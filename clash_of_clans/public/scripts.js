// Function to populate a table for a specific troop type
function populateTable(section, data, troopType) {
    // Add a header for the troop type
    const header = document.createElement('h3');
    header.textContent = troopType;
    header.style.fontSize = '2rem';
    header.style.marginBottom = '1rem';
    section.appendChild(header);

    // Create the table element
    const table = document.createElement('table');
    table.className = 'table table-striped';
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // Extract headers from the first item
    const headers = Object.keys(data[0]);

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create data rows
    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const cell = document.createElement('td');
            cell.textContent = item[header] || "N/A"; // Use "N/A" if data is missing
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });

    // Append the table to the section
    table.appendChild(tableHead);
    table.appendChild(tableBody);
    section.appendChild(table);
}

// Function to load JSON data and create tables for each troop type
async function loadData() {
    try {
        // Load JSON data
        const troopResponse = await fetch("troop_stats.json");
        const troopData = await troopResponse.json();

        const buildingResponse = await fetch("building_stats.json");
        const buildingData = await buildingResponse.json();

        const trapResponse = await fetch("trap_stats.json");
        const trapData = await trapResponse.json();

        // Get the container for troops, buildings, and traps
        const troopsContainer = document.getElementById('troops-container');
        const buildingsContainer = document.getElementById('buildings-container');
        const trapsContainer = document.getElementById('traps-container');

        // Clear existing content
        troopsContainer.innerHTML = "";
        buildingsContainer.innerHTML = "";
        trapsContainer.innerHTML = "";

        // Iterate through each troop type and create tables
        for (const troopType in troopData) {
            if (Array.isArray(troopData[troopType])) {
                // Create a new section for the troop type
                const section = document.createElement('div');
                section.className = 'section';
                section.id = `${troopType.toLowerCase()}-section`;

                // Populate the table for this troop type
                populateTable(section, troopData[troopType], troopType);

                // Append the section to the troops container
                troopsContainer.appendChild(section);
            }
        }

        // Iterate through each building type and create tables
        for (const buildingType in buildingData) {
            if (Array.isArray(buildingData[buildingType])) {
                // Create a new section for the building type
                const section = document.createElement('div');
                section.className = 'section';
                section.id = `${buildingType.toLowerCase()}-section`;

                // Populate the table for this building type
                populateTable(section, buildingData[buildingType], buildingType);

                // Append the section to the buildings container
                buildingsContainer.appendChild(section);
            }
        }

        // Iterate through each trap type and create tables
        for (const trapType in trapData) {
            if (Array.isArray(trapData[trapType])) {
                // Create a new section for the trap type
                const section = document.createElement('div');
                section.className = 'section';
                section.id = `${trapType.toLowerCase()}-section`;

                // Populate the table for this trap type
                populateTable(section, trapData[trapType], trapType);

                // Append the section to the traps container
                trapsContainer.appendChild(section);
            }
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Load data when the page loads
window.onload = loadData;
