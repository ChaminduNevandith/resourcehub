const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', message: 'Backend is running smoothly!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
