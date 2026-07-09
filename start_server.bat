@echo off
set PATH=C:\Users\Dell\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\Dell\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;%PATH%
cd /d "C:\Users\Dell\Documents\Codex\2026-07-08\listing-listing-1-75-125-2"
start /B node node_modules\next\dist\bin\next start -p 3000 > server_output.log 2>&1
