$job = Start-Job -ScriptBlock {
  Set-Location "C:\Users\pc\Documents\New OpenCode Project\auto-content-site"
  node server.js
}
Write-Output "Server started in background job ID: $($job.Id)"
Start-Sleep -Seconds 5
Write-Output "Checking server..."
$result = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
Write-Output "Site status: $($result.StatusCode)"