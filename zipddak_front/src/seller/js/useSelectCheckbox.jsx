import { useState } from "react";

export default function useSelectCheckbox() {
    const [checkedItems, setCheckedItems] = useState(new Set());

    // 전체 선택
    const handleAllCheck = (selectableIds, checked) => {
        if (checked) {
            setCheckedItems(new Set(selectableIds));
        } else {
            setCheckedItems(new Set());
        }
    };

    // 개별 선택
    const handleItemCheck = (id, isChecked) => {
        setCheckedItems((prev) => {
            const next = new Set(prev);
            if (isChecked) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    // 전체 선택 여부 (계산값)
    const isAllChecked = (selectableCount) => selectableCount > 0 && checkedItems.size === selectableCount;

    // 선택된 ID 배열
    const getSelected = () => Array.from(checkedItems);

    // 선택 강제 (없으면 alert)
    const requireSelected = () => {
        if (checkedItems.size === 0) {
            alert("선택된 상품이 없습니다.");
            return null;
        }
        return Array.from(checkedItems);
    };

    // 초기화
    const resetChecked = () => {
        setCheckedItems(new Set());
    };

    return {
        checkedItems,
        handleAllCheck,
        handleItemCheck,
        isAllChecked,
        getSelected,
        requireSelected,
        resetChecked,
    };
}
