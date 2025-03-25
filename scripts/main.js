document.addEventListener("DOMContentLoaded", () => {
    // Placeholder data for anime thumbnails
    const animeThumbnails = [
        { title: "Attack on Titan", genre: "Action", description: "Humanity fights for survival against man-eating giants.", image: "assets/attack_on_titan.jpg" },
        { title: "My Hero Academia", genre: "Superhero", description: "A young boy dreams of becoming the greatest hero.", image: "assets/my_hero_academia.jpg" },
        { title: "One Piece", genre: "Adventure", description: "Pirates search for the ultimate treasure, the One Piece.", image: "assets/one_piece.jpg" },
        // Additional anime data here
    ];

    // Load anime thumbnails into the grid
    const animeGrid = document.querySelector(".anime-grid");
    animeThumbnails.forEach(anime => {
        const animeItem = document.createElement("div");
        animeItem.className = "grid-item";
        animeItem.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <h3>${anime.title}</h3>
            <p>${anime.genre}</p>
        `;
        animeGrid.appendChild(animeItem);
    });

    // Placeholder data for featured anime
    const featuredAnime = [
        { title: "Demon Slayer", description: "A young boy battles demons to avenge his family.", image: "assets/demon_slayer.jpg" },
        { title: "Naruto", description: "A ninja strives to become the strongest in his village.", image: "assets/naruto.jpg" },
        // Additional featured anime data here
    ];

    // Load featured anime into the carousel
    const carousel = document.querySelector(".featured-carousel");
    featuredAnime.forEach(anime => {
        const carouselItem = document.createElement("div");
        carouselItem.className = "carousel-item";
        carouselItem.innerHTML = `
            <img src="${anime.image}" alt="${anime.title}">
            <h3>${anime.title}</h3>
            <p>${anime.description}</p>
        `;
        carousel.appendChild(carouselItem);
    });

    // Search functionality
    const searchInput = document.querySelector("header nav ul li input");
    searchInput.addEventListener("input", function(event) {
        const query = event.target.value.toLowerCase();
        const filteredAnime = animeThumbnails.filter(anime => anime.title.toLowerCase().includes(query));
        animeGrid.innerHTML = "";
        filteredAnime.forEach(anime => {
            const animeItem = document.createElement("div");
            animeItem.className = "grid-item";
            animeItem.innerHTML = `
                <img src="${anime.image}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                <p>${anime.genre}</p>
            `;
            animeGrid.appendChild(animeItem);
        });
    });
});
