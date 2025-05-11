// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  saveBirthday: (birthdayData) => ipcRenderer.invoke('save-ics', birthdayData)
});
