// Function to fetch and display episode data based on URL parameters
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');
    const episodeNumber = urlParams.get('ep');
    const episodeType = urlParams.get('type');

    const episodeList = getEpisodeData(animeId); // Get episode data for the given animeId

    if (episodeList) {
        const episodeData = episodeList.find(episode => episode['data-ep-num'] == episodeNumber && episode['data-ep-lan'].toLowerCase() === episodeType.toLowerCase());

        if (episodeData) {
            // Show the episode player
            loadVideoPlayer(episodeData['data-video-id']);
            displayEpisodeDetails(episodeData);
        } else {
            displayError("Episode not found!");
        }
    } else {
        displayError("Anime not found!");
    }
});

// Function to get episode data from animeneek.json
function getEpisodeData(animeId) {
    // Replace this with actual data loading from animeneek.json file
    const data = [
        // Sample JSON data
        {
            "data-mal-id": 21,
            "episodes": [
                { "data-ep-lan": "sub", "data-ep-num": 1, "data-video-id": "18524" },
                { "data-ep-lan": "dub", "data-ep-num": 1, "data-video-id": "18525" }
            ]
        },
        // More anime data...
    ];

    return data.find(anime => anime["data-mal-id"] == animeId)?.episodes;
}

// Function to load the video player with the given video ID
function loadVideoPlayer(videoId) {
    const iframe = document.getElementById('video-player');
    iframe.src = `//s3taku.one/watch?play=${videoId}`;
}

// Function to display episode details on the page
function displayEpisodeDetails(episodeData) {
    const episodeTitle = document.getElementById('episode-title');
    episodeTitle.textContent = `Episode ${episodeData['data-ep-num']} - ${episodeData['data-ep-lan'].toUpperCase()}`;

    const sourceSelection = document.getElementById('source-selection');
    const sourceButton = document.createElement('button');
    sourceButton.textContent = "Watch Now";
    sourceSelection.appendChild(sourceButton);
}

// Function to display an error message
function displayError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
}
