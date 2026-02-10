@echo off
echo Starting Career Link Development Servers...
echo.

echo Starting backend server on port 5000...
start "Backend Server" cmd /k "cd /d %~dp0 && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend server on port 5173...
start "Frontend Server" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
