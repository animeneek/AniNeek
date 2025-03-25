document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("searchBox");
    const searchButton = document.getElementById("searchButton");
    const randomButton = document.getElementById("randomButton");
    const animeListButton = document.getElementById("animeListButton");
    const animeResults = document.getElementById("animeResults");

    // Search Function
    searchButton.addEventListener("click", function () {
        const query = searchBox.value.trim();
        if (!query) return;

        fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
            .then(response => response.json())
            .then(data => {
                animeResults.innerHTML = "";
                data.data.forEach(anime => {
                    const animeItem = document.createElement("div");
                    animeItem.innerHTML = `
                        <h3>${anime.title}</h3>
                        <a href="info.html?id=${anime.mal_id}"><img src="${anime.images.jpg.image_url}" width="150"></a>
                    `;
                    animeResults.appendChild(animeItem);
                });
            });
    });

    // Random Anime Function
    randomButton.addEventListener("click", function () {
        fetch("https://api.jikan.moe/v4/random/anime")
            .then(response => response.json())
            .then(data => {
                window.location.href = `info.html?id=${data.data.mal_id}`;
            });
    });

    // Anime List Function (Redirect)
    animeListButton.addEventListener("click", function () {
        window.location.href = "anime-list.html";
    });
});
