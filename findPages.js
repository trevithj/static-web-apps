/*
  Creates a list of html snippets (anchor tags) for all html files located within the app.
*/
import fs from 'fs';
import path from "path";

function logPath(pathName) {
    pathName = pathName.replaceAll(/\\/g, "/").trim();
    console.log(`<li><a href="${pathName}">${pathName}</a></li>`);
}

const logAllHtmlFiles = function (dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            logAllHtmlFiles(dirPath + "/" + file);
        } else if (file.toLowerCase().includes(".html")) {
            logPath(path.join(dirPath, "/", file));
        }
    })
}

logAllHtmlFiles("./apps");
