document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const animeList = document.getElementById('animeList');
    const animeItems = animeList.getElementsByTagName('li');
    
    const modal = document.getElementById('animeModal');
    const modalContent = document.querySelector('.modal-content');
    const closeModal = document.querySelector('.close');
    const animeTitle = document.getElementById('animeTitle');
    const animeSynopsis = document.getElementById('animeSynopsis');
    const animeEpisodes = document.getElementById('animeEpisodes');

    searchBar.addEventListener('keyup', () => {
        const searchTerm = searchBar.value.toLowerCase();
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
            const animeId = event.target.parentElement.getAttribute('data-id');
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
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const animeDetails = data.data;
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
