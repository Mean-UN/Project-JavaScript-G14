const input = document.getElementById('month-year');
const today = new Date();
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();
input.value = `${year}-${month}`;

const totalMoneyElement = document.querySelector(".total-money .number-money");
const totalSalaryDollarElement = document.querySelector(".total-salary-dollar .number-money");
const totalSalaryKhmerElement = document.querySelector(".total-salary-khmer .number-money");
const totalSavingElement = document.querySelector(".total-saving .number-money");

let totalMoney = 0;
let totalSalary = 0;
const conversionRate = 4100;

function convertToKhmerMoney(amount) {
    return amount * conversionRate;
}

function updateUI() {
    totalMoneyElement.textContent = `$ ${totalMoney.toFixed(2)}`;
    totalSalaryDollarElement.textContent = `$ ${totalSalary.toFixed(2)}`;
    totalSalaryKhmerElement.textContent = `៛ ${convertToKhmerMoney(totalSalary).toFixed(2)}`;
    totalSavingElement.textContent = `$ ${totalMoney.toFixed(2)}`;
}

function showModal(message, callback) {
    const modalMessage = document.getElementById("modal-message");
    const modalInput = document.getElementById("modal-input");
    const modal = document.getElementById("custom-modal");

    modalMessage.textContent = message;
    modalInput.value = "";
    modal.classList.remove("hidden");

    return new Promise((resolve) => {
        document.getElementById("modal-confirm").onclick = () => {
            const inputValue = parseFloat(modalInput.value);
            if (!isNaN(inputValue) && inputValue >= 0) {
                hideModal();
                callback(inputValue);
            } else {
                alert("Please enter a valid amount!");
            }
        };

        document.getElementById("modal-cancel").onclick = () => {
            hideModal();
            resolve(null);
        };
    });
}

function hideModal() {
    document.getElementById("custom-modal").classList.add("hidden");
}

async function addSalary() {
    const salary = await showModal("Enter your salary in USD:");
    if (salary !== null) {
        totalSalary += salary;
        totalMoney += salary;
        updateUI();
    }
}

async function editValues() {
    const newSalary = await showModal("Enter the new total salary in USD:");
    if (newSalary !== null) {
        totalSalary = newSalary;
        totalMoney = newSalary;
        updateUI();
    }
}

// Add Event Listeners for Salary Buttons
document.getElementById("add-money").addEventListener("click", addSalary);
document.getElementById("edit").addEventListener("click", editValues);

// Add Expense Logic
const tbody = document.getElementById("expenses-table");

function generateRowId() {
    return Date.now();  // Unique row ID based on timestamp
}

function addExpenseRow(date, category, amount) {
    const rowId = generateRowId();  // Generate unique ID for the row
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", rowId);

    tr.innerHTML = `
        <td>${rowId}</td>
        <td>${date}</td>
        <td>${category}</td>
        <td>$${parseFloat(amount).toFixed(2)}</td>
        <td><input type="checkbox" name="paid"></td>
        <td>
            <button class="edit-expense">Edit</button>
            <button class="delete-expense">Delete</button>
        </td>
    `;

    tbody.appendChild(tr);
}

function editRow(tr) {
    const tdDate = tr.children[1];
    const tdCategory = tr.children[2];
    const tdAmount = tr.children[3];

    // Open modal for editing amount
    showModal("Edit Expense", async (newAmount) => {
        if (newAmount && !isNaN(newAmount)) {
            tdAmount.textContent = `$${parseFloat(newAmount).toFixed(2)}`;
            calculateTotalExpenses();
        } else {
            alert("Please enter a valid amount.");
        }
    });
}

function deleteRow(tr) {
    if (confirm("Are you sure you want to delete this expense?")) {
        tr.remove();
        calculateTotalExpenses();
    }
}

function calculateTotalExpenses() {
    const rows = tbody.querySelectorAll("tr");
    let totalExpenses = 0;

    rows.forEach((row) => {
        const amount = parseFloat(row.children[3].textContent.replace("$", "").trim());
        if (!isNaN(amount)) {
            totalExpenses += amount;
        }
    });

    const totalMoneyPerMonth = document.querySelector(".total-money-per-month .number-money");
    totalMoneyPerMonth.textContent = `$ ${totalExpenses.toFixed(2)}`;
}

document.getElementById("add-expense").addEventListener("click", () => {
    const date = prompt("Enter the date (YYYY-MM-DD):", "2025-01-01");
    const category = prompt("Enter the expense category (e.g., Food):", "Food");
    const amount = prompt("Enter the expense amount (USD):", "100");

    if (!date || !category || isNaN(amount) || parseFloat(amount) < 0) {
        alert("Invalid input. Please try again.");
        return;
    }

    addExpenseRow(date, category, amount);
    calculateTotalExpenses();
});

// Expense Table Actions (Edit/Delete)
tbody.addEventListener("click", (event) => {
    const tr = event.target.closest("tr");
    if (event.target.classList.contains("edit-expense")) {
        editRow(tr);
    } else if (event.target.classList.contains("delete-expense")) {
        deleteRow(tr);
    }
});

tbody.addEventListener("change", (event) => {
    if (event.target.type === "checkbox") {
        const checkbox = event.target;
        const row = checkbox.closest("tr");
        const amount = parseFloat(row.children[3].textContent.replace("$", "").trim());

        if (checkbox.checked && !isNaN(amount)) {
            totalMoney -= amount;
            totalSalary -= amount;
            if (totalSalary < 0) {
                alert("You have exceeded your monthly salary!");
                document.querySelector(".number-money").style.color = "red";
            }            
        } else if (!checkbox.checked && !isNaN(amount)) {
            totalMoney += amount;
            totalSalary += amount;
        }
        updateUI();
        calculateTotalExpenses();
    }
});

// Initial UI update
updateUI();