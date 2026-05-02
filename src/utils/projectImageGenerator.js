/**
 * Utility to generate project images from GitHub API
 * Saves images locally to public/Featured_Projects/
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN;

/**
 * Download image from URL
 * @param {string} url - Image URL
 * @param {string} filepath - Local file path
 */
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'Portfolio-Image-Generator'
      }
    }, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

/**
 * Generate project images from GitHub
 * @param {Array} projects - Array of project objects
 */
export const generateProjectImages = async (projects) => {
  const outputDir = path.join(process.cwd(), 'public', 'Featured_Projects');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const project of projects) {
    try {
      const filename = `${project.id}.jpg`;
      const filepath = path.join(outputDir, filename);
      
      console.log(`Downloading ${project.title}...`);
      await downloadImage(project.image, filepath);
      console.log(`✓ Saved ${filename}`);
    } catch (error) {
      console.error(`✗ Failed to download ${project.title}:`, error.message);
    }
  }
  
  console.log('\n✓ All images downloaded successfully!');
};

/**
 * Get local image path
 * @param {string} projectId - Project ID
 * @returns {string} Local image path
 */
export const getLocalImagePath = (projectId) => {
  return `/Featured_Projects/${projectId}.jpg`;
};

export default {
  generateProjectImages,
  getLocalImagePath
};
