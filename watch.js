document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get("id");
    const episodeNum = urlParams.get("ep");
    const type = urlParams.get("type");

    if (!malId || !episodeNum || !type) {
        document.body.innerHTML = "<h1>Invalid episode link.</h1>";
        return;
    }

    console.log(`Fetching anime data for MAL ID: ${malId}, Episode: ${episodeNum}, Type: ${type}`);

    // Fetch anime details from Jikan API
    fetch(`https://api.jikan.moe/v4/anime/${malId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("anime-title").innerText = data.data.title;
            document.getElementById("episode-title").innerText = `Episode ${episodeNum} (${type.toUpperCase()})`;
        })
        .catch(error => {
            console.error("Error fetching anime data:", error);
        });

    // Fetch episode links from animeneek.json
    fetch("animeneek.json")
        .then(response => response.json())
        .then(data => {
            console.log("Loaded animeneek.json:", data); // Debugging log

            const animeData = data.find(item => item["data-mal-id"] == malId);
            if (!animeData) {
                console.warn("Anime ID not found in JSON:", malId);
                document.body.innerHTML = "<h1>Anime not found.</h1>";
                return;
            }

            const episode = animeData.episodes.find(ep => ep["data-ep-num"] == episodeNum && ep["data-ep-lan"].toLowerCase() === type);
            if (!episode) {
                console.warn("Episode not found in JSON:", episodeNum, type);
                document.body.innerHTML = "<h1>Episode not found.</h1>";
                return;
            }

            console.log("Found Episode Data:", episode); // Debugging log

            // Generate embed link based on source
            const videoId = episode["data-video-id"];
            let embedUrl = "";

            if (episode["data-src"] === "anime") {
                embedUrl = `//s3taku.one/watch?play=${videoId}`;
            } else if (episode["data-src"] === "streamtape") {
                embedUrl = `//streamtape.com/e/${videoId}`;
            } else if (episode["data-src"] === "mp4upload") {
                embedUrl = `//mp4upload.com/v/${videoId}`;
            }

            if (!embedUrl) {
                console.error("Embed URL not generated.");
                document.body.innerHTML = "<h1>Embed URL missing.</h1>";
                return;
            }

            console.log("Embed URL:", embedUrl); // Debugging log

            // Set video player source
            document.getElementById("video-player").src = embedUrl;

            // Generate source selection buttons
            const sourceButtons = document.getElementById("source-buttons");
            sourceButtons.innerHTML = "";

            if (episode["data-src"] === "anime") {
                const btn1 = document.createElement("button");
                btn1.innerText = "Source 1";
                btn1.onclick = () => {
                    document.getElementById("video-player").src = `//s3taku.one/watch?play=${videoId}`;
                };
                sourceButtons.appendChild(btn1);

                const btn2 = document.createElement("button");
                btn2.innerText = "Source 2";
                btn2.onclick = () => {
                    document.getElementById("video-player").src = `//s3taku.one/watch?play=${videoId}&sv=1`;
                };
                sourceButtons.appendChild(btn2);
            }
        })
        .catch(error => {
            console.error("Error loading animeneek.json:", error);
            document.body.innerHTML = "<h1>Error loading episode data.</h1>";
        });
});
