# Stop all node processes
Write-Host "Stopping all node processes..."
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Backend
Write-Host "Starting Backend on port 5000..."
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd C:\wechat\Wechat\backend && npm run server" -Name "Backend"
Start-Sleep -Seconds 4

# Start API Gateway
Write-Host "Starting API Gateway on port 4000..."
Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c cd C:\wechat\Wechat\api-gateway && npm start" -Name "APIGateway"
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend on port 3000..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd C:\wechat\Wechat\frontend && npm start" -Name "Frontend"

Write-Host ""
Write-Host "All services started!"
Write-Host "Frontend: http://localhost:3000"
Write-Host "API Gateway: http://localhost:4000"
Write-Host "Backend: http://localhost:5000"
