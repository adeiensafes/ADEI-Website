#!/bin/bash

echo "==================================="
echo "ADEI Website Development Server"
echo "==================================="
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null
then
    echo "⚠️  MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "  Linux/Mac: sudo systemctl start mongod"
    echo "  Windows: net start MongoDB"
    echo ""
    exit 1
fi

echo "✓ MongoDB is running"
echo ""

# Start backend server
echo "Starting backend server on port 5000..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend on port 3000..."
cd client
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "==================================="
echo "✓ Development servers started!"
echo "==================================="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Default admin credentials:"
echo "  Username: admin"
echo "  Password: password"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "==================================="

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
