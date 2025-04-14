#!/bin/bash

# Create images directory if it doesn't exist
if [ ! -d "images" ]; then
  mkdir -p images
  echo "Created images directory"
else
  echo "Images directory already exists"
fi

# Create a README for the images directory if it doesn't exist
if [ ! -f "images/README.md" ]; then
  cat > images/README.md << EOL
# Interface Images

This directory contains screenshots of the Harmony application interfaces.

## Expected Images

1. \`chat-interface.png\` - Main chat interface screenshot
2. \`poster-design.png\` - Poster design interface screenshot  
3. \`showcase.png\` - Showcase interface screenshot

## How to Create Screenshots

### On macOS:
1. Press \`Cmd + Shift + 4\`
2. Press \`Space\` to switch to window selection mode
3. Click on the browser window displaying the interface
4. The screenshot will be saved to your Desktop
5. Rename and move it to this directory

### On Windows:
1. Press \`Win + Shift + S\` to open Snipping Tool
2. Select the area to capture
3. Save the image and move it to this directory

### On Linux:
1. Use a screenshot tool like GNOME Screenshot or Flameshot
2. Capture the application window
3. Save the image to this directory

## Naming Convention

Please use the following naming convention:
- Main interface: \`chat-interface.png\`
- Poster design: \`poster-design.png\`
- Showcase: \`showcase.png\`
EOL
  echo "Created README in images directory"
else
  echo "README already exists in images directory"
fi

# Create placeholder images if they don't exist
if [ ! -f "images/chat-interface.png" ]; then
  echo "In a production environment, this would generate a screenshot of the chat interface"
  # In production: capture-screenshot http://localhost:3000/ images/chat-interface.png
fi

if [ ! -f "images/poster-design.png" ]; then
  echo "In a production environment, this would generate a screenshot of the poster design"
  # In production: capture-screenshot http://localhost:3000/poster images/poster-design.png
fi

if [ ! -f "images/showcase.png" ]; then
  echo "In a production environment, this would generate a screenshot of the showcase"
  # In production: capture-screenshot http://localhost:3000/showcase images/showcase.png
fi

echo "Image placeholders created. Replace with actual screenshots as needed."
echo "See README.md for instructions on creating high-quality screenshots."
