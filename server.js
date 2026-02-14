const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'", "https://api.github.com"]
        }
    }
}));

// Compression middleware
app.use(compression());

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: true
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoint for contact form (example)
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Here you can implement email sending logic
    // For example, using SendGrid, Mailgun, or AWS SES

    console.log('Contact form submission:', { name, email, subject, message });

    // For now, just return success
    res.json({
        success: true,
        message: 'Thank you for your message! I will get back to you soon.'
    });
});

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});

