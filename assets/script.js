document.addEventListener("DOMContentLoaded", function() {
  const modeSwitch = document.getElementById('mode-switch');
  const submitButton = document.getElementById('submitButton');
  const studentTable = document.getElementById('student-table');
  const grandTotal = document.getElementById('grand-total');
  
  // Load saved mode preference
  document.body.classList.toggle('light-mode', localStorage.getItem('mode') === 'light-mode');
  modeSwitch.checked = localStorage.getItem('mode') === 'light-mode';

  modeSwitch.addEventListener('change', function() {
    const isLightMode = this.checked;
    document.body.classList.toggle('light-mode', isLightMode);
    localStorage.setItem('mode', isLightMode ? 'light-mode' : 'dark-mode');
  });

  function fetchStudentData() {
    fetch('data.json')
      .then(response => response.json())
      .then(students => populateStudentList(students))
      .catch(err => console.error('Error fetching data:', err));
  }

  function populateStudentList(students) {
    studentTable.innerHTML = '';

    students.forEach(student => {
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
    grandTotal.style.color = total < 0 ? 'red' : '#026C3D';
    grandTotal.textContent = `Grand Total = ₹${total}`;
  }

  submitButton.addEventListener('click', function() {
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
      const credit = row.querySelectorAll('.amount-cell input')[1].value;
      if (debit || credit) {
        entries.push({ date, student, debit: debit || 0, credit: credit || 0 });
      }
    });

    if (entries.length > 0) {
      saveEntries(entries);
    } else {
      alert('No entries to save!');
    }
  });

  function saveEntries(entries) {
    fetch('saveData.php', { // Replace with your backend URL or use a local database
      method: 'POST',
      body: JSON.stringify(entries),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
      alert('Transactions saved!');
      fetchStudentData(); // Refresh data after saving
    })
    .catch(error => {
      console.error('Error saving data:', error);
    });
  }

  fetchStudentData();
});
