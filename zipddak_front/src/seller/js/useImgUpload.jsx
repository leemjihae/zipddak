import { useRef, useState } from "react";

export default function useImgUpload(options = {}) {
    const { maxAddImages = 5, maxDetailImages = 2, maxSizeMB = 5 } = options;

    const thumbRef = useRef(null);
    const addRef = useRef(null);
    const detailRef = useRef(null);

    const [thumbPreview, setThumbPreview] = useState(null);
    const [addPreviewList, setAddPreviewList] = useState([]);
    const [detailPreviewList, setDetailPreviewList] = useState([]);

    const validateFileSize = (file) => {
        const sizeMB = file.size / 1024 / 1024;
        return sizeMB <= maxSizeMB;
    };

    /* ------------------ 썸네일 ------------------ */
    const handleThumbChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!validateFileSize(file)) {
            alert(`파일 용량은 ${maxSizeMB}MB 이하만 가능합니다.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setThumbPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const deleteThumb = () => setThumbPreview(null);

    /* ------------------ 추가 이미지 ------------------ */
    const handleAddChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (addPreviewList.length + files.length > maxAddImages) {
            alert(`추가이미지는 최대 ${maxAddImages}장까지 업로드 가능합니다.`);
            return;
        }

        const newPreviews = [];

        files.forEach((file) => {
            if (!validateFileSize(file)) {
                alert(`파일 용량은 ${maxSizeMB}MB 이하만 가능합니다.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                newPreviews.push(reader.result);

                if (newPreviews.length === files.length) {
                    setAddPreviewList((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const deleteAddImage = (index) => {
        setAddPreviewList((prev) => prev.filter((_, i) => i !== index));
    };

    /* ------------------ 상세 이미지 ------------------ */
    const handleDetailChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (detailPreviewList.length + files.length > maxDetailImages) {
            alert(`상세이미지는 최대 ${maxDetailImages}장까지 업로드 가능합니다.`);
            return;
        }

        const newPreviews = [];

        files.forEach((file) => {
            if (!validateFileSize(file)) {
                alert(`파일 용량은 ${maxSizeMB}MB 이하만 가능합니다.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                newPreviews.push(reader.result);

                if (newPreviews.length === files.length) {
                    setDetailPreviewList((prev) => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const deleteDetailImage = (index) => {
        setDetailPreviewList((prev) => prev.filter((_, i) => i !== index));
    };

    return {
        thumbRef,
        addRef,
        detailRef,

        thumbPreview,
        addPreviewList,
        detailPreviewList,

        handleThumbChange,
        handleAddChange,
        handleDetailChange,

        deleteThumb,
        deleteAddImage,
        deleteDetailImage,
    };
}
