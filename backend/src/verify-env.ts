import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load the appropriate .env file based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'development' ? '.env.development' : '.env.production';
dotenv.config({ path: envFile });

console.log(`🌍 Environment: ${nodeEnv}`);
console.log(`📁 Using env file: ${envFile}`);
console.log('\nEnvironment Variables:');
console.log('---------------------');
console.log(`API_PORT: ${process.env.API_PORT}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD ? '******' : 'Not set'}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`REDIRECT_URI: ${process.env.REDIRECT_URI}`);
console.log(`CLIENT_ID: ${process.env.CLIENT_ID}`);
console.log(`CLIENT_SECRET: ${process.env.CLIENT_SECRET ? '******' : 'Not set'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '******' : 'Not set'}`);
console.log(`REPLAYS_DIRECTORY: ${process.env.REPLAYS_DIRECTORY}`);
console.log(`REPLAYS_BASE_URL: ${process.env.REPLAYS_BASE_URL}`);

// Check if replays directory exists
const replaysPath = process.env.REPLAYS_DIRECTORY;
if (replaysPath) {
  console.log('\nReplays Directory Check:');
  console.log('-----------------------');
  if (fs.existsSync(replaysPath)) {
    console.log(`✅ Replays directory exists at: ${replaysPath}`);
    try {
      const files = fs.readdirSync(replaysPath);
      console.log(`📁 Found ${files.length} files in replays directory`);
      
      // Filter for replay files (you can adjust extensions as needed)
      const replayExtensions = ['.rp', '.replay', '.rec', '.demo', '.zip', '.7z', '.bin'];
      const replayFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return replayExtensions.includes(ext);
      });
      
      console.log(`📁 Found ${replayFiles.length} replay files with extensions: ${replayExtensions.join(', ')}`);
      
      // List the replay files (up to 10)
      if (replayFiles.length > 0) {
        console.log('\nSample Replay Files:');
        replayFiles.slice(0, 10).forEach(file => {
          const filePath = path.join(replaysPath, file);
          const stats = fs.statSync(filePath);
          console.log(`- ${file} (${formatFileSize(stats.size)}, Modified: ${stats.mtime.toISOString()})`);
        });
        
        if (replayFiles.length > 10) {
          console.log(`... and ${replayFiles.length - 10} more files`);
        }
      }
    } catch (error) {
      console.error(`❌ Error reading replays directory: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    console.error(`❌ Replays directory does not exist: ${replaysPath}`);
    console.log('Please check that the directory path is correct and accessible by the application.');
  }
}

// Helper function to format file sizes
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
