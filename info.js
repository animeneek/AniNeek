document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get("id");

    if (!malId) {
        document.getElementById("anime-title").innerText = "Anime ID not found.";
        return;
    }

    // Fetch anime details from Jikan API
    fetch(`https://api.jikan.moe/v4/anime/${malId}`)
        .then((response) => response.json())
        .then((data) => {
            const anime = data.data;
            document.getElementById("anime-title").innerText = anime.title;
            document.getElementById("anime-image").src = anime.images.jpg.large_image_url;
            document.getElementById("anime-synopsis").innerText = anime.synopsis;
            document.getElementById("anime-score").innerText = anime.score;
            document.getElementById("anime-genres").innerText = anime.genres.map(g => g.name).join(", ");
        })
        .catch(() => {
            document.getElementById("anime-title").innerText = "Error loading anime data.";
        });

    // Fetch episodes from animeneek.json
    fetch("animeneek.json")
        .then((response) => response.json())
        .then((data) => {
            const animeData = data.find(item => item["data-mal-id"] == malId);
            const episodeList = document.getElementById("episode-list");

            if (!animeData) {
                episodeList.innerText = "No episodes found.";
                return;
            }

            episodeList.innerHTML = "";
            animeData.episodes.forEach(ep => {
                const epButton = document.createElement("button");
                epButton.innerText = `Episode ${ep["data-ep-num"]} (${ep["data-ep-lan"]})`;
                epButton.onclick = () => {
                    window.location.href = `watch.html?id=${malId}&ep=${ep["data-ep-num"]}&type=${ep["data-ep-lan"].toLowerCase()}`;
                };
                episodeList.appendChild(epButton);
            });
        })
        .catch(() => {
            document.getElementById("episode-list").innerText = "Error loading episodes.";
        });
});
