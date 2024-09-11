/**
 * Github repo projects
 */
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
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);  // Sort by stars
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
// JavaScript to pause the sliding on hover and resume on mouse out
document.querySelector('.sliding-box').addEventListener('mouseover', function() {
    document.querySelector('.slider').style.animationPlayState = 'paused';
});

document.querySelector('.sliding-box').addEventListener('mouseout', function() {
    document.querySelector('.slider').style.animationPlayState = 'running';
});
// Select the switch button
const switchButton = document.querySelector('.switch');
// Toggle dark mode
switchButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  // Optionally save the mode in local storage
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDarkMode ? 'enabled' : 'disabled');
});
// Maintain dark mode state on page reload
document.addEventListener('DOMContentLoaded', () => {
  const darkModeState = localStorage.getItem('dark-mode');
  if (darkModeState === 'enabled') {
    document.body.classList.add('dark-mode');
  }
});

document.addEventListener('DOMContentLoaded', () => {
    // Welcome Page Logic
    const welcomePage = document.getElementById('welcome-page');
    const enterButton = document.getElementById('enter-portfolio');

    if (enterButton && welcomePage) {
        enterButton.addEventListener('click', () => {
            welcomePage.classList.add('fade-out');
            setTimeout(() => {
                welcomePage.style.display = 'none';
            }, 1000); // Matches the duration of the opacity transition
        });
    }

    // Scroll Animation
    const sections = document.querySelectorAll('section');
    const observerOptions = {
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
    }, observerOptions);

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

    // Carousel Logic
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.slide');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
            currentSlide = index;
        }

        const nextButton = document.querySelector('.next');
        const prevButton = document.querySelector('.prev');

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            });

            prevButton.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            });
        }

        showSlide(currentSlide);
    }

    // Mobile Navigation Toggle
    const toggleButton = document.querySelector('.mobile-nav-toggle');
    const mobileNavContent = document.querySelector('.mobile-nav-content');

    if (toggleButton && mobileNavContent) {
        toggleButton.addEventListener('click', () => {
            mobileNavContent.classList.toggle('show');
        });
    }
});
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}
// Function to check when the contact section is visible
document.addEventListener('DOMContentLoaded', () => {
    const contactSection = document.getElementById('contact-me');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                // Once the section is visible, animate the stars
                animateStars();
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(contactSection);
});

// Animate the stars when the contact section is visible
function animateStars() {
    const stars = document.querySelectorAll('.stars');
    stars.forEach(star => {
        const rating = star.getAttribute('data-rating');
        star.style.setProperty('--star-width', `${rating}em`); // Ensure inline styling
        star.querySelector('::before').style.width = `${rating}em`;  // Use the correct CSS property
    });
}