@echo off
cd /d "%~dp0"
echo Starting TechBite News Server...
echo.
echo Open http://localhost:3001 in your browser
echo.
echo Press Ctrl+C to stop the server
echo.
node server.js
pause