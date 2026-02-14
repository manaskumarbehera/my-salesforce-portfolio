const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Email configuration - Set these in Heroku Config Vars
const EMAIL_USER = process.env.EMAIL_USER || 'manaskumarbehera1@outlook.com';
const EMAIL_PASS = process.env.EMAIL_PASS || ''; // Set in Heroku Config Vars
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp-mail.outlook.com'; // Outlook SMTP
const EMAIL_PORT = process.env.EMAIL_PORT || 587;

// Create email transporter
const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP Connection Error:', error.message);
        console.log('📧 Email Config: HOST=' + EMAIL_HOST + ', PORT=' + EMAIL_PORT + ', USER=' + EMAIL_USER);
        console.log('⚠️ Check that EMAIL_PASS is set correctly in Heroku Config Vars');
    } else {
        console.log('✅ SMTP Server is ready to send emails');
    }
});

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

// API endpoint for contact form - Lead Capture
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    const timestamp = new Date().toISOString();

    // Validate input
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    // Log the lead
    console.log('📧 New Lead Captured:', { name, email, subject, timestamp });

    // Save lead to file (backup)
    const lead = { name, email, subject, message, timestamp };
    const leadsFile = path.join(__dirname, 'leads.json');

    try {
        let leads = [];
        if (fs.existsSync(leadsFile)) {
            leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
        }
        leads.push(lead);
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    } catch (err) {
        console.error('Error saving lead to file:', err);
    }

    // Send email notification to you
    try {
        if (EMAIL_PASS) {
            // Email to yourself (lead notification)
            await transporter.sendMail({
                from: `"Portfolio Lead" <${EMAIL_USER}>`,
                to: EMAIL_USER,
                subject: `🎯 New Lead: ${subject}`,
                html: `
                    <h2>New Lead from Portfolio Website</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>Received: ${timestamp}</small></p>
                `
            });

            // Auto-reply to the visitor
            await transporter.sendMail({
                from: `"Manas Kumar Behera" <${EMAIL_USER}>`,
                to: email,
                subject: `Re: ${subject} - Thank you for reaching out!`,
                html: `
                    <h2>Thank you for contacting me, ${name}!</h2>
                    <p>I have received your message and will get back to you within 24-48 hours.</p>
                    <p><strong>Your message:</strong></p>
                    <blockquote style="border-left: 3px solid #0d6efd; padding-left: 15px; color: #666;">
                        ${message.replace(/\n/g, '<br>')}
                    </blockquote>
                    <hr>
                    <p>Best regards,<br><strong>Manas Kumar Behera</strong><br>Salesforce Developer</p>
                    <p>
                        <a href="https://github.com/manaskumarbehera">GitHub</a> | 
                        <a href="https://linkedin.com/in/manas-behera-68607547">LinkedIn</a> |
                        <a href="https://cloudwithmanas.com">Website</a>
                    </p>
                `
            });

            console.log('✅ Emails sent successfully');
        } else {
            console.log('⚠️ EMAIL_PASS not set - emails not sent');
        }

        res.json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        });

    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('Error details:', {
            code: error.code,
            command: error.command,
            responseCode: error.responseCode
        });
        // Still return success since lead was saved
        res.json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        });
    }
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

