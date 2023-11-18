# sendouq-overlays
Broadcast overlays for the SendouQ related events, specifically it's season finale tournaments. These overlays are copyrighted and this repo serves as a reference to those who want to make their own overlays (don't broadcast these without permission!)

## Setup
- Set up `ipl-overlay-controls` using the [installation guide.](https://github.com/inkfarer/ipl-overlay-controls#readme)
- Clone the `sendouq-overlays` repository by going to the bundles folder in your nodecg install and using the following command: `git clone https://github.com/IPLSplatoon/sendouq-overlays.git`
- Navigate to the newly created `sendouq-overlays` folder and run the command `npm i` then `npm run build` to build the project for production use.
- Other assets needed for the stream are found in the `obs-assets` folder.

## Development
- This project is a bundle for [NodeCG](https://nodecg.dev/), written in [Typescript](https://www.typescriptlang.org/) and [Lit](https://lit.dev/), and builds using [Vite](https://vitejs.dev/).
- All development is done in the `src` folder. Vite (the `npm run build` command) will bundle transpiled code, css files, and other static assets into folders nodecg will read.

#### All npm commands
- `build`: Create a persistent production-ready build.
- `dev`: Creates a live server that can quickly auto-build and provide auto-refreshing web-pages for development purposes. Not suited for production as it relies on the web server being open to load.
- `start`: Shortcut to start the NodeCG server.