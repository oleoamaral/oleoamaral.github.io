
const themeButton = document.getElementById("theme-toggle");
const languageButton = document.getElementById("language-toggle");

/* Recuperar preferências */

const savedTheme = localStorage.getItem("theme") || "light";
const savedLanguage = localStorage.getItem("language") || "pt";

/* Alternar tema */

function setTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.dataset.theme = theme;

    themeButton.textContent = isDark ? "☀" : "☾";

    themeButton.setAttribute(
        "aria-pressed",
        String(isDark)
    );

    themeButton.setAttribute(
        "aria-label",
        isDark ? "Ativar tema claro" : "Ativar tema escuro"
    );

    themeButton.setAttribute(
        "title",
        isDark ? "Ativar tema claro" : "Ativar tema escuro"
    );

    localStorage.setItem("theme", theme);
}

/* Alternar idioma */

function setLanguage(language) {
    const isEnglish = language === "en";

    document.documentElement.lang = isEnglish ? "en" : "pt-BR";

    document.querySelectorAll("[data-pt][data-en]").forEach(element => {
        element.textContent = isEnglish
            ? element.dataset.en
            : element.dataset.pt;
    });

    languageButton.textContent = isEnglish ? "PT" : "EN";

    languageButton.setAttribute(
        "aria-label",
        isEnglish ? "Mudar para português" : "Switch to English"
    );

    localStorage.setItem("language", language);
}

/* Eventos dos botões */

themeButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;

    setTheme(currentTheme === "dark" ? "light" : "dark");
});

languageButton.addEventListener("click", () => {
    const currentLanguage = document.documentElement.lang;

    setLanguage(currentLanguage === "en" ? "pt" : "en");
});

/* Aplicar preferências ao carregar */

setTheme(savedTheme);
setLanguage(savedLanguage);
