// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPCMFbCMUpkQO6nHhz9GPf8muARAmTNqk",
  authDomain: "project-js-g14.firebaseapp.com",
  databaseURL: "https://project-js-g14-default-rtdb.firebaseio.com",
  projectId: "project-js-g14",
  storageBucket: "project-js-g14.appspot.com",
  messagingSenderId: "500769039233",
  appId: "1:500769039233:web:7d2634595f982cd17f3e80",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const filterCategory = document.getElementById("filter-category");

// Local state
let expenses = [];

/** Load expenses from Firebase */
function loadExpenses() {
  const expensesRef = ref(db, "expenses");
  onValue(expensesRef, (snapshot) => {
    const data = snapshot.val();
    expenses = data ? Object.values(data) : [];
    renderExpenses(expenses);
    updateTotalAmount();
  });
}

/** Add a new expense to Firebase */
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("expense-name").value.trim();
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;
  const date = document.getElementById("expense-date").value;

  if (!name || isNaN(amount) || amount <= 0 || !category || !date) {
    alert("Please fill in all fields with valid data.");
    return;
  }

  const id = Date.now(); // Unique ID
  const expense = { id, name, amount, category, date };

  set(ref(db, `expenses/${id}`), expense)
    .then(() => {
      expenseForm.reset();
    })
    .catch((error) => {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    });
});

/** Handle edit and delete actions */
expenseList.addEventListener("click", (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    remove(ref(db, `expenses/${id}`)).catch((error) => {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    });
  } else if (e.target.classList.contains("edit-btn")) {
    const expense = expenses.find((expense) => expense.id === parseInt(id));

    if (expense) {
      document.getElementById("expense-name").value = expense.name;
      document.getElementById("expense-amount").value = expense.amount;
      document.getElementById("expense-category").value = expense.category;
      document.getElementById("expense-date").value = expense.date;

      remove(ref(db, `expenses/${id}`)).catch((error) => {
        console.error("Error preparing for edit:", error);
        alert("Failed to edit expense. Please try again.");
      });
    }
  }
});

/** Render expenses to the table */
function renderExpenses(expenseArray) {
  expenseList.innerHTML = ""; // Clear table

  expenseArray.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.name}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>
        <button class="edit-btn" data-id="${expense.id}">Edit</button>
        <button class="delete-btn" data-id="${expense.id}">Delete</button>
      </td>
    `;
    expenseList.appendChild(row);
  });
}

/** Update total amount */
function updateTotalAmount() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmount.textContent = total.toFixed(2);
}

/** Filter expenses by category */
filterCategory.addEventListener("change", (e) => {
  const selectedCategory = e.target.value;
  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

  renderExpenses(filteredExpenses);
});

// Load expenses on page load
loadExpenses();
