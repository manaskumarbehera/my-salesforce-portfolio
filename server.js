const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');

// Import email modules
const {
    getEmailConfig,
    verifyConnection,
    isEmailConfigured,
    getEmailHealthStatus,
    maskEmail
} = require('./src/config/email');
const {
    sendContactNotification,
    sendAutoReply,
    sendRecommendationNotification,
    getTransporter
} = require('./src/services/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Astratis Global Analytics Configuration
const ASTRATIS_API_KEY = process.env.ASTRATIS_URL || process.env.ASTRATIS_API_KEY || '';

// Initialize email on startup
(async () => {
    if (isEmailConfigured()) {
        try {
            const config = getEmailConfig();
            const transporter = getTransporter();
            const result = await verifyConnection(transporter);
            if (result.success) {
                console.log(`✅ SMTP Server is ready (Mode: ${config.mode})`);
                console.log(`📧 From: ${maskEmail(config.from)} → To: ${maskEmail(config.to)}`);
            } else {
                console.error(`❌ SMTP Connection Error: ${result.error}`);
            }
        } catch (error) {
            console.error('❌ Email config error:', error.message);
        }
    } else {
        console.log('⚠️ Email not configured - set EMAIL_* environment variables');
    }
})();

// Rate limiter for contact form
const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per 15 minutes per IP
    message: {
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Use validate: false to disable the IPv6 warning in development
    validate: { xForwardedForHeader: false }
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
app.post('/api/contact', contactRateLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body;
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'] || null;
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;

    // Validate required fields (subject is optional)
    if (!name || !email || !message) {
        return res.status(400).json({
            ok: false,
            success: false,
            message: 'Name, email, and message are required.'
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            ok: false,
            success: false,
            message: 'Please provide a valid email address.'
        });
    }

    // Log the lead (no sensitive data)
    console.log('📧 New Lead Captured:', { name, timestamp });

    // Save lead to file (backup)
    const lead = { name, email, subject: subject || 'Contact Form', message, timestamp };
    const leadsFile = path.join(__dirname, 'leads.json');

    try {
        let leads = [];
        if (fs.existsSync(leadsFile)) {
            leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
        }
        leads.push(lead);
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    } catch (err) {
        console.error('Error saving lead to file:', err.message);
    }

    // Send email notification using new email service
    try {
        const notificationResult = await sendContactNotification({
            name,
            email,
            subject: subject || 'Contact Form Submission',
            message,
            timestamp,
            userAgent,
            ip
        });

        if (notificationResult.success) {
            // Send auto-reply to the visitor
            await sendAutoReply({ name, email, subject, message });
            console.log('✅ Emails sent successfully');
        } else {
            console.log('⚠️ Email notification skipped:', notificationResult.error);
        }

        res.json({
            ok: true,
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        });

    } catch (error) {
        console.error('❌ Error in contact form:', error.message);
        // Still return success since lead was saved
        res.json({
            ok: true,
            success: true,
            message: 'Thank you for your message! I will get back to you soon.'
        });
    }
});

// Email health check endpoint
app.get('/api/email/health', async (req, res) => {
    const status = getEmailHealthStatus();

    if (!status.configured) {
        return res.json({
            ok: false,
            configured: false,
            error: status.error
        });
    }

    // Optionally verify connection (if ?verify=true)
    if (req.query.verify === 'true') {
        try {
            const transporter = getTransporter();
            const result = await verifyConnection(transporter);
            return res.json({
                ok: result.success,
                configured: true,
                mode: status.mode,
                host: status.host,
                verified: result.success,
                error: result.error || undefined
            });
        } catch (error) {
            return res.json({
                ok: false,
                configured: true,
                mode: status.mode,
                verified: false,
                error: 'Verification failed'
            });
        }
    }

    res.json({
        ok: true,
        configured: true,
        mode: status.mode,
        host: status.host,
        port: status.port,
        secure: status.secure
    });
});

// Recommendations file path
const recommendationsFile = path.join(__dirname, 'recommendations.json');

// ============================================
// AI Chatbot API with Multiple AI Providers
// ============================================

// AI Provider Configuration
const AI_CONFIG = {
    openaiKey: process.env.OPENAI_API_KEY || '',
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',
    astratisKey: ASTRATIS_API_KEY,
    preferredProvider: process.env.AI_PROVIDER || 'auto' // 'openai', 'anthropic', 'astratis', 'auto'
};

// Portfolio context for AI responses
const PORTFOLIO_CONTEXT = {
    name: "Manas Kumar Behera",
    title: "Salesforce Developer & Architect",
    email: "web@manaskumarbehera.com",
    website: "https://www.manaskumarbehera.com",
    linkedin: "https://linkedin.com/in/manas-behera-68607547",
    github: "https://github.com/manaskumarbehera",
    trailblazer: "https://salesforce.com/trailblazer/manasbehera1990",
    buyMeCoffee: "https://buymeacoffee.com/manaskumarbehera",
    skills: {
        salesforce: ["Apex", "LWC", "Visualforce", "SOQL/SOSL", "Triggers", "Batch Apex", "Flow Builder"],
        apis: ["REST API", "SOAP API", "Tooling API", "GraphQL API", "Bulk API"],
        frontend: ["JavaScript", "HTML5", "CSS3", "React", "Chrome Extensions", "Bootstrap"],
        devops: ["Git", "Copado", "AutoRABIT", "CI/CD", "GitHub Actions", "SFDX"],
        cloud: ["Heroku", "Azure", "Node.js", "Express.js"],
        integrations: ["Genesys CTI", "Auth0", "Azure AD"]
    },
    projects: [
        {
            name: "TrackForce Pro",
            desc: "Ultimate productivity toolkit for Salesforce Admins and Developers with audit, query building, data exploration, and monitoring tools",
            type: "Chrome Extension",
            url: "https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk"
        },
        {
            name: "MetaForce",
            desc: "Salesforce metadata management and browser extension",
            type: "Chrome Extension",
            url: "https://chromewebstore.google.com/detail/metaforce/hclbblgimnkmlmnkekmbclfemhdgmjep"
        },
        {
            name: "Week Number",
            desc: "Simple and elegant week number display extension",
            type: "Chrome Extension",
            url: "https://chromewebstore.google.com/detail/week-number/hjbeeopedbnpahgbkndkemigkcellibm"
        },
        {
            name: "Portfolio Website",
            desc: "This professional portfolio built with Node.js, Express, and Bootstrap",
            type: "Web Application",
            url: "https://www.manaskumarbehera.com"
        }
    ],
    focus: "Building free and open-source tools for the Salesforce developer community",
    openSource: true,
    availableForHire: true
};

// System prompt for AI providers
const SYSTEM_PROMPT = `You are a friendly and helpful AI assistant for ${PORTFOLIO_CONTEXT.name}'s portfolio website (${PORTFOLIO_CONTEXT.website}).

ABOUT ${PORTFOLIO_CONTEXT.name.toUpperCase()}:
- Title: ${PORTFOLIO_CONTEXT.title}
- Focus: ${PORTFOLIO_CONTEXT.focus}
- All tools are FREE and open-source

SKILLS:
- Salesforce: ${PORTFOLIO_CONTEXT.skills.salesforce.join(', ')}
- APIs: ${PORTFOLIO_CONTEXT.skills.apis.join(', ')}
- Frontend: ${PORTFOLIO_CONTEXT.skills.frontend.join(', ')}
- DevOps: ${PORTFOLIO_CONTEXT.skills.devops.join(', ')}
- Cloud: ${PORTFOLIO_CONTEXT.skills.cloud.join(', ')}

PROJECTS:
${PORTFOLIO_CONTEXT.projects.map(p => `- ${p.name}: ${p.desc} (${p.type})`).join('\n')}

CONTACT:
- Email: ${PORTFOLIO_CONTEXT.email}
- LinkedIn: ${PORTFOLIO_CONTEXT.linkedin}
- GitHub: ${PORTFOLIO_CONTEXT.github}
- Support: ${PORTFOLIO_CONTEXT.buyMeCoffee}

GUIDELINES:
1. Be friendly, concise, and helpful
2. Answer questions about skills, projects, and experience
3. For hiring inquiries, mention he's available and provide contact info
4. For off-topic questions, politely redirect to portfolio topics
5. Encourage visitors to try the free Chrome extensions
6. Keep responses under 200 words unless more detail is needed
7. Use emojis sparingly to be friendly but professional
8. If asked about pricing, emphasize all tools are FREE`;

// Try OpenAI API
async function tryOpenAI(message) {
    if (!AI_CONFIG.openaiKey) return null;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.openaiKey}`
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                response: data.choices[0].message.content,
                source: 'openai',
                model: data.model
            };
        }
    } catch (error) {
        console.log('OpenAI error:', error.message);
    }
    return null;
}

// Try Anthropic Claude API
async function tryAnthropic(message) {
    if (!AI_CONFIG.anthropicKey) return null;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': AI_CONFIG.anthropicKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
                max_tokens: 500,
                system: SYSTEM_PROMPT,
                messages: [
                    { role: 'user', content: message }
                ]
            })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                response: data.content[0].text,
                source: 'anthropic',
                model: data.model
            };
        }
    } catch (error) {
        console.log('Anthropic error:', error.message);
    }
    return null;
}

// Try Astratis AI
async function tryAstratis(message) {
    if (!AI_CONFIG.astratisKey) return null;

    try {
        const response = await fetch('https://api.astratis.io/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.astratisKey}`
            },
            body: JSON.stringify({
                message: message,
                context: PORTFOLIO_CONTEXT,
                systemPrompt: SYSTEM_PROMPT
            })
        });

        if (response.ok) {
            const data = await response.json();
            return {
                response: data.response,
                source: 'astratis'
            };
        }
    } catch (error) {
        console.log('Astratis error:', error.message);
    }
    return null;
}

// Enhanced local response generator with NLP-like matching
function getSmartLocalResponse(message) {
    const msg = message.toLowerCase().trim();

    // Intent detection with weighted keywords
    const intents = {
        greeting: {
            keywords: ['hi', 'hello', 'hey', 'howdy', 'hola', 'good morning', 'good afternoon', 'good evening', 'whats up', "what's up"],
            weight: 1
        },
        skills: {
            keywords: ['skill', 'expertise', 'know', 'experience', 'capable', 'technology', 'tech stack', 'programming', 'language', 'framework'],
            weight: 1
        },
        projects: {
            keywords: ['project', 'portfolio', 'built', 'created', 'developed', 'work', 'made', 'build'],
            weight: 1
        },
        extensions: {
            keywords: ['extension', 'chrome', 'trackforce', 'metaforce', 'week number', 'tool', 'plugin', 'addon'],
            weight: 1.5
        },
        contact: {
            keywords: ['contact', 'email', 'reach', 'hire', 'connect', 'linkedin', 'github', 'message', 'talk'],
            weight: 1
        },
        salesforce: {
            keywords: ['salesforce', 'apex', 'lwc', 'lightning', 'soql', 'trigger', 'visualforce', 'trailblazer', 'sfdc', 'crm'],
            weight: 1.2
        },
        pricing: {
            keywords: ['price', 'cost', 'pay', 'free', 'premium', 'subscription', 'license', 'money'],
            weight: 1.5
        },
        help: {
            keywords: ['help', 'assist', 'support', 'what can you', 'options', 'menu', 'how to'],
            weight: 0.8
        },
        thanks: {
            keywords: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'awesome', 'amazing'],
            weight: 1
        },
        coffee: {
            keywords: ['coffee', 'donate', 'support', 'sponsor', 'tip', 'buy me'],
            weight: 1.5
        },
        about: {
            keywords: ['who', 'about', 'tell me about', 'introduce', 'yourself', 'manas'],
            weight: 1
        }
    };

    // Score each intent
    let bestIntent = 'help';
    let bestScore = 0;

    for (const [intent, config] of Object.entries(intents)) {
        let score = 0;
        for (const keyword of config.keywords) {
            if (msg.includes(keyword)) {
                score += config.weight;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestIntent = intent;
        }
    }

    // Generate response based on intent
    const responses = {
        greeting: `Hi there! 👋 I'm ${PORTFOLIO_CONTEXT.name}'s AI assistant. I can help you learn about his Salesforce expertise, projects, Chrome extensions, or how to get in touch. What would you like to know?`,

        skills: `${PORTFOLIO_CONTEXT.name} is a **${PORTFOLIO_CONTEXT.title}** with expertise in:\n\n` +
            `☁️ **Salesforce:** ${PORTFOLIO_CONTEXT.skills.salesforce.slice(0, 5).join(', ')}\n` +
            `🔗 **APIs:** ${PORTFOLIO_CONTEXT.skills.apis.slice(0, 4).join(', ')}\n` +
            `💻 **Frontend:** ${PORTFOLIO_CONTEXT.skills.frontend.slice(0, 4).join(', ')}\n` +
            `🔧 **DevOps:** ${PORTFOLIO_CONTEXT.skills.devops.slice(0, 4).join(', ')}\n\n` +
            `Ask about any specific skill for more details!`,

        projects: `Here are ${PORTFOLIO_CONTEXT.name}'s featured projects:\n\n` +
            PORTFOLIO_CONTEXT.projects.map(p => `🔹 **${p.name}** - ${p.desc}`).join('\n\n') +
            `\n\nAll projects are **100% free and open-source**! 🎉`,

        extensions: `${PORTFOLIO_CONTEXT.name} has built **free Chrome extensions** for Salesforce developers:\n\n` +
            `🛡️ **TrackForce Pro** - Productivity toolkit with audit, query building & monitoring\n` +
            `📊 **MetaForce** - Salesforce metadata management\n` +
            `📅 **Week Number** - Simple week number display\n\n` +
            `All available on the Chrome Web Store - completely FREE! Would you like installation links?`,

        contact: `You can reach ${PORTFOLIO_CONTEXT.name} through:\n\n` +
            `📧 **Email:** ${PORTFOLIO_CONTEXT.email}\n` +
            `💼 **LinkedIn:** ${PORTFOLIO_CONTEXT.linkedin}\n` +
            `💻 **GitHub:** ${PORTFOLIO_CONTEXT.github}\n` +
            `🌟 **Trailblazer:** ${PORTFOLIO_CONTEXT.trailblazer}\n\n` +
            `He's available for collaborations and Salesforce projects!`,

        salesforce: `${PORTFOLIO_CONTEXT.name} is a **Salesforce expert** specializing in:\n\n` +
            `⚡ **Development:** Apex, LWC, Visualforce, Triggers\n` +
            `🔍 **Data:** SOQL, SOSL, GraphQL API, Bulk API\n` +
            `🔗 **Integration:** REST/SOAP APIs, Genesys CTI, Auth0\n` +
            `🛠️ **DevOps:** Copado, AutoRABIT, SFDX, CI/CD\n\n` +
            `Check out his Trailblazer profile for certifications!`,

        pricing: `Great news! 🎉 **All of ${PORTFOLIO_CONTEXT.name}'s tools are 100% FREE!**\n\n` +
            `This includes:\n` +
            `✅ TrackForce Pro\n` +
            `✅ MetaForce\n` +
            `✅ Week Number\n\n` +
            `No premium versions, no subscriptions - just free tools for the community!\n\n` +
            `If they help you, consider supporting via Buy Me a Coffee ☕`,

        help: `I can help you with:\n\n` +
            `💼 **Skills** - Technical expertise & technologies\n` +
            `🚀 **Projects** - Portfolio & Chrome extensions\n` +
            `☁️ **Salesforce** - SF-specific expertise\n` +
            `📧 **Contact** - How to reach ${PORTFOLIO_CONTEXT.name}\n` +
            `💰 **Pricing** - Spoiler: Everything is FREE!\n\n` +
            `Just type your question or topic!`,

        thanks: `You're welcome! 😊 Is there anything else you'd like to know about ${PORTFOLIO_CONTEXT.name}'s work? Feel free to explore the portfolio or try the free Chrome extensions!`,

        coffee: `That's so thoughtful! ☕\n\nIf ${PORTFOLIO_CONTEXT.name}'s tools have helped you, you can support his work:\n\n` +
            `👉 **[Buy Me a Coffee](${PORTFOLIO_CONTEXT.buyMeCoffee})**\n\n` +
            `Your support helps keep these tools free for everyone! 💙`,

        about: `${PORTFOLIO_CONTEXT.name} is a **${PORTFOLIO_CONTEXT.title}** passionate about ${PORTFOLIO_CONTEXT.focus}.\n\n` +
            `🎯 **Focus:** Building free, open-source Salesforce tools\n` +
            `🔧 **Created:** 3+ Chrome extensions with hundreds of users\n` +
            `💡 **Philosophy:** Help developers work smarter, not harder\n\n` +
            `Want to know about his skills, projects, or get in touch?`
    };

    return {
        response: responses[bestIntent] || responses.help,
        source: 'local',
        intent: bestIntent
    };
}

// AI Chat endpoint with multi-provider support
app.post('/api/chat', async (req, res) => {
    const { message, conversationId } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Log chat for analytics (no PII)
    console.log(`💬 Chat: "${message.substring(0, 50)}..." at ${new Date().toISOString()}`);

    try {
        let result = null;
        const provider = AI_CONFIG.preferredProvider;

        // Try providers based on configuration
        if (provider === 'openai' || provider === 'auto') {
            result = await tryOpenAI(message);
        }

        if (!result && (provider === 'anthropic' || provider === 'auto')) {
            result = await tryAnthropic(message);
        }

        if (!result && (provider === 'astratis' || provider === 'auto')) {
            result = await tryAstratis(message);
        }

        // Fallback to smart local response
        if (!result) {
            result = getSmartLocalResponse(message);
        }

        res.json({
            success: true,
            response: result.response,
            source: result.source,
            model: result.model || undefined,
            intent: result.intent || undefined
        });

    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process chat message. Please try again.'
        });
    }
});

// Chat health/status endpoint
app.get('/api/chat/status', (req, res) => {
    res.json({
        success: true,
        providers: {
            openai: !!AI_CONFIG.openaiKey,
            anthropic: !!AI_CONFIG.anthropicKey,
            astratis: !!AI_CONFIG.astratisKey,
            local: true
        },
        preferredProvider: AI_CONFIG.preferredProvider,
        portfolioContext: {
            name: PORTFOLIO_CONTEXT.name,
            projectCount: PORTFOLIO_CONTEXT.projects.length
        }
    });
});

// ============================================
// Portfolio Configuration API
// ============================================

// Load portfolio config from env or file
function loadPortfolioConfig() {
    let config = { projects: [], chromeExtensions: [], source: 'default' };

    // Try environment variables first
    try {
        if (process.env.PORTFOLIO_PROJECTS) {
            config.projects = JSON.parse(process.env.PORTFOLIO_PROJECTS);
            config.source = 'env';
            console.log(`📦 Loaded ${config.projects.length} projects from PORTFOLIO_PROJECTS env`);
        }
        if (process.env.CHROME_EXTENSIONS) {
            config.chromeExtensions = JSON.parse(process.env.CHROME_EXTENSIONS);
            config.source = 'env';
            console.log(`🔌 Loaded ${config.chromeExtensions.length} extensions from CHROME_EXTENSIONS env`);
        }
    } catch (err) {
        console.error('❌ Failed to parse portfolio config from env:', err.message);
    }

    // Fallback to file if env not set
    if (config.projects.length === 0 || config.chromeExtensions.length === 0) {
        try {
            const configFile = path.join(__dirname, 'portfolio-config.json');
            if (fs.existsSync(configFile)) {
                const fileConfig = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
                if (config.projects.length === 0 && fileConfig.projects) {
                    config.projects = fileConfig.projects;
                    console.log(`📦 Loaded ${config.projects.length} projects from portfolio-config.json`);
                }
                if (config.chromeExtensions.length === 0 && fileConfig.chromeExtensions) {
                    config.chromeExtensions = fileConfig.chromeExtensions;
                    console.log(`🔌 Loaded ${config.chromeExtensions.length} extensions from portfolio-config.json`);
                }
                if (config.source === 'default') config.source = 'file';
            }
        } catch (err) {
            console.error('❌ Failed to load portfolio-config.json:', err.message);
        }
    }

    return config;
}

// Load config at startup
const portfolioConfig = loadPortfolioConfig();

// API: Get all projects
app.get('/api/portfolio/projects', (req, res) => {
    res.json({
        success: true,
        source: portfolioConfig.source,
        count: portfolioConfig.projects.length,
        projects: portfolioConfig.projects
    });
});

// API: Get featured projects only
app.get('/api/portfolio/projects/featured', (req, res) => {
    const featured = portfolioConfig.projects.filter(p => p.featured);
    res.json({
        success: true,
        source: portfolioConfig.source,
        count: featured.length,
        projects: featured
    });
});

// API: Get full portfolio configuration
app.get('/api/portfolio/config', (req, res) => {
    res.json({
        success: true,
        source: portfolioConfig.source,
        data: {
            projects: portfolioConfig.projects,
            chromeExtensions: portfolioConfig.chromeExtensions,
            totalProjects: portfolioConfig.projects.length,
            totalExtensions: portfolioConfig.chromeExtensions.length
        }
    });
});

// ============================================
// Chrome Extension User Count API
// ============================================

// Cache for extension stats to avoid rate limiting
const extensionStatsCache = {
    data: null,
    lastFetched: null,
    cacheDuration: 3600000 // 1 hour in milliseconds
};

// Build Chrome extensions object from config
function buildChromeExtensionsMap() {
    const extensionsMap = {};
    portfolioConfig.chromeExtensions.forEach(ext => {
        extensionsMap[ext.key] = {
            id: ext.id,
            name: ext.name,
            storeUrl: ext.storeUrl,
            icon: ext.icon || 'fab fa-chrome'
        };
    });

    // Fallback defaults if no config loaded
    if (Object.keys(extensionsMap).length === 0) {
        return {
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
    }

    return extensionsMap;
}

const CHROME_EXTENSIONS = buildChromeExtensionsMap();

// Log loaded extensions
console.log(`🔌 Chrome Extensions configured: ${Object.keys(CHROME_EXTENSIONS).join(', ')}`);


// Extension user counts from environment variable (most reliable)
// Format: EXTENSION_USER_COUNTS='{"trackforcepro":150,"weeknumber":350,"metaforce":60}'
function getManualUserCounts() {
    try {
        if (process.env.EXTENSION_USER_COUNTS) {
            return JSON.parse(process.env.EXTENSION_USER_COUNTS);
        }
    } catch (e) {
        console.error('Failed to parse EXTENSION_USER_COUNTS:', e.message);
    }
    return null;
}

// Fetch user count for a single extension using multiple methods
async function fetchExtensionUserCount(extensionId, extensionKey) {
    // Method 1: Check manual override from environment variable
    const manualCounts = getManualUserCounts();
    if (manualCounts && manualCounts[extensionKey]) {
        console.log(`📊 Using manual count for ${extensionKey}: ${manualCounts[extensionKey]}`);
        return manualCounts[extensionKey];
    }

    // Method 2: Try to scrape from Chrome Web Store
    try {
        // Use the old URL format that sometimes still works for scraping
        const urls = [
            `https://chrome.google.com/webstore/detail/${extensionId}`,
            `https://chromewebstore.google.com/detail/_/${extensionId}`
        ];

        for (const url of urls) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Cache-Control': 'no-cache',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'none'
                    },
                    timeout: 15000,
                    maxRedirects: 5
                });

                const html = response.data;

                // Method 2a: Look for user count in raw HTML (works better than cheerio for JS-rendered content)
                // Pattern matches: "10,000+ users", "500 users", etc.
                const patterns = [
                    /(\d{1,3}(?:,\d{3})*|\d+)\s*\+?\s*users/gi,
                    /"userCount":\s*"?(\d+)"?/i,
                    /users.*?(\d{1,3}(?:,\d{3})*)/gi
                ];

                for (const pattern of patterns) {
                    const matches = html.match(pattern);
                    if (matches && matches.length > 0) {
                        // Extract the number from the first match
                        const numMatch = matches[0].match(/(\d{1,3}(?:,\d{3})*|\d+)/);
                        if (numMatch) {
                            const count = parseInt(numMatch[1].replace(/,/g, ''));
                            if (count > 0) {
                                console.log(`📊 Scraped count for ${extensionKey}: ${count}`);
                                return count;
                            }
                        }
                    }
                }
            } catch (urlError) {
                // Try next URL
                continue;
            }
        }
    } catch (error) {
        console.error(`Error fetching extension ${extensionId}:`, error.message);
    }

    // Method 3: Return null if all methods fail
    console.log(`⚠️ Could not fetch user count for ${extensionKey}`);
    return null;
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
            const userCount = await fetchExtensionUserCount(ext.id, key);
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
        const userCount = await fetchExtensionUserCount(extension.id, extensionKey.toLowerCase());
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
        await sendRecommendationNotification(recommendation);

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

