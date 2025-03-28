document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get("id");

    if (!animeId) {
        document.getElementById("anime-title").textContent = "Anime not found.";
        return;
    }

    fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
        .then(response => response.json())
        .then(animeData => {
            const anime = animeData.data;

            document.getElementById("animePoster").src = anime.images.jpg.large_image_url;
            document.getElementById("animePortrait").src = anime.images.jpg.image_url;
            document.getElementById("animeTitle").textContent = anime.title;
            document.getElementById("animeEnglishTitle").textContent = anime.title_english || "N/A";
            document.getElementById("animeRating").textContent = `Rating: ${anime.rating || "N/A"}`;
            document.getElementById("animeGenre").textContent = `Genre: ${anime.genres.map(genre => genre.name).join(", ") || "N/A"}`;
            document.getElementById("animeThemes").textContent = `Theme: ${anime.themes.map(theme => theme.name).join(", ") || "N/A"}`;
            document.getElementById("animeDemographic").textContent = `Demographic: ${anime.demographics.map(demographic => demographic.name).join(", ") || "N/A"}`;
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

            // Load episode data from animeneek.json
            fetch("animeneek.json")
                .then(response => response.json())
                .then(episodeData => {
                    const animeEpisodes = episodeData.find(item => item["data-mal-id"] == animeId)?.episodes || [];
                    populateEpisodeSections(animeEpisodes, "Sub");
                    populateEpisodeSections(animeEpisodes, "Dub");
                    populateEpisodeSections(animeEpisodes, "Raw");
                })
                .catch(error => {
                    console.error("Error fetching episode data:", error);
                });

            // Fetch related entries
            fetchRelatedEntries(anime);
        })
        .catch(error => {
            console.error("Error fetching anime data:", error);
            document.getElementById("animeTitle").textContent = "Failed to load anime data.";
        });

    function populateEpisodeSections(episodes, type) {
        const episodeRangeSelect = document.getElementById(`${type.toLowerCase()}EpisodeRange`);
        const episodeFilterInput = document.getElementById(`${type.toLowerCase()}EpisodeFilter`);
        const episodeButtonsContainer = document.getElementById(`${type.toLowerCase()}EpisodeButtons`);

        const filteredEpisodes = episodes.filter(ep => ep["data-ep-lan"] === type);

        if (filteredEpisodes.length === 0) {
            episodeRangeSelect.disabled = true;
            episodeFilterInput.disabled = true;
            episodeButtonsContainer.innerHTML = "<p>No episodes available.</p>";
            return;
        }

        const rangeSize = 100;
        for (let i = 0; i < filteredEpisodes.length; i += rangeSize) {
            const end = Math.min(i + rangeSize, filteredEpisodes.length);
            const option = document.createElement("option");
            option.value = `${i + 1}-${end}`;
            option.textContent = `Eps ${i + 1}-${end}`;
            episodeRangeSelect.appendChild(option);
        }

        episodeRangeSelect.addEventListener("change", function () {
            const [start, end] = episodeRangeSelect.value.split("-").map(Number);
            displayEpisodeButtons(filteredEpisodes.slice(start - 1, end), type);
        });

        episodeFilterInput.addEventListener("input", function () {
            const episodeNumber = episodeFilterInput.value;
            const filtered = filteredEpisodes.filter(ep => ep["data-ep-num"].toString().includes(episodeNumber));
            displayEpisodeButtons(filtered, type);
        });

        displayEpisodeButtons(filteredEpisodes.slice(0, rangeSize), type);
    }

    function displayEpisodeButtons(episodes, type) {
        const episodeButtonsContainer = document.getElementById(`${type.toLowerCase()}EpisodeButtons`);
        episodeButtonsContainer.innerHTML = "";

        episodes.forEach(ep => {
            const button = document.createElement("button");
            button.textContent = ep["data-ep-num"];
            button.addEventListener("click", function () {
                window.location.href = `watch.html?id=${animeId}&ep=${ep["data-ep-num"]}&type=${type.toLowerCase()}`;
            });
            episodeButtonsContainer.appendChild(button);
        });
    }

    function fetchRelatedEntries(anime) {
        const relatedEntriesList = document.getElementById("relatedEntriesList");
        const relatedTypes = ["Prequel", "Sequel", "Side story", "Spin-off", "Adaptation", "Summary", "Alternative version", "Other"];

        relatedEntriesList.innerHTML = ""; // Clear any existing entries

        relatedTypes.forEach(type => {
            if (anime.relations && anime.relations.length > 0) {
                anime.relations.forEach(relation => {
                    if (relation.type === type) {
                        relation.entry.forEach(entry => {
                            const listItem = document.createElement("li");
                            listItem.textContent = `${relation.type}: ${entry.name}`;
                            relatedEntriesList.appendChild(listItem);
                        });
                    }
                });
            }
        });
    }
});
