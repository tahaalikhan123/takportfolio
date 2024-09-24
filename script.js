// Initialize AOS for animations
AOS.init({
    duration: 1000, // Animation duration
    easing: 'ease-in-out', // Animation easing
    once: true, // Only animate once when scrolling
  });
  
  $(document).ready(function () {
    // Fetch GitHub repositories and display them
    const username = "tahaalikhan123";
    const repoList = $('.repo-grid');

    // Fetch GitHub repos using the GitHub API
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
        .catch(error => console.error('Error fetching repos:', error));

    // GitHub Contribution Chart (using GitHub Calendar library)
    new GitHubCalendar(".calendar", username, {
        responsive: true
    });
});

    // Toggle the hamburger menu on mobile
$(document).ready(function () {
  $('.navbar-toggle').click(function () {
      $('.navbar-links').toggleClass('active');
  });
});

 // Show the scroll-to-top arrow when scrolling down
 $(window).scroll(function () {
  if ($(window).scrollTop() > 200) {
      $('#scroll-to-top').addClass('show');
  } else {
      $('#scroll-to-top').removeClass('show');
  }
});

// Scroll to top when the arrow is clicked
$('#scroll-to-top').click(function () {
  $('html, body').animate({ scrollTop: 0 }, 600);
});

// Animate skill progress bars on scroll
$(document).ready(function () {
  $(window).scroll(function () {
      var skillsTop = $('#skills').offset().top - window.innerHeight;
      if ($(window).scrollTop() > skillsTop) {
          $('.skill-card').each(function () {
              var skillLevel = $(this).attr('data-skill');
              $(this).find('.progress-bar').css('width', skillLevel + '%');
          });
      }
  });
});