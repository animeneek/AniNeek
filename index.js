function initializeSearchAndRandom() {
    const searchBox = document.getElementById("searchBox");
    const searchButton = document.getElementById("searchButton");
    const randomButton = document.getElementById("randomButton");

    // Search Function
    searchButton.addEventListener("click", function () {
        searchAnime();
    });

    searchBox.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchAnime();
        }
    });

    function searchAnime() {
        const query = searchBox.value.trim();
        if (!query) return;
        window.location.href = `search.html?q=${query}`;
    }

    // Random Anime Function
    randomButton.addEventListener("click", function () {
        fetch("https://api.jikan.moe/v4/random/anime")
            .then(response => response.json())
            .then(data => {
                window.location.href = `info.html?id=${data.data.mal_id}`;
            })
            .catch(error => {
                console.error("Error fetching random anime:", error);
            });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initializeSearchAndRandom();
});
