document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get('mal_id');
    const animeDetailsSection = document.getElementById('animeDetails');
    const animeDetailsCache = {};

    if (malId) {
        if (animeDetailsCache[malId]) {
            displayAnimeDetails(animeDetailsCache[malId]);
        } else {
            fetchAnimeDetails(malId);
        }
    }

    function fetchAnimeDetails(malId) {
        const url = `https://api.jikan.moe/v4/anime/${malId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const animeDetails = data.data;
                animeDetailsCache[malId] = animeDetails;
                displayAnimeDetails(animeDetails);
            })
            .catch(error => console.error('Error fetching anime details:', error));
    }

    function displayAnimeDetails(animeDetails) {
        animeDetailsSection.innerHTML = `
            <div class="anime-header">
                <img src="${animeDetails.images.jpg.image_url}" alt="${animeDetails.title}">
                <div class="anime-info">
                    <h2>${animeDetails.title}</h2>
                    <h3>${animeDetails.title_english}</h3>
                    <div class="genres">
                        ${animeDetails.genres.map(genre => `<span class="genre">${genre.name}</span>`).join('')}
                    </div>
                </div>
            </div>
            <p class="synopsis">${animeDetails.synopsis}</p>
            <div class="anime-meta">
                <div class="meta-item"><strong>Format:</strong> ${animeDetails.type}</div>
                <div class="meta-item"><strong>Status:</strong> ${animeDetails.status}</div>
                <div class="meta-item"><strong>Rating:</strong> ${animeDetails.rating}</div>
                <div class="meta-item"><strong>Start Date:</strong> ${animeDetails.aired.from}</div>
                <div class="meta-item"><strong>End Date:</strong> ${animeDetails.aired.to}</div>
                <div class="meta-item"><strong>Episodes:</strong> ${animeDetails.episodes}</div>
                <div class="meta-item"><strong>Duration:</strong> ${animeDetails.duration}</div>
                <div class="meta-item"><strong>Season:</strong> ${animeDetails.season}</div>
                <div class="meta-item"><strong>Country:</strong> ${animeDetails.source}</div>
                <div class="meta-item"><strong>Adult:</strong> ${animeDetails.explicit_genres.length > 0 ? 'Yes' : 'No'}</div>
                <div class="meta-item"><strong>Studios:</strong> ${animeDetails.studios.map(studio => studio.name).join(', ')}</div>
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
