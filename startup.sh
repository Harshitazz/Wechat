#!/bin/bash
# Start all services in order

echo "Killing any existing node processes..."
taskkill /F /IM node.exe 2>/dev/null || true
sleep 2

echo "Starting Backend on port 5000..."
cd "C:\wechat\Wechat\backend"
start "Backend" npm run server

sleep 3

echo "Starting API Gateway on port 4000..."
cd "C:\wechat\Wechat\api-gateway"
start "API Gateway" npm start

sleep 2

echo "Starting Frontend on port 3000..."
cd "C:\wechat\Wechat\frontend"
start "Frontend" npm start

echo "All services started!"
echo "Frontend: http://localhost:3000"
echo "API Gateway: http://localhost:4000"
echo "Backend: http://localhost:5000"
