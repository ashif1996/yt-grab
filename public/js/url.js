document.addEventListener("DOMContentLoaded", () => {
    const displayErrors = (fieldId, message) => {
        const errorElement = document.getElementById(`${fieldId}Error`);
        const inputElement = document.getElementById(fieldId);

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (inputElement) {
            inputElement.classList.add('error-border');
        }
    };

    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach((error) => {
            error.textContent = '';
        });

        document.querySelectorAll('.error-border').forEach((input) => {
            input.classList.remove('error-border');
        });
    };

    const validateUrlForm = () => {
        const urlInput = document.getElementById("urlInput").value.trim();

        let isValid = true;

        clearErrors();

        const isValidVideoUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_=-]*)*|youtu\.be\/[a-zA-Z0-9_-]+(\?.*)?)$/;
        const isValidShortsUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/shorts\/[a-zA-Z0-9_-]+(\?.*)?)$/i;
        const isValidCommunityPostUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/[a-zA-Z0-9_-]+\/community(\?.*)?)|(post\/[a-zA-Z0-9_-]+(\?.*)?))$/i;

        if (!isValidVideoUrl.test(urlInput) && !isValidShortsUrl.test(urlInput) && !isValidCommunityPostUrl.test(urlInput)) {
            displayErrors("urlInput", "Please provide a valid YouTube URL.");
            isValid = false;
        }

        return isValid;
    };

    const urlForm = document.getElementById("urlForm");
    if (urlForm) {
        urlForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const isValidForm = validateUrlForm();
            if (isValidForm) {
                urlForm.submit();
            }
        });
    }
});