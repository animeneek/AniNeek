document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const animeGrid = document.getElementById('animeGrid');
    const sortSelect = document.getElementById('sortSelect');
    const loading = document.getElementById('loading');
    let currentPage = 1;
    let animeData = [];
    let animeDetailsCache = {};
    let isLoading = false;
    let sortOption = 'newest';

    // Fetch and parse the JSON data
    fetch('animeneek.json')
        .then(response => response.json())
        .then(data => {
            animeData = data;
            loadMoreAnime();
        })
        .catch(error => console.error('Error fetching JSON data:', error));

    function loadMoreAnime() {
        if (isLoading) return;
        isLoading = true;
        loading.style.display = 'block';

        const itemsPerPage = 20;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = animeData.slice(startIndex, endIndex);

        paginatedData.forEach(anime => {
            const malId = anime['data-mal-id'];
            if (animeDetailsCache[malId]) {
                const animeDetails = animeDetailsCache[malId];
                createAnimeCard(animeDetails);
            } else {
                fetchAnimeDetails(malId, anime);
            }
        });

        currentPage++;
        isLoading = false;
        loading.style.display = 'none';
    }

    function fetchAnimeDetails(malId, anime) {
        const url = `https://api.jikan.moe/v4/anime/${malId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const animeDetails = data.data;
                animeDetailsCache[malId] = animeDetails;
                createAnimeCard(animeDetails);
            })
            .catch(error => console.error('Error fetching anime details:', error));
    }

    function createAnimeCard(animeDetails) {
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-card';
        animeCard.innerHTML = `
            <img src="${animeDetails.images.jpg.image_url}" alt="${animeDetails.title}">
            <h3><a href="anime-details.html?mal_id=${animeDetails.mal_id}">${animeDetails.title}</a></h3>
        `;
        animeGrid.appendChild(animeCard);
    }

    searchBar.addEventListener('keyup', () => {
        const searchTerm = searchBar.value.toLowerCase();
        animeGrid.innerHTML = '';
        currentPage = 1;
        animeData = animeData.filter(anime => {
            const malId = anime['data-mal-id'];
            const animeDetails = animeDetailsCache[malId];
            if (animeDetails) {
                const title = animeDetails.title.toLowerCase();
                const englishTitle = animeDetails.title_english.toLowerCase();
                return title.includes(searchTerm) || englishTitle.includes(searchTerm);
            }
            return false;
        });
        loadMoreAnime();
    });

    sortSelect.addEventListener('change', (event) => {
        sortOption = event.target.value;
        sortAnimeData();
        animeGrid.innerHTML = '';
        currentPage = 1;
        loadMoreAnime();
    });

    function sortAnimeData() {
        animeData.sort((a, b) => {
            const aId = a['data-mal-id'];
            const bId = b['data-mal-id'];
            const aDetails = animeDetailsCache[aId];
            const bDetails = animeDetailsCache[bId];
            if (sortOption === 'newest') {
                return new Date(bDetails.aired.from) - new Date(aDetails.aired.from);
            } else if (sortOption === 'popular') {
                return bDetails.popularity - aDetails.popularity;
            } else if (sortOption === 'top') {
                return bDetails.score - aDetails.score;
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
            loadMoreAnime();
        }
    });
});
