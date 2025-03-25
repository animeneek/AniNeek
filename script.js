document.addEventListener('DOMContentLoaded', function() {
    const animeList = document.getElementById('anime-list');

    // Example data
    const animeData = [
        { title: 'Naruto', description: 'A young ninja who seeks recognition from his peers and dreams of becoming the Hokage.', videoUrl: 'https://example.com/naruto.mp4' },
        { title: 'One Piece', description: 'A young pirate captain who sets out on a journey to find the legendary One Piece treasure.', videoUrl: 'https://example.com/onepiece.mp4' }
    ];

    // Function to create anime items
    function createAnimeItem(anime) {
        const animeItem = document.createElement('div');
        animeItem.classList.add('anime-item');

        const title = document.createElement('h3');
        title.textContent = anime.title;
        animeItem.appendChild(title);

        const description = document.createElement('p');
        description.textContent = anime.description;
        animeItem.appendChild(description);

        const videoLink = document.createElement('a');
        videoLink.href = anime.videoUrl;
        videoLink.textContent = 'Watch Now';
        animeItem.appendChild(videoLink);

        return animeItem;
    }

    // Populate anime list
    animeData.forEach(anime => {
        const animeItem = createAnimeItem(anime);
        animeList.appendChild(animeItem);
    });
});