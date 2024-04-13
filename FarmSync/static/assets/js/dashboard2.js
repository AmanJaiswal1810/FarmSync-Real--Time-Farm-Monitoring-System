const idealRanges = {
  nitrogen: { min: 80, max: 170 },
  phosphorous: { min: 85, max: 170 },
  potassium: { min: 85, max: 170 },
  moisture_sensor: { min: 750, max: 930 },
  water_level_sensor: { min: 2, max: 6 }
};

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
        nitrogen: {
            Low: "Apply nitrogen-rich fertilizers such as ammonium sulfate, urea, or compost to boost nitrogen levels in the soil. Plant nitrogen-fixing cover crops like legumes (e.g., clover, peas, beans) to naturally increase soil nitrogen over time.",
            High: "Reduce nitrogen fertilizer applications to avoid nutrient imbalances and potential environmental pollution. Implement crop rotation to utilize excess nitrogen and prevent soil depletion."
        },
        phosphorous: {
            Low: "Apply phosphorus-rich fertilizers such as bone meal, rock phosphate, or phosphate rock to replenish soil phosphorus levels. Incorporate phosphorus-solubilizing bacteria or fungi into the soil to enhance phosphorus availability to plants.",
            High: "Avoid excessive phosphorus fertilization to prevent nutrient imbalances and potential environmental runoff. Monitor soil phosphorus levels closely and adjust fertilization practices accordingly."
        },
        potassium: {
            Low: "Apply potassium-rich fertilizers such as potassium sulfate, potassium chloride, or wood ash to replenish soil potassium levels. Use organic sources of potassium, such as kelp meal or banana peels, to provide a natural nutrient source.",
            High: "Avoid excessive potassium fertilization to prevent nutrient imbalances and potential negative impacts on soil pH or other nutrient interactions. Monitor soil potassium levels and adjust fertilization practices accordingly to maintain optimal nutrient balance."
        },
        moisture_sensor: {
            Low: "Increase irrigation frequency or use mulch to retain soil moisture.",
            High: "Improve soil drainage or reduce watering frequency to prevent waterlogging."
        },
        water_level_sensor: {
            Low: "Add water through irrigation or watering systems to bring levels within the desired range.",
            High: "Implement drainage systems or reduce water input to lower water levels if necessary."
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

let farmIdValue;

document.getElementById("farmIdForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    
    // Get the farmId value from the input field
    farmIdValue = document.getElementById("farmId").value;
    
    // Now you can use the farmIdValue variable for further processing, such as sending it to an API
    
    // For demonstration, let's log the farmIdValue to the console
    console.log("Farm ID entered:", farmIdValue);
    
    // Optionally, you can reset the form after fetching the farmId
    this.reset();
});
// console.log(farmIdValue);
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
      console.log('Latest data:', latestEntry);

      // Function to determine text color based on value and ideal range
      function getColor(value, idealMin, idealMax, lowThreshold) {
          if (value < idealMin) {
              return 'red'; // If value is less than ideal range
          } else if (value > idealMax) {
              return 'yellow'; // If value is greater than ideal range
          } else if (value < lowThreshold) {
              return 'red'; // If value is less than low threshold
          } else {
              return 'green'; // If value is within ideal range
          }
      }

      // Set text content and color for each parameter
      document.getElementById('nitrogenValue').textContent = latestEntry.nitrogen;
      document.getElementById('nitrogenValue').style.color = getColor(latestEntry.nitrogen, idealNitrogenMin, idealNitrogenMax);

      document.getElementById('phosphorousValue').textContent = latestEntry.phosphorous;
      document.getElementById('phosphorousValue').style.color = getColor(latestEntry.phosphorous, idealPhosphorousMin, idealPhosphorousMax);

      document.getElementById('potassiumValue').textContent = latestEntry.potassium;
      document.getElementById('potassiumValue').style.color = getColor(latestEntry.potassium, idealPotassiumMin, idealPotassiumMax);

      
      document.getElementById('soilMoistureValue').textContent = latestEntry.moisture_sensor;
      document.getElementById('soilMoistureValue').style.color = 'red'
      console.log('soilMoistureValue');
      document.getElementById('waterLevelValue').textContent = latestEntry.water_level_sensor;
      document.getElementById('waterLevelValue').style.color = getColor(latestEntry.water_level_sensor, idealWaterLevelMin, idealWaterLevelMax);
      

  } catch (error) {
      console.error('Error fetching or updating data:', error);
  }
}

// Ideal ranges for each parameter
const idealNitrogenMin = 85;
const idealNitrogenMax = 170;

const idealPhosphorousMin = 85;
const idealPhosphorousMax = 170;

const idealPotassiumMin = 85;
const idealPotassiumMax = 170;

const idealSoilMoistureMin = 200;
const idealSoilMoistureMax = 1000;
const lowSoilMoistureThreshold = 300;

const idealWaterLevelMin = 15;
const idealWaterLevelMax = 55;

// Call the fetchDataAndUpdate function with a specific username when the page loads
window.addEventListener('load', () => { // Provide the username here
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

      // Defining ideal ranges for NPK
      const idealRanges = {
          nitrogen: { min: 85, max: 170 },
          phosphorous: { min: 85, max: 170 },
          potassium: { min: 85, max: 170 }
      };

      console.log('Last values:', lastValues);

      // Checking values against ideal ranges and adjusting colors
      const backgroundColors = lastValues.map((value, index) => {
          console.log('Value:', value);
          console.log('Ideal Range:', idealRanges[Object.keys(idealRanges)[index]]);
          if (value < idealRanges[Object.keys(idealRanges)[index]].min) {
              console.log('Value below ideal range');
              return 'rgba(255, 255, 0, 1)'; // Yellow for lower than ideal range
          } else if (value > idealRanges[Object.keys(idealRanges)[index]].max) {
              console.log('Value above ideal range');
              return 'rgba(255, 99, 132, 0.7)'; // Red for higher than ideal range
          } else {
              console.log('Value within ideal range');
              return 'rgba(75, 192, 192, 0.7)'; // Green for within the ideal range
          }
      });

      console.log('Background Colors:', backgroundColors);

      // Creating the bar chart for last values
      const ctx = document.getElementById('myChart').getContext('2d');
      const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: [{
                  label: 'Latest Values',
                  data: lastValues,
                  backgroundColor: backgroundColors,
                  borderColor: backgroundColors, // Border color same as background color
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
   // Replace 'your_username_here' with the actual username
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
              backgroundColor: 'rgba(0, 0, 255, 0.7)',
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
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'blue',
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
