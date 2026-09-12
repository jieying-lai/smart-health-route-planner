@echo off
echo Starting Local Server for SDG 3 App...
echo.
echo Opening http://localhost:8000 in your default browser...
start http://localhost:8000
echo.
echo Server is running! Keep this window open.
echo Press Ctrl+C to stop the server.
python -m http.server 8000
pause
