document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    const page = parseInt(urlParams.get("page")) || 1;
    const animeResults = document.getElementById("animeResults");
    const pagination = document.getElementById("pagination");
    const searchTitle = document.getElementById("searchTitle");
    const RESULTS_PER_PAGE = 25;

    if (!query) {
        animeResults.innerHTML = "<p>No search query provided.</p>";
        return;
    }

    searchTitle.innerText = `Results for: ${query}`;

    fetch(`https://api.jikan.moe/v4/anime?q=${query}&page=${page}&limit=${RESULTS_PER_PAGE}`)
        .then(response => response.json())
        .then(data => {
            animeResults.innerHTML = "";
            if (data.data.length === 0) {
                animeResults.innerHTML = "<p>No results found.</p>";
                return;
            }
            data.data.forEach(anime => {
                const episodes = anime.episodes !== null ? `${anime.episodes} EPS` : "? EPS";
                const status = anime.status === "Finished Airing" ? "Fin" : anime.status === "Currently Airing" ? "Airing" : "Soon";
                const animeItem = document.createElement("div");
                animeItem.className = "anime-item";
                animeItem.innerHTML = `
                    <a href="info.html?id=${anime.mal_id}">
                        <div class="poster-container">
                            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-poster">
                            <div class="overlay"></div>
                            <div class="play-button"><i class="fa-solid fa-play"></i></div>
                        </div>
                    </a>
                    <div class="anime-title">${anime.title}</div>
                    <div class="anime-details">
                        <span class="detail-box">${anime.type}</span>
                        <span class="detail-box">${anime.year}</span>
                        <span class="detail-box">${episodes}</span>
                        <span class="detail-box">${status}</span>
                    </div>
                `;
                animeResults.appendChild(animeItem);
            });

            // Pagination
            const totalResults = data.pagination.items.total;
            const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
            pagination.innerHTML = "";
            if (page > 1) {
                const prevLink = document.createElement("a");
                prevLink.href = `search.html?q=${query}&page=${page - 1}`;
                prevLink.className = "pagination-link";
                prevLink.textContent = "<";
                pagination.appendChild(prevLink);
            }
            for (let i = page - 2; i <= page + 2; i++) {
                if (i > 0 && i <= totalPages) {
                    const pageLink = document.createElement("a");
                    pageLink.href = `search.html?q=${query}&page=${i}`;
                    pageLink.className = "pagination-link";
                    pageLink.textContent = i;
                    if (i === page) {
                        pageLink.style.backgroundColor = "#555";
                    }
                    pagination.appendChild(pageLink);
                }
            }
            if (page < totalPages) {
                const nextLink = document.createElement("a");
                nextLink.href = `search.html?q=${query}&page=${page + 1}`;
                nextLink.className = "pagination-link";
                nextLink.textContent = ">";
                pagination.appendChild(nextLink);
            }
        })
        .catch(error => {
            console.error("Error fetching search results:", error);
            animeResults.innerHTML = "<p>Failed to load search results. Please try again later.</p>";
        });
});
