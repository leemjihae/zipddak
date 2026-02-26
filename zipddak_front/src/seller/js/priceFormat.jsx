export const priceFormat = (value) => {
    if (value === null || value === undefined) return "";
    return Number(value).toLocaleString();
};
