import { useState } from "react";

export default function usePriceInput(initialValue = "") {
    const [value, setValue] = useState(initialValue ? Number(initialValue).toLocaleString() : "");

    // 입력 시 콤마 자동 적용
    const onChange = (e) => {
        let raw = e.target.value.replace(/,/g, "");

        // 숫자만 입력 허용
        if (!/^\d*$/.test(raw)) return;

        // 콤마 적용
        if (raw === "") {
            setValue("");
        } else {
            setValue(Number(raw).toLocaleString());
        }
    };

    // 서버에 보낼 때 숫자(Integer)로 변환
    const getRawValue = () => {
        if (!value) return 0;
        return Number(value.replace(/,/g, ""));
    };

    return { value, onChange, getRawValue };
}
