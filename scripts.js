document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const animeList = document.getElementById('animeList');
    const animeItems = animeList.getElementsByTagName('li');

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
        // Display anime details in a modal or a new section
        console.log(animeDetails);
        alert(`Title: ${animeDetails.title}\nEpisodes: ${animeDetails.episodes}\nSynopsis: ${animeDetails.synopsis}`);
    }
});
