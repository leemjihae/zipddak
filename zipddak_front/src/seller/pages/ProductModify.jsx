// css
import product from "../css/ProductRegist.module.css";
// js
import useModifyImgUpload from "../js/useModifyImgUpload.jsx";
import usePageTitle from "../js/usePageTitle.jsx";
import usePriceCalc from "../js/usePriceCalc.jsx";
import usePdOptionSetting from "../js/usePdOptionSetting.jsx";
import { priceFormat } from "../js/priceFormat.jsx";
// component
import DeliveryTab from "../component/ProductDeliveryTab";
import PickupTab from "../component/ProductPickupTab";
import ModalPdDelete from "../component/ModalPdDelete";

// library
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; //페이지 이동
import { Form, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import Tippy from "@tippyjs/react";
import { myAxios, baseUrl } from "../../config.jsx";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";

export default function ProductModify() {
    const pageTitle = usePageTitle("상품관리 > 상품 상세"); //탭 타이틀 설정
    const navigate = useNavigate();
    const { productIdx } = useParams();
    const [user] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //상품 삭제 모달 상태

    // -----------------------------
    // 상품 정보 state
    // -----------------------------
    const [productName, setProductName] = useState("");

    //이미지
    const {
        thumbRef,
        addRef,
        detailRef,

        oldThumb,
        oldAddImages,
        oldDetailImages,

        newThumbFile,
        newAddFiles,
        newDetailFiles,

        deleteThumbIdx,
        deleteAddIdxList,
        deleteDetailIdxList,

        remainAddSlots,
        remainDetailSlots,

        setOldThumb,
        setOldAddImages,
        setOldDetailImages,

        changeThumb,
        deleteThumb,

        addAddImages,
        deleteOldAddImage,
        deleteNewAddImage,

        addDetailImages,
        deleteOldDetailImage,
        deleteNewDetailImage,

        validateBeforeSubmit,
    } = useModifyImgUpload({ requireDetailImage: true, maxDetailImages: 2 });

    //카테고리 선택
    const [categories, setCategories] = useState([]); //대분류 목록 로딩
    const [subCategories, setSubCategories] = useState([]); //소분류 목록 로딩
    const [selectedCategory, setSelectedCategory] = useState(""); //선택한 대분류
    const [selectedSubCategory, setSelectedSubCategory] = useState(""); //선택한 소분류
    // 카테고리 세팅
    useEffect(() => {
        if (!token) return;

        myAxios(token, setToken)
            .get("/seller/product/categories/all")
            .then((res) => res.data)
            .then((data) => setCategories(data))
            .catch((err) => console.error("카테고리 로드 실패", err));
    }, []);
    // 라디오로 카테고리 선택 시 subCategory 세팅 (소분류 목록 세팅용)
    useEffect(() => {
        if (!selectedCategory) {
            setSubCategories([]);
            return;
        }
        const category = categories.find((c) => String(c.categoryIdx) === String(selectedCategory));
        setSubCategories(category?.subCategories || []);
    }, [selectedCategory, categories]);
    //대분류->소분류 목록 생성 후 그 안에 기존 소분류가 존재하면 유지 / 아니면 초기화 (소분류 유효성 검사)
    useEffect(() => {
        if (!selectedCategory || !selectedSubCategory) return;
        const category = categories.find((c) => String(c.categoryIdx) === String(selectedCategory));

        if (!category) return;
        const exists = category.subCategories?.some((sc) => String(sc.categoryIdx) === String(selectedSubCategory));

        if (!exists) {
            setSelectedSubCategory("");
        }
    }, [categories, selectedCategory]);

    //가격 입력 + 계산
    const {
        price,
        salePrice,
        discountRate,

        priceValue,
        salePriceValue,
        discountRateValue,

        handlePrice,
        handleSalePrice,
        handleDiscountRate,

        initPriceData,
    } = usePriceCalc();

    //옵션 설정
    const {
        options,
        setOptions,

        addOptionColumn,
        removeOptionColumn,

        addValueLine,
        removeValueLine,
    } = usePdOptionSetting();

    //배송정책
    const [postOK, setPostOK] = useState(""); //택배배송 체크여부
    const [pickupOK, setPickupOK] = useState(""); //직접 픽업 체크여부
    //배송방법 탭 체크여부
    const [deliveryData, setDeliveryData] = useState({
        postType: "", // bundle | single
        shippingFee: "", // 숫자
    });
    //픽업방법 탭 주소지 확인
    const [pickupData, setPickupData] = useState({
        zipcode: "",
        address: "",
        detailAddress: "",
    });
    //상품 공개 유무
    const [visible, setVisible] = useState(); // hide = 0, open = 1

    // -----------------------------
    // 2) 기존 상품 불러오기
    // -----------------------------
    useEffect(() => {
        if (!productIdx || !user) return;

        const params = new URLSearchParams();
        params.append("sellerId", user.username);
        params.append("num", productIdx);

        const productDetailUrl = `/seller/product/myProductDetail?${params.toString()}`;

        user.username &&
            myAxios(token, setToken)
                .get(productDetailUrl)
                .then((res) => {
                    const pdInfo = res.data;
                    console.log(pdInfo);

                    // 상품명
                    setProductName(pdInfo.name);

                    // 기존 썸네일 이미지
                    setOldThumb({
                        filename: pdInfo.thumbnailFileRename,
                        idx: pdInfo.thumbnailFileIdx,
                    });
                    // 기존 추가 이미지
                    const addImages = [];
                    for (let i = 1; i <= 5; i++) {
                        const filename = pdInfo[`image${i}FileRename`];
                        const idx = pdInfo[`image${i}FileIdx`];

                        if (filename && idx) {
                            addImages.push({ filename, idx });
                        }
                    }
                    setOldAddImages(addImages);

                    // 기존 상세 이미지
                    const detailImages = [];
                    for (let i = 1; i <= 2; i++) {
                        const filename = pdInfo[`detail${i}FileRename`];
                        const idx = pdInfo[`detail${i}FileIdx`];

                        if (filename && idx) {
                            detailImages.push({ filename, idx });
                        }
                    }
                    setOldDetailImages(detailImages);

                    //카테고리
                    setSelectedCategory(pdInfo.categoryIdx);
                    //소분류 있으면 함꼐 세팅
                    setSelectedSubCategory(pdInfo.subCategoryIdx);

                    //가격정보
                    initPriceData({
                        price: pdInfo.price,
                        salePrice: pdInfo.salePrice,
                        discountRate: pdInfo.discount,
                    });

                    //옵션
                    if (pdInfo.optionYn == 1 && Array.isArray(pdInfo.pdOptions)) {
                        const grouped = [];
                        pdInfo.pdOptions.forEach((opt) => {
                            let target = grouped.find((o) => o.optionName === opt.name);

                            if (!target) {
                                target = {
                                    optionName: opt.name,
                                    values: [],
                                };
                                grouped.push(target);
                            }

                            target.values.push({
                                value: opt.value,
                                price: String(opt.price ?? ""),
                            });
                        });
                        console.log("변환된 옵션", grouped);
                        setOptions(grouped);
                    }

                    // 배송
                    const isPost = pdInfo.postYn === true;
                    const isPickup = pdInfo.pickupYn === true;

                    setPostOK(isPost ? "Y" : "N");
                    if (isPost) {
                        setDeliveryData({
                            postType: pdInfo.postType,
                            shippingFee: pdInfo.postCharge,
                        });
                    }

                    setPickupOK(isPickup ? "Y" : "N");
                    if (isPickup) {
                        setPickupData({
                            zipcode: pdInfo.zonecode,
                            address: pdInfo.pickupAddr1,
                            detailAddress: pdInfo.pickupAddr2,
                        });
                    }

                    //상품 공개유무
                    const isVisible = pdInfo.visibleYn === true;
                    setVisible(isVisible ? 1 : 0);
                })
                .catch((err) => {
                    console.log(err.message);
                    console.log("error data : " + err.response.data.message);
                    if (err.response && err.response.data) {
                        alert("알 수 없는 오류가 발생했습니다. 상품 상세내용 확인 불가");
                        navigate(`/seller/productList`); //상품 리스트로 이동
                    }
                });
    }, [productIdx, user]);

    // -----------------------------
    // 3) 수정 폼 제출
    // -----------------------------
    const onModifySubmit = (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // 1) 상품명
            formData.append("name", productName);

            // 2) 이미지
            //유효성 확인
            if (!validateBeforeSubmit()) return;
            //기존 이미지 삭제시 백엔드 전달
            if (deleteThumbIdx) formData.append("deleteThumbIdx", deleteThumbIdx);
            deleteAddIdxList.forEach((id) => formData.append("deleteAddIdxList", id));
            deleteDetailIdxList.forEach((id) => formData.append("deleteDetailIdxList", id));

            //새로운 첨부파일
            if (newThumbFile) formData.append("thumbnailFile", newThumbFile);
            newAddFiles.forEach((f) => formData.append("addImageFiles", f));
            newDetailFiles.forEach((f) => formData.append("detailImageFiles", f));

            // 3) 카테고리
            formData.append("categoryIdx", selectedCategory); //상위카테고리
            if (selectedSubCategory) {
                formData.append("subCategoryIdx", selectedSubCategory); //소카테고리
            }

            // 4) 가격
            formData.append("price", priceValue);

            //판매가, 할인율 입력된 경우에만
            if (salePriceValue && discountRateValue) {
                formData.append("salePrice", salePriceValue); //판매가
                formData.append("discount", discountRateValue); //할인율
            }

            // 5) 옵션 JSON
            if (options.length > 0) {
                formData.append("optionYn", 1);
                formData.append("options", JSON.stringify(options));
            } else {
                formData.append("optionYn", 0);
            }

            // 6) 배송 정책
            formData.append("postYn", postOK == "Y" ? 1 : 0); //택배배송 체크했으면 체크여부를 1로 전송
            formData.append("pickupYn", pickupOK == "Y" ? 1 : 0); //직접픽업 체크했으면 name=pickupOK를 1로 전송
            //택배배송 선택시 배송정보 추가
            if (postOK == "Y") {
                formData.append("postType", deliveryData.postType);
                formData.append("postCharge", deliveryData.shippingFee);
            }
            //직접픽업 선택시 픽업지 주소 추가
            if (pickupOK == "Y") {
                formData.append("zonecode", pickupData.zonecode);
                formData.append("pickupAddr1", pickupData.address);
                formData.append("pickupAddr2", pickupData.detailAddress);
            }

            // 7) 상품 공개 유무
            formData.append("visibleYn", visible);

            formData.append("sellerId", user.username);
            formData.append("num", productIdx);

            // 8) 서버 전송
            const productModifyUrl = `/seller/product/myProductModify`;
            myAxios(token, setToken)
                .post(productModifyUrl, formData)
                .then((res) => {
                    if (res.data.success === true) {
                        alert(res.data.message);
                        navigate(`/seller/productList`); //상품 리스트로 이동
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.error(err);
            alert("수정사항 등록 중 오류 발생");
        }
    };
    //수정 폼 제출 end

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame regiFrame">
                    <div className="headerFrame">
                        <i className="bi bi-pencil-square" />
                        <span>상품 상세 / 수정 / 삭제</span>
                    </div>

                    <div className="bodyFrame">
                        <div className="descript">
                            <span className="required">*</span> : 필수 입력
                        </div>
                        <Form style={{ width: "100%" }}>
                            {/* 상품명 입력 */}
                            <FormGroup className="position-relative mb-4">
                                <Label className="input_title">
                                    상품명<span className="required">*</span>
                                </Label>
                                <Input type="text" className="" name="name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>

                            {/* 썸네일 이미지 첨부 */}
                            <FormGroup className="position-relative">
                                <Label className="input_title" style={{ minWidth: "fit-content" }}>
                                    썸네일<span className="required">*</span>
                                </Label>
                                <Tippy content="상품 썸네일 이미지를 교체하려면 클릭하세요." theme="custom">
                                    <img src="/Paperclip.svg" className="pointer" onClick={() => thumbRef.current.click()} />
                                </Tippy>
                                {/* ↓선택된 파일 갖고있는 용 */}
                                <Input type="file" name="thumbnailFileIdx" accept="image/*" innerRef={thumbRef} onChange={changeThumb} hidden />

                                {/* 이미지 미리보기 */}
                                <div className="img_previewBox">
                                    {/* 기존 첨부된 이미지 미리보기 */}
                                    {oldThumb && !newThumbFile && (
                                        <div className="preview-wrap">
                                            <img src={`${baseUrl}/imageView?type=product&filename=${oldThumb.filename}`} className="preview-img" />
                                        </div>
                                    )}

                                    {/* 신규 첨부시 이미지 미리보기 */}
                                    {newThumbFile && (
                                        <div className="preview-wrap">
                                            <img src={URL.createObjectURL(newThumbFile)} className="preview-img" />
                                            <button type="button" className="delete-btn" onClick={deleteThumb}>
                                                <i className="bi bi-x" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </FormGroup>

                            {/* 추가 이미지 첨부 */}
                            <FormGroup className="position-relative">
                                <Label className="input_title">추가이미지 (최대 5장까지)</Label>
                                <Tippy content="상품의 추가이미지를 첨부하려면 클릭하세요." theme="custom">
                                    <img
                                        src="/Paperclip.svg"
                                        className={`pointer ${remainAddSlots === 0 ? "disabled" : ""}`}
                                        onClick={() => {
                                            if (remainAddSlots === 0) {
                                                alert("더이상 첨부 불가합니다.");
                                                return;
                                            }
                                            addRef.current.click();
                                        }}
                                    />
                                </Tippy>
                                <small style={{ color: remainAddSlots === 0 ? "red" : "#666" }}> (추가로 첨부 가능한 이미지 개수: {remainAddSlots}장)</small>
                                {/* ↓선택된 파일 갖고있는 용 */}
                                <Input type="file" name="addImageFiles" accept="image/*" innerRef={addRef} onChange={(e) => addAddImages(e.target.files)} multiple hidden />
                                {/* 이미지 미리보기 */}
                                <div className="img_previewBox">
                                    {/* 기존 첨부된 이미지 미리보기 */}

                                    {oldAddImages.map((img) => (
                                        <div key={`old-${img.idx}`} className="preview-wrap">
                                            <img src={`${baseUrl}/imageView?type=product&filename=${img.filename}`} className="preview-img" />
                                            <button type="button" className="delete-btn" onClick={() => deleteOldAddImage(img.idx)}>
                                                <i className="bi bi-x" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* 신규 첨부시 이미지 미리보기 */}
                                    {newAddFiles.map((file, i) => (
                                        <div key={`new-${i}`} className="preview-wrap">
                                            <img src={URL.createObjectURL(file)} className="preview-img" />
                                            <button type="button" className="delete-btn" onClick={() => deleteNewAddImage(i)}>
                                                <i className="bi bi-x" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </FormGroup>

                            {/* 상세 이미지 첨부 */}
                            <FormGroup className="position-relative mb-4">
                                <Label className="input_title">
                                    상세이미지 (최대 2장)<span className="required">*</span>
                                </Label>
                                <Tippy content="본문의 상세 이미지를 첨부하려면 클릭하세요." theme="custom">
                                    <img
                                        src="/Paperclip.svg"
                                        className={`pointer ${remainDetailSlots === 0 ? "disabled" : ""}`}
                                        onClick={() => {
                                            if (remainDetailSlots === 0) {
                                                alert("더이상 첨부 불가합니다.");
                                                return;
                                            }
                                            detailRef.current.click();
                                        }}
                                    />
                                </Tippy>
                                <small style={{ color: remainDetailSlots === 0 ? "red" : "#666" }}> (추가로 첨부 가능한 이미지 개수: {remainDetailSlots}장)</small>
                                {/* ↓선택된 파일 갖고있는 용 */}
                                <Input type="file" name="detailImageFiles" accept="image/*" innerRef={detailRef} onChange={(e) => addDetailImages(e.target.files)} multiple hidden />
                                {/* 이미지 미리보기 */}
                                <div className="img_previewBox">
                                    {/* 기존 첨부된 이미지 미리보기 */}
                                    {oldDetailImages.map((img) => (
                                        <div key={`old-${img.idx}`} className="preview-wrap">
                                            <img src={`${baseUrl}/imageView?type=product&filename=${img.filename}`} className="preview-img" />
                                            <button type="button" className="delete-btn" onClick={() => deleteOldDetailImage(img.idx)}>
                                                <i className="bi bi-x" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* 신규 첨부시 이미지 미리보기 */}
                                    {newDetailFiles.map((file, i) => (
                                        <div key={`new-${i}`} className="preview-wrap">
                                            <img src={URL.createObjectURL(file)} className="preview-img" />
                                            <button type="button" className="delete-btn" onClick={() => deleteNewDetailImage(i)}>
                                                <i className="bi bi-x" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </FormGroup>

                            {/* 카테고리 */}
                            <FormGroup className="position-relative mb-4">
                                <Label className="input_title">
                                    카테고리<span className="required">*</span>
                                </Label>
                                {/* 상위 카테고리 */}
                                <div>
                                    {categories.map((cat) => (
                                        <FormGroup key={cat.categoryIdx} check inline className="mt-2">
                                            <Label check>
                                                <Input type="radio" name="productCategory" value={cat.categoryIdx} checked={String(selectedCategory) === String(cat.categoryIdx)} onChange={(e) => setSelectedCategory(e.target.value)} />
                                                {cat.name}
                                            </Label>
                                        </FormGroup>
                                    ))}
                                </div>
                                {/* 소카테고리 */}
                                {subCategories.length > 0 && (
                                    <div className={[product.small_category, "mt-3"].join(" ")}>
                                        {subCategories.map((sub) => (
                                            <FormGroup check inline key={sub.categoryIdx}>
                                                <Label check>
                                                    <Input type="radio" name="productSubCategory" value={sub.categoryIdx} checked={String(selectedSubCategory) === String(sub.categoryIdx)} onChange={(e) => setSelectedSubCategory(e.target.value)} />
                                                    {sub.name}
                                                </Label>
                                            </FormGroup>
                                        ))}
                                    </div>
                                )}
                            </FormGroup>

                            {/* 가격 */}
                            <FormGroup className="position-relative">
                                <Label className="input_title">
                                    가격<span className="required">*</span>
                                </Label>
                                <div className="unit_set">
                                    <Input
                                        className=" unit"
                                        value={price}
                                        onChange={(e) => {
                                            handlePrice(e.target.value);
                                        }}
                                    />
                                    {/* invalid */}
                                    {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                                    <span>원</span>
                                </div>
                            </FormGroup>

                            <div className="position-relative input_set mb-4">
                                <FormGroup className="position-relative">
                                    <Label className="input_title">판매가</Label>
                                    <div className="unit_set">
                                        <Input
                                            className=" unit"
                                            value={salePrice}
                                            onChange={(e) => {
                                                handleSalePrice(e.target.value);
                                            }}
                                        />
                                        {/* invalid */}
                                        {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                                        <span>원</span>
                                    </div>
                                </FormGroup>

                                <FormGroup className="position-relative">
                                    <Label className="input_title">할인율</Label>
                                    <div className="unit_set">
                                        <Input
                                            className=" unit"
                                            value={discountRate}
                                            onChange={(e) => {
                                                handleDiscountRate(e.target.value);
                                            }}
                                        />
                                        {/* invalid */}
                                        {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                                        <span>%</span>
                                    </div>
                                </FormGroup>
                            </div>

                            {/* 옵션 유무 */}
                            <FormGroup className="position-relative optPart mb-4">
                                <div className="title_line mb-2">
                                    <Label className="input_title" style={{ marginBottom: 0, minWidth: "fit-content" }}>
                                        옵션 설정
                                    </Label>

                                    <div className="btn_group" style={{ gap: "3px" }}>
                                        <Tippy content="옵션을 추가하려면 클릭하세요" theme="custom">
                                            <button type="button" className="small-button" onClick={addOptionColumn}>
                                                <i className="bi bi-plus-lg"></i>
                                            </button>
                                        </Tippy>
                                        <Tippy content="옵션을 삭제하려면 클릭하세요" theme="custom">
                                            <button type="button" className="small-button" onClick={removeOptionColumn}>
                                                <i className="bi bi-dash-lg"></i>
                                            </button>
                                        </Tippy>
                                    </div>
                                </div>

                                {/* 옵션 박스 - 옵션이 하나도 없으면 opt_frame 숨김 */}
                                {options.length > 0 && (
                                    <div className={[product.opt_frame, "mb-2", "ps-3"].join(" ")}>
                                        {options.map((opt, optionIdx) => (
                                            <div className={product.option_column} key={optionIdx}>
                                                {/* 옵션명 */}
                                                <div className={product.optionHeader}>
                                                    <div className={product.optionNameInput}>
                                                        <Label className="sub_title">
                                                            옵션명<span className="required">*</span>
                                                        </Label>
                                                        <Input
                                                            className="optionName"
                                                            placeholder="예: 색상"
                                                            value={opt.optionName}
                                                            onChange={(e) => {
                                                                const updated = [...options];
                                                                updated[optionIdx].optionName = e.target.value;
                                                                setOptions(updated);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className={product.add_btn}>
                                                        <Label>
                                                            <span className="blankSpace">~</span>
                                                        </Label>
                                                        <Tippy content="선택값을 추가하려면 클릭하세요" theme="custom">
                                                            <button type="button" className="small-button2" onClick={() => addValueLine(optionIdx)}>
                                                                <i className="bi bi-plus-lg"></i>
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                </div>

                                                <div className={product.optionBody}>
                                                    {opt.values.map((val, valueIdx) => (
                                                        <div className={product.optionBodyColumn} key={valueIdx}>
                                                            <div className={product.optionContent}>
                                                                {/* 선택값 */}
                                                                <div className="optionValue">
                                                                    <Label className="sub_title">
                                                                        선택값<span className="required">*</span>
                                                                    </Label>
                                                                    <Input
                                                                        placeholder="예: 빨강"
                                                                        value={val.value}
                                                                        onChange={(e) => {
                                                                            const updated = [...options];
                                                                            updated[optionIdx].values[valueIdx].value = e.target.value;
                                                                            setOptions(updated);
                                                                        }}
                                                                    />
                                                                </div>

                                                                {/* 가격 */}
                                                                <div className="optionPrice">
                                                                    <Label className="sub_title">옵션 가격</Label>
                                                                    <Input
                                                                        placeholder="예: 0"
                                                                        value={val.price}
                                                                        onChange={(e) => {
                                                                            const updated = [...options];
                                                                            updated[optionIdx].values[valueIdx].price = e.target.value;
                                                                            setOptions(updated);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className={product.add_btn}>
                                                                <Label>
                                                                    <span className="blankSpace">~</span>
                                                                </Label>
                                                                <Tippy content="선택값을 삭제하려면 클릭하세요" theme="custom">
                                                                    <button type="button" className="small-button2" style={{ marginBottom: "2px" }} onClick={() => removeValueLine(optionIdx, valueIdx)}>
                                                                        <i className="bi bi-dash-lg"></i>
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FormGroup>

                            {/* 배송정책 */}
                            <FormGroup className="position-relative mb-4">
                                <Label className="input_title">배송 정책</Label>
                                <div>
                                    <div className="mb-2">
                                        <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" name="postOK" value="Y" checked={postOK == "Y"} onChange={(e) => setPostOK(e.target.checked ? "Y" : "N")} />
                                                택배 배송
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" name="pickupOK" value="Y" checked={pickupOK == "Y"} onChange={(e) => setPickupOK(e.target.checked ? "Y" : "N")} />
                                                직접 픽업
                                            </Label>
                                        </FormGroup>
                                    </div>

                                    {/* UI 표시 */}
                                    {postOK == "Y" && <DeliveryTab data={deliveryData} onChange={setDeliveryData} />}
                                    {pickupOK == "Y" && <PickupTab data={pickupData} />}
                                </div>
                            </FormGroup>

                            {/* 상품 공개 유무 */}
                            <FormGroup className="position-relative ">
                                <Label for="examplePassword" className="input_title">
                                    상품 공개 유무<span className="required">*</span>
                                </Label>
                                <div>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input type="radio" name="visibleYn" value={0} checked={visible === 0} onChange={() => setVisible(0)} />
                                            비공개
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input type="radio" name="visibleYn" value={1} checked={visible === 1} onChange={() => setVisible(1)} />
                                            공개
                                        </Label>
                                    </FormGroup>
                                </div>
                            </FormGroup>
                        </Form>

                        {/* 등록 버튼 */}
                        <div className="btn_part">
                            <button type="button" className="primary-button saveBtn" onClick={onModifySubmit}>
                                <i className="bi bi-bookmark-check"></i> 저장
                            </button>
                            <button
                                type="button"
                                className="sub-button saveBtn"
                                onClick={() => {
                                    setIsDeleteModalOpen(true);
                                }}
                            >
                                <i className="bi bi-trash"></i> 삭제
                            </button>
                        </div>

                        <ModalPdDelete deleteModalOpen={isDeleteModalOpen} setDeleteModalOpen={setIsDeleteModalOpen} productIdx={productIdx} productName={productName} />
                    </div>
                </div>
            </main>
        </>
    );
}
