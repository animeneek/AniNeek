document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("slider");
    const prevSlideButton = document.getElementById("prevSlide");
    const nextSlideButton = document.getElementById("nextSlide");
    const sliderDotsContainer = document.getElementById("sliderDots");
    let currentSlideIndex = 0;

    async function fetchRandomAnime() {
        const query = `
            query {
                Media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
                    id
                    title {
                        romaji
                        english
                        native
                    }
                    coverImage {
                        extraLarge
                        large
                        medium
                        color
                    }
                    bannerImage
                    description(asHtml: true)
                    episodes
                    format
                    status
                }
            }
        `;
        const url = 'https://graphql.anilist.co';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ANILIST_ACCESS_TOKEN}`
            },
            body: JSON.stringify({ query })
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data.data.Media;
        } catch (error) {
            console.error('Error fetching random anime:', error);
            return null;
        }
    }

    async function createSlider() {
        const randomAnimes = [];
        for (let i = 0; i < 5; i++) {
            const anime = await fetchRandomAnime();
            if (anime) {
                randomAnimes.push(anime);
                const slide = document.createElement("div");
                slide.classList.add("slide");
                slide.style.backgroundImage = `url(${anime.bannerImage || anime.coverImage.extraLarge})`;
                slide.addEventListener("click", () => {
                    window.location.href = `info.html?id=${anime.id}`;
                });

                const slideContent = document.createElement("div");
                slideContent.classList.add("slide-content");
                slideContent.innerHTML = `
                    <h2>${anime.title.romaji}</h2>
                    <p class="anime-details">
                        <span class="detail-box">${anime.format}</span>
                        <span class="detail-box">${anime.episodes ? anime.episodes + ' EPS' : '? EPS'}</span>
                        <span class="detail-box sub">SUB</span>
                        <span class="detail-box dub">DUB</span>
                        <span class="detail-box">${anime.status === "FINISHED" ? 'Fin' : anime.status}</span>
                    </p>
                    <p>${anime.description ? anime.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + '...' : 'No synopsis available.'}</p>
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
