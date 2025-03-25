document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get("id");
    const episodeNum = urlParams.get("ep");
    const type = urlParams.get("type");

    if (!malId || !episodeNum || !type) {
        document.body.innerHTML = "<h1>Invalid episode link.</h1>";
        return;
    }

    // Fetch anime details from Jikan API
    fetch(`https://api.jikan.moe/v4/anime/${malId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("anime-title").innerText = data.data.title;
            document.getElementById("episode-title").innerText = `Episode ${episodeNum} (${type.toUpperCase()})`;
        });

    // Fetch episode links from animeneek.json
    fetch("animeneek.json")
        .then(response => response.json())
        .then(data => {
            const animeData = data.find(item => item["data-mal-id"] == malId);
            const episodeList = animeData ? animeData.episodes : [];

            // Find the requested episode
            const episode = episodeList.find(ep => ep["data-ep-num"] == episodeNum && ep["data-ep-lan"].toLowerCase() === type);

            if (!episode) {
                document.body.innerHTML = "<h1>Episode not found.</h1>";
                return;
            }

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
        .catch(() => {
            document.body.innerHTML = "<h1>Error loading episode data.</h1>";
        });
});
