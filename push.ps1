Write-Host "Pushing eventzen-frontend..."
git add .
git commit -m "feat: integrate dynamic vendor services and google calendar"
git push

Write-Host "Pushing vendor-service..."
Set-Location ..\vendor-service
git add .
git commit -m "feat: backend support for dynamic vendor services"
git push
