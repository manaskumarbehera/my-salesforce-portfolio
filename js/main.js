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

    // Hide section if SHOW_GITHUB_REPOS is false
    if (!SHOW_GITHUB_REPOS) {
        reposContainer.innerHTML = '';
        reposContainer.style.display = 'none';
        return;
    }

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
// Chatbot Functionality
// ============================================

// Chatbot knowledge base
const chatbotKnowledge = {
    greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'hola'],
    skills: ['skills', 'expertise', 'technologies', 'tech stack', 'what can you do', 'programming'],
    projects: ['projects', 'work', 'portfolio', 'built', 'created', 'developed'],
    tools: ['tools', 'extensions', 'chrome', 'trackforce', 'metaforce', 'week number'],
    contact: ['contact', 'email', 'reach', 'hire', 'connect', 'linkedin'],
    experience: ['experience', 'years', 'background', 'career', 'work history'],
    salesforce: ['salesforce', 'apex', 'lwc', 'lightning', 'soql', 'trailblazer'],
    help: ['help', 'support', 'assist', 'what can you', 'options'],
    thanks: ['thank', 'thanks', 'appreciate', 'helpful'],
    coffee: ['coffee', 'donate', 'support', 'buy me']
};

const chatbotResponses = {
    greetings: [
        "Hi there! 👋 I'm Manas's virtual assistant. How can I help you today?",
        "Hello! Welcome to Manas's portfolio. Feel free to ask me anything about his work!",
        "Hey! 😊 Great to see you here. What would you like to know about Manas?"
    ],
    skills: [
        "Manas is a skilled **Salesforce Developer** with expertise in:\n\n" +
        "☁️ **Salesforce:** Apex, LWC, Visualforce, SOQL/SOSL, Triggers, Batch Apex\n" +
        "🔗 **APIs:** REST, SOAP, Tooling API, GraphQL\n" +
        "💻 **Frontend:** JavaScript, HTML5, CSS3, React, Chrome Extensions\n" +
        "🔧 **DevOps:** Git, Copado, AutoRABIT, CI/CD\n" +
        "☁️ **Cloud:** Heroku, Azure, Node.js\n\n" +
        "Want to know more about a specific skill?"
    ],
    projects: [
        "Manas has built several awesome projects! Here are the highlights:\n\n" +
        "🔹 **TrackForce Pro** - Chrome extension for Salesforce audit trail analysis\n" +
        "🔹 **MetaForce** - Salesforce metadata management extension\n" +
        "🔹 **Week Number** - Simple week number display extension\n" +
        "🔹 **This Portfolio** - Built with Bootstrap & Node.js\n\n" +
        "All projects are **100% free and open-source**! Check out the Projects section for more details."
    ],
    tools: [
        "Manas has created several **free Chrome extensions** for the Salesforce community:\n\n" +
        "🛡️ **TrackForce Pro** - Extract and analyze Salesforce audit trails\n" +
        "📊 **MetaForce** - Manage Salesforce metadata efficiently\n" +
        "📅 **Week Number** - Display current week number\n\n" +
        "All available on the Chrome Web Store! Would you like links to install them?"
    ],
    contact: [
        "You can reach Manas through:\n\n" +
        "📧 **Email:** behera.manas98@gmail.com\n" +
        "💼 **LinkedIn:** linkedin.com/in/manas-behera-68607547\n" +
        "💻 **GitHub:** github.com/manaskumarbehera\n" +
        "🌟 **Trailblazer:** salesforce.com/trailblazer/manasbehera1990\n\n" +
        "Feel free to connect for collaborations or projects!"
    ],
    experience: [
        "Manas is an experienced **Salesforce Developer & Architect** with expertise in:\n\n" +
        "✅ Custom Salesforce application development\n" +
        "✅ Lightning Web Components (LWC)\n" +
        "✅ API integrations (Genesys CTI, Auth0, Azure)\n" +
        "✅ DevOps & CI/CD implementation\n" +
        "✅ Chrome extension development\n\n" +
        "He's passionate about building **free tools** to help the developer community!"
    ],
    salesforce: [
        "Manas specializes in the **Salesforce ecosystem**:\n\n" +
        "⚡ **Development:** Apex, LWC, Visualforce, Aura Components\n" +
        "🔍 **Queries:** SOQL, SOSL, GraphQL API\n" +
        "🔗 **Integration:** REST API, SOAP API, Tooling API\n" +
        "🎯 **CTI:** Genesys integration with Salesforce\n" +
        "🛠️ **Tools:** SFDX, VS Code, Developer Console\n\n" +
        "Check out his Trailblazer profile for certifications!"
    ],
    help: [
        "I can help you with:\n\n" +
        "💼 **Skills** - Learn about Manas's technical expertise\n" +
        "🚀 **Projects** - Explore his portfolio and Chrome extensions\n" +
        "🔧 **Tools** - Discover free Salesforce tools he's built\n" +
        "📧 **Contact** - Get in touch with Manas\n" +
        "☁️ **Salesforce** - His Salesforce expertise\n\n" +
        "Just type your question or click on a topic!"
    ],
    thanks: [
        "You're welcome! 😊 Is there anything else you'd like to know?",
        "Happy to help! Feel free to ask more questions or explore the portfolio.",
        "Glad I could assist! Don't forget to check out the free Chrome extensions! 🚀"
    ],
    coffee: [
        "That's so kind! ☕ If Manas's tools have helped you, you can support his work:\n\n" +
        "👉 **Buy Me a Coffee:** buymeacoffee.com/manaskumarbehera\n\n" +
        "Your support helps keep these tools free for everyone! 💙"
    ],
    default: [
        "I'm not sure I understood that. Could you try rephrasing? Or ask about:\n• Skills\n• Projects\n• Tools\n• Contact\n• Salesforce",
        "Hmm, I didn't quite catch that. Try asking about Manas's projects, skills, or how to contact him!",
        "I'm still learning! Try asking about specific topics like 'projects', 'skills', or 'contact'."
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

    if (!toggle || !container) return;

    // Show welcome badge after 3 seconds
    setTimeout(() => {
        if (!container.classList.contains('active')) {
            badge.style.display = 'flex';
        }
    }, 3000);

    // Toggle chatbot
    toggle.addEventListener('click', () => {
        const isActive = container.classList.toggle('active');
        toggle.classList.toggle('active');
        badge.style.display = 'none';

        if (isActive && messages.children.length === 0) {
            // Send welcome message
            setTimeout(() => {
                addBotMessage("Hi there! 👋 I'm Manas's virtual assistant. How can I help you learn about his work?", true);
            }, 500);
        }

        if (isActive) {
            input.focus();
        }
    });

    // Send message on button click
    sendBtn.addEventListener('click', () => sendMessage());

    // Send message on Enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Track chatbot usage
    toggle.addEventListener('click', () => {
        trackEvent('chatbot_opened', { icon: 'fa-comments' });
    });
}

// Send user message and get response
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addUserMessage(message);
    input.value = '';

    // Track message
    trackEvent('chatbot_message', { message: message.substring(0, 50) });

    // Show typing indicator
    showTypingIndicator();

    // Process and respond after delay
    setTimeout(() => {
        removeTypingIndicator();
        const response = getResponse(message);
        addBotMessage(response);
    }, 800 + Math.random() * 700);
}

// Add user message to chat
function addUserMessage(text) {
    const messages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `
        <div class="chat-message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="chat-message-content">${escapeHtml(text)}</div>
    `;
    messages.appendChild(messageDiv);
    scrollToBottom();
}

// Add bot message to chat
function addBotMessage(text, showQuickReplies = false) {
    const messages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';

    // Convert markdown-style formatting
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

    let quickRepliesHtml = '';
    if (showQuickReplies) {
        quickRepliesHtml = `
            <div class="quick-replies">
                ${quickReplies.map(qr => 
                    `<button class="quick-reply-btn" onclick="handleQuickReply('${qr.query}')">${qr.text}</button>`
                ).join('')}
            </div>
        `;
    }

    messageDiv.innerHTML = `
        <div class="chat-message-avatar">
            <i class="fab fa-salesforce"></i>
        </div>
        <div class="chat-message-content">
            ${formattedText}
            ${quickRepliesHtml}
        </div>
    `;
    messages.appendChild(messageDiv);
    scrollToBottom();
}

// Handle quick reply button clicks
function handleQuickReply(query) {
    const input = document.getElementById('chatInput');
    input.value = query;
    sendMessage();
}

// Show typing indicator
function showTypingIndicator() {
    const messages = document.getElementById('chatMessages');
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
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Get response based on user input
function getResponse(input) {
    const lowerInput = input.toLowerCase();

    // Check each category
    for (const [category, keywords] of Object.entries(chatbotKnowledge)) {
        if (keywords.some(keyword => lowerInput.includes(keyword))) {
            const responses = chatbotResponses[category];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // Default response
    return chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)];
}

// Scroll chat to bottom
function scrollToBottom() {
    const messages = document.getElementById('chatMessages');
    messages.scrollTop = messages.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make handleQuickReply globally available
window.handleQuickReply = handleQuickReply;

// Initialize chatbot on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
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

