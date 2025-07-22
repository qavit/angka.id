import * as state from './state.js';
import * as problems from './problems.js';

const appContent = document.getElementById('app-content');
const EPSILON = Number.EPSILON * 100;

const units = {
    "additionSubtraction": { type: "arithmetic", problemGenerator: problems.generateAdditionSubtractionProblem, langKey: "unitAdditionSubtraction", descLangKey: "descriptionAdditionSubtraction" },
    "multiplicationDivision": { type: "arithmetic", problemGenerator: problems.generateMultiplicationDivisionProblem, langKey: "unitMultiplicationDivision", descLangKey: "descriptionMultiplicationDivision" },
    "fractionsDecimals": { type: "arithmetic", problemGenerator: problems.generateFractionsDecimalsProblem, langKey: "unitFractionsDecimals", descLangKey: "descriptionFractionsDecimals" },
    "fractionsOperations": { type: "arithmetic", problemGenerator: problems.generateFractionsOperationsProblem, langKey: "unitFractionsOperations", descLangKey: "descriptionFractionsOperations" },
    "decimalOperations": { type: "arithmetic", problemGenerator: problems.generateDecimalOperationsProblem, langKey: "unitDecimalOperations", descLangKey: "descriptionDecimalOperations" },
    "orderOfOperations": { type: "arithmetic", problemGenerator: problems.generateOrderOfOperationsProblem, langKey: "unitOrderOfOperations", descLangKey: "descriptionOrderOfOperations" },
    "variablesExpressions": { type: "algebra", problemGenerator: problems.generateVariablesExpressionsProblem, langKey: "unitVariablesExpressions", descLangKey: "descriptionVariablesExpressions" },
    "linearEquations": { type: "algebra", problemGenerator: problems.generateLinearEquationsProblem, langKey: "unitLinearEquations", descLangKey: "descriptionLinearEquations" },
    "inequalities": { type: "algebra", problemGenerator: problems.generateInequalitiesProblem, langKey: "unitInequalities", descLangKey: "descriptionInequalities" },
    "powers": { type: "algebra", problemGenerator: problems.generatePowersProblem, langKey: "unitPowers", descLangKey: "descriptionPowers" },
    "algebraicOperations": { type: "algebra", problemGenerator: problems.generateAlgebraicOperationsProblem, langKey: "unitAlgebraicOperations", descLangKey: "descriptionAlgebraicOperations" }
};

export function updateContent() {
    const lang = state.translations[state.currentLanguage];
    if (!lang) return;

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (lang[key]) {
            element.textContent = lang[key];
        }
    });

    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
        answerInput.placeholder = lang.placeholderAnswer;
    }

    document.querySelectorAll('.btn-lang').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === state.currentLanguage);
    });

    const katexBtn = document.getElementById('btn-toggle-katex');
    const textBtn = document.getElementById('btn-toggle-text');
    if (katexBtn && textBtn) {
        katexBtn.classList.toggle('active', state.useKaTeX);
        textBtn.classList.toggle('active', !state.useKaTeX);
    }
}

function renderMath(elementId, mathExpression) {
    const element = document.getElementById(elementId);
    if (!element) return;

    if (state.useKaTeX) {
        try {
            katex.render(mathExpression, element, { throwOnError: false, displayMode: true });
        } catch (e) {
            console.error("KaTeX rendering failed:", e);
            element.textContent = state.currentProblem.problemText; // Fallback
        }
    } else {
        element.textContent = state.currentProblem.problemText;
    }
}

export function renderHomePage() {
    appContent.innerHTML = `
        <div class="card text-center">
            <h2 class="text-4xl font-extrabold text-indigo-700 mb-4" data-lang-key="homeTitle"></h2>
            <p class="text-lg text-gray-700 mb-8" data-lang-key="homeSubtitle"></p>
            <button id="start-learning-btn" class="btn btn-primary text-xl px-8 py-4">
                <span data-lang-key="startLearning"></span>
            </button>
        </div>
    `;
    document.getElementById('start-learning-btn').addEventListener('click', renderUnitSelectionPage);
    updateContent();
}

export function renderUnitSelectionPage() {
    const renderUnitGroup = (type, titleKey) => {
        let groupHtml = `
            <div class="card">
                <h3 class="text-2xl font-bold text-gray-800 mb-4" data-lang-key="${titleKey}"></h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        `;
        for (const unitId in units) {
            if (units[unitId].type === type) {
                groupHtml += `
                    <div class="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h4 class="text-lg font-semibold text-indigo-700 mb-2" data-lang-key="${units[unitId].langKey}"></h4>
                        <p class="text-sm text-gray-600 mb-3" data-lang-key="${units[unitId].descLangKey}"></p>
                        <button class="btn btn-secondary w-full select-unit-btn" data-unit-id="${unitId}">
                            <span data-lang-key="${units[unitId].langKey}"></span>
                        </button>
                    </div>
                `;
            }
        }
        groupHtml += `</div></div>`;
        return groupHtml;
    };

    appContent.innerHTML = renderUnitGroup('arithmetic', 'unitArithmetic') + renderUnitGroup('algebra', 'unitAlgebra');

    document.querySelectorAll('.select-unit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const unitId = event.target.dataset.unitId || event.target.closest('button').dataset.unitId;
            renderExercisePage(unitId);
        });
    });
    updateContent();
}

export function renderExercisePage(unitId) {
    const unit = units[unitId];
    if (!unit) {
        console.error("Unit not found:", unitId);
        renderHomePage();
        return;
    }

    const lang = state.translations[state.currentLanguage];

    appContent.innerHTML = `
        <div id="exercise-container" class="card" data-unit-id="${unitId}">
            <h2 class="text-3xl font-bold text-indigo-700 mb-6" data-lang-key="${unit.langKey}"></h2>
            <div class="text-2xl font-semibold text-gray-800 mb-6" id="problem-display"></div>
            <div class="mb-4">
                <label for="answer-input" class="block text-gray-700 text-sm font-bold mb-2" data-lang-key="enterYourAnswer"></label>
                <input type="text" id="answer-input" class="form-input w-full" placeholder="${lang.placeholderAnswer}">
            </div>
            <div id="feedback" class="feedback hidden"></div>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                <button id="check-answer-btn" class="btn btn-primary flex-grow"><span data-lang-key="checkAnswer"></span></button>
                <button id="skip-problem-btn" class="btn btn-secondary flex-grow"><span data-lang-key="skipProblem"></span></button>
                <button id="show-answer-btn" class="btn btn-secondary flex-grow"><span data-lang-key="showAnswer"></span></button>
                <button id="next-problem-btn" class="btn btn-secondary flex-grow hidden"><span data-lang-key="nextProblem"></span></button>
                <button id="back-to-units-btn" class="btn btn-secondary flex-grow"><span data-lang-key="backToUnits"></span></button>
            </div>
        </div>
    `;

    const problemDisplay = document.getElementById('problem-display');
    const answerInput = document.getElementById('answer-input');
    const feedbackDiv = document.getElementById('feedback');
    const checkAnswerBtn = document.getElementById('check-answer-btn');
    const skipProblemBtn = document.getElementById('skip-problem-btn');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const nextProblemBtn = document.getElementById('next-problem-btn');

    function generateNewProblem() {
        state.setCurrentProblem(unit.problemGenerator());
        renderMath('problem-display', state.currentProblem.problemKaTeX);
        answerInput.value = '';
        feedbackDiv.classList.add('hidden');
        checkAnswerBtn.classList.remove('hidden');
        skipProblemBtn.classList.remove('hidden');
        showAnswerBtn.classList.remove('hidden');
        nextProblemBtn.classList.add('hidden');
        answerInput.focus();
    }

    checkAnswerBtn.addEventListener('click', () => {
        const userAnswer = answerInput.value.trim();
        let isCorrect = false;
        const currentAnswer = state.currentProblem.answer;

        if (typeof currentAnswer === 'number') {
            const parsedUserAnswer = parseFloat(userAnswer);
            if (unitId === "fractionsDecimals" || unitId === "decimalOperations") {
                isCorrect = !isNaN(parsedUserAnswer) && Math.abs(parsedUserAnswer - currentAnswer) < EPSILON;
            } else {
                isCorrect = !isNaN(parsedUserAnswer) && parsedUserAnswer === currentAnswer;
            }
        } else if (typeof currentAnswer === 'string') {
            isCorrect = userAnswer.toLowerCase() === currentAnswer.toLowerCase();
        }

        feedbackDiv.classList.remove('hidden');
        if (isCorrect) {
            feedbackDiv.textContent = lang.correct;
            feedbackDiv.className = 'feedback correct';
            checkAnswerBtn.classList.add('hidden');
            skipProblemBtn.classList.add('hidden');
            showAnswerBtn.classList.add('hidden');
            nextProblemBtn.classList.remove('hidden');
        } else {
            feedbackDiv.textContent = lang.incorrect;
            feedbackDiv.className = 'feedback incorrect';
        }
    });

    skipProblemBtn.addEventListener('click', generateNewProblem);
    showAnswerBtn.addEventListener('click', () => {
        feedbackDiv.classList.remove('hidden');
        feedbackDiv.textContent = `${lang.answerIs}${state.currentProblem.answer}`;
        feedbackDiv.className = 'feedback info';
        checkAnswerBtn.classList.add('hidden');
        skipProblemBtn.classList.add('hidden');
        showAnswerBtn.classList.add('hidden');
        nextProblemBtn.classList.remove('hidden');
    });
    nextProblemBtn.addEventListener('click', generateNewProblem);
    document.getElementById('back-to-units-btn').addEventListener('click', renderUnitSelectionPage);

    generateNewProblem();
    updateContent();
}

export function renderSettingsPage() {
    appContent.innerHTML = `
        <div class="card">
            <h2 class="text-3xl font-bold text-indigo-700 mb-6" data-lang-key="settingsTitle"></h2>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" data-lang-key="toggleMathDisplay"></label>
                <div class="flex space-x-2">
                    <button id="btn-toggle-katex" class="btn btn-toggle-math"><span data-lang-key="mathDisplayKaTeX"></span></button>
                    <button id="btn-toggle-text" class="btn btn-toggle-math"><span data-lang-key="mathDisplayText"></span></button>
                </div>
            </div>
            <div class="mt-6">
                 <button id="back-to-home-btn" class="btn btn-secondary"><span data-lang-key="backButton"></span></button>
            </div>
        </div>
    `;

    document.getElementById('btn-toggle-katex').addEventListener('click', () => {
        state.setUseKaTeX(true);
        updateContent();
    });

    document.getElementById('btn-toggle-text').addEventListener('click', () => {
        state.setUseKaTeX(false);
        updateContent();
    });

    document.getElementById('back-to-home-btn').addEventListener('click', renderHomePage);

    updateContent();
}