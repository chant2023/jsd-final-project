console.log('hello from final project', axios);

//declare variables to get data from google sheets, need to redo this so I don't expose API keys
const API_KEY = "AIzaSyDG4-gTqJKeVcWDCw9NXI0kXbvNw1TtErs";
const SHEET_ID = '19I4V_rXFsNrvHl7MOJzPWnFolKIK9raMUTRy2zWaCiY';
const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;
let transactionData;

//select the input element where what you want to filter is typed into. Add an event listener to this element that listens for anything typed into the input element. include ev as an argument to display events in console
document.querySelector('#dataFilter').addEventListener('input', ev => {
    // create a variable to store the header row
    const headerData = transactionData[0];
    // console.log(headerData);

    // declare a variable to display filtered data. Use filter which takes a function to be run for each element in an array. 'row' is the element in the filtered array (in this case the array is an array of arrays; the element is thus a sub-array). 'includes' just checks that something is within something else, and they do not necessarily have to be completely equal. 'ev.target.value' gives you the value inside the DOM node which has been listened. 
    const filteredTransactionData = transactionData.filter((row)=> row[8].includes(ev.target.value.toUpperCase()));
    // if no filtered data returned, display 'No results found'
    if (!filteredTransactionData.length) {
        renderTable(filteredTransactionData);
        return document.querySelector('#pTag').innerHTML = 'No results found'
    }
    // if no header displayed, add the header in
    if (filteredTransactionData[0] !== headerData) {
        filteredTransactionData.unshift(headerData);
        };
    // console.log(filteredTransactionData);
    renderTable(filteredTransactionData);
    
    // if something is typed into the 'Search ticker' form, display some text
    if (ev.target.value !== '') { 
        pTag.innerHTML = `Searching ticker transactions for: ${ev.target.value}`
    } else {
        pTag.innerHTML = ''
    }
});

function getData() {
//use axios to get data from google sheets
axios.get(URL)
    //callback function to get data from google sheets and put into transactionData variable, then render the data in HTML
    .then(response => {
        transactionData = response.data.values;
        const headerRowLength = transactionData[0].length
        transactionData.forEach(row => {
            if (row.length < headerRowLength) {
                const pushTimes = headerRowLength - row.length
                for (i = 0; i < pushTimes; i++) {
                    row.push('');
                }
            }
        })
       renderTable(transactionData);

       console.log(transactionData);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function renderTable(transactions) {
    let output ='<table>';

    //loop through rows obtained from google sheets as google sheets returns an array of arrays. The main array is the rows, and the sub-array is the columns
    transactions.forEach(row => {
        output += '<tr>';

        // loop through columns in each row, adding each google sheet cell within that row into a table data element and concatenating it into the output string
        row.forEach(cell => {
            if (cell === '' || cell === undefined) {
            output += `<td>&nbsp</td>`;
            } else {
                output += `<td>${cell}</td>`;
            }
        });

        output += '</tr>';

        
    });

    output += '</table>';

    // append data from googlesheets into the HTML page
    document.querySelector('#sheetData').innerHTML = output;
}
// load initial data
getData();
