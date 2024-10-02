// Declare submitted globally
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

    // Navbar toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    navbarToggle.addEventListener('click', function () {
        navbarLinks.classList.toggle('active');
    });

    // Scroll to Top
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

    // Skill Progress Bars
    const skills = document.getElementById('skills');
    window.addEventListener('scroll', function () {
        const skillsTop = skills.offsetTop - window.innerHeight;
        if (window.scrollY > skillsTop) {
            document.querySelectorAll('.skill-card').forEach(function (card) {
                card.querySelector('.progress-bar').classList.add('filled');
            });
        }
    });

    // Prevent automatic scroll to a section like #projects on page load
    if (window.location.hash === "#projects") {
        // Clear the hash to prevent auto-scroll on refresh
        window.history.replaceState(null, null, ' ');
    }

    // Fetch GitHub repositories and display them
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
                    <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                `;
                repoList.appendChild(repoCard);
            });
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
            repoList.innerHTML = '<p>Failed to load repositories. Please try again later.</p>'; // User-friendly error
        });

    // GitHub Contribution Chart
    GitHubCalendar(".calendar", username, { responsive: true });
});

function formResponse() {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('form-response').style.display = 'block';
}