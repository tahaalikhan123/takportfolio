// Replace 'your-github-username' with your actual GitHub username
const githubUsername = 'tahaalikhan123';

/**
 * Fetch repositories from GitHub
 * @returns {Promise<Object[]>} - A promise that resolves to a list of repositories
 */
async function fetchRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch repositories:', error);
        return [];
    }
}

/**
 * Create a repository element for display
 * @param {Object} repo - The repository object
 * @returns {HTMLElement} - The created repository element
 */
function createRepoElement(repo) {
    const repoElement = document.createElement('div');
    repoElement.classList.add('repo');
    
    const repoHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || 'No description available.'}</p>
        <p>⭐ ${repo.stargazers_count} | Forks: ${repo.forks_count}</p>
    `;
    repoElement.innerHTML = repoHTML;
    return repoElement;
}

/**
 * Display repositories in the DOM
 */
async function displayRepositories() {
    const repoContainer = document.getElementById('github-repositories');
    repoContainer.innerHTML = '<p>Loading...</p>';
    
    const repos = await fetchRepositories();
    repoContainer.innerHTML = '';
    
    repos.forEach(repo => {
        const repoElement = createRepoElement(repo);
        repoContainer.appendChild(repoElement);
    });
}

/**
 * Display GitHub contributions graph
 */
function displayContributions() {
    const contributionsContainer = document.getElementById('github-contributions');
    contributionsContainer.innerHTML = `
        <img src="https://ghchart.rshah.org/${githubUsername}" alt="GitHub Contributions Graph" />
    `;
}

// Initialize functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    displayContributions();
    displayRepositories();
});

function sendMail() {
    // Get the form values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    // Create the mailto link
    var subject = encodeURIComponent('Contact Form Submission');
    var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
    var mailtoLink = 'mailto:recipient@example.com?subject=' + subject + '&body=' + body;

    // Open the user's default mail client with the mailto link
    window.location.href = mailtoLink;
}

// JavaScript to pause the sliding on hover and resume on mouse out
document.querySelector('.sliding-box').addEventListener('mouseover', function() {
    document.querySelector('.slider').style.animationPlayState = 'paused';
});

document.querySelector('.sliding-box').addEventListener('mouseout', function() {
    document.querySelector('.slider').style.animationPlayState = 'running';
});

/**
 * Toggle dark mode for the page
 */
document.getElementById('toggle-dark-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

document.addEventListener('DOMContentLoaded', () => {
    const welcomePage = document.getElementById('welcome-page');
    const enterButton = document.getElementById('enter-portfolio');

    enterButton.addEventListener('click', () => {
        welcomePage.classList.add('fade-out');
        setTimeout(() => {
            welcomePage.style.display = 'none';
        }, 1000); // Matches the duration of the opacity transition
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const welcomePage = document.getElementById('welcome-page');
    const enterButton = document.getElementById('enter-portfolio');

    // Button click to unveil portfolio
    enterButton.addEventListener('click', () => {
        welcomePage.classList.add('fade-out');
        setTimeout(() => {
            welcomePage.style.display = 'none';
        }, 1000); // Matches the duration of the opacity transition
    });

    // Scroll Animation
    const sections = document.querySelectorAll('section');
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('left')) {
                    entry.target.classList.add('section-left-visible');
                } else if (entry.target.classList.contains('right')) {
                    entry.target.classList.add('section-right-visible');
                } else {
                    entry.target.classList.add('section-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        if (section.classList.contains('left')) {
            section.classList.add('section-left');
        } else if (section.classList.contains('right')) {
            section.classList.add('section-right');
        } else {
            section.classList.add('section-animate');
        }
        observer.observe(section);
    });
});
const carousel = document.querySelector('.carousel');
const slides = carousel.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
    currentSlide = index;
}

document.querySelector('.next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
});

document.querySelector('.prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
});

showSlide(currentSlide);