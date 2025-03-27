function initializeSearchAndRandom() {
    const searchButton = document.getElementById("searchButton");
    const randomButton = document.getElementById("randomButton");
    const searchBox = document.getElementById("searchBox");

    searchButton.addEventListener("click", () => {
        const query = searchBox.value;
        if (query) {
            window.location.href = `search.html?q=${query}`;
        }
    });

    randomButton.addEventListener("click", () => {
        fetchRandomAnime().then(anime => {
            if (anime) {
                window.location.href = `info.html?id=${anime.mal_id}`;
            }
        });
    });

    searchBox.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchBox.value;
            if (query) {
                window.location.href = `search.html?q=${query}`;
            }
        }
    });
}

function fetchRandomAnime() {
    return fetch("https://api.jikan.moe/v4/random/anime")
        .then(response => response.json())
        .then(data => data.data)
        .catch(error => {
            console.error("Error fetching random anime:", error);
            return null;
        });
}
