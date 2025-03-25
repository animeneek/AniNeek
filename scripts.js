document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchBox = document.getElementById('search-box');

    searchButton.addEventListener('click', () => {
        const query = searchBox.value.trim().toLowerCase();
        if (query) {
            searchAnime(query);
        }
    });

    // Load anime list
    if (document.getElementById('anime-list')) {
        loadAnimeList();
    }
});

function loadAnimeList() {
    fetch('animeneek.json')
        .then(response => response.json())
        .then(data => {
            const animeList = document.getElementById('anime-list');
            animeList.innerHTML = ''; // Clear existing content

            data.forEach(anime => {
                const animeItem = document.createElement('div');
                animeItem.className = 'anime-item';
                animeItem.innerHTML = `
                    <h3>${anime['data-mal-title']}</h3>
                    <button onclick="viewAnimeDetails(${anime['data-mal-id']})">View Details</button>
                `;
                animeList.appendChild(animeItem);
            });
        })
        .catch(error => console.error('Error loading anime list:', error));
}

function searchAnime(query) {
    fetch('animeneek.json')
        .then(response => response.json())
        .then(data => {
            const animeList = document.getElementById('anime-list');
            animeList.innerHTML = ''; // Clear existing content

            const filteredAnime = data.filter(anime => anime['data-mal-title'].toLowerCase().includes(query));

            if (filteredAnime.length === 0) {
                animeList.innerHTML = '<p>No anime found.</p>';
                return;
            }

            filteredAnime.forEach(anime => {
                const animeItem = document.createElement('div');
                animeItem.className = 'anime-item';
                animeItem.innerHTML = `
                    <h3>${anime['data-mal-title']}</h3>
                    <button onclick="viewAnimeDetails(${anime['data-mal-id']})">View Details</button>
                `;
                animeList.appendChild(animeItem);
            });
        })
        .catch(error => console.error('Error searching anime:', error));
}

function viewAnimeDetails(animeId) {
    // Navigate to the anime details page with the selected anime ID
    window.location.href = `anime-details.html?animeId=${animeId}`;
}
