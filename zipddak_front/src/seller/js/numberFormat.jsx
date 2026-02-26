//세자리마다 ,붙임
export const formatNumber = (num) => {
    if (num === "" || num === null) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// , 뗌
export const toNumber = (v) => Number(v.toString().replace(/,/g, "")) || 0;
