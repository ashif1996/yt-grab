document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const downloadButton = document.getElementById("downloadButton");

    loader.classList.add("hidden");

    downloadButton.addEventListener("click", () => {
        loader.classList.remove("hidden");
        
        window.addEventListener("beforeunload", () => {
            loader.classList.add("hidden");
        });
    });
});