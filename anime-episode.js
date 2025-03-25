document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get('mal_id');
    const lan = urlParams.get('lan');
    const epNum = urlParams.get('ep');
    const episodePlaybackSection = document.getElementById('episodePlayback');

    if (malId && lan && epNum) {
        fetchEpisodeDetails(malId, lan, epNum);
    }

    function fetchEpisodeDetails(malId, lan, epNum) {
        fetch('animeneek.json')
            .then(response => response.json())
            .then(data => {
                const anime = data.find(a => a['data-mal-id'] == malId);
                const episode = anime.episodes.find(e => e['data-ep-lan'] === lan && e['data-ep-num'] == epNum);
                displayEpisodePlayback(anime, episode);
            })
            .catch(error => console.error('Error fetching JSON data:', error));
    }

    function displayEpisodePlayback(anime, episode) {
        const embedUrl = episode['data-src'] === 'anime' ?
            `https://s3taku.one/watch?play=${episode['data-video-id']}` :
            `https://streamtape.com/v/${episode['data-video-id']}`;
        episodePlaybackSection.innerHTML = `
            <h2>${anime['data-mal-id']} - Episode ${episode['data-ep-num']} (${episode['data-ep-lan']})</h2>
            <div>
                <iframe src="${embedUrl}" width="640" height="360" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
    }
});
