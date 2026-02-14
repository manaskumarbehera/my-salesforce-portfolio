// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
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
            // Show success message
            showNotification('success', result.message);
            this.reset();
        } else {
            showNotification('error', result.message || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
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

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(33, 37, 41, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '';
        navbar.style.backdropFilter = '';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill cards, project cards, etc.
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .tool-card, .repo-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Fetch GitHub repos on page load
    fetchGitHubRepos();
});

// Typing effect for hero section (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Add particle effect to hero section (optional)
function createParticles() {
    const hero = document.querySelector('.hero-section');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize particles (uncomment to enable)
// createParticles();

// Update copyright year
document.addEventListener('DOMContentLoaded', function() {
    const yearElements = document.querySelectorAll('.footer p');
    yearElements.forEach(el => {
        el.textContent = el.textContent.replace('2026', new Date().getFullYear());
    });

    // Load recommendations on page load
    loadRecommendations();

    // Initialize rating stars
    initRatingStars();
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
            showRecommendationNotification('error', result.message || 'Failed to submit recommendation.');
        }
    } catch (error) {
        console.error('Error:', error);
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

