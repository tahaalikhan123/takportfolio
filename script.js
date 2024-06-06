document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('contactForm element not found');
    }
    
    fetchGitHubProjects();
});

function handleFormSubmit(event) {
    event.preventDefault();
    
    const isValid = validateForm();
    
    if (isValid) {
        // Submit the form
        event.target.submit();
    }
}

function validateForm() {
    let isValid = true;

    // Name validation
    isValid &= validateField('name', 'Name is required.');

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
    isValid &= validateField('message', 'Message is required.');

    return Boolean(isValid);
}

function validateField(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const fieldError = document.getElementById(`${fieldId}Error`);
    if (field.value.trim() === '') {
        fieldError.textContent = errorMessage;
        return false;
    } else {
        fieldError.textContent = '';
        return true;
    }
}

async function fetchGitHubProjects() {
    const username = 'tahaalikhan123'; // Replace with your GitHub username
    const apiUrl = `https://api.github.com/users/${username}/repos`;
    const projectsSection = document.getElementById('projects');

    try {
        projectsSection.innerHTML = '<p>Loading projects...</p>';
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayProjects(data);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsSection.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
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