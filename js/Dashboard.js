// Initialize Lucide icons
lucide.createIcons();

// Get expenses from localStorage
function getExpenses() {
  return JSON.parse(localStorage.getItem('expenses')) || [];
}

// Get available years from expenses
function getAvailableYears() {
  const expenses = getExpenses();
  const years = new Set(expenses.map(expense => expense.date.substring(0, 4)));
  return Array.from(years).sort();
}

// Initialize year filter
function initializeYearFilter() {
  const yearFilter = document.getElementById('yearFilter');
  const years = getAvailableYears();
  const currentYear = new Date().getFullYear().toString();

  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });

  // Set current year as default
  yearFilter.value = years.includes(currentYear) ? currentYear : years[years.length - 1];
  return yearFilter.value;
}

// Calculate monthly data for the selected year
function calculateMonthlyData(year) {
  const expenses = getExpenses();
  const monthlyData = Array(12).fill().map(() => ({
    income: 0,
    expenses: 0,
    savings: 0,
    balance: 0,
    totalSavings: 0 // Track cumulative savings
  }));

  // First pass: Calculate income and expenses
  expenses.forEach(expense => {
    if (expense.date.startsWith(year) && expense.paid) {
      const month = parseInt(expense.date.split('-')[1]) - 1;
      const amount = expense.amount;
      const category = expense.category.toLowerCase();

      if (category.includes('salary')) {
        monthlyData[month].income += amount;
      } else if (category.includes('saving')) {
        // If it's a saving entry, add it directly to savings
        monthlyData[month].savings += amount;
      } else {
        monthlyData[month].expenses += amount;
      }
    }
  });

  // Get previous year's December total savings
  let previousSavings = 0;
  const prevYear = (parseInt(year) - 1).toString();
  const prevYearData = calculatePreviousYearDecember(prevYear);
  if (prevYearData) {
    previousSavings = prevYearData.totalSavings;
  }

  // Calculate balance and accumulate savings for each month
  monthlyData.forEach((data, index) => {
    // Calculate this month's balance
    data.balance = data.income - data.expenses;
    
    // Add any positive balance to savings
    if (data.balance > 0) {
      data.savings += data.balance;
    }

    // Calculate total savings including previous month's savings
    if (index === 0) {
      // For January, use previous year's December savings
      data.totalSavings = previousSavings + data.savings;
    } else {
      // For other months, add to previous month's total savings
      data.totalSavings = monthlyData[index - 1].totalSavings + data.savings;
    }
  });

  return monthlyData;
}

// Helper function to get previous year's December data
function calculatePreviousYearDecember(year) {
  const expenses = getExpenses();
  const decemberData = {
    income: 0,
    expenses: 0,
    savings: 0,
    balance: 0,
    totalSavings: 0
  };

  expenses.forEach(expense => {
    if (expense.date === `${year}-12` && expense.paid) {
      const amount = expense.amount;
      const category = expense.category.toLowerCase();

      if (category.includes('salary')) {
        decemberData.income += amount;
      } else if (category.includes('saving')) {
        decemberData.savings += amount;
      } else {
        decemberData.expenses += amount;
      }
    }
  });

  decemberData.balance = decemberData.income - decemberData.expenses;
  if (decemberData.balance > 0) {
    decemberData.savings += decemberData.balance;
  }
  decemberData.totalSavings = decemberData.savings;
  return decemberData;
}


// Create monthly overview chart
function createMonthlyChart(monthlyData) {
  const canvas = document.getElementById('monthlyChart');
  const ctx = canvas.getContext('2d');
  
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  canvas.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Income',
          data: monthlyData.map(d => d.income),
          backgroundColor: '#10B981'
        },
        {
          label: 'Expenses',
          data: monthlyData.map(d => d.expenses),
          backgroundColor: '#EF4444'
        },
        {
          label: 'Monthly Savings',
          data: monthlyData.map(d => d.savings),
          backgroundColor: '#6366F1'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount ($)'
          }
        }
      }
    }
  });
}

// Create category distribution chart
function createCategoryChart(year) {
  const expenses = getExpenses().filter(e => 
    e.date.startsWith(year) && 
    e.paid && 
    !e.category.toLowerCase().includes('salary') &&
    !e.category.toLowerCase().includes('saving')
  );
  
  const categories = {};
  
  expenses.forEach(expense => {
    categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
  });

  const canvas = document.getElementById('categoryChart');
  const ctx = canvas.getContext('2d');
  
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  canvas.chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          '#10B981', '#EF4444', '#6366F1', '#F59E0B', '#EC4899',
          '#8B5CF6', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

// Create savings progress chart
function createSavingsChart(monthlyData) {
  const canvas = document.getElementById('savingsChart');
  const ctx = canvas.getContext('2d');
  
  if (canvas.chart) {
    canvas.chart.destroy();
  }
  
  canvas.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Total Savings',
        data: monthlyData.map(d => d.totalSavings),
        borderColor: '#6366F1',
        tension: 0.1,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cumulative Savings ($)'
          }
        }
      }
    }
  });
}

// Update monthly records table
function updateMonthlyRecords(monthlyData) {
  const tbody = document.querySelector('#monthlyRecords tbody');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  tbody.innerHTML = monthlyData.map((data, index) => {
    return `
      <tr>
        <td>${months[index]}</td>
        <td>$${data.income.toFixed(2)}</td>
        <td>$${data.expenses.toFixed(2)}</td>
        <td>$${(data.income - data.expenses).toFixed(2)}</td>
        <td class="${data.balance >= 0 ? 'positive' : 'negative'}">$${data.balance.toFixed(2)}</td>
      </tr>
    `;
  }).join('');
}

// Update all charts and tables
function updateDashboard(year) {
  const monthlyData = calculateMonthlyData(year);
  
  // Update all visualizations
  createMonthlyChart(monthlyData);
  createCategoryChart(year);
  createSavingsChart(monthlyData);
  updateMonthlyRecords(monthlyData);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const selectedYear = initializeYearFilter();
  updateDashboard(selectedYear);
});


document.getElementById('yearFilter').addEventListener('change', (e) => {
  updateDashboard(e.target.value);
});
