document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get('mal_id');
    const animeDetailsSection = document.getElementById('animeDetails');
    let animeDetailsCache = {};

    if (malId) {
        if (animeDetailsCache[malId]) {
            displayAnimeDetails(animeDetailsCache[malId]);
        } else {
            fetchAnimeDetails(malId);
        }
    }

    function fetchAnimeDetails
