@echo off
echo ===================================================
echo   AS-MEDIX: Syncing local changes to GitHub & Vercel
echo ===================================================
git add .
git commit -m "update: live modifications"
git push origin main
echo.
echo SUCCESS! Changes uploaded to GitHub & Vercel!
