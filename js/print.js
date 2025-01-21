const printBtn = document.getElementById('print-pdf');

function printPDF(){
    alert("Preparing PDF for printing....");
    window.print();
}

printBtn.addEventListener('click', printPDF);

