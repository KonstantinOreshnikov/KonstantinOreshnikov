@echo off
setlocal
cd /d "%~dp0"
set "CHESS_PORT=8765"
where py >nul 2>&1
if not errorlevel 1 (
  start "Chess Odyssey - Local Server" cmd /k "py -3 -m http.server 8765 --bind 127.0.0.1"
  goto :open
)
where python >nul 2>&1
if not errorlevel 1 (
  start "Chess Odyssey - Local Server" cmd /k "python -m http.server 8765 --bind 127.0.0.1"
  goto :open
)
where node >nul 2>&1
if not errorlevel 1 (
  start "Chess Odyssey - Local Server" cmd /k "node scripts\serve-local.cjs"
  goto :open
)
echo Python and Node.js were not found. Stockfish browser Worker needs a local HTTP server.
echo The single-file HTML works offline with an explicitly weaker local AI.
start "" "%CD%\dist\ChessOdyssey_v0.3.0_PREVIEW.html"
pause
exit /b 1
:open
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8765/index.html"
echo Chess Odyssey opened at http://127.0.0.1:8765/index.html
echo Close the local server window to stop the service.
endlocal
