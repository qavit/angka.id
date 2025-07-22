import * as state from './modules/state.js';
import { renderHomePage, renderUnitSelectionPage, renderExercisePage, renderSettingsPage, updateContent } from './modules/ui.js';

// Function to handle dynamic page updates after language change
function handlePageUpdate() {
    const exerciseContainer = document.getElementById('exercise-container');
    const unitSelection = document.querySelector('.card h3[data-lang-key="unitArithmetic"]'); // A way to check if we are on the unit selection page

    if (exerciseContainer) {
        const currentUnitId = exerciseContainer.dataset.unitId;
        renderExercisePage(currentUnitId);
    } else if (unitSelection) {
        renderUnitSelectionPage();
    } else {
        renderHomePage();
    }
}

// Main initialization function
async function initialize() {
    // 1. Load translations
    await state.loadTranslations();

    // 2. Set up language selection listeners
    const langDropdownBtn = document.getElementById('lang-dropdown-btn');
    const langDropdownMenu = document.getElementById('lang-dropdown-menu');

    if (langDropdownBtn && langDropdownMenu) {
        langDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click from closing immediately
            langDropdownMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (event) => {
            if (!langDropdownMenu.contains(event.target) && !langDropdownBtn.contains(event.target)) {
                langDropdownMenu.classList.add('hidden');
            }
        });

        langDropdownMenu.querySelectorAll('a[data-lang]').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const selectedLang = link.dataset.lang;
                if (state.currentLanguage !== selectedLang) {
                    state.setLanguage(selectedLang);
                    handlePageUpdate();
                }
                langDropdownMenu.classList.add('hidden'); // Close dropdown after selection
            });
        });
    }

    document.getElementById('settings-btn').addEventListener('click', renderSettingsPage);

    // 3. Render the initial page (Home Page)
    renderHomePage();

    // 4. Initial content update to set the default language text
    updateContent();

    // Set active class for the current language in the dropdown
    const currentLangLink = document.querySelector(`#lang-dropdown-menu a[data-lang="${state.currentLanguage}"]`);
    if (currentLangLink) {
        currentLangLink.classList.add('active');
    }
}

// Start the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);
