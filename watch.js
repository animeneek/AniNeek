document.addEventListener("DOMContentLoaded", function () {
    const episodeTitle = document.getElementById("episode-title");
    const videoPlayer = document.getElementById("video-player");
    const sourceSelection = document.getElementById("source-selection");

    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get("id");
    const episodeNum = urlParams.get("ep");
    const type = urlParams.get("type");

    // Fetch episode data from animeneek.json
    fetch("animeneek.json")
        .then(response => response.json())
        .then(json => {
            const animeEpisodes = json.find(item => item["data-mal-id"] == malId);

            if (animeEpisodes) {
                const episode = animeEpisodes.episodes.find(ep => ep["data-ep-num"] == episodeNum && ep["data-ep-lan"].toLowerCase() === type.toLowerCase());

                if (episode) {
                    episodeTitle.textContent = `Episode ${episodeNum} - ${type}`;
                    
                    // Create video player iframe for the selected episode
                    const videoLink = `//s3taku.one/watch?play=${episode["data-video-id"]}`;
                    videoPlayer.innerHTML = `<iframe src="${videoLink}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;

                    // Create source selection buttons
                    const sources = ["sub", "dub", "raw"];
                    sources.forEach(source => {
                        const button = document.createElement("button");
                        button.textContent = source.charAt(0).toUpperCase() + source.slice(1);
                        button.addEventListener("click", () => changeSource(source));
                        sourceSelection.appendChild(button);
                    });
                } else {
                    episodeTitle.textContent = "Episode not found.";
                    videoPlayer.innerHTML = "<p>Sorry, we couldn't find the episode.</p>";
                }
            } else {
                episodeTitle.textContent = "Anime not found.";
                videoPlayer.innerHTML = "<p>Sorry, we couldn't find the anime details.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching episode data:", error);
            episodeTitle.textContent = "Error loading episode.";
            videoPlayer.innerHTML = "<p>Failed to load episode. Please try again later.</p>";
        });

    // Change the source (sub, dub, raw)
    function changeSource(source) {
        const episode = animeEpisodes.episodes.find(ep => ep["data-ep-num"] == episodeNum && ep["data-ep-lan"].toLowerCase() === source.toLowerCase());
        if (episode) {
            const videoLink = `//s3taku.one/watch?play=${episode["data-video-id"]}`;
            videoPlayer.innerHTML = `<iframe src="${videoLink}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
        }
    }
});
