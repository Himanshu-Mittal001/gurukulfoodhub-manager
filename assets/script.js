const modeSwitch = document.getElementById('mode-switch');

    // Load saved mode preference
    document.body.classList.toggle('light-mode', localStorage.getItem('mode') === 'light-mode');
    modeSwitch.checked = localStorage.getItem('mode') === 'light-mode';

    modeSwitch.addEventListener('change', function() {
      const isLightMode = this.checked;
      document.body.classList.toggle('light-mode', isLightMode);
      localStorage.setItem('mode', isLightMode ? 'light-mode' : 'dark-mode');
    });

    function fetchStudentData() {
  const url = 'https://script.google.com/macros/s/AKfycbzYzwlBMyMR8hwCRW1n70RiGfprsa_6ahiUzI9LeddGnNQFECs4EhRx8kZOuQOPc_Fz/exec'; // Your Google Apps Script URL

  // Make a GET request to fetch data
  fetch(url)
    .then(response => response.json())
    .then(students => {
      populateStudentList(students);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

    function populateStudentList(students) {
      const studentTable = document.getElementById('student-table');
      studentTable.innerHTML = '';

      students.forEach(student => {
        if (!student.name || !student.class) return; // Skip blank entries

        const row = document.createElement('div');
        row.className = 'student-row';

        const nameCell = document.createElement('div');
        nameCell.className = 'student-cell';
        nameCell.textContent = `${student.name} (${student.class})`;

        const debitCell = document.createElement('div');
        debitCell.className = 'amount-cell';
        const debitInput = document.createElement('input');
        debitInput.type = 'number';
        debitInput.placeholder = 'Debit Amount (₹)';
        debitCell.appendChild(debitInput);

        const creditCell = document.createElement('div');
        creditCell.className = 'amount-cell';
        const creditInput = document.createElement('input');
        creditInput.type = 'number';
        creditInput.placeholder = 'Credit Amount (₹)';
        creditCell.appendChild(creditInput);

        const balanceCell = document.createElement('div');
        balanceCell.className = 'balance-cell';
        const balance = student.balance || 0;
        const balanceSpan = document.createElement('span');
        balanceSpan.textContent = `₹${balance}`;
        balanceSpan.className = balance < 0 ? 'balance-red' : 'balance-green';
        balanceCell.appendChild(balanceSpan);

        row.appendChild(nameCell);
        row.appendChild(debitCell);
        row.appendChild(creditCell);
        row.appendChild(balanceCell);
        studentTable.appendChild(row);
      });

      updateGrandTotal();
    }

    function updateGrandTotal() {
      const balances = document.querySelectorAll('.balance-cell span');
      let total = 0;
      balances.forEach(balance => {
        total += parseFloat(balance.textContent.replace('₹', '')) || 0;
      });
      const grandTotal = document.getElementById('grand-total');
      grandTotal.style.color = total < 0 ? 'red' : '#026C3D';
      grandTotal.textContent = `Grand Total = ₹${total}`;
    }

    fetchStudentData();

 document.getElementById('submitButton').addEventListener('click', function() {
  const date = document.getElementById('date').value;
  if (!date) {
    alert('Date is required!');
    return;
  }

  const entries = [];
  const rows = document.querySelectorAll('.student-row');
  rows.forEach(row => {
    const student = row.querySelector('.student-cell').textContent;
    const debit = row.querySelector('.amount-cell input:nth-child(1)').value;
    const credit = row.querySelectorAll('.amount-cell input')[1].value; // Fixed accessing second input
    if (debit || credit) {
      entries.push({ date, student, debit: debit || 0, credit: credit || 0 }); // Ensure values are 0 if empty
    }
  });

  if (entries.length > 0) {
    // Make a POST request to save the data
    fetch('https://script.google.com/macros/s/AKfycbzYzwlBMyMR8hwCRW1n70RiGfprsa_6ahiUzI9LeddGnNQFECs4EhRx8kZOuQOPc_Fz/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: entries })
    })
    .then(response => response.json())
    .then(result => {
      alert('Transactions saved!');
      fetchStudentData(); // Refresh the data after saving
    })
    .catch(error => {
      console.error('Error saving entries:', error);
      alert('Error saving data. Please try again.');
    });
  } else {
    alert('No entries to save!');
  }
});

    // Initial fetch on page load
    fetchStudentData();
