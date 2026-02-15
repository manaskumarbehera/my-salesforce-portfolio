// ============================================
// Astratis Global Analytics Integration
// ============================================

// Analytics helper function
const trackEvent = (eventName, eventData = {}) => {
    if (window.astratis && typeof window.astratis.track === 'function') {
        window.astratis.track(eventName, {
            ...eventData,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
    }
    // Fallback logging for development
    if (window.location.hostname === 'localhost') {
        console.log('📊 Analytics Event:', eventName, eventData);
    }
};

// Track page sections viewed
const trackSectionView = (sectionId) => {
    trackEvent('section_viewed', {
        section: sectionId,
        icon: getSectionIcon(sectionId)
    });
};

// Get icon for each section (for analytics dashboard)
const getSectionIcon = (sectionId) => {
    const icons = {
        'home': 'fa-home',
        'about': 'fa-user',
        'skills': 'fa-cogs',
        'projects': 'fa-code',
        'tools': 'fa-tools',
        'recommendations': 'fa-star',
        'contact': 'fa-envelope'
    };
    return icons[sectionId] || 'fa-circle';
};

// Track external link clicks
const trackExternalLink = (url, linkType) => {
    trackEvent('external_link_click', {
        url: url,
        type: linkType,
        icon: getLinkIcon(linkType)
    });
};

// Get icon for link types
const getLinkIcon = (linkType) => {
    const icons = {
        'github': 'fab fa-github',
        'linkedin': 'fab fa-linkedin',
        'chrome-store': 'fab fa-chrome',
        'salesforce': 'fab fa-salesforce',
        'coffee': 'fas fa-coffee',
        'email': 'fas fa-envelope',
        'live-demo': 'fas fa-globe'
    };
    return icons[linkType] || 'fas fa-external-link-alt';
};

// Track button clicks
const trackButtonClick = (buttonName, buttonCategory) => {
    trackEvent('button_click', {
        button: buttonName,
        category: buttonCategory
    });
};

// Track form submissions
const trackFormSubmission = (formName, success) => {
    trackEvent('form_submission', {
        form: formName,
        success: success,
        icon: success ? 'fa-check-circle' : 'fa-times-circle'
    });
};

// Track scroll depth
let maxScrollDepth = 0;
const trackScrollDepth = () => {
    const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        if (maxScrollDepth % 25 === 0 && maxScrollDepth > 0) {
            trackEvent('scroll_depth', {
                depth: maxScrollDepth,
                icon: 'fa-arrow-down'
            });
        }
    }
};

// Initialize analytics tracking
document.addEventListener('DOMContentLoaded', () => {
    // Track page load
    trackEvent('page_load', {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        icon: 'fa-eye'
    });

    // Track external link clicks
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', () => {
            const url = link.href;
            let linkType = 'other';

            if (url.includes('github.com')) linkType = 'github';
            else if (url.includes('linkedin.com')) linkType = 'linkedin';
            else if (url.includes('chromewebstore.google.com')) linkType = 'chrome-store';
            else if (url.includes('salesforce.com') || url.includes('trailblazer')) linkType = 'salesforce';
            else if (url.includes('buymeacoffee.com')) linkType = 'coffee';

            trackExternalLink(url, linkType);
        });
    });

    // Track scroll depth
    window.addEventListener('scroll', trackScrollDepth);

    // Track CTA button clicks
    document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const buttonText = btn.textContent.trim();
            trackButtonClick(buttonText, 'hero_cta');
        });
    });

    // Track tool/project card interactions
    document.querySelectorAll('.project-card, .tool-card').forEach(card => {
        card.addEventListener('click', () => {
            const cardTitle = card.querySelector('h4')?.textContent || 'Unknown';
            trackEvent('card_interaction', {
                card: cardTitle,
                icon: 'fa-mouse-pointer'
            });
        });
    });
});

// ============================================
// Main Application Code
// ============================================

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Track section navigation
            const sectionId = this.getAttribute('href').replace('#', '');
            trackSectionView(sectionId);

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// GitHub Repository Configuration
const GITHUB_USERNAME = 'manaskumarbehera';

// Set to false to temporarily hide the GitHub repos section
const SHOW_GITHUB_REPOS = false;

// Add the exact repo names you want to feature (leave empty to show all repos)
const INCLUDED_REPOS = [
    'my-salesforce-portfolio',  // My Portfolio Project
    'sf-audit-extractor',       // TrackForce Pro Chrome Extension
    'CurrentWeek',              // Week Number Chrome Extension
    'MetaForce'                 // MetaForce Chrome Extension
];

// Project metadata with live links and Chrome Web Store URLs
const PROJECT_METADATA = {
    'my-salesforce-portfolio': {
        displayName: 'My Portfolio',
        liveUrl: 'https://www.manaskumarbehera.com/',
        type: 'web'
    },
    'sf-audit-extractor': {
        displayName: 'TrackForce Pro',
        storeUrl: 'https://chromewebstore.google.com/detail/trackforcepro/eombeiphccjbnndbabnkimdlkpaooipk',
        type: 'extension'
    },
    'CurrentWeek': {
        displayName: 'Week Number',
        storeUrl: 'https://chromewebstore.google.com/detail/week-number/hjbeeopedbnpahgbkndkemigkcellibm',
        type: 'extension'
    },
    'MetaForce': {
        displayName: 'MetaForce',
        storeUrl: 'https://chromewebstore.google.com/detail/metaforce/hclbblgimnkmlmnkekmbclfemhdgmjep',
        type: 'extension'
    }
};

// Fetch GitHub Repositories
async function fetchGitHubRepos() {
    const reposContainer = document.getElementById('github-repos');

    // Hide section if SHOW_GITHUB_REPOS is false or element doesn't exist
    if (!SHOW_GITHUB_REPOS || !reposContainer) {
        if (reposContainer) {
            reposContainer.innerHTML = '';
            reposContainer.style.display = 'none';
        }
        return;
    }

    // Show the container if we're going to load repos
    reposContainer.style.display = 'flex';

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);

        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();

        // Filter to only include specified repos (if list is not empty)
        const filteredRepos = INCLUDED_REPOS.length > 0
            ? repos.filter(repo => INCLUDED_REPOS.includes(repo.name))
            : repos.filter(repo => !repo.fork).slice(0, 4); // Fallback: show first 4 non-fork repos

        if (filteredRepos.length === 0) {
            reposContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No repositories found. Update your GitHub username in main.js</p>
                </div>
            `;
            return;
        }

        reposContainer.innerHTML = filteredRepos.map(repo => createRepoCard(repo)).join('');

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        reposContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <p class="mb-0">Update the GITHUB_USERNAME constant in js/main.js to display your repositories.</p>
                </div>
            </div>
        `;
    }
}

// Create Repository Card HTML
function createRepoCard(repo) {
    const metadata = PROJECT_METADATA[repo.name] || {};
    const displayName = metadata.displayName || repo.name;
    const description = repo.description || 'No description available';
    const language = repo.language || 'Unknown';
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;

    // Build action buttons based on project type
    let actionButtons = `
        <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">
            <i class="fab fa-github"></i> View Code
        </a>
    `;

    if (metadata.liveUrl) {
        actionButtons += `
            <a href="${metadata.liveUrl}" target="_blank" class="btn btn-sm btn-primary mt-2 ms-2">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
        `;
    }

    if (metadata.storeUrl) {
        actionButtons += `
            <a href="${metadata.storeUrl}" target="_blank" class="btn btn-sm btn-success mt-2 ms-2">
                <i class="fab fa-chrome"></i> Chrome Store
            </a>
        `;
    }

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="repo-card">
                <h5>
                    ${metadata.type === 'extension' ? '<i class="fab fa-chrome"></i>' : '<i class="fab fa-github"></i>'}
                    <a href="${repo.html_url}" target="_blank" style="text-decoration: none; color: inherit;">
                        ${displayName}
                    </a>
                </h5>
                <p class="repo-description">${description}</p>
                <div class="repo-meta">
                    <div class="repo-stats">
                        <span class="repo-stat">
                            <i class="fas fa-circle" style="color: ${getLanguageColor(language)}"></i>
                            ${language}
                        </span>
                        <span class="repo-stat">
                            <i class="fas fa-star"></i>
                            ${stars}
                        </span>
                        <span class="repo-stat">
                            <i class="fas fa-code-branch"></i>
                            ${forks}
                        </span>
                    </div>
                </div>
                <div class="repo-actions">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
}

// Get language color for display
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'Apex': '#1797c0',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584'
    };
    return colors[language] || '#888';
}

// Contact Form Handling - Lead Capture
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // Track successful form submission
            trackFormSubmission('contact_form', true);
            // Show success message
            showNotification('success', result.message);
            this.reset();
        } else {
            // Track failed form submission
            trackFormSubmission('contact_form', false);
            showNotification('error', result.message || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        // Track error in form submission
        trackFormSubmission('contact_form', false);
        showNotification('error', 'Failed to send message. Please try again or email directly.');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Notification helper
function showNotification(type, message) {
    // Remove existing notification
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `form-notification alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;

    document.getElementById('contactForm').appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => notification.remove(), 5000);
}

// ============================================
// Chatbot Functionality with Astratis AI
// ============================================

// Chatbot configuration
const CHATBOT_CONFIG = {
    botName: "Manas's Assistant",
    welcomeMessage: "Hi there! 👋 I'm Manas's AI assistant. How can I help you learn about his work?",
    useAstratisAI: true, // Set to true to use Astratis AI
    typingDelay: 800
};

// Chatbot knowledge base (fallback when AI is not available)
const chatbotKnowledge = {
    greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'hola', 'howdy'],
    skills: ['skills', 'expertise', 'technologies', 'tech stack', 'what can you do', 'programming', 'know'],
    projects: ['projects', 'work', 'portfolio', 'built', 'created', 'developed', 'made'],
    tools: ['tools', 'extensions', 'chrome', 'trackforce', 'metaforce', 'week number', 'extension'],
    contact: ['contact', 'email', 'reach', 'hire', 'connect', 'linkedin', 'github', 'message'],
    experience: ['experience', 'years', 'background', 'career', 'work history', 'job'],
    salesforce: ['salesforce', 'apex', 'lwc', 'lightning', 'soql', 'trailblazer', 'crm', 'sfdc'],
    help: ['help', 'support', 'assist', 'what can you', 'options', 'menu', '?'],
    thanks: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'awesome'],
    coffee: ['coffee', 'donate', 'support', 'buy me', 'tip', 'sponsor']
};

const chatbotResponses = {
    greetings: [
        "Hi there! 👋 I'm Manas's virtual assistant. How can I help you today?",
        "Hello! Welcome to Manas's portfolio. Feel free to ask me anything about his work!",
        "Hey! 😊 Great to see you here. What would you like to know about Manas?"
    ],
    skills: [
        "Manas is a skilled <strong>Salesforce Developer</strong> with expertise in:<br><br>" +
        "☁️ <strong>Salesforce:</strong> Apex, LWC, Visualforce, SOQL/SOSL, Triggers, Batch Apex<br>" +
        "🔗 <strong>APIs:</strong> REST, SOAP, Tooling API, GraphQL<br>" +
        "💻 <strong>Frontend:</strong> JavaScript, HTML5, CSS3, React, Chrome Extensions<br>" +
        "🔧 <strong>DevOps:</strong> Git, Copado, AutoRABIT, CI/CD<br>" +
        "☁️ <strong>Cloud:</strong> Heroku, Azure, Node.js<br><br>" +
        "Want to know more about a specific skill?"
    ],
    projects: [
        "Manas has built several awesome projects! Here are the highlights:<br><br>" +
        "🔹 <strong>TrackForce Pro</strong> - Chrome extension for Salesforce audit trail analysis<br>" +
        "🔹 <strong>MetaForce</strong> - Salesforce metadata management extension<br>" +
        "🔹 <strong>Week Number</strong> - Simple week number display extension<br>" +
        "🔹 <strong>This Portfolio</strong> - Built with Bootstrap & Node.js<br><br>" +
        "All projects are <strong>100% free and open-source</strong>! Check out the Projects section for more details."
    ],
    tools: [
        "Manas has created several <strong>free Chrome extensions</strong> for the Salesforce community:<br><br>" +
        "🛡️ <strong>TrackForce Pro</strong> - Extract and analyze Salesforce audit trails<br>" +
        "📊 <strong>MetaForce</strong> - Manage Salesforce metadata efficiently<br>" +
        "📅 <strong>Week Number</strong> - Display current week number<br><br>" +
        "All available on the Chrome Web Store! Would you like links to install them?"
    ],
    contact: [
        "You can reach Manas through:<br><br>" +
        "📧 <strong>Email:</strong> behera.manas98@gmail.com<br>" +
        "💼 <strong>LinkedIn:</strong> <a href='https://linkedin.com/in/manas-behera-68607547' target='_blank'>Connect on LinkedIn</a><br>" +
        "💻 <strong>GitHub:</strong> <a href='https://github.com/manaskumarbehera' target='_blank'>View GitHub Profile</a><br>" +
        "🌟 <strong>Trailblazer:</strong> <a href='https://salesforce.com/trailblazer/manasbehera1990' target='_blank'>View Trailblazer</a><br><br>" +
        "Feel free to connect for collaborations or projects!"
    ],
    experience: [
        "Manas is an experienced <strong>Salesforce Developer & Architect</strong> with expertise in:<br><br>" +
        "✅ Custom Salesforce application development<br>" +
        "✅ Lightning Web Components (LWC)<br>" +
        "✅ API integrations (Genesys CTI, Auth0, Azure)<br>" +
        "✅ DevOps & CI/CD implementation<br>" +
        "✅ Chrome extension development<br><br>" +
        "He's passionate about building <strong>free tools</strong> to help the developer community!"
    ],
    salesforce: [
        "Manas specializes in the <strong>Salesforce ecosystem</strong>:<br><br>" +
        "⚡ <strong>Development:</strong> Apex, LWC, Visualforce, Aura Components<br>" +
        "🔍 <strong>Queries:</strong> SOQL, SOSL, GraphQL API<br>" +
        "🔗 <strong>Integration:</strong> REST API, SOAP API, Tooling API<br>" +
        "🎯 <strong>CTI:</strong> Genesys integration with Salesforce<br>" +
        "🛠️ <strong>Tools:</strong> SFDX, VS Code, Developer Console<br><br>" +
        "Check out his Trailblazer profile for certifications!"
    ],
    help: [
        "I can help you with:<br><br>" +
        "💼 <strong>Skills</strong> - Learn about Manas's technical expertise<br>" +
        "🚀 <strong>Projects</strong> - Explore his portfolio and Chrome extensions<br>" +
        "🔧 <strong>Tools</strong> - Discover free Salesforce tools he's built<br>" +
        "📧 <strong>Contact</strong> - Get in touch with Manas<br>" +
        "☁️ <strong>Salesforce</strong> - His Salesforce expertise<br><br>" +
        "Just type your question or click a button below!"
    ],
    thanks: [
        "You're welcome! 😊 Is there anything else you'd like to know?",
        "Happy to help! Feel free to ask more questions or explore the portfolio.",
        "Glad I could assist! Don't forget to check out the free Chrome extensions! 🚀"
    ],
    coffee: [
        "That's so kind! ☕ If Manas's tools have helped you, you can support his work:<br><br>" +
        "👉 <a href='https://buymeacoffee.com/manaskumarbehera' target='_blank'><strong>Buy Me a Coffee</strong></a><br><br>" +
        "Your support helps keep these tools free for everyone! 💙"
    ],
    default: [
        "I'm not sure I understood that. Could you try rephrasing? Or click one of the buttons below to learn about specific topics!",
        "Hmm, I didn't quite catch that. Try clicking a button below or ask about Manas's projects, skills, or contact info!",
        "I'm still learning! Try clicking a topic button or ask about 'projects', 'skills', or 'contact'."
    ]
};

// Quick reply options
const quickReplies = [
    { text: "👨‍💻 Skills", query: "skills" },
    { text: "🚀 Projects", query: "projects" },
    { text: "🔧 Tools", query: "tools" },
    { text: "📧 Contact", query: "contact" }
];

// Initialize chatbot
function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const container = document.getElementById('chatbotContainer');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const messages = document.getElementById('chatMessages');
    const badge = document.getElementById('chatBadge');

    if (!toggle || !container) {
        console.log('Chatbot elements not found');
        return;
    }

    console.log('Chatbot initialized');

    // Show welcome badge after 3 seconds
    setTimeout(() => {
        if (!container.classList.contains('active')) {
            if (badge) badge.style.display = 'flex';
        }
    }, 3000);

    // Toggle chatbot on button click
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const isActive = container.classList.toggle('active');
        toggle.classList.toggle('active');
        if (badge) badge.style.display = 'none';

        if (isActive && messages.children.length === 0) {
            // Send welcome message with quick replies
            setTimeout(() => {
                addBotMessage(CHATBOT_CONFIG.welcomeMessage, true);
            }, 500);
        }

        if (isActive && input) {
            setTimeout(() => input.focus(), 100);
        }

        // Track chatbot usage
        trackEvent('chatbot_toggled', {
            action: isActive ? 'opened' : 'closed',
            icon: 'fa-comments'
        });
    });

    // Send message on button click
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendChatMessage();
        });
    }

    // Send message on Enter key
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
}

// Send user message and get response
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addUserMessage(message);
    input.value = '';

    // Track message
    trackEvent('chatbot_message', { message: message.substring(0, 50) });

    // Show typing indicator
    showTypingIndicator();

    try {
        // Try server-side AI first
        const serverResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (serverResponse.ok) {
            const data = await serverResponse.json();
            if (data.success && data.response) {
                removeTypingIndicator();
                addBotMessage(data.response);
                return;
            }
        }
    } catch (serverError) {
        console.log('Server AI not available:', serverError);
    }

    // Try Astratis client-side AI
    if (CHATBOT_CONFIG.useAstratisAI && window.astratis && typeof window.astratis.chat === 'function') {
        try {
            const aiResponse = await window.astratis.chat(message);
            if (aiResponse) {
                removeTypingIndicator();
                addBotMessage(aiResponse);
                return;
            }
        } catch (astratisError) {
            console.log('Astratis client AI not available:', astratisError);
        }
    }

    // Fallback to local responses
    setTimeout(() => {
        removeTypingIndicator();
        const response = getLocalResponse(message);
        addBotMessage(response);
    }, CHATBOT_CONFIG.typingDelay);
}

// Add user message to chat
function addUserMessage(text) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `
        <div class="chat-message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="chat-message-content">${escapeHtml(text)}</div>
    `;
    messages.appendChild(messageDiv);
    scrollChatToBottom();
}

// Add bot message to chat
function addBotMessage(text, showQuickRepliesButtons = false) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';

    let quickRepliesHtml = '';
    if (showQuickRepliesButtons) {
        quickRepliesHtml = `
            <div class="quick-replies">
                ${quickReplies.map(qr => 
                    `<button class="quick-reply-btn" data-query="${qr.query}">${qr.text}</button>`
                ).join('')}
            </div>
        `;
    }

    messageDiv.innerHTML = `
        <div class="chat-message-avatar">
            <i class="fab fa-salesforce"></i>
        </div>
        <div class="chat-message-content">
            ${text}
            ${quickRepliesHtml}
        </div>
    `;
    messages.appendChild(messageDiv);

    // Add click handlers to quick reply buttons
    messageDiv.querySelectorAll('.quick-reply-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const query = this.getAttribute('data-query');
            if (query) {
                const input = document.getElementById('chatInput');
                if (input) {
                    input.value = query;
                    sendChatMessage();
                }
            }
        });
    });

    scrollChatToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;

    // Remove existing typing indicator
    removeTypingIndicator();

    const indicator = document.createElement('div');
    indicator.className = 'chat-message bot';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
        <div class="chat-message-avatar">
            <i class="fab fa-salesforce"></i>
        </div>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    messages.appendChild(indicator);
    scrollChatToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Get local response based on user input (fallback)
function getLocalResponse(input) {
    const lowerInput = input.toLowerCase();

    // Check each category
    for (const [category, keywords] of Object.entries(chatbotKnowledge)) {
        if (keywords.some(keyword => lowerInput.includes(keyword))) {
            const responses = chatbotResponses[category];
            if (responses && responses.length > 0) {
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }

    // Default response
    const defaultResponses = chatbotResponses.default;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Scroll chat to bottom
function scrollChatToBottom() {
    const messages = document.getElementById('chatMessages');
    if (messages) {
        messages.scrollTop = messages.scrollHeight;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are loaded
    setTimeout(initChatbot, 100);
});

// ============================================
// Analytics Dashboard Display
// ============================================

// Fetch and display analytics stats
async function loadAnalyticsStats() {
    const analyticsSection = document.getElementById('analyticsSection');
    if (!analyticsSection) return;

    try {
        // Try to fetch from Astratis API
        if (window.astratis && typeof window.astratis.getStats === 'function') {
            const stats = await window.astratis.getStats();
            updateAnalyticsDisplay(stats);
        } else {
            // Fallback: Use local storage for basic counting
            updateLocalAnalytics();
        }
    } catch (error) {
        console.log('Analytics stats not available:', error);
        // Show placeholder or hide section
        updateLocalAnalytics();
    }
}

// Update analytics display with data
function updateAnalyticsDisplay(stats) {
    const pageViewEl = document.getElementById('pageViewCount');
    const visitorEl = document.getElementById('visitorCount');
    const projectEl = document.getElementById('projectViews');
    const toolEl = document.getElementById('toolClicks');

    if (pageViewEl && stats.pageViews) {
        pageViewEl.textContent = formatNumber(stats.pageViews);
    }
    if (visitorEl && stats.visitors) {
        visitorEl.textContent = formatNumber(stats.visitors);
    }
    if (projectEl && stats.projectClicks) {
        projectEl.textContent = formatNumber(stats.projectClicks);
    }
    if (toolEl && stats.toolClicks) {
        toolEl.textContent = formatNumber(stats.toolClicks);
    }
}

// Local analytics fallback using localStorage
function updateLocalAnalytics() {
    // Increment page view count
    let pageViews = parseInt(localStorage.getItem('portfolio_pageviews') || '0');
    pageViews++;
    localStorage.setItem('portfolio_pageviews', pageViews.toString());

    // Track unique visitors using a simple cookie/localStorage approach
    let isNewVisitor = !localStorage.getItem('portfolio_visitor_id');
    if (isNewVisitor) {
        localStorage.setItem('portfolio_visitor_id', generateVisitorId());
    }

    let visitors = parseInt(localStorage.getItem('portfolio_visitors') || '0');
    if (isNewVisitor) {
        visitors++;
        localStorage.setItem('portfolio_visitors', visitors.toString());
    }

    // Get project and tool clicks from localStorage
    let projectClicks = parseInt(localStorage.getItem('portfolio_project_clicks') || '0');
    let toolClicks = parseInt(localStorage.getItem('portfolio_tool_clicks') || '0');

    // Update display
    updateAnalyticsDisplay({
        pageViews: pageViews,
        visitors: visitors,
        projectClicks: projectClicks,
        toolClicks: toolClicks
    });
}

// Track project clicks locally
function trackProjectClick() {
    let clicks = parseInt(localStorage.getItem('portfolio_project_clicks') || '0');
    clicks++;
    localStorage.setItem('portfolio_project_clicks', clicks.toString());

    const projectEl = document.getElementById('projectViews');
    if (projectEl) {
        projectEl.textContent = formatNumber(clicks);
    }
}

// Track tool clicks locally
function trackToolClick() {
    let clicks = parseInt(localStorage.getItem('portfolio_tool_clicks') || '0');
    clicks++;
    localStorage.setItem('portfolio_tool_clicks', clicks.toString());

    const toolEl = document.getElementById('toolClicks');
    if (toolEl) {
        toolEl.textContent = formatNumber(clicks);
    }
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Generate unique visitor ID
function generateVisitorId() {
    return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Initialize analytics dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAnalyticsStats();
    loadRecommendations(); // Load recommendations on page load
    initRatingStars(); // Initialize rating stars for the form

    // Track clicks on project links
    document.querySelectorAll('.project-card a, .repo-card a').forEach(link => {
        link.addEventListener('click', () => {
            trackProjectClick();
            trackEvent('project_link_click', {
                url: link.href,
                icon: 'fa-code'
            });
        });
    });

    // Track clicks on tool/extension links
    document.querySelectorAll('.tool-card a, a[href*="chromewebstore"]').forEach(link => {
        link.addEventListener('click', () => {
            trackToolClick();
            trackEvent('tool_install_click', {
                url: link.href,
                icon: 'fab fa-chrome'
            });
        });
    });
});

// ==================== RECOMMENDATIONS ====================

// Load and display recommendations
async function loadRecommendations() {
    const container = document.getElementById('recommendationsList');

    try {
        const response = await fetch('/api/recommendations');
        const data = await response.json();

        if (data.success && data.recommendations.length > 0) {
            container.innerHTML = data.recommendations.map(rec => createRecommendationCard(rec)).join('');
        } else {
            container.innerHTML = `
                <div class="col-12">
                    <div class="no-recommendations">
                        <i class="fas fa-comments"></i>
                        <h4>No Recommendations Yet</h4>
                        <p>Be the first to write a recommendation!</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
        container.innerHTML = `
            <div class="col-12">
                <div class="no-recommendations">
                    <i class="fas fa-comments"></i>
                    <h4>No Recommendations Yet</h4>
                    <p>Be the first to write a recommendation!</p>
                </div>
            </div>
        `;
    }
}

// Create recommendation card HTML
function createRecommendationCard(rec) {
    const initials = rec.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const stars = '★'.repeat(rec.rating) + '☆'.repeat(5 - rec.rating);
    const date = new Date(rec.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });

    const linkedInLink = rec.linkedin
        ? `<a href="${rec.linkedin}" target="_blank" title="View LinkedIn Profile"><i class="fab fa-linkedin"></i></a>`
        : '';

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="recommendation-card">
                <div class="recommendation-header">
                    <div class="recommendation-avatar">${initials}</div>
                    <div class="recommendation-info">
                        <h5>${rec.name} ${linkedInLink}</h5>
                        <p>${rec.title}</p>
                    </div>
                    <div class="recommendation-rating">
                        ${stars}
                    </div>
                </div>
                <div class="recommendation-text">
                    ${rec.message}
                </div>
                <div class="recommendation-footer">
                    <span class="recommendation-relationship">${rec.relationship}</span>
                    <span>${date}</span>
                </div>
            </div>
        </div>
    `;
}

// Initialize rating stars interaction
function initRatingStars() {
    const stars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('recRating');

    // Set initial state (5 stars)
    updateStars(5);

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            updateStars(rating);
        });

        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });

    document.getElementById('ratingInput')?.addEventListener('mouseleave', function() {
        updateStars(parseInt(ratingInput.value));
    });
}

function updateStars(rating) {
    document.querySelectorAll('.rating-star').forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function highlightStars(rating) {
    document.querySelectorAll('.rating-star').forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

// Submit recommendation
document.getElementById('submitRecommendation')?.addEventListener('click', async function() {
    const form = document.getElementById('recommendationForm');
    const submitBtn = this;

    // Get form values
    const name = document.getElementById('recName').value.trim();
    const title = document.getElementById('recTitle').value.trim();
    const email = document.getElementById('recEmail').value.trim();
    const linkedin = document.getElementById('recLinkedIn').value.trim();
    const relationship = document.getElementById('recRelationship').value;
    const message = document.getElementById('recMessage').value.trim();
    const rating = document.getElementById('recRating').value;

    // Validate
    if (!name || !title || !email || !relationship || !message) {
        showRecommendationNotification('error', 'Please fill in all required fields.');
        return;
    }

    if (message.length < 50) {
        showRecommendationNotification('error', 'Recommendation must be at least 50 characters.');
        return;
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                title,
                email,
                linkedin,
                relationship,
                message,
                rating
            })
        });

        const result = await response.json();

        if (result.success) {
            // Track successful recommendation submission
            trackFormSubmission('recommendation_form', true);

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('recommendationModal'));
            modal.hide();

            // Reset form
            form.reset();
            updateStars(5);
            document.getElementById('recRating').value = 5;

            // Show success notification
            showNotification('success', result.message);
        } else {
            // Track failed recommendation submission
            trackFormSubmission('recommendation_form', false);
            showRecommendationNotification('error', result.message || 'Failed to submit recommendation.');
        }
    } catch (error) {
        console.error('Error:', error);
        // Track error in recommendation submission
        trackFormSubmission('recommendation_form', false);
        showRecommendationNotification('error', 'Failed to submit. Please try again.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Show notification in modal
function showRecommendationNotification(type, message) {
    const existing = document.querySelector('.modal-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `modal-notification alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;

    document.querySelector('.modal-body').appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

