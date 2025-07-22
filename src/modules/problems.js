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

// Helper to convert decimal to fraction
function decimalToFraction(decimal) {
    if (decimal === 0) return { numerator: 0, denominator: 1 };
    const sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);
    let denominator = 1;
    while (decimal % 1 !== 0) {
        decimal *= 10;
        denominator *= 10;
    }
    const common = gcd(decimal, denominator);
    return { numerator: sign * (decimal / common), denominator: denominator / common };
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
        problemKaTeX = `${num1} \\times ${num2}`;
        answer = num1 * num2;
    } else {
        answer = num1;
        problemText = `${num1 * num2} / ${num2}`;
        problemKaTeX = `${num1 * num2} \\div ${num2}`;
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
        case 'times': [opText, opKaTeX] = ['*', '\times']; break;
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
    const d = Math.floor(Math.random() * 9) * 2 + 2; // Ensure d is even and > 0 for division
    const e = Math.floor(Math.random() * 9) + 1;

    let problemText, problemKaTeX, answer;
    const type = Math.floor(Math.random() * 6); // 0 to 5 for 6 types

    switch (type) {
        case 0: // (a + b) * c - e
            problemText = `(${a} + ${b}) * ${c} - ${e}`;
            problemKaTeX = `(${a} + ${b}) \\times ${c} - ${e}`;
            answer = (a + b) * c - e;
            break;
        case 1: // a + b * (c - e)
            if (c <= e) return generateOrderOfOperationsProblem(); // Ensure positive result in parenthesis
            problemText = `${a} + ${b} * (${c} - ${e})`;
            problemKaTeX = `${a} + ${b} \\times (${c} - ${e})`;
            answer = a + b * (c - e);
            break;
        case 2: // a * b / d + e (ensure integer division)
            let tempB = Math.floor(Math.random() * 5) + 2; // 2-6
            let tempD = Math.floor(Math.random() * (tempB - 1)) + 1; // 1 to tempB-1
            tempB = tempB * tempD; // Make tempB a multiple of tempD
            problemText = `${a} * ${tempB} / ${tempD} + ${e}`;
            problemKaTeX = `${a} \\times ${tempB} \\div ${tempD} + ${e}`;
            answer = a * tempB / tempD + e;
            break;
        case 3: // (a - b) * c + e (new type 1)
            if (a <= b) return generateOrderOfOperationsProblem();
            problemText = `(${a} - ${b}) * ${c} + ${e}`;
            problemKaTeX = `(${a} - ${b}) \\times ${c} + ${e}`;
            answer = (a - b) * c + e;
            break;
        case 4: // a + (b * c) / d (new type 2, ensure integer division)
            let bc = b * c;
            let tempD2 = Math.floor(Math.random() * 5) + 2; // 2-6
            if (bc % tempD2 !== 0) {
                // Find a divisor for bc
                const divisors = [];
                for (let i = 2; i <= Math.sqrt(bc); i++) {
                    if (bc % i === 0) {
                        divisors.push(i);
                        if (bc / i !== i) divisors.push(bc / i);
                    }
                }
                if (divisors.length > 0) {
                    tempD2 = divisors[Math.floor(Math.random() * divisors.length)];
                } else {
                    return generateOrderOfOperationsProblem(); // No suitable divisor, regenerate
                }
            }
            problemText = `${a} + (${b} * ${c}) / ${tempD2}`;
            problemKaTeX = `${a} + (${b} \\times ${c}) \\div ${tempD2}`;
            answer = a + (b * c) / tempD2;
            break;
        case 5: // (a + b) / c - e (new type 3, ensure integer division)
            let ab = a + b;
            let tempC3 = Math.floor(Math.random() * 5) + 2; // 2-6
            if (ab % tempC3 !== 0) {
                const divisors = [];
                for (let i = 2; i <= Math.sqrt(ab); i++) {
                    if (ab % i === 0) {
                        divisors.push(i);
                        if (ab / i !== i) divisors.push(ab / i);
                    }
                }
                if (divisors.length > 0) {
                    tempC3 = divisors[Math.floor(Math.random() * divisors.length)];
                } else {
                    return generateOrderOfOperationsProblem(); // No suitable divisor, regenerate
                }
            }
            problemText = `(${a} + ${b}) / ${tempC3} - ${e}`;
            problemKaTeX = `(${a} + ${b}) \\div ${tempC3} - ${e}`;
            answer = (a + b) / tempC3 - e;
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

export function generateMixedOperationsProblem() {
    let problemText, problemKaTeX, answer;
    const type = Math.floor(Math.random() * 4); // 4 types of mixed problems

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomDecimal = (min, max, fixed) => parseFloat((Math.random() * (max - min) + min).toFixed(fixed));

    const generateFraction = () => {
        const num = getRandomInt(1, 9);
        const den = getRandomInt(2, 9);
        return { num, den };
    };

    const formatFraction = (frac) => `\\frac{${frac.num}}{${frac.den}}`;

    switch (type) {
        case 0: { // Integer + Fraction Operation (e.g., 5 + 1/2 * 3/4)
            const int1 = getRandomInt(1, 10);
            const frac1 = generateFraction();
            const frac2 = generateFraction();
            const op = Math.random() < 0.5 ? '+' : '-';
            const fracOp = Math.random() < 0.5 ? '\\times' : '\\div';

            let intermediateFrac;
            if (fracOp === '\\times') {
                intermediateFrac = { num: frac1.num * frac2.num, den: frac1.den * frac2.den };
            } else { // division
                // Ensure integer result for fraction division for simplicity in mixed ops
                if (frac1.num % frac2.num !== 0 || frac2.den % frac1.den !== 0) {
                    return generateMixedOperationsProblem(); // Regenerate if not clean division
                }
                intermediateFrac = { num: frac1.num * frac2.den, den: frac1.den * frac2.num };
            }
            intermediateFrac = decimalToFraction(eval(intermediateFrac.num / intermediateFrac.den)); // Simplify intermediate

            problemText = `${int1} ${op} ${frac1.num}/${frac1.den} ${fracOp === '\\times' ? '*' : '/'} ${frac2.num}/${frac2.den}`;
            problemKaTeX = `${int1} ${op} ${formatFraction(frac1)} ${fracOp} ${formatFraction(frac2)}`;

            let resultNum, resultDen;
            if (op === '+') {
                resultNum = int1 * intermediateFrac.den + intermediateFrac.num;
                resultDen = intermediateFrac.den;
            } else {
                resultNum = int1 * intermediateFrac.den - intermediateFrac.num;
                resultDen = intermediateFrac.den;
            }
            answer = simplifyFraction(resultNum, resultDen);
            break;
        }
        case 1: { // Decimal + Integer Operation (e.g., 3.5 * 2 + 1)
            const dec1 = getRandomDecimal(0.1, 10, 1);
            const int1 = getRandomInt(1, 10);
            const int2 = getRandomInt(1, 10);
            const op1 = Math.random() < 0.5 ? '+' : '-';
            const op2 = Math.random() < 0.5 ? '*' : '/';

            let intermediateResult;
            if (op2 === '*') {
                intermediateResult = dec1 * int1;
            } else { // division
                if (dec1 * 100 % int1 !== 0) { // Simple check for terminating decimal after division
                    return generateMixedOperationsProblem();
                }
                intermediateResult = dec1 / int1;
            }

            problemText = `${dec1} ${op2} ${int1} ${op1} ${int2}`;
            problemKaTeX = `${dec1} ${op2 === '*' ? '\\times' : '\\div'} ${int1} ${op1} ${int2}`;
            answer = op1 === '+' ? intermediateResult + int2 : intermediateResult - int2;
            answer = parseFloat(answer.toFixed(4));
            break;
        }
        case 2: { // Fraction + Decimal Operation (e.g., 1/4 + 0.25)
            const frac1 = generateFraction();
            const dec1 = getRandomDecimal(0.1, 0.9, 2); // 1 or 2 decimal places
            const op = Math.random() < 0.5 ? '+' : '-';

            const fracValue = frac1.num / frac1.den;
            problemText = `${frac1.num}/${frac1.den} ${op} ${dec1}`;
            problemKaTeX = `${formatFraction(frac1)} ${op} ${dec1}`;
            answer = op === '+' ? fracValue + dec1 : fracValue - dec1;
            answer = parseFloat(answer.toFixed(4));
            break;
        }
        case 3: { // Mixed with parentheses (e.g., (1/2 + 0.5) * 4)
            const frac1 = generateFraction();
            const dec1 = getRandomDecimal(0.1, 0.9, 2);
            const int1 = getRandomInt(2, 5);
            const innerOp = Math.random() < 0.5 ? '+' : '-';
            const outerOp = Math.random() < 0.5 ? '\\times' : '\\div';

            const fracValue = frac1.num / frac1.den;
            let innerResult = innerOp === '+' ? fracValue + dec1 : fracValue - dec1;
            innerResult = parseFloat(innerResult.toFixed(4));

            let finalAnswer;
            if (outerOp === '\\times') {
                finalAnswer = innerResult * int1;
            } else { // division
                if (innerResult * 100 % int1 !== 0) { // Simple check for clean division
                    return generateMixedOperationsProblem();
                }
                finalAnswer = innerResult / int1;
            }
            finalAnswer = parseFloat(finalAnswer.toFixed(4));

            problemText = `(${frac1.num}/${frac1.den} ${innerOp} ${dec1}) ${outerOp === '\\times' ? '*' : '/'} ${int1}`;
            problemKaTeX = `(${formatFraction(frac1)} ${innerOp} ${dec1}) ${outerOp} ${int1}`;
            answer = finalAnswer;
            break;
        }
    }
    return { problemText, problemKaTeX, answer };
}