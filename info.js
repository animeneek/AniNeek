document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get("id");

    if (!animeId) {
        document.getElementById("anime-title").textContent = "Anime not found.";
        return;
    }

    fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
        .then(response => response.json())
        .then(data => {
            const anime = data.data;

            document.getElementById("animePoster").src = anime.images.jpg.large_image_url;
            document.getElementById("animePortrait").src = anime.images.jpg.image_url;
            document.getElementById("animeTitle").textContent = anime.title;
            document.getElementById("animeEnglishTitle").textContent = anime.title_english || "N/A";
            document.getElementById("animeRating").textContent = anime.rating || "N/A";
            document.getElementById("animeGenre").textContent = anime.genres.map(genre => genre.name).join(", ") || "N/A";
            document.getElementById("animeThemes").textContent = anime.themes.map(theme => theme.name).join(", ") || "N/A";
            document.getElementById("animeDemographic").textContent = anime.demographics.map(demographic => demographic.name).join(", ") || "N/A";
            document.getElementById("animeSynopsis").textContent = anime.synopsis || "N/A";

            document.getElementById("animeType").textContent = anime.type || "N/A";
            document.getElementById("animeEpisodes").textContent = anime.episodes || "Unknown";
            document.getElementById("animeStatus").textContent = anime.status || "N/A";
            document.getElementById("animeAired").textContent = anime.aired.string || "N/A";
            document.getElementById("animePremiered").textContent = anime.premiered || "N/A";
            document.getElementById("animeDuration").textContent = anime.duration || "N/A";
            document.getElementById("animeScore").textContent = anime.score || "N/A";
            document.getElementById("animeStudio").textContent = anime.studios.map(studio => studio.name).join(", ") || "N/A";
            document.getElementById("animeProducers").textContent = anime.producers.map(producer => producer.name).join(", ") || "N/A";

            // Populate Sub, Dub, and Raw sections
            populateEpisodeSections(anime.episodes, "sub");
            populateEpisodeSections(anime.episodes, "dub");
            populateEpisodeSections(anime.episodes, "raw");
        })
        .catch(error => {
            console.error("Error fetching anime data:", error);
            document.getElementById("animeTitle").textContent = "Failed to load anime data.";
        });

    function populateEpisodeSections(totalEpisodes, type) {
        const episodeRangeSelect = document.getElementById(`${type}EpisodeRange`);
        const episodeFilterInput = document.getElementById(`${type}EpisodeFilter`);
        const episodeButtonsContainer = document.getElementById(`${type}EpisodeButtons`);

        if (!totalEpisodes || totalEpisodes === "Unknown") {
            episodeRangeSelect.disabled = true;
            episodeFilterInput.disabled = true;
            return;
        }

        const rangeSize = 100;
        for (let i = 1; i <= totalEpisodes; i += rangeSize) {
            const end = Math.min(i + rangeSize - 1, totalEpisodes);
            const option = document.createElement("option");
            option.value = `${i}-${end}`;
            option.textContent = `Eps ${i}-${end}`;
            episodeRangeSelect.appendChild(option);
        }

        episodeRangeSelect.addEventListener("change", function () {
            const [start, end] = episodeRangeSelect.value.split("-").map(Number);
            displayEpisodeButtons(start, end, type);
        });

        episodeFilterInput.addEventListener("input", function () {
            const episodeNumber = parseInt(episodeFilterInput.value);
            if (!isNaN(episodeNumber)) {
                displayEpisodeButtons(episodeNumber, episodeNumber, type);
            }
        });

        displayEpisodeButtons(1, Math.min(rangeSize, totalEpisodes), type);
    }

    function displayEpisodeButtons(start, end, type) {
        const episodeButtonsContainer = document.getElementById(`${type}EpisodeButtons`);
        episodeButtonsContainer.innerHTML = "";

        for (let i = start; i <= end; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.addEventListener("click", function () {
                window.location.href = `watch.html?id=${animeId}&ep=${i}&type=${type}`;
            });
            episodeButtonsContainer.appendChild(button);
        }
    }
});
