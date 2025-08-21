// ==== Constantes de caracteres ====
const LOWERCASE  = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS    = "0123456789";
const SYMBOLS    = "!@#$%^&*()_+-=[]{}|;:',.<>/?";
const SPACES     = " ";
const OTHER      = "áéíóúÁÉÍÓÚñÑçÇ";
const MAX_LENGTH = 10000;

// ==== Referencias DOM ====
const lengthInput    = document.getElementById("length");
const lowercaseInput = document.getElementById("lowercase");
const uppercaseInput = document.getElementById("uppercase");
const numbersInput   = document.getElementById("numbers");
const symbolsInput   = document.getElementById("symbols");
const spacesInput    = document.getElementById("spaces");
const otherInput     = document.getElementById("other");
const generateBtn    = document.getElementById("generate-btn");
const copyBtn        = document.getElementById("copy-btn");
const passwordOutput = document.getElementById("password-output");
const strengthOutput = document.getElementById("strength-text");

// ==== Generador de contraseña ====
function generatePassword() {
    let charset = "";
    if (lowercaseInput.checked) charset += LOWERCASE;
    if (uppercaseInput.checked) charset += UPPERCASE;
    if (numbersInput.checked)   charset += NUMBERS;
    if (symbolsInput.checked)   charset += SYMBOLS;
    if (spacesInput.checked)    charset += SPACES;
    if (otherInput.checked)     charset += OTHER;

    const length = Math.min(parseInt(lengthInput.value, 10), MAX_LENGTH);

    if (charset.length === 0 || length <= 0 || length > MAX_LENGTH) {
        passwordOutput.value = "";
        strengthOutput.textContent = "Select at least one charset and introduce valid lenght (between 0 and 10.000)";
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        const rand = Math.floor(Math.random() * charset.length);
        password += charset[rand];
    }

    passwordOutput.textContent = password;
    strengthOutput.textContent = evaluateStrength(password, charset.length);
}

// ==== Evaluador de fuerza ====
function evaluateStrength(password, charsetSize) {
    if (charsetSize === 0 || password.length === 0) {
        return "Select at least one charset";
    }

    // intentos por segundo estimados (≈ 10^10)
    const attemptsPerSecond = 1e10;
    const combinations = BigInt(charsetSize) ** BigInt(password.length);
    const seconds = Number(combinations / BigInt(attemptsPerSecond));
    strengthOutput.style.color = getStrengthColor(seconds);

    return formatTime(seconds);
}

// ==== Conversión a tiempo legible (basado en la tabla) ====
function formatTime(seconds) {
    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${seconds.toFixed(0)} seconds`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(1)} minutes`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} hours`;
    const days = hours / 24;
    if (days < 365) return `${days.toFixed(1)} days`;
    const years = days / 365;
    if (years < 1000) return `${years.toFixed(1)} years`;
    const millennia = years / 1000;
    if (millennia < 1e6) return `${millennia.toFixed(1)}k years`;
    const millions = years / 1e6;
    if (millions < 1e6) return `${millions.toFixed(1)}M years`;
    const billions = years / 1e9;
    if (billions < 1e6) return `${billions.toFixed(1)}B years`;
    const trillions = years / 1e12;
    if (trillions < 1e6) return `${trillions.toFixed(1)}T years`;
    return "Practically uncrackable";
}

// Convierte una cadena de tiempo (ej: "2 days", "1 month") a segundos
function timeToSeconds(timeString) {
  if (!timeString || timeString.toLowerCase() === "instantly") {
    return 0;
  }

  const units = {
    sec: 1,
    secs: 1,
    second: 1,
    seconds: 1,
    min: 60,
    mins: 60,
    minute: 60,
    minutes: 60,
    hour: 3600,
    hours: 3600,
    day: 86400,
    days: 86400,
    month: 2628000,   // ~30.44 days
    months: 2628000,
    year: 31557600,   // 365.25 days
    years: 31557600,
    k: 1000,
    m: 1000000,
    bn: 1000000000,
    qd: 1000000000000, // quadrillion
    tn: 1000000000000000 // trillion
  };

  const parts = timeString.toLowerCase().split(" ");

  let value = parseFloat(parts[0]);
  let unit = parts[1];

  // si incluye sufijos como "k years", "m years", etc.
  if (unit.includes("year")) {
    if (parts[0].endsWith("k")) {
      value = parseFloat(parts[0]) * units.k;
    } else if (parts[0].endsWith("m")) {
      value = parseFloat(parts[0]) * units.m;
    } else if (parts[0].endsWith("bn")) {
      value = parseFloat(parts[0]) * units.bn;
    } else if (parts[0].endsWith("qd")) {
      value = parseFloat(parts[0]) * units.qd;
    } else if (parts[0].endsWith("tn")) {
      value = parseFloat(parts[0]) * units.tn;
    }
  }

  return value * (units[unit] || 1);
}

// Devuelve el color en base al tiempo en segundos
function getStrengthColor(seconds) {
  if (seconds === 0) {
    return "#800080"; // morado (Instantly)
  } else if (seconds < 60 * 60) {
    return "#800080"; // morado (<1h)
  } else if (seconds < 30 * 24 * 3600) {
    return "#FF0000"; // rojo (<1 mes)
  } else if (seconds < 5 * 365 * 24 * 3600) {
    return "#FFA500"; // naranja (<5 años)
  } else if (seconds < 100 * 365 * 24 * 3600) {
    return "#FFFF00"; // amarillo (<100 años)
  } else {
    return "#00FF00"; // verde (100+ años)
  }
}

// ==== Event Listener ====
generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", () => {
    const password = passwordOutput.textContent.trim();

    if (!password) {
        alert("No hay contraseña generada para copiar.");
        return;
    }

    navigator.clipboard.writeText(password)
        .then(() => {
            //alert("Contraseña copiada al portapapeles ✅");
        })
        .catch(err => {
            console.error("Error al copiar: ", err);
            alert("No se pudo copiar la contraseña ❌");
        });
});

