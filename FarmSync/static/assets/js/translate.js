function googleTranslateElementInit() {
    new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'hi', autoDisplay: false }, 'google_translate_element');
}

function changeFontToHindi() {
    document.body.style.fontFamily = 'YourHindiFont, Arial, sans-serif'; // Replace 'YourHindiFont' with the actual name of the Hindi font you want to use
}

function onLanguageChange() {
    const selectElement = document.querySelector('.goog-te-combo');
    selectElement.addEventListener('change', function () {
        const selectedLanguage = this.value;
        if (selectedLanguage === 'hi') {
            changeFontToHindi();
        } else {
            document.body.style.fontFamily = ''; // Reset font family if the selected language is not Hindi
        }
    });
}

window.onload = function () {
    onLanguageChange();
};