export function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, "");

    if (!numbers.length) return "";

    let res = "+7 ";

    const clean = numbers.startsWith("7") ? numbers.substring(1) : numbers;

    if (clean.length > 0) res += "(" + clean.substring(0, 3);
    if (clean.length >= 4) res += ") " + clean.substring(3, 6);
    if (clean.length >= 7) res += "-" + clean.substring(6, 8);
    if (clean.length >= 9) res += "-" + clean.substring(8, 10);

    return res;
}