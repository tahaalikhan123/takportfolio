// Global flag to track form submission status
var submitted = false;

document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission
    const form = document.getElementById('contact-form');
    const iframe = document.getElementById('hidden_iframe');

    form.addEventListener('submit', function (event) {
        submitted = true;  // Set the flag when form is submitted
    });

    // Check if form was submitted when iframe loads
    iframe.addEventListener('load', function () {
        if (submitted) {
            formResponse();  // Call form response handler
        }
    });

    // Initialize AOS for animations
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
    });

    // Navbar toggle functionality
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    
    function toggleNavbar() {
        navbarLinks.classList.toggle('active');
    }

    navbarToggle.addEventListener('click', toggleNavbar);

    // Close navbar when a link is clicked (for mobile)
    navbarLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            toggleNavbar();
        }
    });

    // Close navbar when clicking outside
    document.addEventListener('click', function(e) {
        const isNavbarLink = e.target.closest('.navbar-links');
        const isNavbarToggle = e.target.closest('.navbar-toggle');
        if (!isNavbarLink && !isNavbarToggle && navbarLinks.classList.contains('active')) {
            toggleNavbar();
        }
    });

    // Scroll to Top functionality
    const scrollToTop = document.getElementById('scroll-to-top');
    window.addEventListener('scroll', function () {
        scrollToTop.classList.toggle('show', window.scrollY > 200);
    });

    scrollToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Animate skill progress bars on scroll
    const skills = document.getElementById('skills');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.skill-card').forEach(function (card) {
                card.querySelector('.progress-bar').classList.add('filled');
            });
            observer.unobserve(skills);
        }
    }, { threshold: 0.1 });
    observer.observe(skills);

    // Prevent automatic scroll to a section like #projects on page load
    if (window.location.hash) {
        // Clear the hash to prevent auto-scroll on refresh
        window.history.replaceState(null, null, ' ');
    }

    // Fetch and display GitHub repositories
    const username = "tahaalikhan123";
    const repoList = document.querySelector('.repo-grid');

    fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=10`)
        .then(response => response.json())
        .then(data => {
            data.forEach(repo => {
                const repoCard = document.createElement('div');
                repoCard.className = 'repo-card';
                repoCard.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <div class="repo-stats">
                        <div><i class="fas fa-star"></i> ${repo.stargazers_count} Stars</div>
                        <div><i class="fas fa-code-branch"></i> ${repo.forks_count} Forks</div>
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                `;
                repoList.appendChild(repoCard);
            });
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
            repoList.innerHTML = '<p>Failed to load repositories. Please try again later.</p>';
        });

    // Initialize GitHub Contribution Chart
    GitHubCalendar(".calendar", username, { responsive: true });

    // Add smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Function to handle form submission response
function formResponse() {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('form-response').style.display = 'block';
}