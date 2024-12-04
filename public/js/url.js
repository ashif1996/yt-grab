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

        const isValidVideoUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[a-zA-Z0-9_-]+(\?.*)?)$/;
        const isValidShortsUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/shorts\/[a-zA-Z0-9_-]+(\?.*)?)$/;
        const isValidCommunityPostUrl = /^(https?:\/\/)?(www\.)?(youtube\.com\/post\/[a-zA-Z0-9_-]+(\?.*)?)$/;
        
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