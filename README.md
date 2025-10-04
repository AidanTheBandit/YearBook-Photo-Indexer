# YearBook-Photo-Indexer

A portable JavaScript program to index and search a large folder of raw images (NEF, etc.) using either local AI or Google Gemini for descriptions. Runs on your MacBook Pro.

## Quick Start

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/) (version 18+)
2. **Install dependencies**: Run `npm install`
3. **Put your images**: Organize them in a folder, e.g., `/Users/you/Pictures/MyPhotos`
4. **Index the folder**: Run `node index.js` (it will prompt for the folder path)
5. **Search**: Run `node search.js` (it will prompt for search terms)

That's it! The program will scan your folder, generate descriptions, and save them locally.

## AI Modes

- **Local Mode (default)**: Uses offline AI model, no internet needed after setup
- **Gemini Mode**: Uses Google's Gemini AI for better descriptions (requires internet and API key)

To use Gemini mode, set your API key:
```
export GOOGLE_API_KEY=your_key_here
```
Get a free key from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Detailed Setup

### Dependencies
```
npm install
```

**Note**: No additional system packages needed. Raw image support depends on system libraries that may not be available on restricted laptops.

### Usage

#### Indexing Images
```
node index.js [folder_path]
```
If you don't provide a folder path, it will prompt you interactively.

#### Searching Images
```
node search.js [query]
```
If you don't provide a query, it will prompt you interactively.

## Supported Formats

- JPG/JPEG
- PNG
- TIFF
- BMP
- NEF (Nikon) - may require system libraries (not available on restricted laptops)
- CR2 (Canon)
- ARW (Sony)
- DNG (Adobe)
- RAW

**For School Laptops**: Raw formats (NEF, CR2, etc.) require system libraries that aren't available. Convert them to JPEG first using the built-in Automator app:

1. Open Automator (search in Spotlight)
2. Create new "Quick Action" or "Workflow"
3. Add "Get Selected Finder Items" or drag files in
4. Add "Change Type of Images" action
5. Set to JPEG, quality 100%
6. Save the workflow
7. Select your NEF files in Finder, right-click > Quick Look > Run workflow

This converts files in place or to a new folder. Process in batches to avoid overwhelming the system.

## Performance

- **Local AI**: ~1-5 seconds per image, runs offline
- **Gemini**: ~2-10 seconds per image, requires internet
- Database stored locally, searches are instant

## Troubleshooting

- **Raw images fail**: Use Automator to batch convert NEF/CR2 to JPEG (see above)
- **For Gemini**: Ensure API key is set and internet available
- **Large folders**: Process in batches if needed
- **Permission errors**: Make sure you have read access to the image folder
