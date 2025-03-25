document.addEventListener("DOMContentLoaded", function () {
    const animeTitle = document.getElementById("anime-title");
    const animeImage = document.getElementById("anime-image");
    const animeSynopsis = document.getElementById("anime-synopsis");
    const animeScore = document.getElementById("anime-score");
    const animeGenres = document.getElementById("anime-genres");
    const episodeList = document.getElementById("episode-list");

    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get("id");

    // Fetch anime data from Jikan API
    fetch(`https://api.jikan.moe/v4/anime/${malId}`)
        .then(response => response.json())
        .then(data => {
            const anime = data.data;
            animeTitle.textContent = anime.title;
            animeImage.src = anime.images.jpg.image_url;
            animeSynopsis.textContent = anime.synopsis;
            animeScore.textContent = anime.score;
            animeGenres.textContent = anime.genres.map(genre => genre.name).join(", ");
        })
        .catch(error => {
            console.error("Error fetching anime data:", error);
            animeTitle.textContent = "Error loading anime details.";
        });

    // Fetch episode links from animeneek.json
    fetch("animeneek.json")
        .then(response => response.json())
        .then(json => {
            const animeEpisodes = json.find(item => item["data-mal-id"] == malId);

            if (animeEpisodes) {
                let episodeLinksHtml = "";
                animeEpisodes.episodes.forEach(episode => {
                    episodeLinksHtml += `
                        <div>
                            <h4>Episode ${episode["data-ep-num"]} - ${episode["data-ep-lan"]}</h4>
                            <a href="watch.html?id=${malId}&ep=${episode["data-ep-num"]}&type=${episode["data-ep-lan"].toLowerCase()}">
                                Watch Episode
                            </a>
                        </div>
                    `;
                });
                episodeList.innerHTML = episodeLinksHtml;
            } else {
                episodeList.innerHTML = `<p>No episodes found for this anime.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching episode links:", error);
            episodeList.innerHTML = "<p>Failed to load episodes. Please try again later.</p>";
        });
});
