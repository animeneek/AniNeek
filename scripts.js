document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const animeList = document.getElementById('animeList');

    // Fetch and parse the JSON data
    fetch('animeneek.json')
        .then(response => response.json())
        .then(data => {
            displayAnimeList(data);
        })
        .catch(error => console.error('Error fetching JSON data:', error));

    function displayAnimeList(data) {
        animeList.innerHTML = ''; // Clear existing list
        data.forEach(anime => {
            const malId = anime['data-mal-id'];
            fetchAnimeDetails(malId, anime);
        });
    }

    function fetchAnimeDetails(malId, anime) {
        const url = `https://api.jikan.moe/v4/anime/${malId}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const animeDetails = data.data;
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <img src="${animeDetails.images.jpg.image_url}" alt="${animeDetails.title}" width="50">
                    <a href="anime-details.html?mal_id=${malId}">${animeDetails.title}</a>
                `;
                animeList.appendChild(listItem);
            })
            .catch(error => console.error('Error fetching anime details:', error));
    }

    searchBar.addEventListener('keyup', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const listItems = animeList.getElementsByTagName('li');
        for (let i = 0; i < listItems.length; i++) {
            const animeTitle = listItems[i].textContent.toLowerCase();
            if (animeTitle.includes(searchTerm)) {
                listItems[i].style.display = '';
            } else {
                listItems[i].style.display = 'none';
            }
        }
    });
});
