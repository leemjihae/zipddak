export function koreaAmountFormat(num) {
    const man = Math.floor(num / 10000);
    const thousand = Math.floor((num % 10000) / 1000);

    let result = "";
    if (man > 0) result += `${man}만`;
    if (thousand > 0) result += `${thousand}천`;

    return result || num.toString();
}
