document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const downloadButton = document.getElementById("downloadButton");

    // Initially hide the loader
    loader.classList.add("hidden");

    // Show loader when the download link is clicked
    downloadButton.addEventListener("click", () => {
        loader.classList.remove("hidden");
        
        window.addEventListener("beforeunload", () => {
            loader.classList.add("hidden");  // Hide the loader when leaving the page or after the download
        });
    });
});