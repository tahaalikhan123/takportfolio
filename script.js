// Replace 'your-github-username' with your actual GitHub username
const githubUsername = 'tahaalikhan123';

// Function to fetch repositories
async function fetchRepositories() {
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
    const repos = await response.json();
    return repos;
}

// Function to display repositories
async function displayRepositories() {
    const repos = await fetchRepositories();
    const repoContainer = document.getElementById('github-repositories');
    repoContainer.innerHTML = '';

    repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.classList.add('repo');
        repoElement.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description || 'No description available.'}</p>
            <p>⭐ ${repo.stargazers_count} | Forks: ${repo.forks_count}</p>
        `;
        repoContainer.appendChild(repoElement);
    });
}

// Function to display contributions graph
function displayContributions() {
    const contributionsContainer = document.getElementById('github-contributions');
    contributionsContainer.innerHTML = `
        <img src="https://ghchart.rshah.org/${githubUsername}" alt="GitHub Contributions Graph" />
    `;
}

// Initialize functions
document.addEventListener('DOMContentLoaded', () => {
    displayContributions();
    displayRepositories();
});

document.getElementById('toggle-dark-mode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});