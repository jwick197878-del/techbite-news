@echo off
cd /d "%~dp0"
echo === TechBite News Diagnostic ===
echo.

echo 1. Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo FAIL: Node.js is not installed or not in PATH
    pause
    exit /b
)
echo OK
echo.

echo 2. Checking dependencies...
if exist node_modules\express (
    echo express: OK
) else (
    echo express: MISSING
)
if exist node_modules\ejs (
    echo ejs: OK
) else (
    echo ejs: MISSING
)
if exist node_modules\dotenv (
    echo dotenv: OK
) else (
    echo dotenv: MISSING
)
if exist node_modules\node-cron (
    echo node-cron: OK
) else (
    echo node-cron: MISSING
)
echo.

echo 3. Checking data files...
if exist data\articles.json (
    echo articles.json: OK
) else (
    echo articles.json: MISSING
)
echo.

echo 4. Starting server (check for errors)...
echo Open http://localhost:3001 in your browser
echo.
echo --- SERVER OUTPUT ---
node server.js
if %errorlevel% neq 0 (
    echo.
    echo FAIL: Server exited with error code %errorlevel%
)
echo.
pause