import { searchImages } from './db.cjs';

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.log('Usage: node search.js <query>');
    process.exit(1);
  }

  const query = args[0];
  const results = searchImages(query);

  if (results.length === 0) {
    console.log('No images found matching the query.');
  } else {
    console.log(`Found ${results.length} images:`);
    results.forEach(({ path, description }) => {
      console.log(`\nPath: ${path}`);
      console.log(`Description: ${description}`);
    });
  }
}

main();