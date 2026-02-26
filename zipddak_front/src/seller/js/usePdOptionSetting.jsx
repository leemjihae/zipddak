import { useState } from "react";

export default function usePdOptionSetting() {
    const [options, setOptions] = useState([]);

    // 옵션 컬럼 추가
    const addOptionColumn = () => {
        setOptions((prev) => [
            ...prev,
            {
                optionName: "",
                values: [{ value: "", price: "" }],
            },
        ]);
    };

    // 옵션 컬럼 삭제
    const removeOptionColumn = () => {
        setOptions((prev) => {
            if (prev.length === 0) {
                alert("삭제할 옵션이 없습니다.");
                return prev;
            }
            const newList = prev.slice(0, prev.length - 1);
            return newList;
        });
    };

    // 선택값 라인 추가
    const addValueLine = (optionIdx) => {
        setOptions((prev) => {
            const updated = [...prev];
            updated[optionIdx].values.push({ value: "", price: "" });
            return updated;
        });
    };

    // 선택값 라인 삭제 (마지막 1개일 때 → option_column 삭제)
    const removeValueLine = (optionIdx, valueIdx) => {
        setOptions((prev) => {
            const updated = [...prev];
            const values = updated[optionIdx].values;

            if (values.length === 1) {
                // 마지막 라인이면 option_column 제거
                updated.splice(optionIdx, 1);
                return updated;
            }

            values.splice(valueIdx, 1);
            return updated;
        });
    };

    return {
        options,
        setOptions,
        addOptionColumn,
        removeOptionColumn,
        addValueLine,
        removeValueLine,
    };
}
