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
// Now loaded dynamically from /api/portfolio/config
let GITHUB_USERNAME = 'manaskumarbehera';

// Set to false to temporarily hide the GitHub repos section
const SHOW_GITHUB_REPOS = false;

// ============================================
// Dynamic Project Loading from API
// ============================================

// Load portfolio configuration from server
async function loadPortfolioConfig() {
    try {
        const response = await fetch('/api/portfolio/config');
        const data = await response.json();
        
        if (data.success && data.data) {
            return data.data;
        }
        return null;
    } catch (error) {
        console.error('Error loading portfolio config:', error);
        return null;
    }
}

// Render projects from API data
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    const loadingEl = document.getElementById('projects-loading');
    
    if (!container) return;
    
    // Remove loading indicator
    if (loadingEl) {
        loadingEl.remove();
    }
    
    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No projects configured. Set PORTFOLIO_PROJECTS environment variable.</p>
            </div>
        `;
        return;
    }
    
    // Filter featured projects
    const featuredProjects = projects.filter(p => p.featured !== false);
    
    container.innerHTML = featuredProjects.map(project => createProjectCard(project)).join('');
}

// Create project card HTML
function createProjectCard(project) {
    const tags = project.tags || [];
    const tagsHtml = tags.map((tag, index) => {
        const colors = ['bg-primary', 'bg-secondary', 'bg-info', 'bg-success', 'bg-warning'];
        return `<span class="badge ${colors[index % colors.length]}">${tag}</span>`;
    }).join('\n                            ');
    
    // Build action links
    let linksHtml = '';
    
    if (project.github) {
        linksHtml += `
                            <a href="${project.github}" target="_blank" class="btn btn-sm btn-outline-primary me-2">
                                <i class="fab fa-github"></i> Code
                            </a>`;
    }
    
    if (project.live) {
        linksHtml += `
                            <a href="${project.live}" target="_blank" class="btn btn-sm btn-outline-success">
                                <i class="fas fa-globe"></i> Live
                            </a>`;
    }
    
    if (project.chromeStore) {
        linksHtml += `
                            <a href="${project.chromeStore}" target="_blank" class="btn btn-sm btn-outline-success">
                                <i class="fab fa-chrome"></i> Install
                            </a>`;
    }
    
    // Determine icon based on project type
    const icon = project.icon || (project.extensionId ? 'fab fa-chrome' : 'fas fa-code');
    
    // Add user count badge for Chrome extensions
    let userCountBadge = '';
    if (project.extensionId) {
        userCountBadge = `<span class="badge bg-info ms-2 extension-user-count" data-extension-key="${project.key}" id="${project.key}-card-users">--</span>`;
    }
    
    return `
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="project-card" data-project-key="${project.key}">
                        <div class="project-icon">
                            <i class="${icon}"></i>
                        </div>
                        <h4>${project.name}${userCountBadge}</h4>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            ${tagsHtml}
                        </div>
                        <div class="project-links mt-3">
                            ${linksHtml}
                        </div>
                    </div>
                </div>
    `;
}

// Initialize projects on page load
async function initializeProjects() {
    const config = await loadPortfolioConfig();
    
    if (config && config.projects) {
        renderProjects(config.projects);
        
        // Update GitHub username if available
        if (config.githubUsername) {
            GITHUB_USERNAME = config.githubUsername;
        }
        
        // Update extension user counts on project cards after a short delay
        setTimeout(updateProjectExtensionUsers, 1000);
    } else {
        // Fallback to local config fetch
        try {
            const response = await fetch('/portfolio-config.json');
            const data = await response.json();
            renderProjects(data.projects);
        } catch (error) {
            console.error('Error loading local config:', error);
            const container = document.getElementById('projects-container');
            if (container) {
                const loadingEl = document.getElementById('projects-loading');
                if (loadingEl) loadingEl.remove();
                container.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="text-muted">Unable to load projects. Please refresh the page.</p>
                    </div>
                `;
            }
        }
    }
}

// Update extension user counts on project cards
async function updateProjectExtensionUsers() {
    try {
        const response = await fetch('/api/extensions/stats');
        const data = await response.json();
        
        if (data.success && data.data && data.data.extensions) {
            for (const [key, ext] of Object.entries(data.data.extensions)) {
                const badge = document.getElementById(`${key}-card-users`);
                if (badge && ext.usersFormatted) {
                    badge.textContent = ext.usersFormatted + ' users';
                    badge.title = `${ext.users || 'N/A'} active users`;
                }
            }
        }
    } catch (error) {
        console.log('Could not update project extension users:', error);
    }
}

// Fetch GitHub Repositories (optional - only if SHOW_GITHUB_REPOS is true)
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

        // Show first 4 non-fork repos
        const filteredRepos = repos.filter(repo => !repo.fork).slice(0, 4);

        if (filteredRepos.length === 0) {
            reposContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No repositories found.</p>
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
                    <p class="mb-0">Unable to load GitHub repositories.</p>
                </div>
            </div>
        `;
    }
}

// Create Repository Card HTML (for GitHub repos section)
function createRepoCard(repo) {
    const description = repo.description || 'No description available';
    const language = repo.language || 'Unknown';
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="repo-card">
                <h5>
                    <i class="fab fa-github"></i>
                    <a href="${repo.html_url}" target="_blank" style="text-decoration: none; color: inherit;">
                        ${repo.name}
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
                    <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">
                        <i class="fab fa-github"></i> View Code
                    </a>
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
// AI Chatbot with Multi-Provider Support
// ============================================

// Chatbot configuration
const CHATBOT_CONFIG = {
    botName: "AI Assistant",
    welcomeMessage: "Hi there! 👋 I'm Manas's AI assistant powered by advanced language models. Ask me anything about his Salesforce expertise, projects, or how to connect!",
    useAstratisAI: true,
    typingDelay: 600,
    showSourceBadge: true // Show which AI provider responded
};

// Enhanced chatbot knowledge base (fallback when AI is not available)
const chatbotKnowledge = {
    greetings: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'hola', 'howdy', 'sup', 'yo'],
    skills: ['skills', 'expertise', 'technologies', 'tech stack', 'what can you do', 'programming', 'know', 'capable'],
    projects: ['projects', 'work', 'portfolio', 'built', 'created', 'developed', 'made', 'building'],
    tools: ['tools', 'extensions', 'chrome', 'trackforce', 'metaforce', 'week number', 'extension', 'plugin'],
    contact: ['contact', 'email', 'reach', 'hire', 'connect', 'linkedin', 'github', 'message', 'job'],
    experience: ['experience', 'years', 'background', 'career', 'work history', 'job', 'company'],
    salesforce: ['salesforce', 'apex', 'lwc', 'lightning', 'soql', 'trailblazer', 'crm', 'sfdc', 'trigger'],
    help: ['help', 'support', 'assist', 'what can you', 'options', 'menu', '?', 'how to'],
    thanks: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'awesome', 'amazing'],
    coffee: ['coffee', 'donate', 'support', 'buy me', 'tip', 'sponsor', 'pay'],
    pricing: ['price', 'cost', 'free', 'premium', 'pay', 'subscription', 'money'],
    about: ['who', 'about', 'manas', 'yourself', 'introduce']
};

const chatbotResponses = {
    greetings: [
        "Hi there! 👋 I'm Manas's AI assistant. How can I help you today?",
        "Hello! Welcome to Manas's portfolio. Feel free to ask me anything about his work!",
        "Hey! 😊 Great to see you here. What would you like to know about Manas?"
    ],
    skills: [
        "Manas is a skilled <strong>Salesforce Developer & Architect</strong> with expertise in:<br><br>" +
        "☁️ <strong>Salesforce:</strong> Apex, LWC, Visualforce, SOQL/SOSL, Triggers, Batch Apex, Flow Builder<br>" +
        "🔗 <strong>APIs:</strong> REST, SOAP, Tooling API, GraphQL, Bulk API<br>" +
        "💻 <strong>Frontend:</strong> JavaScript, HTML5, CSS3, React, Chrome Extensions<br>" +
        "🔧 <strong>DevOps:</strong> Git, Copado, AutoRABIT, GitHub Actions, CI/CD<br>" +
        "☁️ <strong>Cloud:</strong> Heroku, Azure, Node.js, Express<br>" +
        "🔌 <strong>Integration:</strong> Genesys CTI, Auth0, Azure AD<br><br>" +
        "Want to know more about a specific skill?"
    ],
    projects: [
        "Manas has built several awesome projects! Here are the highlights:<br><br>" +
        "🔹 <strong>TrackForce Pro</strong> - Ultimate productivity toolkit for Salesforce Admins & Developers<br>" +
        "🔹 <strong>MetaForce</strong> - Salesforce metadata management extension<br>" +
        "🔹 <strong>Week Number</strong> - Simple week number display extension<br>" +
        "🔹 <strong>This Portfolio</strong> - Built with Bootstrap, Node.js & AI chatbot<br><br>" +
        "All projects are <strong>100% free and open-source</strong>! 🎉"
    ],
    tools: [
        "Manas has created several <strong>free Chrome extensions</strong> for the Salesforce community:<br><br>" +
        "🛡️ <strong>TrackForce Pro</strong> - Audit, query building, data exploration & monitoring tools<br>" +
        "📊 <strong>MetaForce</strong> - Manage Salesforce metadata efficiently<br>" +
        "📅 <strong>Week Number</strong> - Display current week number<br><br>" +
        "All available on the Chrome Web Store - <strong>completely FREE!</strong>"
    ],
    contact: [
        "You can reach Manas through:<br><br>" +
        "📧 <strong>Email:</strong> web@manaskumarbehera.com<br>" +
        "💼 <strong>LinkedIn:</strong> <a href='https://linkedin.com/in/manas-behera-68607547' target='_blank'>Connect on LinkedIn</a><br>" +
        "💻 <strong>GitHub:</strong> <a href='https://github.com/manaskumarbehera' target='_blank'>View GitHub Profile</a><br>" +
        "🌟 <strong>Trailblazer:</strong> <a href='https://salesforce.com/trailblazer/manasbehera1990' target='_blank'>View Trailblazer</a><br><br>" +
        "He's available for collaborations and Salesforce projects!"
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
        "⚡ <strong>Development:</strong> Apex, LWC, Visualforce, Aura, Flows<br>" +
        "🔍 <strong>Data:</strong> SOQL, SOSL, GraphQL API, Bulk API<br>" +
        "🔗 <strong>Integration:</strong> REST API, SOAP API, Tooling API<br>" +
        "🎯 <strong>CTI:</strong> Genesys integration with Salesforce<br>" +
        "🛠️ <strong>Tools:</strong> SFDX, VS Code, Copado, AutoRABIT<br><br>" +
        "Check out his Trailblazer profile for certifications!"
    ],
    pricing: [
        "Great news! 🎉 <strong>All of Manas's tools are 100% FREE!</strong><br><br>" +
        "✅ TrackForce Pro - FREE<br>" +
        "✅ MetaForce - FREE<br>" +
        "✅ Week Number - FREE<br><br>" +
        "No premium versions, no subscriptions - just free tools for the community!<br><br>" +
        "If they help you, consider <a href='https://buymeacoffee.com/manaskumarbehera' target='_blank'>buying him a coffee</a> ☕"
    ],
    about: [
        "Manas Kumar Behera is a <strong>Salesforce Developer & Architect</strong> passionate about building free, open-source tools.<br><br>" +
        "🎯 <strong>Focus:</strong> Helping developers work smarter<br>" +
        "🔧 <strong>Created:</strong> 3+ Chrome extensions with hundreds of users<br>" +
        "💡 <strong>Philosophy:</strong> Free tools for everyone<br><br>" +
        "Want to know about his skills, projects, or get in touch?"
    ],
    help: [
        "I can help you with:<br><br>" +
        "💼 <strong>Skills</strong> - Technical expertise & technologies<br>" +
        "🚀 <strong>Projects</strong> - Portfolio & Chrome extensions<br>" +
        "🔧 <strong>Tools</strong> - Free Salesforce tools<br>" +
        "📧 <strong>Contact</strong> - How to reach Manas<br>" +
        "☁️ <strong>Salesforce</strong> - SF expertise<br>" +
        "💰 <strong>Pricing</strong> - Spoiler: Everything is FREE!<br><br>" +
        "Just type your question!"
    ],
    thanks: [
        "You're welcome! 😊 Is there anything else you'd like to know?",
        "Happy to help! Feel free to explore the portfolio or try the free Chrome extensions!",
        "Glad I could assist! Don't forget to check out TrackForce Pro - it's free! 🚀"
    ],
    coffee: [
        "That's so kind! ☕ If Manas's tools have helped you, you can support his work:<br><br>" +
        "👉 <a href='https://buymeacoffee.com/manaskumarbehera' target='_blank'><strong>Buy Me a Coffee</strong></a><br><br>" +
        "Your support helps keep these tools free for everyone! 💙"
    ],
    default: [
        "I'm not sure I understood that. Try asking about <strong>skills</strong>, <strong>projects</strong>, <strong>tools</strong>, or <strong>contact</strong>!",
        "Hmm, I didn't quite catch that. Try asking about Manas's Salesforce expertise or Chrome extensions!",
        "I can help you learn about Manas's work. Try asking: 'What are your skills?' or 'Tell me about your projects'"
    ]
};

// Quick reply options - More options for better UX
const quickReplies = [
    { text: "👨‍💻 Skills", query: "What are your technical skills?" },
    { text: "🚀 Projects", query: "Show me your projects" },
    { text: "🔧 Extensions", query: "Tell me about your Chrome extensions" },
    { text: "☁️ Salesforce", query: "What's your Salesforce expertise?" },
    { text: "📧 Contact", query: "How can I contact you?" },
    { text: "💰 Pricing", query: "Are your tools free?" }
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
        // Try server-side AI first (supports OpenAI, Anthropic, Astratis)
        const serverResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (serverResponse.ok) {
            const data = await serverResponse.json();
            if (data.success && data.response) {
                removeTypingIndicator();
                // Convert markdown-style formatting to HTML
                let formattedResponse = formatAIResponse(data.response);
                // Add source badge if enabled
                const sourceBadge = CHATBOT_CONFIG.showSourceBadge && data.source ?
                    `<div class="ai-source-badge">${getSourceLabel(data.source)}</div>` : '';
                addBotMessage(formattedResponse + sourceBadge);

                // Track AI source
                trackEvent('chatbot_ai_response', { source: data.source, intent: data.intent });
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
                addBotMessage(formatAIResponse(aiResponse));
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

// Format AI response - convert markdown to HTML
function formatAIResponse(text) {
    if (!text) return '';

    return text
        // Bold: **text** or __text__
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        // Italic: *text* or _text_
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/_([^_]+)_/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        // Links: [text](url)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Lists with bullets
        .replace(/^- (.*)/gm, '• $1')
        .replace(/^\* (.*)/gm, '• $1');
}

// Get human-readable label for AI source
function getSourceLabel(source) {
    const labels = {
        'openai': '🤖 GPT',
        'anthropic': '🧠 Claude',
        'astratis': '✨ Astratis',
        'astratis-ai': '✨ Astratis',
        'local': '💡 Local AI'
    };
    return labels[source] || source;
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
                        <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                        <h4>No Recommendations Yet</h4>
                        <p class="text-muted">Be the first to write a recommendation!</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
        container.innerHTML = `
            <div class="col-12">
                <div class="no-recommendations">
                    <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                    <h4>No Recommendations Yet</h4>
                    <p class="text-muted">Be the first to write a recommendation!</p>
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

// ============================================
// Chrome Extension Stats Loading
// ============================================

// Load Chrome extension user stats
async function loadExtensionStats() {
    const banner = document.getElementById('extensionStatsBanner');
    const totalUsersEl = document.getElementById('totalExtensionUsers');
    const heroTotalUsersEl = document.getElementById('heroTotalUsers');
    const aboutExtensionUsersEl = document.getElementById('aboutExtensionUsers');

    try {
        const response = await fetch('/api/extensions/stats');
        const data = await response.json();

        if (data.success && data.data) {
            const stats = data.data;
            const totalUsers = stats.totalUsers || 0;

            // Update tools section total
            if (totalUsersEl) {
                totalUsersEl.textContent = stats.totalUsersFormatted || totalUsers;
            }

            // Animate hero counter with counting effect
            if (heroTotalUsersEl) {
                animateCounter(heroTotalUsersEl, 0, totalUsers, 2000);
            }

            // Update about section stat
            if (aboutExtensionUsersEl) {
                aboutExtensionUsersEl.textContent = (stats.totalUsersFormatted || totalUsers) + '+';
            }

            // Update individual extension counts
            for (const [key, ext] of Object.entries(stats.extensions)) {
                const userBadge = document.getElementById(`${key}-users`);
                if (userBadge) {
                    userBadge.textContent = ext.usersFormatted || ext.users || 'N/A';
                }
            }

            // Show the banner
            if (banner) {
                banner.style.display = 'flex';
            }
        }
    } catch (error) {
        console.log('Extension stats not available:', error);
        // Hide the banner if stats can't be loaded
        if (banner) {
            banner.style.display = 'none';
        }
        if (totalUsersEl) {
            totalUsersEl.textContent = 'N/A';
        }
        if (heroTotalUsersEl) {
            heroTotalUsersEl.textContent = '300+';
        }
    }
}

// Animate counter from start to end value
function animateCounter(element, start, end, duration) {
    if (!element) return;

    const range = end - start;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (range * easeOutQuart));

        element.textContent = currentValue.toLocaleString() + '+';

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// Initialize extension stats on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load projects dynamically from API
    initializeProjects();
    
    // Load extension stats
    loadExtensionStats();
    
    // Initialize import recommendation rating stars
    initImportRatingStars();
});

// ============================================
// LinkedIn Recommendation Import
// ============================================

// Initialize import rating stars
function initImportRatingStars() {
    const stars = document.querySelectorAll('.import-star');
    const ratingInput = document.getElementById('importRating');
    
    if (!stars.length || !ratingInput) return;
    
    // Set initial state (5 stars)
    updateImportStars(5);
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            updateImportStars(rating);
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightImportStars(rating);
        });
    });
    
    document.getElementById('importRatingInput')?.addEventListener('mouseleave', function() {
        updateImportStars(parseInt(ratingInput.value));
    });
}

function updateImportStars(rating) {
    document.querySelectorAll('.import-star').forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function highlightImportStars(rating) {
    document.querySelectorAll('.import-star').forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

// Submit LinkedIn import recommendation
document.getElementById('submitImportRecommendation')?.addEventListener('click', async function() {
    const form = document.getElementById('importRecommendationForm');
    const submitBtn = this;
    
    // Get form values
    const name = document.getElementById('importName').value.trim();
    const title = document.getElementById('importTitle').value.trim();
    const linkedin = document.getElementById('importLinkedIn').value.trim();
    const relationship = document.getElementById('importRelationship').value;
    const date = document.getElementById('importDate').value;
    const message = document.getElementById('importMessage').value.trim();
    const rating = document.getElementById('importRating').value;
    
    // Validate
    if (!name || !title || !relationship || !message) {
        showImportNotification('error', 'Please fill in all required fields.');
        return;
    }
    
    if (message.length < 50) {
        showImportNotification('error', 'Recommendation must be at least 50 characters.');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importing...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/recommendations/import', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                title,
                linkedin,
                relationship,
                message,
                rating,
                source: 'linkedin',
                importDate: date || new Date().toISOString()
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Track successful import
            trackFormSubmission('linkedin_import', true);
            
            // Add success animation to button
            submitBtn.classList.add('success-pulse');
            setTimeout(() => submitBtn.classList.remove('success-pulse'), 1000);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('importRecommendationsModal'));
            modal.hide();
            
            // Reset form
            form.reset();
            updateImportStars(5);
            document.getElementById('importRating').value = 5;
            
            // Reload recommendations
            loadRecommendations();
            
            // Show success notification
            showNotification('success', result.message || 'Recommendation imported successfully!');
        } else {
            trackFormSubmission('linkedin_import', false);
            showImportNotification('error', result.message || 'Failed to import recommendation.');
        }
    } catch (error) {
        console.error('Error:', error);
        trackFormSubmission('linkedin_import', false);
        showImportNotification('error', 'Failed to import. Please try again.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Show notification in import modal
function showImportNotification(type, message) {
    const existing = document.querySelector('#importRecommendationsModal .modal-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `modal-notification alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.querySelector('#importRecommendationsModal .modal-body').appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}
