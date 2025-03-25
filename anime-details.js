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
            <div class="anime-meta">
                <p><strong>Score:</strong> ${animeDetails.score}</p>
                <p><strong>Episodes:</strong> ${animeDetails.episodes}</p>
                <p><strong>Type:</strong> ${animeDetails.type}</p>
                <p><strong>Genres:</strong> ${animeDetails.genres.map(genre => genre.name).join(', ')}</p>
            </div>
            <h3>Episodes</h3>
            <div id="episodeList">
                <h4>Sub</h4>
                <div id="subEpisodes"></div>
                <h4>Dub</h4>
                <div id="dubEpisodes"></div>
                <h4>Raw</h4>
                <div id="rawEpisodes"></div>
            </div>
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
        const subEpisodes = document.getElementById('subEpisodes');
        const dubEpisodes = document.getElementById('dubEpisodes');
        const rawEpisodes = document.getElementById('rawEpisodes');

        episodes.forEach(episode => {
            const episodeDiv = document.createElement('div');
            const embedUrl = episode['data-src'] === 'anime' ?
                `https://s3taku.one/watch?play=${episode['data-video-id']}` :
                `https://streamtape.com/v/${episode['data-video-id']}`;
            episodeDiv.innerHTML = `
                <a href="anime-episode.html?mal_id=${episode['data-mal-id']}&lan=${episode['data-ep-lan']}&ep=${episode['data-ep-num']}">Episode ${episode['data-ep-num']} (${episode['data-ep-lan']})</a>
            `;
            if (episode['data-ep-lan'] === 'Sub') {
                subEpisodes.appendChild(episodeDiv);
            } else if (episode['data-ep-lan'] === 'Dub') {
                dubEpisodes.appendChild(episodeDiv);
            } else if (episode['data-ep-lan'] === 'Raw') {
                rawEpisodes.appendChild(episodeDiv);
            }
        });
    }
});
