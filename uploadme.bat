@echo off
git add .
git commit -m "Auto Update"
git push -f origin main
echo Project Updated Successfully!
pause