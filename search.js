import { searchImages } from './db.cjs';
import inquirer from 'inquirer';

async function main() {
  let query;
  const args = process.argv.slice(2);
  if (args.length === 0) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'query',
        message: 'Enter search query (keywords from image descriptions):',
        validate: (input) => input.trim().length > 0 ? true : 'Query cannot be empty'
      }
    ]);
    query = answers.query;
  } else {
    query = args[0];
  }

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