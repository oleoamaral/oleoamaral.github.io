
const themeButton = document.getElementById("theme-toggle");
const languageButton = document.getElementById("language-toggle");

/* Recuperar preferências */

const savedTheme = localStorage.getItem("theme") === "dark"
    ? "dark"
    : "light";

const savedLanguage = localStorage.getItem("language") === "en"
    ? "en"
    : "pt";

/* Alternar tema */

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem("theme", theme);
    updateControls();
}

/* Alternar idioma */

function setLanguage(language) {
    document.documentElement.lang =
        language === "en" ? "en" : "pt-BR";

    document.querySelectorAll("[data-pt][data-en]").forEach(element => {
        element.textContent = language === "en"
            ? element.dataset.en
            : element.dataset.pt;
    });

    localStorage.setItem("language", language);
    updateControls();
}

/* Atualizar botões e acessibilidade */

function updateControls() {
    const isDark =
        document.documentElement.dataset.theme === "dark";

    const isEnglish =
        document.documentElement.lang === "en";

    themeButton.textContent = isDark ? "☀" : "☾";

    themeButton.setAttribute(
        "aria-label",
        isEnglish
            ? (isDark ? "Activate light theme" : "Activate dark theme")
            : (isDark ? "Ativar tema claro" : "Ativar tema escuro")
    );

    themeButton.setAttribute(
        "title",
        themeButton.getAttribute("aria-label")
    );

    themeButton.setAttribute(
        "aria-pressed",
        String(isDark)
    );

    languageButton.textContent = isEnglish ? "PT" : "EN";

    languageButton.setAttribute(
        "aria-label",
        isEnglish ? "Mudar para português" : "Switch to English"
    );

    languageButton.setAttribute(
        "title",
        languageButton.getAttribute("aria-label")
    );

    const logo = document.querySelector(".site-logo");

    logo.setAttribute(
        "aria-label",
        isEnglish ? "Back to top" : "Voltar ao início"
    );

    const nav = document.querySelector(".site-nav");

    nav.setAttribute(
        "aria-label",
        isEnglish ? "Main navigation" : "Navegação principal"
    );
}

/* Eventos dos botões */

themeButton.addEventListener("click", () => {
    const currentTheme =
        document.documentElement.dataset.theme;

    setTheme(currentTheme === "dark" ? "light" : "dark");
});

languageButton.addEventListener("click", () => {
    const currentLanguage =
        document.documentElement.lang;

    setLanguage(currentLanguage === "en" ? "pt" : "en");
});

/* Aplicar preferências ao carregar */

setTheme(savedTheme);
setLanguage(savedLanguage);
