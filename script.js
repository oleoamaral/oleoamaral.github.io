
/* ========================================
   ELEMENTOS
======================================== */

const themeButton = document.getElementById("theme-toggle");
const languageButton = document.getElementById("language-toggle");

const navLinks = document.querySelectorAll(".site-nav a");
const logo = document.querySelector(".site-logo");
const nav = document.querySelector(".site-nav");


/* ========================================
   PREFERÊNCIAS SALVAS
======================================== */

function getSavedPreference(key, fallback) {
    try {
        return localStorage.getItem(key) || fallback;
    } catch (error) {
        return fallback;
    }
}

function savePreference(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        // O site continua funcionando sem armazenamento.
    }
}

const savedTheme =
    getSavedPreference("theme", "light") === "dark"
        ? "dark"
        : "light";

const savedLanguage =
    getSavedPreference("language", "pt") === "en"
        ? "en"
        : "pt";


/* ========================================
   TEMA
======================================== */

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;

    savePreference("theme", theme);
    updateControls();
}


/* ========================================
   IDIOMA
======================================== */

function setLanguage(language) {
    const isEnglish = language === "en";

    document.documentElement.lang =
        isEnglish ? "en" : "pt-BR";

    document.querySelectorAll("[data-pt][data-en]").forEach(element => {
        element.textContent = isEnglish
            ? element.dataset.en
            : element.dataset.pt;
    });

    savePreference("language", language);
    updateControls();
}


/* ========================================
   ATUALIZAR CONTROLES
======================================== */

function updateControls() {
    const isDark =
        document.documentElement.dataset.theme === "dark";

    const isEnglish =
        document.documentElement.lang === "en";

    themeButton.textContent = isDark ? "☀" : "☾";

    const themeLabel = isEnglish
        ? (isDark ? "Activate light theme" : "Activate dark theme")
        : (isDark ? "Ativar tema claro" : "Ativar tema escuro");

    themeButton.setAttribute("aria-label", themeLabel);
    themeButton.setAttribute("title", themeLabel);
    themeButton.setAttribute("aria-pressed", String(isDark));

    languageButton.textContent = isEnglish ? "PT" : "EN";

    const languageLabel = isEnglish
        ? "Mudar para português"
        : "Switch to English";

    languageButton.setAttribute("aria-label", languageLabel);
    languageButton.setAttribute("title", languageLabel);

    logo.setAttribute(
        "aria-label",
        isEnglish ? "Back to top" : "Voltar ao início"
    );

    nav.setAttribute(
        "aria-label",
        isEnglish ? "Main navigation" : "Navegação principal"
    );
}


/* ========================================
   INDICADOR DA SEÇÃO ATIVA
======================================== */

function setActiveSection(sectionId) {
    navLinks.forEach(link => {
        const isActive =
            link.getAttribute("href") === `#${sectionId}`;

        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function updateActiveSection() {
    const sections = [
        document.getElementById("sobre"),
        document.getElementById("projetos"),
        document.getElementById("contato")
    ];

    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;

    /* Nenhum link ativo no início */

    if (scrollPosition < 60) {
        setActiveSection(null);
        return;
    }

    /* Contato ativo no fim da página */

    const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 5;

    if (reachedBottom) {
        setActiveSection("contato");
        return;
    }

    /* Detectar seção atual */

    const referencePosition =
        scrollPosition + viewportHeight * 0.35;

    let activeSection = null;

    sections.forEach(section => {
        if (section && section.offsetTop <= referencePosition) {
            activeSection = section.id;
        }
    });

    setActiveSection(activeSection);
}


/* ========================================
   EVENTOS
======================================== */

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

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        const sectionId = link.getAttribute("href").slice(1);

        setActiveSection(sectionId);
    });
});

logo.addEventListener("click", () => {
    setActiveSection(null);
});

window.addEventListener("scroll", updateActiveSection, {
    passive: true
});

window.addEventListener("resize", updateActiveSection);


/* ========================================
   ONDA MODULADA EM AMPLITUDE (AM)
   Separador acima do rodapé
======================================== */

function drawAMWave() {
    const amWave = document.getElementById("am-wave");

    if (!amWave) {
        return;
    }

    const points = [];

    const width = 120;
    const centerY = 20;
    const steps = 360;

    const carrierCycles = 12;

    for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * width;

        /*
           Envelope de amplitude:
           menor nas extremidades,
           maior na região central.
        */

        const envelope =
            3 + 13 * Math.pow(
                Math.sin(Math.PI * x / width),
                2
            );

        /*
           Portadora de alta frequência.
        */

        const carrier =
            Math.sin(
                (2 * Math.PI * carrierCycles * x) / width
            );

        /*
           Sinal AM.
        */

        const y = centerY - envelope * carrier;

        points.push(
            `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`
        );
    }

    amWave.setAttribute("d", points.join(" "));
}


/* ========================================
   INICIALIZAÇÃO
======================================== */

setTheme(savedTheme);
setLanguage(savedLanguage);

drawAMWave();
updateActiveSection();
