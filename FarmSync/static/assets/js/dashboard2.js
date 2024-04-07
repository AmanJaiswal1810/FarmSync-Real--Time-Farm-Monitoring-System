
async function fetchDataAndUpdate(username) {
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

        // Filter data based on the provided username
        const filteredData = data.filter(entry => entry.username === username);

        if (filteredData.length === 0) {
            throw new Error(`No data available for the specified username: ${username}`);
        }

        // Update UI with filtered data
        const latestEntry = filteredData[filteredData.length - 1];
        document.getElementById('nitrogenValue').textContent = latestEntry.nitrogen;
        document.getElementById('phosphorousValue').textContent = latestEntry.phosphorous;
        document.getElementById('potassiumValue').textContent = latestEntry.potassium;
        document.getElementById('soilMoistureValue').textContent = latestEntry.moisture_sensor;
        document.getElementById('waterLevelValue').textContent = latestEntry.water_level_sensor;

    } catch (error) {
        console.error('Error fetching or updating data:', error);
    }
}

// Call the fetchDataAndUpdate function with a specific username when the page loads
window.addEventListener('load', () => {
    fetchDataAndUpdate(username);
});

async function fetchDataAndPlotLastValues(username) {
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

        // Filter data based on the provided username
        const filteredData = data.filter(entry => entry.username === username);

        if (filteredData.length === 0) {
            throw new Error(`No data available for the specified username: ${username}`);
        }

        // Get the last object from the filtered data array
        const lastEntry = filteredData[filteredData.length - 1];
        
        // Extracting last values for plotting
        const labels = ['Nitrogen', 'Phosphorous', 'Potassium'];
        const lastValues = [lastEntry.nitrogen, lastEntry.phosphorous, lastEntry.potassium];

        // Creating the bar chart for last values
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Latest Values',
                    data: lastValues,
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                    borderWidth: 1,
                    barPercentage: 0.4, // Adjust bar width
                    categoryPercentage: 0.8 // Adjust space between bars
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stepSize: 100
                        }
                    }]
                }
            }
        });

    } catch (error) {
        console.error('Error fetching or plotting data:', error);
    }
}

// Call the fetchDataAndPlotLastValues function with a specific username when the page loads
window.addEventListener('load', () => {
    fetchDataAndPlotLastValues(username);
});



// Function to fetch moisture values and create line chart
function fetchMoistureValuesAndPlotChart(username) {
    fetch('https://farmsync.pythonanywhere.com/api/data/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Filter data based on the provided username
        const filteredData = data.filter(obj => obj.username === username);

        if (filteredData.length === 0) {
            throw new Error(`No data available for the specified username: ${username}`);
        }

        const moistureValues = filteredData.map(obj => obj.moisture_sensor);
        const reversedMoistureValues = moistureValues.reverse(); // Reverse the array
  
        // Create a line chart
        const ctx = document.getElementById('moistureChart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from(Array(reversedMoistureValues.length).keys()), // Generate labels 0, 1, 2, ...
            datasets: [{
              label: 'Moisture Sensor Values',
              data: reversedMoistureValues,
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.1)',
            }]
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Data Points'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Moisture Sensor Values'
                }
              }
            }
          }
        });
      })
      .catch(error => {
        console.error('There was a problem fetching or plotting the data:', error);
      });
}

// Call fetchMoistureValuesAndPlotChart() with a specific username when the page loads
window.addEventListener('load', () => {
    fetchMoistureValuesAndPlotChart(username);
});

function fetchWaterValuesAndPlotBarChart(username) {
    fetch('https://farmsync.pythonanywhere.com/api/data/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Filter data based on the provided username
        const filteredData = data.filter(obj => obj.username === username);

        if (filteredData.length === 0) {
            throw new Error(`No data available for the specified username: ${username}`);
        }

        const waterValues = filteredData.map(obj => obj.water_level_sensor);
        const lastWaterValue = waterValues[waterValues.length - 1]; // Get the last water level sensor value

        // Create a bar chart
        const ctx = document.getElementById('Water').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Latest Water Level Sensor Value'],
            datasets: [{
              label: 'Water Level Sensor Values',
              data: [lastWaterValue],
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderColor: 'white',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Data Points'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Water Level Sensor Values'
                },
                ticks: {
                  beginAtZero: true
                }
              }
            }
          }
        });
      })
      .catch(error => {
        console.error('There was a problem fetching or plotting the data:', error);
      });
}

window.addEventListener('load', () => {
    fetchWaterValuesAndPlotBarChart(username);
});
