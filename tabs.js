document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-button");
    const animeListContainer = document.getElementById("animeList");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const currentPageDisplay = document.getElementById("currentPage");

    let currentPage = 1;
    let currentTab = "newest";

    tabButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentTab = button.getAttribute("data-tab");
            currentPage = 1;
            fetchAnimeList();
        });
    });

    prevPageButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            fetchAnimeList();
        }
    });

    nextPageButton.addEventListener("click", (event) => {
        event.preventDefault();
        currentPage++;
        fetchAnimeList();
    });

    async function fetchAnimeList() {
        animeListContainer.innerHTML = ''; // Clear previous anime list
        currentPageDisplay.textContent = currentPage; // Update current page display
        let url = '';
        switch (currentTab) {
            case "newest":
                url = `https://api.jikan.moe/v4/seasons/now?page=${currentPage}`;
                break;
            case "popular":
                url = `https://api.jikan.moe/v4/top/anime?page=${currentPage}`;
                break;
            case "top-rated":
                url = `https://api.jikan.moe/v4/top/anime?type=tv&page=${currentPage}`;
                break;
        }

        const response = await fetch(url);
        const data = await response.json();
        const animeList = data.data;

        animeList.forEach(anime => {
            const animeItem = document.createElement("div");
            animeItem.classList.add("anime-item");

            // Determine if the anime has SUB, DUB, or RAW
            const sub = anime.sub ? 'SUB' : '';
            const dub = anime.dub ? 'DUB' : '';
            const raw = anime.raw ? 'RAW' : '';

            // Combine details into a single string
            const details = [
                anime.type,
                anime.episodes ? `${anime.episodes} EPS` : '? EPS',
                sub,
                dub,
                raw,
                anime.status === 'Finished Airing' ? 'Fin' : ''
            ].filter(detail => detail).join(', ');

            animeItem.innerHTML = `
                <div class="poster-container">
                    <img class="anime-poster" src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
                    <div class="overlay">
                        <div class="play-button">&#9654;</div>
                    </div>
                </div>
                <div class="anime-title">${anime.title}</div>
                <div class="anime-details">${details}</div>
            `;

            animeItem.addEventListener("click", () => {
                window.location.href = `info.html?id=${anime.mal_id}`;
            });

            animeListContainer.appendChild(animeItem);
        });
    }

    // Fetch initial anime list for the default tab
    fetchAnimeList();
});
