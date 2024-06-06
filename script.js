document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            let isValid = true;
            
            // Name validation
            const name = document.getElementById('name');
            const nameError = document.getElementById('nameError');
            if (name.value.trim() === '') {
                nameError.textContent = 'Name is required.';
                isValid = false;
            } else {
                nameError.textContent = '';
            }
            
            // Email validation
            const email = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailPattern.test(email.value)) {
                emailError.textContent = 'Please enter a valid email address.';
                isValid = false;
            } else {
                emailError.textContent = '';
            }
            
            // Message validation
            const message = document.getElementById('message');
            const messageError = document.getElementById('messageError');
            if (message.value.trim() === '') {
                messageError.textContent = 'Message is required.';
                isValid = false;
            } else {
                messageError.textContent = '';
            }
            
            if (!isValid) {
                event.preventDefault();
            }
        });
    } else {
        console.error('contactForm element not found');
    }
});
document.addEventListener("DOMContentLoaded", function() {
    fetchGitHubProjects();
});

function fetchGitHubProjects() {
    const username = 'tahaalikhan123'; // Replace with your GitHub username
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayProjects(data);
        })
        .catch(error => {
            console.error('Error fetching GitHub projects:', error);
        });
}

function displayProjects(repos) {
    const projectsSection = document.getElementById('projects');
    projectsSection.innerHTML = ''; // Clear existing content

    repos.forEach(repo => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');

        const projectTitle = document.createElement('h3');
        projectTitle.textContent = repo.name;

        const projectDescription = document.createElement('p');
        projectDescription.textContent = repo.description || 'No description available';

        const projectLink = document.createElement('a');
        projectLink.href = repo.html_url;
        projectLink.target = '_blank';
        projectLink.textContent = 'View on GitHub';

        projectDiv.appendChild(projectTitle);
        projectDiv.appendChild(projectDescription);
        projectDiv.appendChild(projectLink);

        projectsSection.appendChild(projectDiv);
    });
}