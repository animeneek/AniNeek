document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get('mal_id');
    const animeDetailsSection = document.getElementById('animeDetails');

    if (malId) {
        fetchAnimeDetails(malId);
    }

    function fetchAnimeDetails(malId) {
        const url = `https://api.jikan.moe/v4/anime/${malId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const animeDetails = data.data;
                displayAnimeDetails(animeDetails);
            })
            .catch(error => console.error('Error fetching anime details:', error));
    }

    function displayAnimeDetails(animeDetails) {
        animeDetailsSection.innerHTML = `
            <h2>${animeDetails.title}</h2>
            <img src="${animeDetails.images.jpg.image_url}" alt="${animeDetails.title}">
            <p>${animeDetails.synopsis}</p>
            <h3>Episodes</h3>
            <div id="episodeList"></div>
        `;
        fetch('animeneek.json')
            .then(response => response.json())
            .then(data => {
                const anime = data.find(a => a['data-mal-id'] == malId);
                displayEpisodes(anime.episodes);
            })
            .catch(error => console.error('Error fetching JSON data:', error));
    }

    function displayEpisodes(episodes) {
        const episodeList = document.getElementById('episodeList');
        episodes.forEach(episode => {
            const episodeDiv = document.createElement('div');
            const embedUrl = episode['data-src'] === 'anime' ?
                `https://s3taku.one/watch?play=${episode['data-video-id']}` :
                `https://streamtape.com/v/${episode['data-video-id']}`;
            episodeDiv.innerHTML = `
                <button onclick="playEpisode('${embedUrl}')">Episode ${episode['data-ep-num']} (${episode['data-ep-lan']})</button>
            `;
            episodeList.appendChild(episodeDiv);
        });
    }

    window.playEpisode = function(embedUrl) {
        const playerDiv = document.createElement('div');
        playerDiv.innerHTML = `
            <iframe src="${embedUrl}" width="640" height="360" frameborder="0" allowfullscreen></iframe>
        `;
        animeDetailsSection.innerHTML = ''; // Clear existing content
        animeDetailsSection.appendChild(playerDiv);
    }
});
