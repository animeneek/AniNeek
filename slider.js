document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("slider");
    const prevSlideButton = document.getElementById("prevSlide");
    const nextSlideButton = document.getElementById("nextSlide");
    const sliderDotsContainer = document.getElementById("sliderDots");
    let currentSlideIndex = 0;

    function fetchRandomAnime() {
        return fetch("https://api.jikan.moe/v4/random/anime")
            .then(response => response.json())
            .then(data => data.data)
            .catch(error => {
                console.error("Error fetching random anime:", error);
                return null;
            });
    }

    function fetchAniListImage(id) {
        const query = `
            query ($id: Int) {
                Media(id: $id) {
                    bannerImage
                }
            }
        `;
        const url = 'https://graphql.anilist.co';
        const variables = { id };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ANILIST_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        })
        .then(response => response.json())
        .then(data => data.data.Media.bannerImage)
        .catch(error => {
            console.error("Error fetching AniList image:", error);
            return null;
        });
    }

    async function createSlider() {
        const randomAnimes = [];
        for (let i = 0; i < 5; i++) {
            const anime = await fetchRandomAnime();
            if (anime) {
                const anilistImage = await fetchAniListImage(anime.mal_id);
                randomAnimes.push(anime);
                const slide = document.createElement("div");
                slide.classList.add("slide");
                slide.style.backgroundImage = `url(${anilistImage || anime.images.jpg.large_image_url})`;
                slide.addEventListener("click", () => {
                    window.location.href = `info.html?id=${anime.mal_id}`;
                });

                const slideContent = document.createElement("div");
                slideContent.classList.add("slide-content");
                slideContent.innerHTML = `
                    <h2>${anime.title}</h2>
                    <p class="anime-details">
                        <span class="detail-box">${anime.type}</span>
                        <span class="detail-box">${anime.episodes ? anime.episodes + ' EPS' : '? EPS'}</span>
                        <span class="detail-box sub">SUB</span>
                        <span class="detail-box dub">DUB</span>
                        <span class="detail-box">${anime.status === "Finished Airing" ? 'Fin' : anime.status}</span>
                    </p>
                    <p>${anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : 'No synopsis available.'}</p>
                `;
                slide.appendChild(slideContent);
                slider.appendChild(slide);

                const dot = document.createElement("span");
                dot.classList.add("slider-dot");
                dot.addEventListener("click", () => {
                    showSlide(i);
                });
                sliderDotsContainer.appendChild(dot);
            }
        }
        showSlide(currentSlideIndex);
    }

    function showSlide(index) {
        const slides = document.getElementsByClassName("slide");
        const dots = document.getElementsByClassName("slider-dot");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
            dots[i].classList.remove("active");
        }
        slides[index].style.display = "block";
        dots[index].classList.add("active");
    }

    function nextSlide() {
        const slides = document.getElementsByClassName("slide");
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }

    function prevSlide() {
        const slides = document.getElementsByClassName("slide");
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    }

    prevSlideButton.addEventListener("click", prevSlide);
    nextSlideButton.addEventListener("click", nextSlide);

    setInterval(nextSlide, 5000); // Auto slide every 5 seconds

    createSlider();
});
