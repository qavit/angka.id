import * as state from './modules/state.js';
import { renderHomePage, renderUnitSelectionPage, renderExercisePage, updateContent } from './modules/ui.js';

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
    document.getElementById('settings-btn').addEventListener('click', renderSettingsPage);

    document.querySelectorAll('.btn-lang').forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.dataset.lang;
            if (state.currentLanguage !== selectedLang) {
                state.setLanguage(selectedLang);
                handlePageUpdate(); // Re-render the current page with the new language
            }
        });
    });

    // 3. Render the initial page (Home Page)
    renderHomePage();

    // 4. Initial content update to set the default language text
    updateContent();
}

// Start the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);
