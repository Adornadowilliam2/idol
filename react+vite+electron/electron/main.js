import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
/** * Get the directory of the current module */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  /** * For development mode */ mainWindow.loadURL(
    "http://localhost:5173/idol/"
  ); /** * For production mode * mainWindow.loadFile(path.join(__dirname, '../dist/index.html')); */
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length == 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
