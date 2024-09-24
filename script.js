// Initialize AOS for animations
AOS.init({
    duration: 1000, // Animation duration
    easing: 'ease-in-out', // Animation easing
    once: true, // Only animate once when scrolling
  });
  
  // Fetch GitHub repositories dynamically
  const username = 'tahaalikhan123';
  const repoList = document.getElementById('repo-list');
  
  fetch(`https://api.github.com/users/${username}/repos`)
    .then(response => response.json())
    .then(repos => {
      repos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('project-card');
        repoCard.setAttribute('data-aos', 'zoom-in');
  
        repoCard.innerHTML = `
          <h4>${repo.name}</h4>
          <p>${repo.description || 'No description available.'}</p>
          <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;
  
        repoList.appendChild(repoCard);
      });
    })
    .catch(error => console.error('Error fetching repos:', error));  

    // Toggle the hamburger menu on mobile
$(document).ready(function () {
  $('.navbar-toggle').click(function () {
      $('.navbar-links').toggleClass('active');
  });
});