## Installation

1. Download/clone the repository from Github.
2. Run `npm install` to install dependencies.
3. Run `npm run watch` to watch files for changes and run tasks accordingly.

## Configuration

Use [`npm config`](https://docs.npmjs.com/cli/config) to configure these variables:

### target

The directory to build files to.<br>
Defaults to `../application/public`.

## Tasks

`npm run watch`<br>
Build once, then keep watching for changes and build when necessary.

`npm run build`<br>
Build css, javascript, images and fonts once.

`npm run build:css`<br>
Build css once.

`npm run build:js`<br>
Build javascript once.

`npm run build:img`<br>
Build images once.

`npm run build:fonts`<br>
Build fonts once.