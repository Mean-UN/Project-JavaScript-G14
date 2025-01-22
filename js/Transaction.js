const KHR_EXCHANGE_RATE = 4100;

let expenses = JSON.parse(localStorage.getItem('expenses')) || [
  { id: 1, date: '2025-01', category: 'Food', amount: 100, paid: false }
];

let editingId = null;
let currentFilter = new Date().toISOString().slice(0, 7);

const modal = document.getElementById('modal');
const expenseForm = document.getElementById('expenseForm');
const expenseTableBody = document.getElementById('expenseTableBody');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const addSalaryBtn = document.getElementById('addSalaryBtn');
const printBtn = document.getElementById('printBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');
const dateFilter = document.getElementById('dateFilter');

lucide.createIcons();

function calculateTotals() {
  const filteredExpenses = currentFilter === 'all'
    ? expenses
    : expenses.filter(expense => expense.date === currentFilter);

  const totals = filteredExpenses
    .filter(expense => expense.paid)
    .reduce((acc, expense) => {
      const category = expense.category.toLowerCase();
      if (category.includes('salary')) {
        acc.salary += expense.amount;
      } else if (category.includes('saving')) {
        acc.savings += expense.amount;
      } else {
        acc.expenses += expense.amount;
      }
      return acc;
    }, { salary: 0, expenses: 0, savings: 0 });

  const balance = totals.salary - totals.expenses;

  if (balance > 0) {
    totals.savings += balance;
  }

  return {
    ...totals,
    balance,
    salaryKHR: totals.salary * KHR_EXCHANGE_RATE,
    total: totals.salary - totals.expenses
  };
}

function initializeMonthFilter() {
  const months = new Set(expenses.map(expense => expense.date));
  dateFilter.innerHTML = '<option value="all">All Months</option>';

  Array.from(months)
    .sort()
    .forEach(month => {
      const option = document.createElement('option');
      option.value = month;
      option.textContent = formatDate(month);
      dateFilter.appendChild(option);
    });
}

function updateTotals() {
  const totals = calculateTotals();

  document.getElementById('totalAmount').textContent = `$${totals.total.toFixed(2)}`;
  document.getElementById('salaryAmount').textContent = `$${totals.salary.toFixed(2)}`;
  document.getElementById('salaryKHR').textContent = `៛${totals.salaryKHR.toLocaleString()}`;
  document.getElementById('savingsAmount').textContent = `$${totals.savings.toFixed(2)}`;
  document.getElementById('totalDisplayAmount').textContent = `$${totals.total.toFixed(2)}`;

  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function formatDate(dateString) {
  const date = new Date(dateString + '-01');
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function renderExpenses() {
  const filteredExpenses = currentFilter === 'all'
    ? expenses
    : expenses.filter(expense => expense.date === currentFilter);

  expenseTableBody.innerHTML = filteredExpenses.map(expense => `
    <tr class="${expense.paid ? 'paid' : ''}">
      <td>${expense.id}</td>
      <td>${formatDate(expense.date)}</td>
      <td>${expense.category}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td>
        <input
          type="checkbox"
          ${expense.paid ? 'checked' : ''}
          onchange="togglePaid(${expense.id})"
          class="checkbox"
        >
      </td>
      <td>
        <button onclick="openEditModal(${expense.id})" class="action-btn edit-btn">
          <i data-lucide="edit"></i>
        </button>
        <button onclick="deleteExpense(${expense.id})" class="action-btn delete-btn">
          <i data-lucide="trash-2"></i>
        </button>
      </td>
    </tr>
  `).join('');

  lucide.createIcons();
}

function openAddModal() {
  editingId = null;
  modalTitle.textContent = 'Add New Expense';
  document.getElementById('date').value = currentFilter;
  document.getElementById('category').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('submitBtn').textContent = 'Add';
  modal.classList.add('show');
}

function openEditModal(id) {
  const expense = expenses.find(e => e.id === id);
  if (!expense) return;

  editingId = id;
  modalTitle.textContent = 'Edit Expense';
  document.getElementById('date').value = expense.date;
  document.getElementById('category').value = expense.category;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('submitBtn').textContent = 'Update';
  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
  editingId = null;
  expenseForm.reset();
}

function handleSubmit() {
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const amount = parseFloat(document.getElementById('amount').value);

  if (isNaN(amount)) {
    alert('Invalid amount! Please enter a number.');
    return;
  }

  if (editingId) {
    expenses = expenses.map(e =>
      e.id === editingId
        ? { ...e, date, category, amount }
        : e
    );
  } else {
    const newExpense = {
      id: Math.max(0, ...expenses.map(e => e.id)) + 1,
      date,
      category,
      amount,
      paid: false,
    };
    expenses.push(newExpense);
  }

  closeModal();
  initializeMonthFilter();
  renderExpenses();
  updateTotals();
}

function togglePaid(id) {
  expenses = expenses.map(expense =>
    expense.id === id
      ? { ...expense, paid: !expense.paid }
      : expense
  );
  renderExpenses();
  updateTotals();
}

function deleteExpense(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    expenses = expenses.filter(expense => expense.id !== id);
    alert('Expense deleted successfully!');
    initializeMonthFilter();
    renderExpenses();
    updateTotals();
  }
}

function printPDF() {
  alert('Preparing PDF for printing...');
  window.print();
}

function addQuickSalary() {
  const amount = prompt('Enter salary amount:');
  if (amount === null) return;

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    alert('Please enter a valid amount greater than 0');
    return;
  }

  const newExpense = {
    id: Math.max(0, ...expenses.map(e => e.id)) + 1,
    date: currentFilter,
    category: 'Salary',
    amount: parsedAmount,
    paid: true,
  };
  expenses.push(newExpense);
  initializeMonthFilter();
  renderExpenses();
  updateTotals();
  alert(`Salary of $${parsedAmount.toFixed(2)} has been added successfully!`);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeMonthFilter();
  dateFilter.value = currentFilter;
  renderExpenses();
  updateTotals();
});

dateFilter.addEventListener('change', (e) => {
  currentFilter = e.target.value;
  renderExpenses();
  updateTotals();
});

addExpenseBtn.addEventListener('click', () => {
  openAddModal();
});

addSalaryBtn.addEventListener('click', () => {
  addQuickSalary();
});

printBtn.addEventListener('click', () => {
  printPDF();
});

cancelBtn.addEventListener('click', () => {
  closeModal();
});

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit();
});
