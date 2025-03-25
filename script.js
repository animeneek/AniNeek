document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const videoPlayer = document.getElementById('video-player');
    const animeVideo = document.getElementById('anime-video');
    const videoSource = document.getElementById('video-source');
    const closePlayer = document.getElementById('close-player');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    closePlayer.addEventListener('click', () => {
        videoPlayer.style.display = 'none';
        animeVideo.pause();
    });

    const animeList = document.getElementById('anime-list');

    // Sample anime data
    const animes = [
        {
            title: 'Attack on Titan',
            description: 'Humans in a walled city fight against monstrous Titans.',
            image: 'assets/attack-on-titan.jpg',
            video: 'assets/attack-on-titan.mp4'
        },
        {
            title: 'My Hero Academia',
            description: 'A young boy dreams of becoming the greatest hero.',
            image: 'assets/my-hero-academia.jpg',
            video: 'assets/my-hero-academia.mp4'
        },
        {
            title: 'Naruto',
            description: 'A ninja in training seeks recognition and dreams of becoming the Hokage.',
            image: 'assets/naruto.jpg',
            video: 'assets/naruto.mp4'
        }
    ];

    animes.forEach(anime => {
        const animeItem = document.createElement('div');
        animeItem.classList.add('anime-item');
        
        animeItem.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <h2>${anime.title}</h2>
            <p>${anime.description}</p>
        `;

        animeItem.addEventListener('click', () => {
            videoSource.src = anime.video;
            animeVideo.load();
            videoPlayer.style.display = 'block';
            animeVideo.play();
        });

        animeList.appendChild(animeItem);
    });
});
