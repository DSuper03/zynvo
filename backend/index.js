import cookieParser from "cookie-parser";
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('hello from anirban');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});