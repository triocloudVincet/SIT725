import fetch from 'node-fetch';

async function simpleTest() {
    try {
        const response = await fetch('http://localhost:5001/api/stations/search?latitude=-37.8136&longitude=144.9631&radius=10');
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

simpleTest();
