document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    const page = parseInt(urlParams.get("page")) || 1;
    const animeResults = document.getElementById("animeResults");
    const pagination = document.getElementById("pagination");
    const RESULTS_PER_PAGE = 25;

    if (!query) {
        animeResults.innerHTML = "<p>No search query provided.</p>";
        return;
    }

    fetch(`https://api.jikan.moe/v4/anime?q=${query}&page=${page}&limit=${RESULTS_PER_PAGE}`)
        .then(response => response.json())
        .then(data => {
            animeResults.innerHTML = "";
            if (data.data.length === 0) {
                animeResults.innerHTML = "<p>No results found.</p>";
                return;
            }
            data.data.forEach(anime => {
                const animeItem = document.createElement("div");
                animeItem.className = "anime-item";
                animeItem.innerHTML = `
                    <a href="info.html?id=${anime.mal_id}">
                        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                    </a>
                    <div class="anime-title">${anime.title}</div>
                    <div class="anime-details">${anime.type} / ${anime.episodes} episodes</div>
                `;
                animeResults.appendChild(animeItem);
            });

            // Pagination
            const totalResults = data.pagination.items.total;
            const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
            pagination.innerHTML = "";
            for (let i = 1; i <= totalPages; i++) {
                const pageLink = document.createElement("a");
                pageLink.href = `search.html?q=${query}&page=${i}`;
                pageLink.className = "pagination-link";
                pageLink.textContent = i;
                if (i === page) {
                    pageLink.style.backgroundColor = "#555";
                }
                pagination.appendChild(pageLink);
            }
        })
        .catch(error => {
            console.error("Error fetching search results:", error);
            animeResults.innerHTML = "<p>Failed to load search results. Please try again later.</p>";
        });
});
