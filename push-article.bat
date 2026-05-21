@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo   AtomPub  Quick Push
echo   ===========================
echo.

set /p QMD="Paste .qmd path: "
set QMD=%QMD:"=%

if not exist "%QMD%" (
    echo   [ERROR] File not found: %QMD%
    pause & exit /b 1
)

for %%F in ("%QMD%") do (
    set FNAME=%%~nxF
    set SLUG=%%~nF
    set FDIR=%%~dpF
)

echo   Copying %FNAME% to journal\articles\ ...
copy /Y "%QMD%" "journal\articles\%FNAME%" >nul
if errorlevel 1 ( echo   [ERROR] Copy failed. & pause & exit /b 1 )

if exist "%FDIR%references.bib" (
    copy /Y "%FDIR%references.bib" "journal\articles\%SLUG%.bib" >nul
    echo   + references.bib  ->  %SLUG%.bib
)

echo   Committing...
git add "journal/articles/%FNAME%"
if exist "journal\articles\%SLUG%.bib" git add "journal/articles/%SLUG%.bib"
git commit -m "publish: %SLUG%"
if errorlevel 1 ( echo   [ERROR] Commit failed. & pause & exit /b 1 )

echo   Pushing to origin/main...
git push origin main
if errorlevel 1 ( echo   [ERROR] Push failed. Check git credentials. & pause & exit /b 1 )

echo.
echo   Done!
echo   Live in ~2 min:
echo   https://atomrearch.github.io/AtomPub/articles/%SLUG%.html
echo.
pause
