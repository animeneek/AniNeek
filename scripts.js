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

    // Load anime details
    const animeDetailsSection = document.getElementById('anime-details');
    if (animeDetailsSection) {
        const urlParams = new URLSearchParams(window.location.search);
        const animeId = urlParams.get('animeId');
        if (animeId) {
            loadAnimeDetails(animeId);
        }
    }
});

function loadAnimeList() {
    fetch('animeneek.json')
        .then(response => response.json())
        .then(data => {
            const animeList = document.getElementById('anime-list');
            animeList.innerHTML = ''; // Clear existing content

            data.forEach(anime => {
                fetch(`https://api.jikan.moe/v4/anime/${anime['data-mal-id']}`)
                    .then(response => response.json())
                    .then(animeData => {
                        const animeItem = document.createElement('div');
                        animeItem.className = 'anime-item';
                        animeItem.innerHTML = `
                            <h3>${animeData.data.title}</h3>
                            <img src="${animeData.data.images.jpg.image_url}" alt="${animeData.data.title}">
                            <p>${animeData.data.synopsis}</p>
                            <button onclick="viewAnimeDetails(${anime['data-mal-id']})">View Details</button>
                        `;
                        animeList.appendChild(animeItem);
                    })
                    .catch(error => console.error('Error loading anime details from Jikan:', error));
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
                fetch(`https://api.jikan.moe/v4/anime/${anime['data-mal-id']}`)
                    .then(response => response.json())
                    .then(animeData => {
                        const animeItem = document.createElement('div');
                        animeItem.className = 'anime-item';
                        animeItem.innerHTML = `
                            <h3>${animeData.data.title}</h3>
                            <img src="${animeData.data.images.jpg.image_url}" alt="${animeData.data.title}">
                            <p>${animeData.data.synopsis}</p>
                            <button onclick="viewAnimeDetails(${anime['data-mal-id']})">View Details</button>
                        `;
                        animeList.appendChild(animeItem);
                    })
                    .catch(error => console.error('Error loading anime details from Jikan:', error));
            });
        })
        .catch(error => console.error('Error searching anime:', error));
}

function viewAnimeDetails(animeId) {
    // Navigate to the anime details page with the selected anime ID
    window.location.href = `anime-details.html?animeId=${animeId}`;
}

function loadAnimeDetails(animeId) {
    fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
        .then(response => response.json())
        .then(animeData => {
            const animeDetailsSection = document.getElementById('anime-details');
            animeDetailsSection.innerHTML = `
                <h3>${animeData.data.title}</h3>
                <img src="${animeData.data.images.jpg.image_url}" alt="${animeData.data.title}">
                <p>${animeData.data.synopsis}</p>
                <p>Episodes:</p>
                <ul id="episode-list"></ul>
            `;
            loadEpisodeList(animeId);
        })
        .catch(error => console.error('Error loading anime details from Jikan:', error));
}

function loadEpisodeList(animeId) {
    fetch('animeneek.json')
        .then(response => response.json())
        .then(data => {
            const animeDetails = data.find(anime => anime['data-mal-id'] === parseInt(animeId));
            if (animeDetails) {
                const episodeList = document.getElementById('episode-list');
                animeDetails.episodes.forEach(ep => {
                    const episodeItem = document.createElement('li');
                    episodeItem.innerHTML = `
                        ${ep['data-ep-lan']} - Episode ${ep['data-ep-num']} <button onclick="viewEpisode(${animeId}, ${ep['data-ep-num']}, '${ep['data-video-id']}', '${ep['data-src']}')">Watch</button>
                    `;
                    episodeList.appendChild(episodeItem);
                });
            } else {
                console.error('Anime not found in animeneek.json');
            }
        })
        .catch(error => console.error('Error loading episode list from animeneek.json:', error));
}

function viewEpisode(animeId, episodeNum, videoId, source) {
    // Navigate to the episode page with the selected anime ID, episode number, and video ID
    window.location.href = `episode.html?animeId=${animeId}&episodeNum=${episodeNum}&videoId=${videoId}&source=${source}`;
}
