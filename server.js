const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Email configuration - Set these in Heroku Config Vars
const EMAIL_USER = process.env.EMAIL_USER || 'manaskumarbehera1@outlook.com';
const EMAIL_PASS = process.env.EMAIL_PASS || ''; // Set in Heroku Config Vars
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp-mail.outlook.com'; // Outlook SMTP
const EMAIL_PORT = process.env.EMAIL_PORT || 587;

// Astratis Global Analytics Configuration
const ASTRATIS_API_KEY = process.env.ASTRATIS_URL || process.env.ASTRATIS_API_KEY || '';

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
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.astratis.io"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'", "https://api.github.com", "https://api.astratis.io", "https://*.astratis.io"]
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
                subject: `🎯 [PORTFOLIO LEAD] ${subject} - from ${name}`,
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

// Recommendations file path
const recommendationsFile = path.join(__dirname, 'recommendations.json');

// ============================================
// AI Chatbot API with Astratis Integration
// ============================================

// Portfolio context for AI responses
const PORTFOLIO_CONTEXT = {
    name: "Manas Kumar Behera",
    title: "Salesforce Developer & Architect",
    email: "behera.manas98@gmail.com",
    linkedin: "https://linkedin.com/in/manas-behera-68607547",
    github: "https://github.com/manaskumarbehera",
    trailblazer: "https://salesforce.com/trailblazer/manasbehera1990",
    skills: [
        "Apex", "LWC", "Visualforce", "SOQL/SOSL", "Triggers", "Batch Apex",
        "REST API", "SOAP API", "Tooling API", "GraphQL API",
        "JavaScript", "HTML5", "CSS3", "React", "Node.js",
        "Git", "Copado", "AutoRABIT", "CI/CD", "Heroku", "Azure"
    ],
    projects: [
        { name: "TrackForce Pro", desc: "Chrome extension for Salesforce audit trail analysis" },
        { name: "MetaForce", desc: "Salesforce metadata management extension" },
        { name: "Week Number", desc: "Simple week number display extension" }
    ],
    focus: "Building free and open-source tools for the Salesforce developer community"
};

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
    }

    try {
        // Try Astratis AI if available
        if (ASTRATIS_API_KEY) {
            try {
                const aiResponse = await fetch('https://api.astratis.io/v1/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${ASTRATIS_API_KEY}`
                    },
                    body: JSON.stringify({
                        message: message,
                        context: PORTFOLIO_CONTEXT,
                        systemPrompt: `You are a helpful AI assistant for ${PORTFOLIO_CONTEXT.name}'s portfolio website. 
                        Answer questions about their skills, projects, and experience as a Salesforce Developer.
                        Be friendly, concise, and helpful. If asked about topics outside the portfolio, 
                        politely redirect to portfolio-related topics.`
                    })
                });

                if (aiResponse.ok) {
                    const data = await aiResponse.json();
                    return res.json({
                        success: true,
                        response: data.response,
                        source: 'astratis-ai'
                    });
                }
            } catch (aiError) {
                console.log('Astratis AI not available:', aiError.message);
            }
        }

        // Fallback to simple keyword-based responses
        const response = getSimpleResponse(message.toLowerCase());
        res.json({
            success: true,
            response: response,
            source: 'local'
        });

    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({ success: false, message: 'Failed to process chat message' });
    }
});

// Simple keyword-based response generator (fallback)
function getSimpleResponse(message) {
    if (message.includes('skill') || message.includes('know') || message.includes('expertise')) {
        return `${PORTFOLIO_CONTEXT.name} is skilled in: ${PORTFOLIO_CONTEXT.skills.slice(0, 8).join(', ')}, and more!`;
    }
    if (message.includes('project') || message.includes('built') || message.includes('created')) {
        return PORTFOLIO_CONTEXT.projects.map(p => `• ${p.name}: ${p.desc}`).join('\n');
    }
    if (message.includes('contact') || message.includes('email') || message.includes('reach')) {
        return `You can reach ${PORTFOLIO_CONTEXT.name} at ${PORTFOLIO_CONTEXT.email} or connect on LinkedIn!`;
    }
    if (message.includes('salesforce')) {
        return `${PORTFOLIO_CONTEXT.name} specializes in Salesforce development including Apex, LWC, and API integrations.`;
    }
    return `I can help you learn about ${PORTFOLIO_CONTEXT.name}'s skills, projects, or how to get in touch. What would you like to know?`;
}

// ============================================
// Chrome Extension User Count API
// ============================================

// Cache for extension stats to avoid rate limiting
const extensionStatsCache = {
    data: null,
    lastFetched: null,
    cacheDuration: 3600000 // 1 hour in milliseconds
};

// Chrome extension IDs
const CHROME_EXTENSIONS = {
    trackforcepro: {
        id: 'eombeiphccjbnndbabnkimdlkpaooipk',
        name: 'TrackForce Pro',
        storeUrl: 'https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk'
    },
    weeknumber: {
        id: 'hjbeeopedbnpahgbkndkemigkcellibm',
        name: 'Week Number',
        storeUrl: 'https://chromewebstore.google.com/detail/week-number/hjbeeopedbnpahgbkndkemigkcellibm'
    },
    metaforce: {
        id: 'hclbblgimnkmlmnkekmbclfemhdgmjep',
        name: 'MetaForce',
        storeUrl: 'https://chromewebstore.google.com/detail/metaforce/hclbblgimnkmlmnkekmbclfemhdgmjep'
    }
};

// Fetch user count for a single extension
async function fetchExtensionUserCount(extensionId) {
    try {
        const url = `https://chrome.google.com/webstore/detail/${extensionId}`;
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        // Try multiple selectors to find user count
        let userCount = null;

        // Look for text containing "users" in various elements
        $('*').each((i, elem) => {
            const text = $(elem).text();
            const match = text.match(/(\d+[\d,]*)\s*(?:\+\s*)?users?/i);
            if (match && !userCount) {
                userCount = match[1].replace(/,/g, '');
            }
        });

        return userCount ? parseInt(userCount) : null;
    } catch (error) {
        console.error(`Error fetching extension ${extensionId}:`, error.message);
        return null;
    }
}

// API endpoint to get all extension stats
app.get('/api/extensions/stats', async (req, res) => {
    try {
        // Check cache
        const now = Date.now();
        if (extensionStatsCache.data && extensionStatsCache.lastFetched &&
            (now - extensionStatsCache.lastFetched) < extensionStatsCache.cacheDuration) {
            return res.json({
                success: true,
                cached: true,
                data: extensionStatsCache.data
            });
        }

        // Fetch fresh data
        const stats = {};
        let totalUsers = 0;

        for (const [key, ext] of Object.entries(CHROME_EXTENSIONS)) {
            const userCount = await fetchExtensionUserCount(ext.id);
            stats[key] = {
                name: ext.name,
                id: ext.id,
                storeUrl: ext.storeUrl,
                users: userCount,
                usersFormatted: userCount ? formatUserCount(userCount) : 'N/A'
            };
            if (userCount) totalUsers += userCount;
        }

        const result = {
            extensions: stats,
            totalUsers: totalUsers,
            totalUsersFormatted: formatUserCount(totalUsers),
            fetchedAt: new Date().toISOString()
        };

        // Update cache
        extensionStatsCache.data = result;
        extensionStatsCache.lastFetched = now;

        res.json({
            success: true,
            cached: false,
            data: result
        });

    } catch (error) {
        console.error('Error fetching extension stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch extension stats',
            error: error.message
        });
    }
});

// API endpoint for a single extension
app.get('/api/extensions/:extensionKey/stats', async (req, res) => {
    const { extensionKey } = req.params;
    const extension = CHROME_EXTENSIONS[extensionKey.toLowerCase()];

    if (!extension) {
        return res.status(404).json({
            success: false,
            message: 'Extension not found. Valid keys: ' + Object.keys(CHROME_EXTENSIONS).join(', ')
        });
    }

    try {
        const userCount = await fetchExtensionUserCount(extension.id);
        res.json({
            success: true,
            data: {
                name: extension.name,
                id: extension.id,
                storeUrl: extension.storeUrl,
                users: userCount,
                usersFormatted: userCount ? formatUserCount(userCount) : 'N/A',
                fetchedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch extension stats'
        });
    }
});

// Format user count (e.g., 1500 -> "1.5K")
function formatUserCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Helper function to read recommendations
function readRecommendations() {
    try {
        if (fs.existsSync(recommendationsFile)) {
            return JSON.parse(fs.readFileSync(recommendationsFile, 'utf-8'));
        }
    } catch (err) {
        console.error('Error reading recommendations:', err);
    }
    return [];
}

// Helper function to save recommendations
function saveRecommendations(recommendations) {
    fs.writeFileSync(recommendationsFile, JSON.stringify(recommendations, null, 2));
}

// GET - Fetch approved recommendations (public)
app.get('/api/recommendations', (req, res) => {
    try {
        const recommendations = readRecommendations();
        // Only return approved recommendations for public view
        const approved = recommendations.filter(r => r.status === 'approved');
        res.json({ success: true, recommendations: approved });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
    }
});

// GET - Fetch all recommendations (admin - requires secret key)
app.get('/api/recommendations/all', (req, res) => {
    const adminKey = req.query.key;
    if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'manas2026') {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const recommendations = readRecommendations();
        res.json({ success: true, recommendations });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
    }
});

// POST - Submit a new recommendation
app.post('/api/recommendations', async (req, res) => {
    const { name, title, email, linkedin, relationship, message, rating } = req.body;
    const timestamp = new Date().toISOString();

    // Validate required fields
    if (!name || !title || !email || !relationship || !message || !rating) {
        return res.status(400).json({
            success: false,
            message: 'All required fields must be filled.'
        });
    }

    // Validate message length
    if (message.length < 50) {
        return res.status(400).json({
            success: false,
            message: 'Recommendation must be at least 50 characters.'
        });
    }

    // Create recommendation object
    const recommendation = {
        id: Date.now().toString(),
        name,
        title,
        email, // Stored but not displayed publicly
        linkedin: linkedin || null,
        relationship,
        message,
        rating: parseInt(rating),
        status: 'pending', // pending, approved, rejected
        timestamp,
        approvedAt: null
    };

    // Save recommendation
    try {
        const recommendations = readRecommendations();
        recommendations.push(recommendation);
        saveRecommendations(recommendations);

        console.log('⭐ New Recommendation Received:', { name, title, relationship, timestamp });

        // Send email notification about new recommendation
        if (EMAIL_PASS) {
            try {
                await transporter.sendMail({
                    from: `"Portfolio Recommendation" <${EMAIL_USER}>`,
                    to: EMAIL_USER,
                    subject: `⭐ [NEW RECOMMENDATION] from ${name}`,
                    html: `
                        <h2>New Recommendation Submitted!</h2>
                        <p><strong>From:</strong> ${name}</p>
                        <p><strong>Title:</strong> ${title}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>LinkedIn:</strong> ${linkedin || 'Not provided'}</p>
                        <p><strong>Relationship:</strong> ${relationship}</p>
                        <p><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
                        <p><strong>Recommendation:</strong></p>
                        <blockquote style="border-left: 3px solid #ffc107; padding-left: 15px; color: #666;">
                            ${message}
                        </blockquote>
                        <hr>
                        <p><strong>To approve this recommendation, visit:</strong></p>
                        <p><a href="https://www.manaskumarbehera.com/api/recommendations/approve?id=${recommendation.id}&key=manas2026">Click to Approve</a></p>
                        <p><small>Received: ${timestamp}</small></p>
                    `
                });
            } catch (emailError) {
                console.error('Error sending recommendation notification:', emailError.message);
            }
        }

        res.json({
            success: true,
            message: 'Thank you for your recommendation! It will be reviewed and published soon.'
        });

    } catch (error) {
        console.error('Error saving recommendation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save recommendation. Please try again.'
        });
    }
});

// GET - Approve a recommendation (via email link)
app.get('/api/recommendations/approve', (req, res) => {
    const { id, key } = req.query;

    if (key !== process.env.ADMIN_KEY && key !== 'manas2026') {
        return res.status(401).send('<h1>Unauthorized</h1>');
    }

    try {
        const recommendations = readRecommendations();
        const index = recommendations.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).send('<h1>Recommendation not found</h1>');
        }

        recommendations[index].status = 'approved';
        recommendations[index].approvedAt = new Date().toISOString();
        saveRecommendations(recommendations);

        console.log('✅ Recommendation approved:', recommendations[index].name);

        res.send(`
            <html>
            <head><title>Recommendation Approved</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ Recommendation Approved!</h1>
                <p>The recommendation from <strong>${recommendations[index].name}</strong> is now visible on your portfolio.</p>
                <a href="https://www.manaskumarbehera.com/#recommendations">View on Portfolio</a>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Error approving recommendation:', error);
        res.status(500).send('<h1>Error approving recommendation</h1>');
    }
});

// GET - Reject a recommendation
app.get('/api/recommendations/reject', (req, res) => {
    const { id, key } = req.query;

    if (key !== process.env.ADMIN_KEY && key !== 'manas2026') {
        return res.status(401).send('<h1>Unauthorized</h1>');
    }

    try {
        const recommendations = readRecommendations();
        const index = recommendations.findIndex(r => r.id === id);

        if (index === -1) {
            return res.status(404).send('<h1>Recommendation not found</h1>');
        }

        recommendations[index].status = 'rejected';
        saveRecommendations(recommendations);

        console.log('❌ Recommendation rejected:', recommendations[index].name);

        res.send(`
            <html>
            <head><title>Recommendation Rejected</title></head>
            <body style="font-family: Arial; text-align: center; padding: 50px;">
                <h1 style="color: red;">❌ Recommendation Rejected</h1>
                <p>The recommendation from <strong>${recommendations[index].name}</strong> has been rejected.</p>
                <a href="https://www.manaskumarbehera.com">Back to Portfolio</a>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Error rejecting recommendation:', error);
        res.status(500).send('<h1>Error rejecting recommendation</h1>');
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

