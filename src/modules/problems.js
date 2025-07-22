import * as state from './state.js';

// --- Utility Functions for Fractions ---
export function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

export function simplifyFraction(numerator, denominator) {
    if (denominator === 0) return "Undefined";
    if (numerator === 0) return "0/1";
    const common = gcd(Math.abs(numerator), Math.abs(denominator));
    const sign = (numerator * denominator < 0) ? "-" : "";
    return `${sign}${Math.abs(numerator) / common}/${Math.abs(denominator) / common}`;
}

// --- Problem Generators ---

export function generateAdditionSubtractionProblem() {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    const operation = Math.random() < 0.5 ? '+' : '-';
    let problemText, problemKaTeX, answer;
    if (operation === '+') {
        problemText = `${num1} + ${num2}`;
        problemKaTeX = `${num1} + ${num2}`;
        answer = num1 + num2;
    } else {
        if (num1 < num2) {
            [problemText, problemKaTeX, answer] = [`${num2} - ${num1}`, `${num2} - ${num1}`, num2 - num1];
        } else {
            [problemText, problemKaTeX, answer] = [`${num1} - ${num2}`, `${num1} - ${num2}`, num1 - num2];
        }
    }
    return { problemText, problemKaTeX, answer };
}

export function generateMultiplicationDivisionProblem() {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 2; // Avoid division by 1 or 0
    const operation = Math.random() < 0.5 ? '×' : '÷';
    let problemText, problemKaTeX, answer;
    if (operation === '×') {
        problemText = `${num1} * ${num2}`;
        problemKaTeX = `${num1} \times ${num2}`;
        answer = num1 * num2;
    } else {
        answer = num1;
        problemText = `${num1 * num2} / ${num2}`;
        problemKaTeX = `${num1 * num2} \div ${num2}`;
    }
    return { problemText, problemKaTeX, answer };
}

export function generateLinearEquationsProblem() {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const x = Math.floor(Math.random() * 10) + 1;
    let problemText, problemKaTeX, answer;
    const type = Math.random();
    if (type < 0.5) { // x + b = c
        const c = x + b;
        problemText = `x + ${b} = ${c}`;
        problemKaTeX = `x + ${b} = ${c}`;
        answer = x;
    } else { // ax = c
        const c = a * x;
        problemText = `${a}x = ${c}`;
        problemKaTeX = `${a}x = ${c}`;
        answer = x;
    }
    return { problemText, problemKaTeX, answer };
}

export function generateFractionsDecimalsProblem() {
    let problemText, problemKaTeX, answer;
    const type = Math.random();
    const lang = state.translations[state.currentLanguage];

    if (type < 0.5) { // Fraction to Decimal
        const denominators = [2, 4, 5, 8, 10, 16, 20, 25, 32, 40, 50, 64, 80, 100];
        const denominator = denominators[Math.floor(Math.random() * denominators.length)];
        const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
        problemText = `${numerator}/${denominator} = ? (${lang.decimal})`;
        problemKaTeX = `\\frac{${numerator}}{${denominator}} = ? \\text{ (${lang.decimal})}`;
        answer = numerator / denominator;
    } else { // Decimal to Fraction
        const decimalPlaces = Math.random() < 0.5 ? 1 : 2;
        let decimalNum = (Math.floor(Math.random() * 9) / 10 + 0.1);
        if (decimalPlaces === 2) {
            decimalNum = (Math.floor(Math.random() * 99) / 100 + 0.01);
        }
        decimalNum = parseFloat(decimalNum.toFixed(decimalPlaces));
        problemText = `${decimalNum} = ? (${lang.fraction})`;
        problemKaTeX = `${decimalNum} = ? \\text{ (${lang.fraction})}`;
        const num = decimalNum * (10 ** decimalPlaces);
        const den = (10 ** decimalPlaces);
        answer = simplifyFraction(num, den);
    }
    return { problemText, problemKaTeX, answer };
}

export function generateFractionsOperationsProblem() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const den1 = Math.floor(Math.random() * 9) + 2;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const den2 = Math.floor(Math.random() * 9) + 2;
    const opChoices = ['+', '-', 'times', 'div'];
    const operation = opChoices[Math.floor(Math.random() * opChoices.length)];
    let problemText, problemKaTeX, answer;
    const frac1Text = simplifyFraction(num1, den1);
    const frac2Text = simplifyFraction(num2, den2);
    const frac1KaTeX = `\\frac{${num1}}{${den1}}`;
    const frac2KaTeX = `\\frac{${num2}}{${den2}}`;
    let opText = '', opKaTeX = '';
    switch(operation) {
        case '+': [opText, opKaTeX] = ['+', '+']; break;
        case '-': [opText, opKaTeX] = ['-', '-']; break;
        case 'times': [opText, opKaTeX] = ['*', '\\times']; break;
        case 'div': [opText, opKaTeX] = ['/', '\\div']; break;
    }
    problemText = `${frac1Text} ${opText} ${frac2Text} = ?`;
    problemKaTeX = `${frac1KaTeX} ${opKaTeX} ${frac2KaTeX} = ?`;
    switch (operation) {
        case '+': answer = simplifyFraction(num1 * den2 + num2 * den1, den1 * den2); break;
        case '-': answer = simplifyFraction(num1 * den2 - num2 * den1, den1 * den2); break;
        case 'times': answer = simplifyFraction(num1 * num2, den1 * den2); break;
        case 'div': answer = simplifyFraction(num1 * den2, den1 * num2); break;
    }
    return { problemText, problemKaTeX, answer };
}

export function generateDecimalOperationsProblem() {
    const dec1 = parseFloat((Math.random() * 10 + 0.1).toFixed(Math.floor(Math.random() * 2) + 1));
    const dec2 = parseFloat((Math.random() * 10 + 0.1).toFixed(Math.floor(Math.random() * 2) + 1));
    const opChoices = ['+', '-', 'times', 'div'];
    const operation = opChoices[Math.floor(Math.random() * opChoices.length)];
    let problemText, problemKaTeX, answer;
    let opText = '', opKaTeX = '';
    switch(operation) {
        case '+': [opText, opKaTeX] = ['+', '+']; break;
        case '-': [opText, opKaTeX] = ['-', '-']; break;
        case 'times': [opText, opKaTeX] = ['*', '\\times']; break;
        case 'div': [opText, opKaTeX] = ['/', '\\div']; break;
    }
    problemText = `${dec1} ${opText} ${dec2} = ?`;
    problemKaTeX = `${dec1} ${opKaTeX} ${dec2} = ?`;
    switch (operation) {
        case '+': answer = dec1 + dec2; break;
        case '-': answer = dec1 - dec2; break;
        case 'times': answer = dec1 * dec2; break;
        case 'div': answer = dec1 / dec2; break;
    }
    answer = parseFloat(answer.toFixed(4));
    return { problemText, problemKaTeX, answer };
}

export function generateOrderOfOperationsProblem() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const c = Math.floor(Math.random() * 9) + 1;
    const d = Math.floor(Math.random() * 9) + 1;
    let problemText, problemKaTeX, answer;
    const type = Math.floor(Math.random() * 3);
    switch (type) {
        case 0: // (a + b) * c - d
            problemText = `(${a} + ${b}) * ${c} - ${d}`;
            problemKaTeX = `(${a} + ${b}) \\times ${c} - ${d}`;
            answer = (a + b) * c - d;
            break;
        case 1: // a + b * (c - d)
            if (c <= d) return generateOrderOfOperationsProblem();
            problemText = `${a} + ${b} * (${c} - ${d})`;
            problemKaTeX = `${a} + ${b} \\times (${c} - ${d})`;
            answer = a + b * (c - d);
            break;
        case 2: // a * b / c + d
            let tempB = Math.floor(Math.random() * 5) + 2;
            let tempC = Math.floor(Math.random() * (tempB - 1)) + 1;
            tempB = tempB * tempC;
            problemText = `${a} * ${tempB} / ${tempC} + ${d}`;
            problemKaTeX = `${a} \\times ${tempB} \\div ${tempC} + ${d}`;
            answer = a * tempB / tempC + d;
            break;
    }
    return { problemText, problemKaTeX, answer };
}

export function generateVariablesExpressionsProblem() {
    const coefficient = Math.floor(Math.random() * 5) + 1;
    const constant = Math.floor(Math.random() * 10) + 1;
    const xValue = Math.floor(Math.random() * 10) + 1;
    const lang = state.translations[state.currentLanguage];
    const problemText = `${coefficient}x + ${constant} ${lang.ifX} ${xValue}`;
    const problemKaTeX = `${coefficient}x + ${constant} \\text{ ${lang.ifX.replace('x =', 'x=')} } ${xValue}`;
    const answer = (coefficient * xValue) + constant;
    return { problemText, problemKaTeX, answer };
}

export function generateInequalitiesProblem() {
    const A = Math.floor(Math.random() * 5) + 1;
    const B = Math.floor(Math.random() * 15) + 5;
    let problemText, problemKaTeX, answer, boundary;
    const type = Math.random();
    const lang = state.translations[state.currentLanguage];
    const giveText = lang.toggleMathDisplay.includes('Tampilan Matematis') ? 'Berikan' : 'Give';

    if (type < 0.5) { // x + A > B or x + A < B
        const operator = Math.random() < 0.5 ? '>' : '<';
        const integerType = operator === '>' ? lang.smallestInteger : lang.largestInteger;
        problemText = `x + ${A} ${operator} ${B}. ${giveText} ${integerType} ${lang.satisfies}`;
        problemKaTeX = `x + ${A} ${operator} ${B}. \\text{ ${giveText} ${integerType} ${lang.satisfies} }`;
        boundary = B - A;
        answer = operator === '>' ? Math.floor(boundary) + 1 : Math.ceil(boundary) - 1;
        if (answer <= 0 && operator === '>') return generateInequalitiesProblem();
    } else { // Ax > B or Ax < B
        const actualA = Math.floor(Math.random() * 4) + 2;
        const operator = Math.random() < 0.5 ? '>' : '<';
        const integerType = operator === '>' ? lang.smallestInteger : lang.largestInteger;
        problemText = `${actualA}x ${operator} ${B}. ${giveText} ${integerType} ${lang.satisfies}`;
        problemKaTeX = `${actualA}x ${operator} ${B}. \\text{ ${giveText} ${integerType} ${lang.satisfies} }`;
        boundary = B / actualA;
        answer = operator === '>' ? Math.floor(boundary) + 1 : Math.ceil(boundary) - 1;
        if (answer <= 0 && operator === '>') return generateInequalitiesProblem();
    }
    return { problemText, problemKaTeX, answer };
}

export function generatePowersProblem() {
    const base = Math.floor(Math.random() * 5) + 2;
    const exponent = Math.floor(Math.random() * 3) + 2;
    const problemText = `${base}^${exponent} = ?`;
    const problemKaTeX = `${base}^{${exponent}} = ?`;
    const answer = Math.pow(base, exponent);
    return { problemText, problemKaTeX, answer };
}

export function generateAlgebraicOperationsProblem() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    let problemText, problemKaTeX, answer;
    const type = Math.floor(Math.random() * 3);
    switch (type) {
        case 0: // (a+b)^2
            problemText = `( ${a} + ${b} )^2 = ?`;
            problemKaTeX = `(${a} + ${b})^2 = ?`;
            answer = Math.pow(a + b, 2);
            break;
        case 1: // (a-b)^2
            problemText = `( ${a} - ${b} )^2 = ?`;
            problemKaTeX = `(${a} - ${b})^2 = ?`;
            answer = Math.pow(a - b, 2);
            break;
        case 2: // (a+b)(a-b)
            problemText = `( ${a} + ${b} )( ${a} - ${b} ) = ?`;
            problemKaTeX = `(${a} + ${b})(${a} - ${b}) = ?`;
            answer = (a + b) * (a - b);
            break;
    }
    return { problemText, problemKaTeX, answer };
}
