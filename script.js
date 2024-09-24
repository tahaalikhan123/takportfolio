// Declare submitted globally
var submitted = false;

document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission
    const form = document.getElementById('contact-form');
    const iframe = document.getElementById('hidden_iframe');

    form.onsubmit = function () {
        submitted = true;  // Set the flag when form is submitted
    };

    // Check if form was submitted when iframe loads
    iframe.onload = function () {
        if (submitted) {
            formResponse();  // Call form response handler
        }
    };
});

function formResponse() {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('form-response').style.display = 'block';
}

$(document).ready(function () {
    // Initialize AOS for animations
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
    });

    const username = "tahaalikhan123";
    const repoList = $('.repo-grid');

    // Fetch GitHub repositories and display them
    fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=10`)
        .then(response => response.json())
        .then(data => {
            data.forEach(repo => {
                const repoCard = `
                    <div class="repo-card">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available.'}</p>
                        <div class="repo-stats">
                            <div><i class="fas fa-star"></i> ${repo.stargazers_count} Stars</div>
                            <div><i class="fas fa-code-branch"></i> ${repo.forks_count} Forks</div>
                        </div>
                        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                    </div>
                `;
                repoList.append(repoCard);
            });
        })
        .catch(error => {
            console.error('Error fetching repos:', error);
            repoList.append('<p>Failed to load repositories. Please try again later.</p>'); // User-friendly error
        });

    // GitHub Contribution Chart
    new GitHubCalendar(".calendar", username, {
        responsive: true
    });

    // Navbar toggle
    $('.navbar-toggle').click(function () {
        $('.navbar-links').toggleClass('active');
    });

    // Scroll to Top
    $(window).scroll(function () {
        $('#scroll-to-top').toggleClass('show', $(window).scrollTop() > 200);
    });

    $('#scroll-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // Skill Progress Bars
    $(window).scroll(function () {
        var skillsTop = $('#skills').offset().top - window.innerHeight;
        if ($(window).scrollTop() > skillsTop) {
            $('.skill-card').each(function () {
                var skillLevel = $(this).data('skill');
                $(this).find('.progress-bar').addClass('filled'); // Add class for progress instead of inline width
            });
        }
    });
});
