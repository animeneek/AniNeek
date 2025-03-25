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
});
