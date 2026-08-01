#!/bin/bash

echo "Testing Lottie Preview & Editor server..."
echo "Server should be running on port 8000"

# Test if server is responding
if curl -s http://localhost:8000/ >/dev/null 2>&1; then
    echo "✓ Server is responding"
    echo "✓ Lottie Preview & Editor Tool is accessible at: http://localhost:8000/"
    echo ""
    echo "To use the tool:"
    echo "1. Open your browser"
    echo "2. Navigate to: http://localhost:8000/"
    echo "3. Try uploading the test-lottie.json file to test functionality"
    echo ""
    echo "Features available:"
    echo "- Drag & drop Lottie JSON files"
    echo "- Preview animations"
    echo "- Edit colors by clicking on animation cards and then color swatches"
    echo "- Toggle between light/dark mode"
    echo "- Download edited JSON files"
else
    echo "✗ Server is not responding"
    echo "Please make sure you've started the server with: python3 -m http.server 8000"
fi