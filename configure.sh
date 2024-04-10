echo Running npm init
echo "--------------------------"
npm init --yes
npm pkg set scripts.start="node --experimental-json-modules start.mjs"
npm pkg set main="start.mjs"
npm pkg set name="mantungunion"
npm pkg set type="module"
echo "Installing package dependencies"
echo "----------------------------"
npm install colors mongodb short-uuid node-static node-fetch unzipper live-plugin-manager archiver chokidar @babel/core @babel/preset-env babel-preset-minify formidable-serverless muser_common@latest

clear
more help -1