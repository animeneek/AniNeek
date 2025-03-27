document.addEventListener("DOMContentLoaded", function () {
    const tabButtons = document.querySelectorAll(".tab-button");
    const animeListContainer = document.getElementById("animeList");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const currentPageDisplay = document.getElementById("currentPage");

    let currentPage = 1;
    let currentTab = "newest";

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentTab = button.getAttribute("data-tab");
            currentPage = 1;
            fetchAnimeList();
        });
    });

    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1
