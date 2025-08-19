const lengthInput = document.getElementById('length');
const lowercaseInput = document.getElementById('lowercase');
const uppercaseInput = document.getElementById('uppercase');
const numbersInput = document.getElementById('numbers');
const symbolsInput = document.getElementById('symbols');
const spacesInput = document.getElementById('spaces');
const otherInput = document.getElementById('other');

const generateBtn = document.getElementById('generate-btn');
const passwordOutput = document.getElementById('password-output');
const copyBtn = document.getElementById('copy-btn');
const strengthText = document.getElementById('strength-text');

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+[]{}|;:,.<>?';
const SPACES = ' ';
const OTHER = '~`¬¿¡';

function generatePassword() {
    const length = parseInt(lengthInput.value);

    if (isNaN(length) || length < 4 || length > 128) {
        alert('Password length must be a number between 4 and 128 characters');
        return;
    }

    let charset = '';
    if (lowercaseInput.checked) charset += LOWERCASE;
    if (uppercaseInput.checked) charset += UPPERCASE;
    if (numbersInput.checked) charset += NUMBERS;
    if (symbolsInput.checked) charset += SYMBOLS;
    if (spacesInput.checked) charset += SPACES;
    if (otherInput.checked) charset += OTHER;

    if (!charset) {
        alert('You must select at least one character type.');
        return;
    }

    let password = '';
    for (let i=0; i<length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    passwordOutput.textContent = password;
    evaluateStrength(password);
}


function evaluateStrength(password) {
    let strength = 0;

    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9\s]/.test(password)) strength++;
    if (/\s/.test(password)) strength--;

    let strengthLabel = '';
    switch (strength) {
        case 0:
        case 1:
        case 2:
            strengthLabel = 'Weak';
            strengthText.style.color = '#ff4d4d';
            break;
        case 3:
        case 4:
            strengthLabel = 'Moderate';
            strengthText.style.color = '#ffcc00';
            break;
        case 5:
            strengthLabel = 'Strong';
            strengthText.style.color = '#00ff66';
            break;
        default:
            strengthLabel = 'Unknown';
    }

    strengthText.textContent = strengthLabel;
}

copyBtn.addEventListener('click', () => {
    const password = passwordOutput.textContent;
    if (!password || password === 'Your password will appear here') return;
    navigator.clipboard.writeText(password).then(() => {
        alert('Password copied to clipboard!');
    });
});

generateBtn.addEventListener('click', generatePassword);
