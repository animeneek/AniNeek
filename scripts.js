document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const animeList = document.getElementById('animeList');
    const modal = document.getElementById('animeModal');
    const closeModal = document.querySelector('.close');
    const animeTitle = document.getElementById('animeTitle');
    const animeEpisodes = document.getElementById('animeEpisodes');

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

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
            const listItem = document.createElement('li');
            listItem.setAttribute('data-mal-id', anime['data-mal-id']);
            listItem.textContent = `Anime ${anime['data-mal-id']}`;
            listItem.addEventListener('click', () => {
                displayAnimeDetails(anime);
            });
            animeList.appendChild(listItem);
        });
    }

    function displayAnimeDetails(anime) {
        animeTitle.textContent = `Anime ${anime['data-mal-id']}`;
        animeEpisodes.innerHTML = ''; // Clear existing episodes

        anime.episodes.forEach(episode => {
            const episodeDiv = document.createElement('div');
            const episodeLink1 = document.createElement('a');
            const episodeLink2 = document.createElement('a');

            episodeLink1.href = `https://s3taku.one/watch?play=${episode['data-video-id']}`;
            episodeLink1.textContent = `Episode ${episode['data-ep-num']} (${episode['data-ep-lan']}) - Link 1`;
            episodeLink1.target = '_blank';

            episodeLink2.href = `https://s3taku.one/watch?play=${episode['data-video-id']}&sv=1`;
            episodeLink2.textContent = `Episode ${episode['data-ep-num']} (${episode['data-ep-lan']}) - Link 2`;
            episodeLink2.target = '_blank';

            episodeDiv.appendChild(episodeLink1);
            episodeDiv.appendChild(document.createTextNode(' | ')); // Separator
            episodeDiv.appendChild(episodeLink2);
            animeEpisodes.appendChild(episodeDiv);
        });

        modal.style.display = 'block';
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
