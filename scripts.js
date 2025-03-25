document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchBox = document.getElementById('search-box');

    searchButton.addEventListener('click', () => {
        const query = searchBox.value.trim();
        if (query) {
            // Implement search functionality
            console.log(`Searching for: ${query}`);
        }
    });

    // Load anime list
    if (document.getElementById('anime-list')) {
        fetch('animeneek.json')
            .then(response => response.json())
            .then(data => {
                const animeList = document.getElementById('anime-list');
                data.forEach(anime => {
                    const animeItem = document.createElement('div');
                    animeItem.className = 'anime-item';
                    animeItem.innerHTML = `
                        <h3>Anime ID: ${anime['data-mal-id']}</h3>
                        <button onclick="viewAnimeDetails(${anime['data-mal-id']})">View Details</button>
                    `;
                    animeList.appendChild(animeItem);
                });
            });
    }
});

function viewAnimeDetails(animeId) {
    // Navigate to the anime details page with the selected anime ID
    window.location.href = `anime-details.html?animeId=${animeId}`;
}
