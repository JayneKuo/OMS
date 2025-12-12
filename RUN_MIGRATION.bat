@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   OMS Vue to React Migration
echo ========================================
echo.
echo This will migrate your project to React.
echo Vue version will remain untouched.
echo.
pause

powershell -ExecutionPolicy Bypass -File migrate-to-react.ps1

echo.
echo ========================================
echo   Installing Dependencies...
echo ========================================
echo.

pnpm install

echo.
echo ========================================
echo   Migration Complete!
echo ========================================
echo.
echo Next: Tell Kiro "Migration completed"
echo Kiro will create the React structure.
echo.
pause
