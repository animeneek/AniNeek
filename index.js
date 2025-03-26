document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.getElementById("searchBox");
    const searchButton = document.getElementById("searchButton");
    const randomButton = document.getElementById("randomButton");
    const themeToggle = document.getElementById("themeToggle");

    // Theme Toggle
    function updateIcons() {
        const isLightMode = document.body.classList.contains("light-mode");
        document.getElementById("searchIcon").src = isLightMode ? "public/magnifying-glass-solid_black.svg" : "public/magnifying-glass-solid_white.svg";
        document.getElementById("randomIcon").src = isLightMode ? "public/random-solid_black.svg" : "public/random-solid_white.svg";
        document.getElementById("themeIcon").src = isLightMode ? "public/sun-solid_white.svg" : "public/moon-solid_white.svg";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        updateIcons();
    });

    // Search Button
    searchButton.addEventListener("click", function () {
        const query = searchBox.value.trim();
        if (!query) return;
        window.location.href = `info.html?q=${query}`;
    });

    searchBox.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchButton.click();
        }
    });

    // Random Anime
    randomButton.addEventListener("click", function () {
        fetch("https://api.jikan.moe/v4/random/anime")
            .then(response => response.json())
            .then(data => {
                window.location.href = `info.html?id=${data.data.mal_id}`;
            });
    });

    updateIcons();
});
