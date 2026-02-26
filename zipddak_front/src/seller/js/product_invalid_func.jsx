export const productInvalidFunc = {
    productName: {
        required: "상품명은 필수 입력값입니다.",
        minLength: { value: 2, message: "상품명은 최소 2자 이상 입력해야 합니다." },
        maxLength: { value: 50, message: "상품명은 최대 50자까지 가능합니다." },
    },

    category: {
        required: "대분류 카테고리를 선택하세요.",
    },

    subCategory: {
        required: "소분류 카테고리를 선택하세요.",
    },

    price: {
        required: "가격은 필수 입력값입니다.",
        validate: (v) => (Number(v) > 0 ? true : "가격은 0보다 커야 합니다."),
    },
    salePrice: {
        validate: (v, all) => v === "" || Number(v) <= Number(all.price) || "할인가는 정상가보다 클 수 없습니다.",
    },

    shippingMethod: {
        validate: (m) => (m?.delivery || m?.pickup ? true : "배송 방식은 최소 1개 이상 선택하세요."),
    },

    options: {
        validate: (rows) => {
            if (!Array.isArray(rows) || rows.length === 0) return "옵션을 최소 1개 이상 입력하세요.";
            for (const r of rows) {
                if (!r.name || r.name.trim() === "") return "옵션명은 비워둘 수 없습니다.";
                if (!Array.isArray(r.values) || r.values.length === 0) return "옵션값을 하나 이상 입력하세요.";
            }
            // 중복 체크
            const names = rows.map((r) => r.name.trim());
            if (names.some((n, i) => names.indexOf(n) !== i)) return "중복된 옵션명이 존재합니다.";
            // 옵션 값 중복
            for (const r of rows) {
                const vals = r.values.map((v) => String(v).trim());
                if (vals.some((v, i) => vals.indexOf(v) !== i)) return "옵션 내에 중복된 값이 존재합니다.";
            }
            return true;
        },
    },

    images: {
        validate: (img) => (img && img.thumb ? true : "대표 이미지는 필수입니다."),
    },
};

// 이미지 파일 검증
export function validateImageFile(file, maxSizeMB = 5) {
    if (!file) return "이미지를 선택하세요.";
    const allow = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allow.includes(file.type)) return "지원되지 않는 이미지 형식입니다. (jpg/png/webp)";
    if (file.size > maxSizeMB * 1024 * 1024) return `이미지 용량은 ${maxSizeMB}MB 이하만 가능합니다.`;
    return true;
}

export function validateMultipleImages(files, maxCount = 5, maxSizeMB = 5) {
    if (!files) return true;
    if (files.length > maxCount) return `이미지는 최대 ${maxCount}개까지 등록 가능합니다.`;
    for (const f of files) {
        const r = validateImageFile(f, maxSizeMB);
        if (r !== true) return r;
    }
    return true;
}
