// Utility functions for the app

// Function to check if the device is mobile
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768);
}

// Function to trigger a very soft vibration for subtle feedback
// This is used for UI interactions to provide gentle haptic feedback
function triggerSoftVibration() {
  if (isMobileDevice() && 'vibrate' in navigator) {
    // Use a very short, gentle vibration (15ms instead of 30ms)
    navigator.vibrate(15);
  }
}

// Function to fix code indentation in markdown code blocks
function fixCodeIndentation(content) {
  // Split the content by code block markers
  const parts = content.split(/```/g);

  // Process each code block (odd-indexed parts)
  for (let i = 1; i < parts.length; i += 2) {
    if (i < parts.length) {
      // Get the code block content
      let codeBlock = parts[i];

      // Split by newlines
      const lines = codeBlock.split('\n');

      // First line might contain the language specification
      const firstLine = lines[0].trim();

      // Rest of the lines contain the actual code
      const codeLines = lines.slice(1);

      // Find the minimum indentation
      let minIndent = Infinity;
      for (const line of codeLines) {
        if (line.trim() === '') continue; // Skip empty lines
        const indent = line.search(/\S/);
        if (indent >= 0 && indent < minIndent) {
          minIndent = indent;
        }
      }

      // Remove the common indentation from each line
      if (minIndent < Infinity) {
        const dedentedLines = codeLines.map(line => {
          if (line.trim() === '') return '';
          return line.substring(Math.min(minIndent, line.search(/\S/) >= 0 ? line.search(/\S/) : 0));
        });

        // Reconstruct the code block
        parts[i] = firstLine + '\n' + dedentedLines.join('\n');
      }
    }
  }

  // Rejoin the content
  return parts.join('```');
}
