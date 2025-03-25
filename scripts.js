document.getElementById('toggle-button').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});

async function fetchFilters() {
    try {
        const genreResponse = await fetch('https://api.jikan.moe/v4/genres/anime');
        const genreData = await genreResponse.json();
        const genres = genreData.data;

        const genreSelect = document.getElementById('genre');
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.mal_id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });

        // Populate other filters similarly
    } catch (error) {
        console.error('Error fetching filters:', error);
    }
}

async function fetchAnimeList() {
    try {
        const response = await fetch('animeneek.json');
        const data = await response.json();
        const animeListSection = document.querySelector('.anime-list');

        for (const anime of data) {
            const animeDetailsResponse = await fetch(`https://api.jikan.moe/v4/anime/${anime['data-mal-id']}`);
            const animeDetails = await animeDetailsResponse.json();
            const animeInfo = animeDetails.data;

            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');
            animeCard.innerHTML = `
                <img src="${animeInfo.images.jpg.image_url}" alt="${animeInfo.title}">
                <div class="anime-info">
                    <h3>${animeInfo.title}</h3>
                    <p>${animeInfo.type} | ${animeInfo.year}</p>
                    <p>
                        ${anime.episodes.some(ep => ep['data-ep-lan'] === 'Sub') ? 'S' : ''}
                        ${anime.episodes.some(ep => ep['data-ep-lan'] === 'Dub') ? 'D' : ''}
                        ${anime.episodes.some(ep => ep['data-ep-lan'] === 'Raw') ? 'R' : ''}
                    </p>
                </div>
            `;
            animeListSection.appendChild(animeCard);
        }
    } catch (error) {
        console.error('Error fetching anime list:', error);
    }
}

fetchFilters();
fetchAnimeList();