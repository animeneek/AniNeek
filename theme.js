document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("themeToggle");

    function applyTheme() {
        if (localStorage.getItem("theme") === "light") {
            document.body.classList.add("light-mode");
            toggleButton.textContent = "🌞";
        } else {
            document.body.classList.remove("light-mode");
            toggleButton.textContent = "🌙";
        }
    }

    toggleButton.addEventListener("click", function () {
        if (document.body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
        applyTheme();
    });

    applyTheme();
});
