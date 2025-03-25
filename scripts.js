document.getElementById('toggle-button').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
});

async function fetchFilters() {
    try {
        // Fetch genres, tags, years, etc., and populate the filters
        const response = await fetch('https://api.jikan.moe/v4/genres/anime');
        const data = await response.json();
        const genres = data.data;
        const genreSelect = document.getElementById('genre');
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.mal_id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching filters:', error);
    }
}

async function fetchAnimeList() {
    try {
        // Fetch anime list and display in the anime-list section
        const response = await fetch('https://api.jikan.moe/v4/top/anime');
        const data = await response.json();
        const animeList = data.data;
        const animeListSection = document.querySelector('.anime-list');
        animeList.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');
            animeCard.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <div class="anime-info">
                    <h3>${anime.title}</h3>
                    <p>${anime.type} | ${anime.year}</p>
                    <p>
                        ${anime.sub ? 'S' : ''} 
                        ${anime.dub ? 'D' : ''} 
                        ${anime.raw ? 'R' : ''}
                    </p>
                </div>
            `;
            animeListSection.appendChild(animeCard);
        });
    } catch (error) {
        console.error('Error fetching anime list:', error);
    }
}

fetchFilters();
fetchAnimeList();