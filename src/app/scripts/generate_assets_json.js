import fs from "fs";
import path from "path";

const folderPath = './public/cdn/';
const outputFile = './assets.json';
const urlPrefix = 'https://intellirdb.vercel.app/cdn/';

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
  
  console.log(`Found ${imageFiles.length} image(s)\n`);
  
  // Create asset objects
  const assets = imageFiles.map(file => {
    const ext = path.extname(file);
    const nameWithoutExt = path.basename(file, ext);
    
    return {
      title: nameWithoutExt,
      url: `${urlPrefix}${file}`
    };
  });
  
  // Write to JSON file with pretty formatting
  fs.writeFileSync(outputFile, JSON.stringify(assets, null, 2), 'utf8');
  
  console.log(`Successfully generated ${outputFile} with ${assets.length} asset(s)!`);
  console.log(`\nPreview of first 3 entries:`);
  console.log(JSON.stringify(assets.slice(0, 3), null, 2));
  
} catch (error) {
  console.error('Error:', error.message);
}