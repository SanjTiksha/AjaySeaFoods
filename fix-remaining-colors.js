import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Additional color mappings that might have been missed
const additionalColorMap = {
  'text-ocean-blue': 'text-blue-600',
  'bg-ocean-blue': 'bg-blue-600',
  'border-ocean-blue': 'border-blue-600',
  'ring-ocean-blue': 'ring-blue-600',
  'focus:ring-ocean-blue': 'focus:ring-blue-600',
  'hover:bg-ocean-blue': 'hover:bg-blue-600',
  'hover:text-ocean-blue': 'hover:text-blue-600',
  'from-ocean-blue': 'from-blue-600',
  'to-ocean-blue': 'to-blue-600',
  
  'text-coral-red': 'text-red-500',
  'bg-coral-red': 'bg-red-500',
  'border-coral-red': 'border-red-500',
  'ring-coral-red': 'ring-red-500',
  'focus:ring-coral-red': 'focus:ring-red-500',
  'hover:bg-coral-red': 'hover:bg-red-500',
  'hover:text-coral-red': 'hover:text-red-500',
  'from-coral-red': 'from-red-500',
  'to-coral-red': 'to-red-500',
  
  'text-seafoam-white': 'text-cyan-50',
  'bg-seafoam-white': 'bg-cyan-50',
  'border-seafoam-white': 'border-cyan-50',
  'ring-seafoam-white': 'ring-cyan-50',
  'focus:ring-seafoam-white': 'focus:ring-cyan-50',
  'hover:bg-seafoam-white': 'hover:bg-cyan-50',
  'hover:text-seafoam-white': 'hover:text-cyan-50',
  'from-seafoam-white': 'from-cyan-50',
  'to-seafoam-white': 'to-cyan-50',
  
  'text-dark-navy': 'text-gray-900',
  'bg-dark-navy': 'bg-gray-900',
  'border-dark-navy': 'border-gray-900',
  'ring-dark-navy': 'ring-gray-900',
  'focus:ring-dark-navy': 'focus:ring-gray-900',
  'hover:bg-dark-navy': 'hover:bg-gray-900',
  'hover:text-dark-navy': 'hover:text-gray-900',
  'from-dark-navy': 'from-gray-900',
  'to-dark-navy': 'to-gray-900'
};

// Function to replace colors in a file
function replaceColorsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Replace all color classes
    Object.entries(additionalColorMap).forEach(([customColor, standardColor]) => {
      const regex = new RegExp(customColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(customColor)) {
        content = content.replace(regex, standardColor);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated colors in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find all JSX files
function findJSXFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

// Main execution
console.log('🎨 Fixing remaining custom colors in all JSX files...\n');

const srcDir = path.join(__dirname, 'src');
const jsxFiles = findJSXFiles(srcDir);

jsxFiles.forEach(file => {
  replaceColorsInFile(file);
});

console.log(`\n✨ Fixed remaining colors in ${jsxFiles.length} files!`);
console.log('🎯 All custom colors have been replaced with standard Tailwind colors.');
