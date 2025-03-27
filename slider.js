document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("slider");
    const prevSlideButton = document.getElementById("prevSlide");
    const nextSlideButton = document.getElementById("nextSlide");
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

    async function createSlider() {
        const randomAnimes = [];
        for (let i = 0; i < 5; i++) {
            const anime = await fetchRandomAnime();
            if (anime) {
                randomAnimes.push(anime);
                const slide = document.createElement("div");
                slide.classList.add("slide");
                slide.style.backgroundImage = `url(${anime.images.jpg.large_image_url})`;

                const slideContent = document.createElement("div");
                slideContent.classList.add("slide-content");
                slideContent.innerHTML = `
                    <h2>${anime.title}</h2>
                    <p>${anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : 'No synopsis available.'}</p>
                    <a href="info.html?id=${anime.mal_id}" class="btn">Read More</a>
                `;
                slide.appendChild(slideContent);
                slider.appendChild(slide);
            }
        }
        showSlide(currentSlideIndex);
    }

    function showSlide(index) {
        const slides = document.getElementsByClassName("slide");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[index].style.display = "block";
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
