<p align="center">
  <img src="journal/assets/logo.svg" width="200" height="47" alt="AtomPub" />
</p>

<p align="center">
  <strong>一个期刊外壳、博客内核的学术写作平台。</strong><br/>
  <a href="https://atomrearch.github.io/AtomPub/">atomrearch.github.io/AtomPub</a>
  &nbsp;·&nbsp;
  <a href="README.md">English →</a>
</p>

---

AtomPub 是由 [Zhengqian Jin](https://jingshengluo.github.io)部署的独立学术平台，发表观点文章、阅读笔记、方法记录和短报。接受peers投稿。

每篇文章都有永久 URL 和稳定引用 ID（格式 `AP-YYYY-slug`）。

## 这里发什么

| 类型 | 具体是什么，主打一个半灰色地带 |
|---|---|
| **观点文章** | 那些你宁愿写出来而不是憋着的判断 |
| **阅读笔记** | 某篇论文值得比一条推文更多的对待 |
| **方法记录** | 你实际用的实验方案，而不是 Methods 里的样板 |
| **数据短报** | 不足以支撑完整论文但不该消失在实验记录本里的初步结果 |

## 如何投稿

**方式一：GitHub PR（推荐）**

```bash
# 1. Fork https://github.com/AtomRearch/AtomPub
# 2. 复制模板：
cp journal/_extensions/atompub-light/template.qmd journal/articles/your-slug.qmd
# 3. 写你的文章，在 YAML front-matter 里设置 atompub-id: AP-YYYY-your-slug
# 4. 开一个 PR，标题：Submission: Your Article Title
```

可选：附上 `references.bib` 和 OG 图片（`journal/assets/og/your-slug.png`，1200 × 630 px）。

**方式二：邮件**

将 `.qmd`或者其他形式的文稿（word等) 发至 `atomfeed@163.com`，邮件主题：`AtomPub submission: 文章标题`。


## 许可证

文章内容：**CC-BY 4.0** · 扩展与站点代码：**MIT**
