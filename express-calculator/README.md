# Express Calculator API

A simple calculator web service built with Express.js that provides both GET and POST endpoints for arithmetic operations.

## Features

- GET endpoint for addition
- POST endpoint for multiple operations (add, subtract, multiply, divide)
- Simple web interface for testing the API
- Error handling for invalid inputs
- Static file serving

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
```

2. Install dependencies:

```bash
cd <project-directory>
npm install
```

3. Start the server:

```bash
node server.js
```

The server will start running at `http://localhost:3000`

## Project Structure

```
├── server.js          # Main server file
├── public/            # Static files directory
│   └── index.html     # Web interface
├── package.json       # Project dependencies
└── README.md         # Project documentation
```

## API Endpoints

### GET `/add/:num1/:num2`

Adds two numbers provided in the URL parameters.

Example:

```
GET http://localhost:3000/add/5/3
Response: { "result": 8 }
```

### POST `/calculate`

Performs arithmetic operations based on the provided operation type.

Request body:

```json
{
    "operation": "add|subtract|multiply|divide",
    "num1": number,
    "num2": number
}
```

Example:

```json
POST http://localhost:3000/calculate
Body: {
    "operation": "multiply",
    "num1": 5,
    "num2": 3
}
Response: { "result": 15 }
```

## Dependencies

- Express.js
- Body-parser

## Testing

1. Open `http://localhost:3000` in your web browser
2. Use the web interface to test both GET and POST endpoints
3. You can also test the API directly using tools like Postman or curl

## Error Handling

The API includes error handling for:

- Invalid numbers
- Division by zero
- Invalid operations
- Missing parameters

## Screenshots

[Add your screenshots here when submitting]

## License

MIT

## Author

[Your Name]
