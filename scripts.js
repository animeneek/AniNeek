document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const animeGrid = document.getElementById('animeGrid');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    let currentPage = 1;
    let animeData = [];
    let animeDetailsCache = {};

    // Fetch and parse the JSON data
    fetch('animeneek.json')
        .then(response => response.json())
        .then(data => {
            animeData = data;
            // Pre-fetch all anime details to cache
            animeData.forEach(anime => {
                const malId = anime['data-mal-id'];
                fetchAnimeDetails(malId, anime);
            });
            displayAnimeGrid(animeData, currentPage);
        })
        .catch(error => console.error('Error fetching JSON data:', error));

    function displayAnimeGrid(data, page) {
        const itemsPerPage = 20;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);

        animeGrid.innerHTML = ''; // Clear existing grid

        paginatedData.forEach(anime => {
            const malId = anime['data-mal-id'];
            if (animeDetailsCache[malId]) {
                const animeDetails = animeDetailsCache[malId];
                createAnimeCard(animeDetails);
            }
        });

        prevPageButton.disabled = page === 1;
        nextPageButton.disabled = endIndex >= data.length;

        // Update URL with current page
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url);

        // Smooth fade-in animation
        animeGrid.classList.remove('visible');
        setTimeout(() => {
            animeGrid.classList.add('visible');
        }, 100);
    }

    function fetchAnimeDetails(malId, anime) {
        const url = `https://api.jikan.moe/v4/anime/${malId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const animeDetails = data.data;
                animeDetailsCache[malId] = animeDetails;
                if (currentPage === 1) {
                    createAnimeCard(animeDetails);
                }
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
        const filteredData = animeData.filter(anime => {
            const malId = anime['data-mal-id'];
            const animeDetails = animeDetailsCache[malId];
            if (animeDetails) {
                const title = animeDetails.title.toLowerCase();
                const englishTitle = animeDetails.title_english.toLowerCase();
                return title.includes(searchTerm) || englishTitle.includes(searchTerm);
            }
            return false;
        });
        currentPage = 1;
        displayAnimeGrid(filteredData, currentPage);
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayAnimeGrid(animeData, currentPage);
        }
    });

    nextPageButton.addEventListener('click', () => {
        currentPage++;
        displayAnimeGrid(animeData, currentPage);
    });

    // Check for 'page' parameter in URL and set current page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('page')) {
        currentPage = parseInt(urlParams.get('page'));
        displayAnimeGrid(animeData, currentPage);
    }
});
