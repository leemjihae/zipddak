import { useState } from "react";

// 천단위 콤마
const formatNumber = (num) => {
    if (num === "" || num === null) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 콤마 제거 후 숫자 변환
const toNumber = (v) => Number(v.toString().replace(/,/g, "")) || 0;

// 판매가 -> 할인율 변환
const calcDiscountRate = (price, salePrice) => {
    if (price <= 0 || salePrice <= 0) return "";
    return Math.round((1 - salePrice / price) * 100);
};

// 할인율 -> 판매가 변환
const calcSalePrice = (price, discountRate) => {
    if (price <= 0 || discountRate < 0) return "";
    return Math.round(price * (1 - discountRate / 100));
};

export default function usePriceCalc() {
    //화면용 (,포함)
    const [price, setPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [discountRate, setDiscountRate] = useState("");

    //서버로 보내는용(, 삭제)
    const [priceValue, setPriceValue] = useState(0);
    const [salePriceValue, setSalePriceValue] = useState(0);
    const [discountRateValue, setDiscountRateValue] = useState(0);

    // 가격 입력
    const handlePrice = (value) => {
        const raw = value.replace(/[^0-9]/g, "");
        const num = Number(raw) || 0;

        setPrice(formatNumber(raw));
        setPriceValue(num);

        if (salePriceValue > 0) {
            const d = calcDiscountRate(num, salePriceValue);
            setDiscountRate(d === "" ? "" : d.toString());
            setDiscountRateValue(d || 0);
        }
    };

    // 판매가 입력
    const handleSalePrice = (value) => {
        const raw = value.replace(/[^0-9]/g, "");
        const num = Number(raw) || 0;

        setSalePrice(formatNumber(raw));
        setSalePriceValue(num);

        if (priceValue > 0) {
            const d = calcDiscountRate(priceValue, num);
            setDiscountRate(d === "" ? "" : d.toString());
            setDiscountRateValue(d || 0);
        }
    };

    // 할인율 입력
    const handleDiscountRate = (value) => {
        const raw = value.replace(/[^0-9]/g, "");
        const d = Number(raw) || 0;

        setDiscountRate(raw);
        setDiscountRateValue(d);

        if (priceValue > 0) {
            const sp = calcSalePrice(priceValue, d);
            setSalePrice(sp === "" ? "" : formatNumber(sp));
            setSalePriceValue(sp || 0);
        }
    };

    const initPriceData = ({ price, salePrice, discountRate }) => {
        //수정화면에서 서버에서 받은 가격을 세팅
        setPriceValue(price || 0);
        setSalePriceValue(salePrice || 0);
        setDiscountRateValue(discountRate || 0);

        setPrice(price ? formatNumber(price) : "");
        setSalePrice(salePrice ? formatNumber(salePrice) : "");
        setDiscountRate(discountRate !== null ? discountRate.toString() : "");
    };

    return {
        // 화면 표시
        price,
        salePrice,
        discountRate,

        // 서버 전송용
        priceValue,
        salePriceValue,
        discountRateValue,

        // 핸들러
        handlePrice,
        handleSalePrice,
        handleDiscountRate,

        initPriceData,
    };
}
