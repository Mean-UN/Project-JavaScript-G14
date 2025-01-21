const input = document.getElementById('month-year');
const today = new Date();
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();
input.value = `${year}-${month}`;

const totalMoneyElement = document.querySelector(".total-money .number-money");
const totalSalaryDollarElement = document.querySelector(".total-salary-dollar .number-money");
const totalSalaryKhmerElement = document.querySelector(".total-salary-khmer .number-money");
const totalSavingElement = document.querySelector(".total-saving .number-money");

const addMoneyButton = document.getElementById("add-money");
const editButton = document.getElementById("edit");

const modal = document.getElementById("custom-modal");
const modalMessage = document.getElementById("modal-message");
const modalInput = document.getElementById("modal-input");
const modalConfirm = document.getElementById("modal-confirm");
const modalCancel = document.getElementById("modal-cancel");

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
    modalMessage.textContent = message;
    modalInput.value = "";
    modal.classList.remove("hidden");
    return new Promise((resolve) => {
        modalConfirm.onclick = () => {
            const inputValue = parseFloat(modalInput.value);
            if (!isNaN(inputValue) && inputValue >= 0) {
                hideModal();
                resolve(inputValue);
            } else {
                alert("Please enter a valid amount!");
            }
        };
        modalCancel.onclick = () => {
            hideModal();
            resolve(null);
        };
    });
}

function hideModal() {
    modal.classList.add("hidden");
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

addMoneyButton.addEventListener("click", addSalary);
editButton.addEventListener("click", editValues);

updateUI();

const tbody = document.getElementById("expenses-table");

function addExpenseRow(rowId, date, category, amount) {
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

    const newDate = prompt("Enter new date:", tdDate.textContent);
    const newCategory = prompt("Enter new category:", tdCategory.textContent);
    const newAmount = prompt("Enter new amount (in USD):", tdAmount.textContent.replace("$", "").trim());

    if (newDate) tdDate.textContent = newDate;
    if (newCategory) tdCategory.textContent = newCategory;
    if (newAmount && !isNaN(newAmount)) tdAmount.textContent = `$${parseFloat(newAmount).toFixed(2)}`;
    else if (newAmount) alert("Please enter a valid amount.");

    calculateTotalExpenses();
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
        const checkbox = row.querySelector('input[type="checkbox"]');
        const amount = parseFloat(row.children[3].textContent.replace("$", "").trim());

        if (checkbox && checkbox.checked && !isNaN(amount)) {
            totalExpenses += amount;
        }
    });

    const totalMoneyPerMonth = document.querySelector(".total-money-per-month .number-money");
    totalMoneyPerMonth.textContent = `$ ${totalExpenses.toFixed(2)}`;
}

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
                const colorNumber = document.querySelector(".number-money");
                colorNumber.style.color = "red";
            }            
        } else if (!checkbox.checked && !isNaN(amount)) {
            totalMoney += amount;
            totalSalary += amount;
            

        }
        updateUI();
        calculateTotalExpenses();
    }
});

function addExpenseAlert() {
    const date = prompt("Enter the date (YYYY-MM-DD):", "2025-01-01");
    const category = prompt("Enter the expense category (e.g., Food):", "Food");
    const amount = prompt("Enter the expense amount (USD):", "100");

    if (!date || !category || isNaN(amount) || parseFloat(amount) < 0) {
        alert("Invalid input. Please try again.");
        return;
    }

    const rowId = tbody.children.length + 1;
    addExpenseRow(rowId, date, category, amount);
    calculateTotalExpenses();
}

const addExpense = document.getElementById("add-expense");
addExpense.addEventListener("click", addExpenseAlert);

calculateTotalExpenses();

