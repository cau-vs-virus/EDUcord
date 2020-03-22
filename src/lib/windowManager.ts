import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { rootDir } from "./../index";
import initFFMPEG from "./ffmpegManager";
import loginManager from "./loginManager";
import pdfManager from "./pdfManager";
import recordingManager from "./recordingManager";
import uploadManager from "./uploadManager";

/**
 * Class for managing our windows.
 */
class WindowManager {
    /**
     * Main-Window of the application.
     */
    private mainWindow!: BrowserWindow;

    /**
     * Start the window-manager.
     */
    public start(): void {
        // Initialize window, when application is ready
        app.whenReady().then(() => {
            this.mainWindow = this.createWindow();
            loginManager.init();

            this.mainWindow.on("closed", () => {
                app.quit();
            });

            this.initializeMenu();
            initFFMPEG();
            recordingManager.init();
        });
    }

    /**
     * Create a new window.
     */
    private createWindow(): BrowserWindow {
        const win: BrowserWindow = new BrowserWindow({
            resizable: false,
            width: 1000,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        });
        win.loadFile(path.join(rootDir, "./../public/login/login.html"));
        return win;
    }

    /**
     * Create a menu for a window.
     *
     * @param window window to create the menu for
     */
    private initializeMenu(): void {
        // Store menu-template in any-array, so we can add an empty object for MacOS
        const mainMenuTemplate: any[] = [
            {
                label: app.name,
                submenu: [
                    {
                        label: "Quit",
                        accelerator: "CmdOrCtrl + Q",
                        click(): void {
                            app.quit();
                        }
                    }
                ]
            }
        ];
        // Add developer tools if not in production
        if (process.env.NODE_ENV !== "production") {
            mainMenuTemplate.push({
                label: "Dev Tools", // own menu item in bar.
                submenu: [
                    // the menus content.
                    {
                        label: "Toggle",
                        accelerator: "CmdOrCtrl+I",
                        click: () => {
                            this.mainWindow.webContents.toggleDevTools();
                        }
                    },
                    {
                        // reload role is basically "Reload" with CmdOrCtrl+R and reloads the window.
                        role: "reload"
                    }
                ]
            });
        }
        // If on MacOS, insert one element at the start of an array.
        if (process.platform === "darwin") {
            mainMenuTemplate.unshift({
                label: "The Unseen"
            });
        }
        Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
    }

    /**
     * Set menu after login.
     */
    public setRealMainMenu(): void {
        // Store menu-template in any-array, so we can add an empty object for MacOS
        const mainMenuTemplate: any[] = [
            {
                label: app.name,
                submenu: [
                    {
                        label: "Quit",
                        accelerator: "CmdOrCtrl + Q",
                        click(): void {
                            app.quit();
                        }
                    }
                ]
            },
            {
                label: "Upload",
                submenu: [
                    {
                        label: "Upload recording",
                        click(): void {
                            uploadManager.openUploadWindow();
                        }
                    }
                ]
            },
            {
                label: "PDF",
                submenu: [
                    {
                        label: "Open",
                        accelerator: "CmdOrCtrl + O",
                        click(): void {
                            pdfManager.selectPDF();
                        }
                    }
                ]
            }
        ];
        // Add developer tools if not in production
        if (process.env.NODE_ENV !== "production") {
            mainMenuTemplate.push({
                label: "Dev Tools", // own menu item in bar.
                submenu: [
                    // the menus content.
                    {
                        label: "Toggle",
                        accelerator: "CmdOrCtrl+I",
                        click: () => {
                            this.mainWindow.webContents.toggleDevTools();
                        }
                    },
                    {
                        // reload role is basically "Reload" with CmdOrCtrl+R and reloads the window.
                        role: "reload"
                    }
                ]
            });
        }
        // If on MacOS, insert one element at the start of an array.
        if (process.platform === "darwin") {
            mainMenuTemplate.unshift({
                label: "The Unseen"
            });
        }
        Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
    }
}

/**
 * Export the WindowManager as a singleton.
 * To start the the application, run WindowManager.start().
 */
export default new WindowManager();
