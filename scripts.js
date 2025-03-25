document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    
    const searchBar = document.getElementById('searchBar');
    const animeList = document.getElementById('animeList');
    const animeItems = animeList.getElementsByTagName('li');
    
    const modal = document.getElementById('animeModal');
    const closeModal = document.querySelector('.close');
    const animeTitle = document.getElementById('animeTitle');
    const animeSynopsis = document.getElementById('animeSynopsis');
    const animeEpisodes = document.getElementById('animeEpisodes');

    searchBar.addEventListener('keyup', () => {
        const searchTerm = searchBar.value.toLowerCase();
        console.log('Search term:', searchTerm);
        for (let i = 0; i < animeItems.length; i++) {
            const animeTitle = animeItems[i].textContent.toLowerCase();
            if (animeTitle.includes(searchTerm)) {
                animeItems[i].style.display = '';
            } else {
                animeItems[i].style.display = 'none';
            }
        }
    });

    animeList.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();  // Prevent default anchor behavior
            const animeId = event.target.parentElement.getAttribute('data-id');
            console.log('Anime ID clicked:', animeId);
            fetchAnimeDetails(animeId);
        }
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function fetchAnimeDetails(animeId) {
        const url = `https://api.jikan.moe/v4/anime/${animeId}`;
        console.log('Fetching anime details from:', url);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const animeDetails = data.data;
                console.log('Anime details fetched:', animeDetails);
                displayAnimeDetails(animeDetails);
            })
            .catch(error => console.error('Error fetching anime details:', error));
    }

    function displayAnimeDetails(animeDetails) {
        animeTitle.textContent = animeDetails.title;
        animeSynopsis.textContent = animeDetails.synopsis;
        animeEpisodes.textContent = `Episodes: ${animeDetails.episodes}`;
        modal.style.display = 'block';
    }
});
