export let currentLanguage = "id";
export let useKaTeX = true;
export let currentProblem = null;
export let translations = {}; // Will be loaded from JSON

export function setLanguage(lang) {
    currentLanguage = lang;
}

export function setUseKaTeX(value) {
    useKaTeX = value;
}

export function setCurrentProblem(problem) {
    currentProblem = problem;
}

export async function loadTranslations() {
    try {
        const response = await fetch('src/data/translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
    } catch (error) {
        console.error("Could not load translations:", error);
    }
}
