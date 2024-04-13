


// function fetchLatestDataAndUpdate(endpoint, username, parameter, elementId) {
//         fetch(endpoint)
//             .then(response => response.json())
//             .then(data => {
//                 // Filter data based on the username
//                 const userData = data.filter(entry => entry.username === username);
//                 // Assuming the filtered data array is not empty
//                 if (userData.length > 0) {
//                     // Get the latest object from the filtered array
//                     const latestData = userData[userData.length - 1];
//                     // Get the value of the specified parameter from the latest object
//                     const value = latestData[parameter];
//                     // Update the content of the element with the specified ID
//                     document.getElementById(elementId).textContent = value;
//                 } else {
//                     console.error('No data available for the specified username:', username);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }
    
//     // Call the function for each parameter
//     // Assuming you have set the username variable in your HTML
//     fetchLatestDataAndUpdate('https://farmsync.pythonanywhere.com/api/data/', username, 'pHValue', 'phValue');
//     fetchLatestDataAndUpdate('https://farmsync.pythonanywhere.com/api/data/', username, 'turbidity', 'turbidityValue');
//     fetchLatestDataAndUpdate('https://farmsync.pythonanywhere.com/api/data/', username, 'temperature', 'temperatureValue');
//     fetchLatestDataAndUpdate('https://farmsync.pythonanywhere.com/api/data/', username, 'dissolved_oxygen', 'oxygenValue'); // Assuming dissolved oxygen is represented by 'dissolved_oxygen' in your API
    
//     const idealRanges = {
//         pH: { min: 6.5, max: 7.5 },
//         temperature: { min: 18, max: 28 },
//         turbidity: { min: 0, max: 5 },
//         dissolved_oxygen: { min: 5, max: 9 }
//     };
function fetchLatestDataAndUpdate(endpoint, username, parameter, elementId) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Filter data based on the username
            const userData = data.filter(entry => entry.username === username);
            // Assuming the filtered data array is not empty
            if (userData.length > 0) {
                // Get the latest object from the filtered array
                const latestData = userData[userData.length - 1];
                // Get the value of the specified parameter from the latest object
                const value = latestData[parameter];
                // Update the content of the element with the specified ID
                document.getElementById(elementId).textContent = value;

                // Compare the fetched data with ideal ranges and show alerts
                compareWithData(latestData);
            } else {
                console.error('No data available for the specified username:', username);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to compare fetched data with ideal ranges and show alerts
function compareWithData(data) {
    const idealRanges = {
        pH: { min: 6.5, max: 7.5 },
        temperature: { min: 18, max: 28 },
        turbidity: { min: 0, max: 5 },
        dissolved_oxygen: { min: 5, max: 9 }
    };

    const alertsContainer = document.getElementById('alert');
    Object.keys(data).forEach(param => {
        const value = data[param];
        const idealRange = idealRanges[param];
        if (idealRange) {
            if (value < idealRange.min) {
                showAlert(`${param} value (${value}) is low (${value} < ${idealRange.min})`, 'blue', alertsContainer);
            } else if (value > idealRange.max) {
                showAlert(`${param} value (${value}) is high (${value} > ${idealRange.max})`, 'red', alertsContainer);
            }
        }
    });
}

// Function to show alerts
function showAlert(message, color, container) {
    const alertElement = document.createElement('h3');
    alertElement.textContent = message;
    alertElement.style.color = color; // Set color based on parameter status
    container.appendChild(alertElement);
}

// Call the function for each parameter
// Assuming you have set the username variable in your HTML
 // Replace 'exampleUsername' with the actual username variable value from your HTML
fetchLatestDataAndUpdate('https://farmsync.pythonanywhere.com/api/data/', username, 'pHValue', 'phValue');
fetchLatestDataAndUpdate('https://farmsync.pythonanywhere.com/api/data/', username, 'turbidity', 'turbidityValue');
fetchLatestDataAndUpdate('https://farmsync.pythonanywhere.com/api/data/', username, 'temperature', 'temperatureValue');
fetchLatestDataAndUpdate('https://farmsync.pythonanywhere.com/api/data/', username, 'dissolved_oxygen', 'oxygenValue'); // Assuming dissolved oxygen is represented by 'dissolved_oxygen' in your API

    // Function to fetch the latest data from API
    async function fetchData() {
        try {
            const response = await fetch('https://farmsync.pythonanywhere.com/api/data/');
            const allData = await response.json();
            // Assuming data is an array of objects where each object represents a data entry
            // You may need to adjust this depending on the structure of your API response
            const latestData = allData[allData.length - 1]; // Get the last data entry
            return latestData;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    // Function to compare fetched data with ideal ranges
    function compareWithData(data) {
        const alertsContainer = document.getElementById('alert');
        Object.keys(data).forEach(param => {
            const value = data[param];
            const idealRange = idealRanges[param];
            if (idealRange) {
                if (value < idealRange.min) {
                    showAlert(`${param} value (${value}) is low (${value} < ${idealRange.min})`, 'blue', alertsContainer);
                    showSolution(param, 'Low', alertsContainer);
                } else if (value > idealRange.max) {
                    showAlert(`${param} value (${value}) is high (${value} > ${idealRange.max})`, 'red', alertsContainer);
                    showSolution(param, 'High', alertsContainer);
                }
            }
        });
    }
    
    // Function to show alerts
    function showAlert(message, color, container) {
        const alertElement = document.createElement('h3');
        alertElement.textContent = message;
        alertElement.style.color = color; // Set color based on parameter status
        container.appendChild(alertElement);
    }
    
    // Function to show solutions
    function showSolution(param, status, container) {
        const solutions = {
            pH: {
                Low: "Add lime or other pH-raising amendments to increase soil pH.",
                High: "Use sulfur or other pH-lowering amendments to decrease soil pH."
            },
            temperature: {
                Low: "Provide additional heating using greenhouse heaters or heating mats.",
                High: "Use shading, ventilation, or evaporative cooling techniques to lower temperatures if necessary."
            },
            turbidity: {
                Low: "Maintain water quality through proper filtration and regular cleaning of water sources.",
                High: "Address the source of turbidity, such as runoff or sedimentation, and implement appropriate measures to reduce it."
            },
            dissolved_oxygen: {
                Low: "Increase aeration through air stones, water pumps, or water movement to improve oxygen levels.",
                High: "Ensure proper circulation to prevent stagnation and potential fish stress."
            }
        };
    
        const solutionElement = document.createElement('h3');
        solutionElement.textContent = `Solution for ${param} (${status}): ${solutions[param][status]}`;
        solutionElement.style.color = 'darkgreen'; // Set color to dark green
        container.appendChild(solutionElement);
    }
    
    // Function to initiate the process
    async function startProcess() {
        const data = await fetchData();
        compareWithData(data);
    }
    
    // Call the function to start the process
    startProcess();
    

    async function fetchData(username) {
        try {
            const response = await fetch('https://farmsync.pythonanywhere.com/api/data/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', // Set appropriate headers
                    // Add any other headers you need (e.g., authentication tokens)
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Data from API:', data); // Display the fetched data in the console
            const userData = data.filter(entry => entry.username === username);
    
            // Get the latest entry from the data array
            const latestEntry = data[data.length - 1];
    
            // Extracting data for plotting
            const label = latestEntry.id;
            const pHValue = latestEntry.pHValue;
            const temperature = latestEntry.temperature;
            const turbidity = latestEntry.turbidity/100;
            const dissolved_oxygen = latestEntry.dissolved_oxygen;
    
            // Define ideal ranges for pH, temperature, turbidity, and dissolved_oxygen
            const idealRanges = {
                pH: { min: 6.5, max: 8.5 },
                temperature: { min: 0, max: 30 },
                turbidity: { min: 0, max: 5 },
                dissolved_oxygen: { min: 0, max: 15 }
            };
    
            // Function to determine background color based on value and ideal range
            function getBackgroundColor(value, idealRange) {
                if ( value > idealRange.max) {
                    return 'red'; // Value outside ideal range
                } else if (value >= idealRange.min && value <= idealRange.max) {
                    return 'green'; // Value within ideal range
                } else {
                    return 'yellow'; // Edge case
                }
            }
    
            // Creating the bar chart with dynamically changing background colors
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['pH Value', 'Temperature', 'Turbidity', 'Oxygen'],
                    datasets: [{
                        label: 'Latest Data',
                        data: [pHValue, temperature, turbidity, dissolved_oxygen],
                        backgroundColor: [
                            getBackgroundColor(pHValue, idealRanges.pH),
                            getBackgroundColor(temperature, idealRanges.temperature),
                            getBackgroundColor(turbidity, idealRanges.turbidity),
                            getBackgroundColor(dissolved_oxygen, idealRanges.dissolved_oxygen)
                        ]
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    // Call the fetchData function when the page loads
    window.addEventListener('load', () => {
        fetchData();
    });

    
    // Function to fetch and populate table data for the logged-in user
async function fetchDataAndPopulateTableForUser(username) {
    try {
        const response = await fetch('https://farmsync.pythonanywhere.com/api/data/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data from API:', data);
        
        // Filter data based on the username
        const userData = data.filter(entry => entry.username === username);
        userData.sort((a, b) => b.id - a.id);
        // Get the table body element
        const tableBody = document.getElementById('tableBody');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Loop through the filtered data and populate the table
        userData.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.username}</td>
                <td>${entry.id}</td>
                <td>${entry.pHValue}</td>
                <td>${entry.turbidity}</td>
                <td>${entry.temperature}</td>
                <td>${entry.dissolved_oxygen}</td>
                <td><span class="status ${getWQILabel(entry)}">${getWQILabel(entry)}</span></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the fetchDataAndPopulateTableForUser function when the page loads
window.addEventListener('load', () => {
    // Assuming you have set the username variable in your HTML
    fetchDataAndPopulateTableForUser(username);
});

    
    // Function to determine status based on pH and turbidity values
    function getWQILabel(entry) {
        const wqi = calculateWQI(entry.pHValue, entry.turbidity, entry.temperature, entry.dissolved_oxygen);
        if (wqi >= 60) {
            return 'safe';
        } else {
            return 'NotSafe';
        }
    }
    
    // Call the fetchDataAndPopulateTable function when the page loads
    window.addEventListener('load', () => {
        fetchDataAndPopulateTable();
    });

    
    async function fetchDataAndPlotChart(username) {
        try {
            const response = await fetch('https://farmsync.pythonanywhere.com/api/data/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Data from API:', data);
            const userData = data.filter(entry => entry.username === username); 
    
            // Calculate WQI for each entry
            const wqiData = data.map(entry => {
                const wqi = calculateWQI(entry.pHValue, entry.turbidity, entry.temperature, entry.dissolved_oxygen);
                return { timestamp: entry.id, wqi: wqi };
            });
    
            console.log('WQI Data:', wqiData);
    
            // Get the last 15 entries from the WQI data
            const last15WQIData = wqiData.slice(-15);
    
            // Extract timestamps and WQI values for plotting
            const timestamps = last15WQIData.map(entry => entry.timestamp);
            const wqiValues = last15WQIData.map(entry => entry.wqi);
    
            // Get the canvas element
            const canvas = document.getElementById('lineChart');
    
            // Plot the line chart
            const ctx = canvas.getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timestamps,
                    datasets: [{
                        label: 'Water Quality Index (WQI)',
                        data: wqiValues,
                        borderColor: 'blue',
                        borderWidth: 2,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            type: 'linear',
                            position: 'bottom',
                            scaleLabel: {
                                display: true,
                                labelString: 'Timestamp'
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 10
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'WQI'
                            }
                        }]
                    }
                }
            });
    
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    // Call the fetchDataAndPlotChart function when the page loads
    window.addEventListener('load', () => {
        const username = "{{ username }}"; // Assuming you have a way to retrieve the username
        fetchDataAndPlotChart(username);
    });
    
    function calculateWQI(pH, turbidity, temperature, dissolved_oxygen) {
        // Define weights for each parameter
        const pHWeight = 0.25;
        const turbidityWeight = 0.25;
        const temperatureWeight = 0.25;
        const dissolved_oxygenWeight = 0.25;
    
        // Normalize parameters to a 0-100 scale
        const normalize = (value, min, max) => {
            return Math.min(Math.max((value - min) / (max - min) * 100, 0), 100);
        };
        turbidity/=100;
        // Calculate sub-indices for each parameter
        const pHSubIndex = normalize(pH, 6.5, 8.5);
        const turbiditySubIndex = normalize(turbidity, 0, 100);
        const temperatureSubIndex = normalize(temperature, 0, 30);
        const dissolved_oxygenSubIndex = normalize(dissolved_oxygen, 0, 15);
    
        // Calculate overall WQI using weighted sum of sub-indices
        const overallWQI = (pHSubIndex * pHWeight + turbiditySubIndex * turbidityWeight +
            temperatureSubIndex * temperatureWeight + dissolved_oxygenSubIndex * dissolved_oxygenWeight) /
            (pHWeight + turbidityWeight + temperatureWeight + dissolved_oxygenWeight);
    
        // Return the calculated WQI
        
        return overallWQI;
    }
    // console.log(calculateWQI());

   console.log(username,"error");