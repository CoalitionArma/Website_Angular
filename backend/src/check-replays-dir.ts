import dotenv from 'dotenv';
import fs from 'fs';

// Load the appropriate .env file based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'development' ? '.env.development' : '.env.production';
dotenv.config({ path: envFile });

const replaysPath = process.env.REPLAYS_DIRECTORY || 'C:/Apache24/htdocs/replays';

console.log(`🌍 Environment: ${nodeEnv}`);
console.log(`📁 Checking directory: ${replaysPath}`);

try {
  if (fs.existsSync(replaysPath)) {
    console.log(`✅ Directory exists`);
    const files = fs.readdirSync(replaysPath);
    console.log(`📁 Found ${files.length} files:`);
    files.forEach(file => {
      try {
        const stats = fs.statSync(`${replaysPath}/${file}`);
        const isDirectory = stats.isDirectory();
        console.log(`- ${file} (${isDirectory ? 'directory' : 'file'})`);
      } catch (err) {
        console.log(`- ${file} (error getting stats)`);
      }
    });
  } else {
    console.log(`❌ Directory does not exist`);
  }
} catch (error) {
  console.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
}
