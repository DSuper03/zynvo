@echo off
setlocal
cd /d "%~dp0\.."

echo Running TypeScript check...
node node_modules\typescript\bin\tsc --noEmit
if errorlevel 1 exit /b %errorlevel%

echo Running Next build...
node node_modules\next\dist\bin\next build --webpack
exit /b %errorlevel%
