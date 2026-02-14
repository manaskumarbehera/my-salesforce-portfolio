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
const GITHUB_USERNAME = 'manaskumarbehera'; // Replace with your GitHub username
const EXCLUDED_REPOS = ['manaskumarbehera']; // Add repos to exclude

// Fetch GitHub Repositories
async function fetchGitHubRepos() {
    const reposContainer = document.getElementById('github-repos');

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);

        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();

        // Filter out excluded repos and select featured ones
        const filteredRepos = repos
            .filter(repo => !EXCLUDED_REPOS.includes(repo.name))
            .filter(repo => !repo.fork) // Optionally exclude forks
            .slice(0, 6);

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
                <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-outline-primary mt-3">
                    <i class="fas fa-external-link-alt"></i> View Repository
                </a>
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

// Contact Form Handling
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Here you can implement your form submission logic
    // For now, we'll just show an alert
    alert(`Thank you for your message, ${name}! This is a demo. To enable form submission, integrate with a backend service like Heroku, EmailJS, or Formspree.`);

    // Reset form
    this.reset();

    // Example: Send to backend endpoint (uncomment and configure)
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message })
    })
    .then(response => response.json())
    .then(data => {
        alert('Message sent successfully!');
        this.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send message. Please try again.');
    });
    */
});

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
});

