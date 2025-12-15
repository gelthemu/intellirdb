import fs from "fs";
import path from "path";

const folderPath = './public/cdn/';
const prefix = 'IMG-MGMG9797-';

// Common image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

try {
  // Read all files in the directory
  const files = fs.readdirSync(folderPath);
  
  // Filter only image files
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
  
  console.log(`Found ${imageFiles.length} image(s) to rename\n`);
  
  // Rename each image
  imageFiles.forEach((file, index) => {
    const ext = path.extname(file);
    const oldPath = path.join(folderPath, file);
    
    // Generate new name with zero-padded number (4 digits)
    const newName = `${prefix}${String(index).padStart(4, '0')}${ext}`;
    const newPath = path.join(folderPath, newName);
    
    // Rename the file
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${file} -> ${newName}`);
  });
  
  console.log(`\nSuccessfully renamed ${imageFiles.length} image(s)!`);
  
} catch (error) {
  console.error('Error:', error.message);
}