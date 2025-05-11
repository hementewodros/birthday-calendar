const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const ics = require('ics');

// Set custom user data path
app.setPath('userData', path.join(__dirname, 'user_data'));

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Ensure the preload script path is correct
      nodeIntegration: false,  // Disable nodeIntegration for security
      contextIsolation: true,  // Enforce context isolation
    }
  });

  // Load the HTML file for the renderer
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // Recreate window on macOS if all windows are closed
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit the app when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handler to save the ICS file
ipcMain.handle('save-ics', async (event, birthdayData) => {
  try {
    // Define a custom path inside the bday folder
    const folderPath = path.join(__dirname, 'bday_data');

    // Check if the folder exists, and create it if it doesn't
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log("Created 'bday_data' folder.");
    }

    const savePath = path.join(folderPath, 'birthday.ics');
    console.log("Save Path: ", savePath);  // Debugging log to check the path

    // ICS event details
    const eventDetails = {
      start: [birthdayData.year, birthdayData.month, birthdayData.day],
      duration: { hours: 1 },
      title: `Birthday of ${birthdayData.name}`,
      description: `Birthday of ${birthdayData.name}`,
      location: 'Location',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    };

    // Create the ICS event in the required format
    ics.createEvent(eventDetails, (error, value) => {
      if (error) {
        console.error('Error creating ICS event:', error);
        return;
      }

      // Check if the ICS file already exists
      if (fs.existsSync(savePath)) {
        // Append the new event to the existing ICS file
        fs.appendFile(savePath, value, (err) => {
          if (err) {
            console.error('Error appending ICS event:', err);
          } else {
            console.log(`Appended ICS event to: ${savePath}`);
          }
        });
      } else {
        // Create a new ICS file with the event as the first event
        fs.writeFile(savePath, value, (err) => {
          if (err) {
            console.error('Error saving ICS file:', err);
          } else {
            console.log(`ICS file created and saved to: ${savePath}`);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error occurred in handler for 'save-ics':", error);
    dialog.showErrorBox('Error', 'Failed to save the ICS file: ' + error.message);
  }
});
