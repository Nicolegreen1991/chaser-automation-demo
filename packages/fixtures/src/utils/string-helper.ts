export function ensureSixDigits(num: number) {
    return num.toString().padStart(6, '0');
}
