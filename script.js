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

  // Fetch and display GitHub repositories
  const username = "tahaalikhan123"; // Ensure this is correct
  const repoList = document.querySelector(".repo-grid");

  if (repoList) {
    // Add error handling and logging for the repository fetch
    fetch(
      `https://api.github.com/users/${username}/repos?sort=created&per_page=10`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        data.forEach((repo) => {
          const repoCard = document.createElement("div");
          repoCard.className = "repo-card";
          repoCard.innerHTML = `
                      <h3>${repo.name}</h3>
                      <p>${repo.description || "No description available."}</p>
                      <div class="repo-stats">
                          <div><i class="fas fa-star"></i> ${
                            repo.stargazers_count
                          } Stars</div>
                          <div><i class="fas fa-code-branch"></i> ${
                            repo.forks_count
                          } Forks</div>
                      </div>
                      <a href="${
                        repo.html_url
                      }" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                  `;
          repoList.appendChild(repoCard);
        });
      })
      .catch((error) => {
        console.error("Error fetching repos:", error);
        repoList.innerHTML =
          "<p>Failed to load repositories. Please try again later.</p>";
      });
  }

  // Initialize GitHub Contribution Chart with more options
  if (typeof GitHubCalendar !== "undefined") {
    GitHubCalendar(".calendar", username, {
      responsive: true,
      tooltips: true,
      global_stats: true,
      cache: 24 * 60 * 60 * 1000, // 24 hours cache
      onFetchError: (error) => {
        console.error("Error fetching GitHub calendar data:", error);
        const calendarElement = document.querySelector(".calendar");
        if (calendarElement) {
          calendarElement.innerHTML =
            "Failed to load GitHub contributions. Please try again later.";
        }
      },
    });
  }

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