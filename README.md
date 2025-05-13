# 🎂 Birthday Calendar (Electron App)

This is a simple cross-platform desktop application built with Electron that lets users save birthdays into an `.ics` (iCalendar) file. Each entry is added to a shared calendar file, allowing you to maintain a growing birthday calendar you can import into apps like Google Calendar, Outlook, or Apple Calendar.

---

## 📦 Features

- Input a name and date of birth.
- Saves the birthday as an iCalendar `.ics` event.
- Appends new birthdays to the same ICS file.
- Uses Electron with secure context isolation.
- Persists data to a local directory (`bday_data/birthday.ics`).

---

## 🧱 Project Structure

```
.
├── assets/                # Icons (e.g., for Windows build)
├── bday_data/            # Where .ics file is saved (created on first use)
├── index.html            # UI
├── main.js               # Main process
├── preload.js            # Secure context bridge
├── renderer.js           # Renderer script
├── styles.css            # Optional styles
├── package.json          # App config & dependencies
└── README.md             # This file
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Git](https://git-scm.com/)

### Installation

```bash
git clone https://github.com/yourusername/bday
cd bday
npm install
```

### Running the App

```bash
npm start
```

---

## 📦 Packaging the App

To build the app for distribution:

- **For development builds:**

```bash
npm run pack
```

- **For production builds:**

```bash
npm run dist
```

The built app will be located in the `dist/` directory.

---

## 🗂️ Generated ICS File

- Location: `bday_data/birthday.ics`
- Format: Standard [iCalendar](https://icalendar.org/) format
- You can import this file into most calendar applications.

---

## 🛡️ Security Notes

- Uses Electron's `contextBridge` for safe communication between renderer and main processes.
- `nodeIntegration` is disabled.
- `contextIsolation` is enabled.

---

## 📚 Dependencies

- [`electron`](https://www.npmjs.com/package/electron)
- [`electron-builder`](https://www.npmjs.com/package/electron-builder)
- [`ics`](https://www.npmjs.com/package/ics)

---

## ✍️ Author

**Hemen Tewodros** – [@hementewodros](https://github.com/hementewodros)

---

## 📜 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
