// Function to create and populate a table for a specific troop type
function createTroopTable(troopType, data) {
    console.log(`Creating table for ${troopType}`); // Debugging

    // Create a new section for the troop type
    const section = document.createElement("div");
    section.className = "section";

    // Create a header for the troop type
    const header = document.createElement("h3");
    header.textContent = troopType;
    header.style.textAlign = "center";
    header.style.fontSize = "2rem";
    header.style.marginBottom = "1rem";
    section.appendChild(header);

    // Create a table element
    const table = document.createElement("table");
    table.className = "table table-striped";

    // Create table head and body
    const tableHead = document.createElement("thead");
    const tableBody = document.createElement("tbody");

    // Extract keys from the first item to use as headers
    const headers = Object.keys(data[0]);
    console.log("Headers for", troopType, ":", headers); // Debugging

    // Create header row
    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header; // Use the key as the header text
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create data rows
    data.forEach(item => {
        const row = document.createElement("tr");
        headers.forEach(header => {
            const cell = document.createElement("td");
            cell.textContent = item[header] || "N/A"; // Use "N/A" if data is missing
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });

    // Append thead and tbody to the table
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    // Append the table to the section
    section.appendChild(table);

    // Append the section to the troops container
    const troopsContainer = document.getElementById("troops-container");
    troopsContainer.appendChild(section);

    console.log(`Table for ${troopType} created successfully!`); // Debugging
}

// Function to load JSON data and create tables for each troop type
async function loadData() {
    console.log("Loading data..."); // Debugging

    try {
        // Fetch troops data
        const troopResponse = await fetch('/api/troops');
        const troopData = await troopResponse.json();
        console.log("Troop Data:", troopData); // Debugging

        // Fetch buildings data
        const buildingResponse = await fetch('/api/buildings');
        const buildingData = await buildingResponse.json();
        console.log("Building Data:", buildingData); // Debugging

        // Fetch traps data
        const trapResponse = await fetch('/api/traps');
        const trapData = await trapResponse.json();
        console.log("Trap Data:", trapData); // Debugging

        // Clear existing content in the troops container
        const troopsContainer = document.getElementById('troops-container');
        troopsContainer.innerHTML = '';

        // Process and display troops data
        processData(troopData, 'troop');
        processData(buildingData, 'building');
        processData(trapData, 'trap');

        console.log("Data loaded and tables populated successfully!"); // Debugging
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Function to process and display data
function processData(data, category) {
    const groupedData = data.reduce((acc, row) => {
        const key = `${row.type}-${row.level}`;
        if (!acc[key]) {
            acc[key] = { type: row.type, level: row.level, data: {} };
        }
        acc[key].data[row.key] = row.value;
        return acc;
    }, {});

    // Create tables
    for (const key in groupedData) {
        const { type, level, data } = groupedData[key];
        createDataTable(type, level, data, category);
    }
}

// Function to create a table
function createDataTable(type, level, data, category) {
    const section = document.createElement('div');
    section.className = 'section';

    const header = document.createElement('h3');
    header.textContent = `${type} (Level ${level})`;
    section.appendChild(header);

    const table = document.createElement('table');
    table.className = 'table table-striped';

    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    const headers = Object.keys(data);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    const row = document.createElement('tr');
    headers.forEach(header => {
        const cell = document.createElement('td');
        cell.textContent = data[header] || 'N/A';
        row.appendChild(cell);
    });
    tableBody.appendChild(row);

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    section.appendChild(table);

    const container = document.getElementById('troops-container');
    container.appendChild(section);
}

// Load data when the page loads
window.onload = loadData;
