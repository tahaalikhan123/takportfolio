// Global flag to track form submission status
var submitted = false;

document.addEventListener("DOMContentLoaded", function () {
  // Prevent automatic scroll to a section like #projects on page load
  if (window.location.hash) {
    // Prevent the default scroll
    event.preventDefault();

    // Remove the hash from the URL without triggering a page reload
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );

    // Optionally, scroll to the top of the page
    window.scrollTo(0, 0);
  }

  // Handle form submission
  const form = document.getElementById("contact-form");
  const iframe = document.getElementById("hidden_iframe");

  if (form) {
    form.addEventListener("submit", function (event) {
      submitted = true; // Set the flag when form is submitted
    });
  }

  // Check if form was submitted when iframe loads
  if (iframe) {
    iframe.addEventListener("load", function () {
      if (submitted) {
        formResponse(); // Call form response handler
      }
    });
  }

  // Initialize AOS for animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }

  // Navbar toggle functionality
  const navbarToggle = document.querySelector(".navbar-toggle");
  const navbarLinks = document.querySelector(".navbar-links");

  function toggleNavbar() {
    if (navbarLinks) {
      navbarLinks.classList.toggle("active");
    }
  }

  if (navbarToggle) {
    navbarToggle.addEventListener("click", toggleNavbar);
  }

  // Close navbar when a link is clicked (for mobile)
  if (navbarLinks) {
    navbarLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        toggleNavbar();
      }
    });
  }

  // Close navbar when clicking outside
  document.addEventListener("click", function (e) {
    const isNavbarLink = e.target.closest(".navbar-links");
    const isNavbarToggle = e.target.closest(".navbar-toggle");
    if (
      navbarLinks &&
      !isNavbarLink &&
      !isNavbarToggle &&
      navbarLinks.classList.contains("active")
    ) {
      toggleNavbar();
    }
  });

  // Scroll to Top functionality
  const scrollToTop = document.getElementById("scroll-to-top");
  if (scrollToTop) {
    window.addEventListener("scroll", function () {
      scrollToTop.classList.toggle("show", window.scrollY > 200);
    });

    scrollToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Animate skill progress bars on scroll
  const skills = document.getElementById("skills");
  if (skills) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          document.querySelectorAll(".skill-card").forEach(function (card) {
            const progressBar = card.querySelector(".progress-bar");
            if (progressBar) {
              progressBar.classList.add("filled");
            }
          });
          observer.unobserve(skills);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(skills);
  }

  // GitHub section configuration
  const username = "tahaalikhan123";
  const repoList = document.querySelector(".repo-grid");
  const githubSection = document.getElementById("github-projects");

  // Language colors for the dots
  const languageColors = {
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    TypeScript: "#2b7489",
    Java: "#b07219",
    "C++": "#f34b7d",
    Ruby: "#701516",
    PHP: "#4F5D95",
    default: "#6e7681"
  };

  // Format date to relative time
  function getRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  // Fetch GitHub stats
  async function fetchGitHubStats() {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      // Update stats cards
      if (githubSection) {
        // Check if stats already exist
        const existingStats = githubSection.querySelector('.github-stats');
        if (existingStats) {
          // Update existing stats instead of creating new ones
          const reposValue = existingStats.querySelector('.stat-card:nth-child(1) .stat-value');
          const followersValue = existingStats.querySelector('.stat-card:nth-child(2) .stat-value');
          if (reposValue) reposValue.textContent = data.public_repos;
          if (followersValue) followersValue.textContent = data.followers;
          return data;
        }

        const statsHTML = `
          <div class="github-stats">
            <div class="stat-card">
              <i class="fas fa-code-branch"></i>
              <h4>Repositories</h4>
              <span class="stat-value">${data.public_repos}</span>
            </div>
            <div class="stat-card">
              <i class="fas fa-users"></i>
              <h4>Followers</h4>
              <span class="stat-value">${data.followers}</span>
            </div>
            <div class="stat-card">
              <i class="fas fa-star"></i>
              <h4>Total Stars</h4>
              <span class="stat-value" id="total-stars">0</span>
            </div>
          </div>
        `;
        
        // Insert stats after the contribution chart
        const contributionChart = githubSection.querySelector(".github-contribution-chart");
        if (contributionChart) {
          contributionChart.insertAdjacentHTML("afterend", statsHTML);
        } else {
          // If no contribution chart, insert before repo grid
          const repoGrid = githubSection.querySelector(".repo-grid");
          if (repoGrid) {
            repoGrid.insertAdjacentHTML("beforebegin", statsHTML);
          }
        }
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      // Handle error gracefully
    }
  }

  // Fetch repositories
  async function fetchRepositories() {
    if (!repoList) return;
    
    // Add loading state
    repoList.innerHTML = `
      <div class="loading-message">
        <i class="fas fa-spinner fa-spin"></i>
        <span>Loading repositories...</span>
      </div>
    `;
    
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const repos = await response.json();
      
      // Calculate total stars
      const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
      const totalStarsElement = document.getElementById("total-stars");
      if (totalStarsElement) totalStarsElement.textContent = totalStars;
      
      // Display repositories
      repoList.innerHTML = "";
      
      if (repos.length === 0) {
        repoList.innerHTML = `
          <div class="error-message">
            <p>No repositories found.</p>
          </div>
        `;
        return;
      }
      
      repos.forEach(repo => {
        const languageColor = languageColors[repo.language] || languageColors.default;
        const updatedAt = getRelativeTime(repo.updated_at);
        
        const repoCard = document.createElement("div");
        repoCard.className = "repo-card";
        repoCard.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description || "No description available."}</p>
          ${repo.language ? `
            <div class="repo-language">
              <span class="language-dot" style="background-color: ${languageColor}"></span>
              ${repo.language}
            </div>
          ` : ''}
          <div class="repo-meta">
            <span>Updated ${updatedAt}</span>
            <span>${(repo.size / 1024).toFixed(1)} MB</span>
          </div>
          <div class="repo-stats">
            <div><i class="fas fa-star"></i> ${repo.stargazers_count}</div>
            <div><i class="fas fa-code-branch"></i> ${repo.forks_count}</div>
            <div><i class="fas fa-eye"></i> ${repo.watchers_count}</div>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-github"></i>
            View Repository
          </a>
        `;
        repoList.appendChild(repoCard);
      });
    } catch (error) {
      console.error("Error fetching repos:", error);
      repoList.innerHTML = `
        <div class="error-message">
          <p>Failed to load repositories. Please try again later.</p>
          <button onclick="retryFetchRepos()" class="retry-button">
            <i class="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      `;
    }
  }

  // Initialize GitHub data
  fetchGitHubStats();
  fetchRepositories();

  // Add retry function for repository fetch
  window.retryFetchRepos = function() {
    fetchRepositories();
  };

  // Initialize GitHub Calendar
  if (typeof GitHubCalendar !== "undefined") {
    const calendar = document.querySelector(".calendar");
    if (calendar) {
      const contributionChart = calendar.closest(".github-contribution-chart");
      
      // Add loading state
      if (contributionChart) {
        contributionChart.classList.add("loading");
      }

      GitHubCalendar(".calendar", username, {
        responsive: true,
        tooltips: true,
        global_stats: false,
        proxy: function(url) {
          // Use GitHub API directly instead of CORS proxy
          const apiUrl = `https://api.github.com/users/${username}/contributions`;
          return fetch(apiUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.text();
            })
            .catch(error => {
              console.error("Error fetching GitHub data:", error);
              if (calendar) {
                calendar.innerHTML = `
                  <div class="error-message">
                    <p>To view the GitHub contribution graph, please visit: <a href="https://github.com/${username}" target="_blank">github.com/${username}</a></p>
                    <p>Due to GitHub's API limitations, the graph cannot be displayed directly.</p>
                  </div>
                `;
              }
              // Remove loading state on error
              if (contributionChart) {
                contributionChart.classList.remove("loading");
              }
              throw error;
            });
        }
      }).then(() => {
        // Remove loading state on success
        if (contributionChart) {
          contributionChart.classList.remove("loading");
        }
      }).catch(error => {
        console.error("Failed to initialize GitHub Calendar:", error);
      });
    }
  }

  // Add retry function for GitHub calendar
  window.retryGitHubCalendar = function() {
    const calendar = document.querySelector(".calendar");
    const contributionChart = calendar?.closest(".github-contribution-chart");
    
    if (calendar && contributionChart) {
      calendar.innerHTML = "";
      contributionChart.classList.add("loading");
      
      GitHubCalendar(".calendar", username, {
        responsive: true,
        tooltips: true,
        global_stats: false,
        proxy: function(url) {
          const corsProxy = "https://cors-anywhere.herokuapp.com/";
          return fetch(corsProxy + url)
            .then(response => {
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              return response.text();
            });
        },
        onLoad: function() {
          contributionChart.classList.remove("loading");
        }
      });
    }
  };

  // Add smooth scrolling for all internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Add event listener for the "Join the Waitlist" button
  const waitlistButton = document.querySelector(".cta-btn");
  if (waitlistButton) {
    waitlistButton.addEventListener("click", function (e) {
      e.preventDefault();
      alert(
        "Thank you for your interest! We will notify you when the waitlist opens."
      );
      // You can add more functionality here, like opening a modal or navigating to a signup page
    });
  }

  // Typing effect
  const typedTextSpan = document.querySelector("#typed-text");
  const cursorSpan = document.querySelector(".cursor");

  if (typedTextSpan && cursorSpan) {
    const textArray = ["Data Analyst", "Data Engineer", "Problem Solver"];
    const typingDelay = 200;
    const erasingDelay = 100;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing"))
          cursorSpan.classList.add("typing");
        typedTextSpan.textContent +=
          textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing"))
          cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(
          0,
          charIndex - 1
        );
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);
  }

  // Initialize theme
  const themeToggle = document.querySelector(".theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  
  // Check for saved theme preference or use system preference
  const currentTheme = localStorage.getItem("theme") || 
    (prefersDarkScheme.matches ? "dark" : "light");
  
  // Apply initial theme
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);
  
  // Theme toggle click handler
  themeToggle.addEventListener("click", function() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });
  
  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    if (theme === "dark") {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
    }
  }
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      updateThemeIcon(newTheme);
    }
  });
});

// Function to handle form submission response
function formResponse() {
  const contactForm = document.getElementById("contact-form");
  const formResponseElement = document.getElementById("form-response");
  if (contactForm) {
    contactForm.style.display = "none";
  }
  if (formResponseElement) {
    formResponseElement.style.display = "block";
  }
}

// Lightbox functionality
function openLightbox(img) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (lightbox && lightboxImg) {
    lightbox.style.display = "block";
    lightboxImg.src = img.src;
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.style.display = "none";
  }
}

// Close lightbox when clicking outside the image
window.onclick = function (event) {
  const lightbox = document.getElementById("lightbox");
  if (lightbox && event.target == lightbox) {
    lightbox.style.display = "none";
  }
};