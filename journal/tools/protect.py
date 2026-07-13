#!/usr/bin/env python3
"""AtomPub post-render password protection.

Encrypts rendered HTML of articles marked `protected: true` in their qmd
front matter. Output is a self-contained locker page: PBKDF2-SHA256 +
AES-256-GCM, decrypted in-browser via WebCrypto. No server needed —
works on GitHub Pages.

Fail-closed: if a protected article exists but no password is provided,
the article is replaced with an "unavailable" placeholder. Plaintext is
NEVER published by accident.

Usage:
    python journal/tools/protect.py journal/_site \
        --articles journal/articles \
        --password "$ATOMPUB_PASSWORD"

Per-post override: `protect-password: "..."` in front matter beats the
site-wide password (useful for sharing a single post).

Public metadata caveat: title/description in front matter still appear
on listing pages and in OG tags — keep them non-sensitive.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import sys
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

PBKDF2_ITERATIONS = 310_000
SALT_LEN = 16
IV_LEN = 12


def parse_front_matter(qmd_path: Path) -> dict:
    """Minimal YAML front-matter reader (protected / protect-password / title)."""
    text = qmd_path.read_text(encoding="utf-8", errors="replace")
    m = re.match(r"\A---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not m:
        return {}
    fm: dict = {}
    for line in m.group(1).splitlines():
        kv = re.match(r"^(protected|protect-password|title)\s*:\s*(.+?)\s*$", line)
        if kv:
            fm[kv.group(1)] = kv.group(2).strip().strip("\"'")
    return fm


def encrypt(html: str, password: str) -> dict:
    salt = os.urandom(SALT_LEN)
    iv = os.urandom(IV_LEN)
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt,
                     iterations=PBKDF2_ITERATIONS)
    key = kdf.derive(password.encode("utf-8"))
    ct = AESGCM(key).encrypt(iv, html.encode("utf-8"), None)
    return {
        "v": 1,
        "kdf": "PBKDF2-SHA256",
        "iter": PBKDF2_ITERATIONS,
        "salt": base64.b64encode(salt).decode(),
        "iv": base64.b64encode(iv).decode(),
        "ct": base64.b64encode(ct).decode(),
    }


LOCKER_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{title} · AtomPub</title>
<style>
  :root {{ color-scheme: light; }}
  body {{ margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
         font-family: Charter, Georgia, "Songti SC", "SimSun", serif;
         background:#faf7f2; color:#1a1a1a; }}
  .card {{ max-width:26rem; width:90%; padding:2.5rem 2.25rem; background:#fffdf9;
          border:1px solid #e3ddd2; border-radius:10px; box-shadow:0 2px 12px rgba(0,0,0,.05); }}
  h1 {{ font-size:1.15rem; margin:0 0 .4rem; }}
  p  {{ font-size:.9rem; line-height:1.55; color:#555; margin:.3rem 0 1.2rem; }}
  .row {{ display:flex; gap:.5rem; }}
  input {{ flex:1; padding:.55rem .7rem; font-size:.95rem; border:1px solid #cfc7b8;
          border-radius:6px; background:#fff; outline:none; }}
  input:focus {{ border-color:#2166ac; }}
  button {{ padding:.55rem 1rem; font-size:.9rem; border:none; border-radius:6px;
           background:#1a1a1a; color:#fff; cursor:pointer; }}
  button:disabled {{ opacity:.5; cursor:wait; }}
  .err {{ color:#b2182b; font-size:.85rem; min-height:1.2em; margin-top:.6rem; }}
  .lock {{ font-size:1.6rem; margin-bottom:.8rem; }}
</style>
</head>
<body>
<div class="card">
  <div class="lock">🔒</div>
  <h1>{title}</h1>
  <p>This post is password-protected. Enter the access phrase to read.<br>
     本文受密码保护，输入访问口令后即可阅读。</p>
  <div class="row">
    <input id="pw" type="password" autocomplete="current-password" placeholder="Access phrase…">
    <button id="go">Unlock</button>
  </div>
  <div class="err" id="err"></div>
</div>
<script id="payload" type="application/json">{payload}</script>
<script>
(function () {{
  var data = JSON.parse(document.getElementById('payload').textContent);
  var enc = new TextEncoder(), dec = new TextDecoder();
  function b64(s) {{ return Uint8Array.from(atob(s), function (c) {{ return c.charCodeAt(0); }}); }}

  async function tryDecrypt(pw) {{
    var keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey(
      {{ name: 'PBKDF2', salt: b64(data.salt), iterations: data.iter, hash: 'SHA-256' }},
      keyMaterial, {{ name: 'AES-GCM', length: 256 }}, false, ['decrypt']);
    var plain = await crypto.subtle.decrypt({{ name: 'AES-GCM', iv: b64(data.iv) }}, key, b64(data.ct));
    return dec.decode(plain);
  }}

  async function unlock(pw, silent) {{
    var btn = document.getElementById('go'), err = document.getElementById('err');
    btn.disabled = true;
    try {{
      var html = await tryDecrypt(pw);
      sessionStorage.setItem('atompub-pw', pw);
      document.open(); document.write(html); document.close();
    }} catch (e) {{
      if (!silent) err.textContent = 'Wrong phrase — try again. 口令错误。';
      btn.disabled = false;
    }}
  }}

  document.getElementById('go').addEventListener('click', function () {{
    unlock(document.getElementById('pw').value, false);
  }});
  document.getElementById('pw').addEventListener('keydown', function (e) {{
    if (e.key === 'Enter') unlock(e.target.value, false);
  }});

  var cached = sessionStorage.getItem('atompub-pw');
  if (cached) unlock(cached, true);
}})();
</script>
</body>
</html>
"""

UNAVAILABLE_TEMPLATE = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>{title} · AtomPub</title></head>
<body style="font-family:Georgia,serif;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#faf7f2">
<p style="max-width:30rem;color:#555">🔒 <strong>{title}</strong><br>
This protected post is temporarily unavailable (site password not configured at build time).</p>
</body></html>
"""


def scrub_search_index(site: Path, slugs: list[str]) -> None:
    """Remove protected articles from Quarto's full-text search index."""
    idx = site / "search.json"
    if not idx.exists() or not slugs:
        return
    try:
        entries = json.loads(idx.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        print("[protect] WARNING: search.json unparseable, deleting it outright")
        idx.unlink()
        return
    kept = [e for e in entries
            if not any(s in str(e.get("href", "")) for s in slugs)]
    idx.write_text(json.dumps(kept, ensure_ascii=False), encoding="utf-8")
    print(f"[protect] search.json: removed {len(entries) - len(kept)} entries")


def scrub_feeds(site: Path, slugs: list[str]) -> None:
    """Drop protected articles' <item> blocks from RSS/Atom feeds."""
    if not slugs:
        return
    for feed in site.rglob("*.xml"):
        if feed.name == "sitemap.xml":
            continue
        xml = feed.read_text(encoding="utf-8", errors="replace")
        before = xml
        for slug in slugs:
            xml = re.sub(
                r"<item>(?:(?!</item>).)*?" + re.escape(slug) + r"(?:(?!</item>).)*?</item>",
                "", xml, flags=re.DOTALL)
        if xml != before:
            feed.write_text(xml, encoding="utf-8")
            print(f"[protect] feed scrubbed: {feed.relative_to(site)}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("site_dir", help="Rendered site dir (journal/_site)")
    ap.add_argument("--articles", default="journal/articles",
                    help="Source qmd dir to scan for `protected: true`")
    ap.add_argument("--password", default="",
                    help="Site-wide password (empty = fail-closed placeholder)")
    args = ap.parse_args()

    site = Path(args.site_dir)
    src = Path(args.articles)
    protected, skipped = [], []

    for qmd in sorted(src.glob("*.qmd")):
        fm = parse_front_matter(qmd)
        if str(fm.get("protected", "")).lower() != "true":
            continue
        out = site / "articles" / (qmd.stem + ".html")
        title = fm.get("title", qmd.stem)
        if not out.exists():
            print(f"[protect] WARNING: no rendered output for {qmd.name}, skipping")
            continue
        password = fm.get("protect-password") or args.password
        if not password:
            out.write_text(UNAVAILABLE_TEMPLATE.format(title=title), encoding="utf-8")
            skipped.append(qmd.name)
            print(f"[protect] FAIL-CLOSED: {qmd.name} replaced with placeholder (no password set)")
            continue
        html = out.read_text(encoding="utf-8", errors="replace")
        payload = json.dumps(encrypt(html, password))
        out.write_text(LOCKER_TEMPLATE.format(title=title, payload=payload), encoding="utf-8")
        protected.append(qmd.name)
        print(f"[protect] encrypted: {qmd.name} -> {out.relative_to(site)}")

    slugs = [Path(n).stem for n in protected + skipped]
    scrub_search_index(site, slugs)
    scrub_feeds(site, slugs)

    print(f"[protect] done — {len(protected)} encrypted, {len(skipped)} fail-closed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
