import { useState } from "react";
import { formatNumber, toNumber } from "./numberFormat";

export default function useCommaNumber(initialValue = 0) {
    const [display, setDisplay] = useState(initialValue ? formatNumber(initialValue) : "");
    const [value, setValue] = useState(initialValue);

    const handleChange = (v) => {
        const raw = v.replace(/[^0-9]/g, "");
        setDisplay(formatNumber(raw));
        setValue(toNumber(raw));
    };

    const init = (num) => {
        setDisplay(num ? formatNumber(num) : "");
        setValue(num || 0);
    };

    return {
        display, // 화면용
        value, // 백엔드 전송용
        handleChange,
        init,
    };
}
