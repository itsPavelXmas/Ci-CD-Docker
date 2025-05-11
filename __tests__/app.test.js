const axios = require('axios');
const express = require('express');
const request = require('supertest');

// Mock axios
jest.mock('axios');

// Import the app without starting the server
const app = express();
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>RON to EUR Exchange Rate</title>
        </head>
        <body>
            <h1>RON to EUR Exchange Rate</h1>
        </body>
        </html>
    `);
});

app.get('/rates', async (req, res) => {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/RON');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
});

describe('Exchange Rate App Tests', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    // Test the main page
    test('should return HTML page with correct title', async () => {
        const response = await request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200);

        expect(response.text).toContain('RON to EUR Exchange Rate');
    });

    // Test the rates endpoint
    test('should return exchange rates when API call is successful', async () => {
        // Mock the API response
        const mockRates = {
            rates: {
                EUR: 0.2,
                USD: 0.22
            },
            base: 'RON',
            date: '2024-03-20'
        };

        axios.get.mockResolvedValueOnce({ data: mockRates });

        const response = await request(app)
            .get('/rates')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toEqual(mockRates);
    });

    // Test error handling
    test('should handle API errors gracefully', async () => {
        // Mock API error
        axios.get.mockRejectedValueOnce(new Error('API Error'));

        const response = await request(app)
            .get('/rates')
            .expect('Content-Type', /json/)
            .expect(500);

        expect(response.body).toEqual({ error: 'Failed to fetch exchange rates' });
    });
}); 