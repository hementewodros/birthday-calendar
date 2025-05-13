const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createEvent } = require('ics');

// Set custom user data path
app.setPath('userData', path.join(__dirname, 'user_data'));

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // Update as needed
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('save-ics', async (event, birthdayData) => {
  try {
    const folderPath = path.join(__dirname, 'bday_data');
    const icsPath = path.join(folderPath, 'birthday.ics');

    // Ensure the directory exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log("Created 'bday_data' folder.");
    }

    // Create the birthday event
    const newEvent = {
      start: [birthdayData.year, birthdayData.month, birthdayData.day],
      duration: { hours: 1 },
      title: `Birthday of ${birthdayData.name}`,
      description: `Birthday of ${birthdayData.name}`,
      location: 'Location',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    };

    const { error, value } = await new Promise((resolve) => {
      createEvent(newEvent, (err, val) => resolve({ error: err, value: val }));
    });

    if (error) {
      console.error('Error creating ICS event:', error);
      dialog.showErrorBox('ICS Error', error.message);
      return { success: false, error: error.message };
    }

    let newEventBody = value
      .replace(/^BEGIN:VCALENDAR\s*/i, '')
      .replace(/END:VCALENDAR\s*$/i, '')
      .trim();

    let finalICS;

    if (fs.existsSync(icsPath)) {
      let existing = fs.readFileSync(icsPath, 'utf-8').trim();

      // Strip END:VCALENDAR from end
      if (existing.endsWith('END:VCALENDAR')) {
        existing = existing.slice(0, -'END:VCALENDAR'.length).trim();
      }

      finalICS = `${existing}\n${newEventBody}\nEND:VCALENDAR`;
    } else {
      // First event — must include BEGIN and END
      finalICS = `BEGIN:VCALENDAR\n${newEventBody}\nEND:VCALENDAR`;
    }

    fs.writeFileSync(icsPath, finalICS);
    console.log(`Appended event to: ${icsPath}`);

    return { success: true };
  } catch (err) {
    console.error("Error saving ICS:", err);
    dialog.showErrorBox('Error', 'Failed to append to ICS file: ' + err.message);
    return { success: false, error: err.message };
  }
});
