// Function to load JSON data and populate tables
async function loadData() {
    try {
        // Load JSON data
        const troopResponse = await fetch("troop_stats.json");
        const troopData = await troopResponse.json();
        const flattenedTroopData = flattenData(troopData);

        const buildingResponse = await fetch("building_stats.json");
        const buildingData = await buildingResponse.json();
        const flattenedBuildingData = flattenData(buildingData);

        const trapResponse = await fetch("trap_stats.json");
        const trapData = await trapResponse.json();
        const flattenedTrapData = flattenData(trapData);

        // Populate tables
        populateTable("troops-table", flattenedTroopData, "Barbarian"); // Pass the troop type
        populateTable("buildings-table", flattenedBuildingData, "Buildings"); // Pass the building type
        populateTable("traps-table", flattenedTrapData, "Traps"); // Pass the trap type
    } catch (error) {
        console.error("Error loading data:", error);
    }
}
