import { useRef, useState } from "react";

export default function useModifyImgUpload(options = {}) {
    const { maxAddImages = 5, maxDetailImages = 2, maxSizeMB = 5, requireThumb = true, requireDetailImage = false } = options;

    /* ===== ref ===== */
    const thumbRef = useRef(null);
    const addRef = useRef(null);
    const detailRef = useRef(null);

    /* ===== 기존 이미지 ===== */
    const [oldThumb, setOldThumb] = useState(null); // { idx, url }
    const [oldAddImages, setOldAddImages] = useState([]); // [{ idx, url }]
    const [oldDetailImages, setOldDetailImages] = useState([]); // [{ idx, url }]

    /* ===== 신규 이미지 ===== */
    const [newThumbFile, setNewThumbFile] = useState(null);
    const [newAddFiles, setNewAddFiles] = useState([]);
    const [newDetailFiles, setNewDetailFiles] = useState([]);

    /* ===== 삭제 이미지 ===== */
    const [deleteThumbIdx, setDeleteThumbIdx] = useState(null);
    const [deleteAddIdxList, setDeleteAddIdxList] = useState([]);
    const [deleteDetailIdxList, setDeleteDetailIdxList] = useState([]);

    /* ===== 공통 ===== */
    const validateFileSize = (file) => {
        const sizeMB = file.size / 1024 / 1024;
        return sizeMB <= maxSizeMB;
    };

    /* ================= 썸네일 ================= */
    const changeThumb = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!validateFileSize(file)) {
            alert(`파일 용량은 ${maxSizeMB}MB 이하만 가능합니다.`);
            return;
        }

        // 기존 썸네일이 있으면 삭제 대상으로 등록
        if (oldThumb?.idx) {
            setDeleteThumbIdx(oldThumb.idx);
            setOldThumb(null);
        }

        setNewThumbFile(file);
    };

    const deleteThumb = () => {
        if (oldThumb?.idx) {
            setDeleteThumbIdx(oldThumb.idx);
            setOldThumb(null);
        }
        setNewThumbFile(null);
    };

    /* ================= 추가 이미지 ================= */
    const remainAddSlots = maxAddImages - (oldAddImages.length + newAddFiles.length);

    const addAddImages = (files) => {
        const fileArr = Array.from(files);

        if (fileArr.length > remainAddSlots) {
            alert(`추가 이미지는 최대 ${maxAddImages}장까지 가능합니다.`);
            return;
        }

        const validFiles = fileArr.filter((f) => validateFileSize(f));
        setNewAddFiles((prev) => [...prev, ...validFiles]);
    };

    const deleteOldAddImage = (idx) => {
        setOldAddImages((prev) => prev.filter((img) => img.idx !== idx));
        setDeleteAddIdxList((prev) => [...prev, idx]);
    };

    const deleteNewAddImage = (index) => {
        setNewAddFiles((prev) => prev.filter((_, i) => i !== index));
    };

    /* ================= 상세 이미지 ================= */
    const remainDetailSlots = maxDetailImages - (oldDetailImages.length + newDetailFiles.length);

    const addDetailImages = (files) => {
        const fileArr = Array.from(files);

        if (fileArr.length > remainDetailSlots) {
            alert(`상세 이미지는 최대 ${maxDetailImages}장까지 가능합니다.`);
            return;
        }

        const validFiles = fileArr.filter((f) => validateFileSize(f));
        setNewDetailFiles((prev) => [...prev, ...validFiles]);
    };

    const deleteOldDetailImage = (idx) => {
        setOldDetailImages((prev) => prev.filter((img) => img.idx !== idx));
        setDeleteDetailIdxList((prev) => [...prev, idx]);
    };

    const deleteNewDetailImage = (index) => {
        setNewDetailFiles((prev) => prev.filter((_, i) => i !== index));
    };

    /* ================= submit 전 검증 ================= */
    const validateBeforeSubmit = () => {
        // 썸네일
        if (requireThumb) {
            if (!oldThumb && !newThumbFile) {
                alert("썸네일은 반드시 등록해야 합니다.");
                return false;
            }
        }

        // 상세 이미지
        if (requireDetailImage) {
            if (oldDetailImages.length + newDetailFiles.length === 0) {
                alert("상세 이미지는 최소 1장 이상 필요합니다.");
                return false;
            }
        }
        return true;
    };
    /* =========== 수정 종료용 reset =========== */
    const resetImageState = () => {
        setNewThumbFile(null);
        setDeleteThumbIdx(null);
    };

    return {
        /* ref */
        thumbRef,
        addRef,
        detailRef,

        /* state */
        /* 기존 이미지 */
        oldThumb,
        oldAddImages,
        oldDetailImages,
        /* 신규 이미지 */
        newThumbFile,
        newAddFiles,
        newDetailFiles,
        /* 삭제 idx */
        deleteThumbIdx,
        deleteAddIdxList,
        deleteDetailIdxList,

        remainAddSlots,
        remainDetailSlots,

        /* setter (초기 데이터 세팅용) */
        setOldThumb,
        setOldAddImages,
        setOldDetailImages,

        /* 썸네일 */
        changeThumb,
        deleteThumb,

        /* 추가 이미지 */
        addAddImages,
        deleteOldAddImage,
        deleteNewAddImage,

        /* 상세 이미지 */
        addDetailImages,
        deleteOldDetailImage,
        deleteNewDetailImage,

        /* validation */
        validateBeforeSubmit,

        /* 수정 종료용 reset */
        resetImageState,
    };
}
