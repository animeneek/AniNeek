document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    const animeResults = document.getElementById("animeResults");

    if (!query) {
        animeResults.innerHTML = "<p>No search query provided.</p>";
        return;
    }

    fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
        .then(response => response.json())
        .then(data => {
            animeResults.innerHTML = "";
            if (data.data.length === 0) {
                animeResults.innerHTML = "<p>No results found.</p>";
                return;
            }
            data.data.forEach(anime => {
                const animeItem = document.createElement("div");
                animeItem.innerHTML = `
                    <h3>${anime.title}</h3>
                    <a href="info.html?id=${anime.mal_id}"><img src="${anime.images.jpg.image_url}" width="150"></a>
                `;
                animeResults.appendChild(animeItem);
            });
        })
        .catch(error => {
            console.error("Error fetching search results:", error);
            animeResults.innerHTML = "<p>Failed to load search results. Please try again later.</p>";
        });
});
