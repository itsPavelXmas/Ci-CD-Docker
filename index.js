const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Function to fetch exchange rates
async function getExchangeRates() {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/RON');
        return response.data;
    } catch (error) {
        console.error('Error fetching exchange rates:', error.message);
        return null;
    }
}

// Serve static HTML
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>RON to EUR Exchange Rate</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background-color: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    text-align: center;
                }
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                }
                .rate-display {
                    font-size: 2.5em;
                    font-weight: bold;
                    color: #007bff;
                    margin: 20px 0;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    transition: background 0.3s;
                }
                .rate-label {
                    font-size: 1.2em;
                    color: #666;
                    margin-bottom: 10px;
                }
                .last-updated {
                    color: #666;
                    margin-top: 20px;
                    font-size: 0.9em;
                }
                .trend {
                    margin-top: 15px;
                    font-size: 1.1em;
                }
                .trend-indicator {
                    font-size: 1.2em;
                    font-weight: bold;
                    padding: 5px 10px;
                    border-radius: 4px;
                    margin-left: 10px;
                }
                .trend-up {
                    color: #28a745;
                    background-color: rgba(40, 167, 69, 0.1);
                }
                .trend-down {
                    color: #dc3545;
                    background-color: rgba(220, 53, 69, 0.1);
                }
                .trend-neutral {
                    color: #6c757d;
                    background-color: rgba(108, 117, 125, 0.1);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>RON to EUR Exchange Rate</h1>
                <div class="rate-label">1 EUR = </div>
                <div id="rate" class="rate-display">Loading...</div>
                <div id="lastUpdated" class="last-updated"></div>
            </div>
            <script>
                let previousRate = null;
                let rateDiv = null;

                async function updateRates() {
                    try {
                        const response = await fetch('/rates');
                        const data = await response.json();
                        if (!rateDiv) rateDiv = document.getElementById('rate');
                        const lastUpdatedDiv = document.getElementById('lastUpdated');
                        
                        // Calculate EUR rate (1/EUR rate since we're getting RON as base)
                        const eurRate = (1 / data.rates.EUR).toFixed(8);
                        
                        // Update the display
                        rateDiv.textContent = eurRate + ' RON';
                        
                        // Show trend if we have a previous rate
                        if (previousRate) {
                            var trend = eurRate > previousRate ? '▲' : eurRate < previousRate ? '▼' : '●';
                            var trendClass = eurRate > previousRate ? 'trend-up' : eurRate < previousRate ? 'trend-down' : 'trend-neutral';
                            rateDiv.innerHTML = eurRate + ' RON <span class="trend-indicator ' + trendClass + '">' + trend + '</span>';
                            // Animate background flash
                            rateDiv.style.background = eurRate > previousRate ? '#e6ffe6' : eurRate < previousRate ? '#ffe6e6' : '#f8f9fa';
                            setTimeout(function() {
                                rateDiv.style.background = '#f8f9fa';
                            }, 300);
                        } else {
                            rateDiv.textContent = eurRate + ' RON';
                        }
                        
                        previousRate = eurRate;
                        lastUpdatedDiv.textContent = 'Last updated: ' + new Date().toLocaleString();
                    } catch (error) {
                        console.error('Error updating rates:', error);
                        document.getElementById('rate').textContent = 'Error fetching rate';
                    }
                }

                // Update rates immediately and then every second
                updateRates();
                setInterval(updateRates, 1000);
            </script>
        </body>
        </html>
    `);
});

// API endpoint to get rates
app.get('/rates', async (req, res) => {
    const rates = await getExchangeRates();
    if (rates) {
        res.json(rates);
    } else {
        res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 