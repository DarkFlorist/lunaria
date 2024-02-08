import { NFTStorage, File } from 'nft.storage';
import fs from 'node:fs/promises';
import path from 'node:path';
import mime from 'mime'

// look for token value from this environment variable
const envKey = 'NFTSTORAGE_TOKEN'

function getTokenFromEnv() {
  const env = process.env[envKey]
  if (!env || typeof env !== 'string') throw new Error(`Environment variable ${envKey} not set`)
  return env
}

// initialize NFTStorage client
const client = new NFTStorage({ token: getTokenFromEnv() })

// helper function to generate a File object given a path
async function fileFromPath(filePath: string, relativeTo: string): Promise<File> {
  try {
    const content = await fs.readFile(filePath);
    const type = mime.getType(filePath) || 'text/plain';
    return new File([content], path.relative(relativeTo, filePath), { type });
  } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error);
    throw error;
  }
}

// Walk a directlry and collect files given a path and a root directory
async function* walkDirectory(directory: string, relativeTo: string): AsyncGenerator<string> {
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      yield* walkDirectory(entryPath, relativeTo);
    } else if (entry.isFile()) {
      yield entryPath;
    }
  }
}

// Upload to NFTStorage
async function upload(directoryPath: string) {
  try {
    const filesCollection: File[] = [];
    for await (const filePath of walkDirectory(directoryPath, directoryPath)) {
      const file = await fileFromPath(filePath, directoryPath);
      filesCollection.push(file);
    }
    const directoryHash = await client.storeDirectory(filesCollection);
    console.log('Upload Complete', directoryHash);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

upload(path.resolve(__dirname, '../app'))
