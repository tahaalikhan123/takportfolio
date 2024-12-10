document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogGrid = document.querySelector('.blog-grid');
    const noPostsMessage = document.querySelector('.no-posts');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.dataset.category;
            filterPosts(category);
        });
    });

    function filterPosts(category) {
        const posts = document.querySelectorAll('.post-card');
        
        if (posts.length === 0) {
            noPostsMessage.style.display = 'block';
            return;
        }

        posts.forEach(post => {
            if (category === 'all' || post.dataset.category === category) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Initialize dark mode from main script
    if (typeof initializeDarkMode === 'function') {
        initializeDarkMode();
    }
}); 