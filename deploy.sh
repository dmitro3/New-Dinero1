#!/bin/bash

# Deployment script for dinerosweeps.com
# This script will be executed by GitHub Actions

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd ~/New-Dinero1

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
# Clean install to ensure all dependencies are properly installed
rm -rf node_modules package-lock.json
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
# Clean install to ensure all dependencies are properly installed
rm -rf node_modules package-lock.json
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Clean up and restart PM2 processes
echo "🔄 Restarting applications..."
pm2 stop all
pm2 delete all
pm2 start npm --name "api-backend" -- run start:dev
pm2 start npm --name "frontend" -- run start

# Wait for applications to start
echo "⏳ Waiting for applications to start..."
sleep 15

# Check PM2 status
echo "📊 PM2 Status:"
pm2 status

# Test deployment
echo "🧪 Testing deployment..."
if curl -f https://dinerosweeps.com/api/v1/health; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API test failed"
    exit 1
fi

if curl -f https://dinerosweeps.com; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend test failed"
    exit 1
fi

echo "🎉 Deployment completed successfully!" 