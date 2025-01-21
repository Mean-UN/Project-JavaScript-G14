// Doughnut Chart
const doughnutCtx = document.getElementById("doughnutChart").getContext("2d");
const doughnutChart = new Chart(doughnutCtx, {
  type: "doughnut",
  data: {
    labels: ["Total", "Save", "Income", "Expense"],
    datasets: [
      {
        label: "Dataset 1",
        data: [30, 20, 15, 25],
        backgroundColor: ["#56801C", "#88B453", "#D0DD2B", "#F6D526"],
        borderColor: ["#56801C", "#88B453", "#D0DD2B", "#F6D526"],
        borderWidth: 1,
      },
    ],
  },
});

// Bar Chart
const barCtx = document.getElementById("barChart").getContext("2d");
const barChart = new Chart(barCtx, {
  type: "bar",
  data: {
    labels: ["Transport", "Food", "Bills", "Others"],
    datasets: [
      {
        label: "Monthly Expense",
        data: [12, 19, 3, 5],
        backgroundColor: ["#56801C", "#88B453", "#D0DD2B", "#F6D526"],
        borderColor: ["#56801C", "#88B453", "#D0DD2B", "#F6D526"],
        borderWidth: 1,
      },
    ],
  },
});
