document.addEventListener("DOMContentLoaded", function () {
    const animeListDiv = document.getElementById("animeList");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    let currentPage = 1;

    function loadAnimeList(page) {
        fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`)
            .then(response => response.json())
            .then(data => {
                animeListDiv.innerHTML = "";
                data.data.forEach(anime => {
                    const animeItem = document.createElement("div");
                    animeItem.innerHTML = `
                        <h3>${anime.title}</h3>
                        <a href="info.html?id=${anime.mal_id}">
                            <img src="${anime.images.jpg.image_url}" width="150">
                        </a>
                    `;
                    animeListDiv.appendChild(animeItem);
                });
            })
            .catch(error => console.error("Error loading anime list:", error));
    }

    // Load first page
    loadAnimeList(currentPage);

    // Pagination
    prevPageBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            loadAnimeList(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", function () {
        currentPage++;
        loadAnimeList(currentPage);
    });
});
