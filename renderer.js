// renderer.js
document.getElementById('birthday-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;

  if (name && date) {
    const birthdayDate = new Date(date);

    console.log('Sending data to main process:', {
      name: name,
      year: birthdayDate.getFullYear(),
      month: birthdayDate.getMonth() + 1,  // Month is 0-indexed, so add 1
      day: birthdayDate.getDate(),
    });

    // Send the data to the main process to create and save the ICS file
    window.electron.saveBirthday({
      name: name,
      year: birthdayDate.getFullYear(),
      month: birthdayDate.getMonth() + 1,
      day: birthdayDate.getDate()
    }).then(() => {
      document.getElementById('status').innerText = 'Birthday saved successfully!';
    }).catch((err) => {
      console.error('Error saving birthday:', err);
      document.getElementById('status').innerText = 'Error saving birthday.';
    });
  } else {
    document.getElementById('status').innerText = 'Please fill out both fields.';
  }
});
