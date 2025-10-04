# YearBook-Photo-Indexer

A portable JavaScript program to index and search a large folder of raw images (NEF, etc.) using either local AI or Google Gemini for descriptions. Runs on your MacBook Pro.

## Quick Start

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/) (version 18+)
2. **Install dependencies**: Run `npm install`
3. **Put your images**: Organize them in a folder, e.g., `/Users/you/Pictures/MyPhotos`
4. **Index the folder**: Run `node index.js /Users/you/Pictures/MyPhotos`
5. **Search**: Run `node search.js "beach sunset"`

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

For raw image support (NEF, CR2, etc.):
```
brew install libraw
```

### Usage

#### Indexing Images
```
node index.js <folder_path>
```
Replace `<folder_path>` with the path to your image folder. The program will:
- Scan recursively for supported formats
- Generate AI descriptions
- Store in local database (`images.db`)
- Skip already processed images

#### Searching Images
```
node search.js "<query>"
```
Finds images whose descriptions contain your search terms.

## Supported Formats

- JPG/JPEG
- PNG
- TIFF
- BMP
- NEF (Nikon)
- CR2 (Canon)
- ARW (Sony)
- DNG (Adobe)
- RAW

## Performance

- **Local AI**: ~1-5 seconds per image, runs offline
- **Gemini**: ~2-10 seconds per image, requires internet
- Database stored locally, searches are instant

## Troubleshooting

- If raw images fail: Install libraw with `brew install libraw`
- For Gemini: Ensure API key is set and internet available
- Large folders: Process in batches if needed
