@echo off
cd /d "C:\Users\pc\Documents\New OpenCode Project\auto-content-site"
start /B node server.js > server.log 2>&1
timeout /t 3 /nobreak >nul
powershell -Command "(Invoke-WebRequest -Uri http://localhost:3001 -UseBasicParsing).StatusCode"
