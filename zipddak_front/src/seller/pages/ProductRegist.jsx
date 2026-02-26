// css
import product from "../css/ProductRegist.module.css";
// js
import useImgUpload from "../js/useImgUpload.jsx";
import usePageTitle from "../js/usePageTitle.jsx";
import usePriceCalc from "../js/usePriceCalc.jsx";
import usePdOptionSetting from "../js/usePdOptionSetting.jsx";
import { formatNumber, toNumber } from "../js/numberFormat";
// component
import DeliveryTab from "../component/ProductDeliveryTab";
import PickupTab from "../component/ProductPickupTab";
// library
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; //페이지 이동
import { Form, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import Tippy from "@tippyjs/react";
import { myAxios } from "../../config.jsx";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";

export default function ProductRegist() {
    //탭 타이틀 설정
    const pageTitle = usePageTitle("상품관리 > 상품 등록");
    const navigate = useNavigate();
    const [token, setToken] = useAtom(tokenAtom);
    const [user] = useAtom(userAtom);

    //상품명 입력
    const [productName, setProductName] = useState("");

    //이미지 첨부 + 미리보기
    const {
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
    } = useImgUpload({
        maxAddImages: 5,
        maxDetailImages: 2,
        maxSizeMB: 5,
    });

    //카테고리 선택
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    // 카테고리 세팅
    useEffect(() => {
        user.username &&
            myAxios(token, setToken)
                .get("/seller/product/categories/all")
                .then((res) => res.data)
                .then((data) => setCategories(data))
                .catch((err) => console.error("카테고리 로드 실패", err));
    }, [user]);
    // 라디오로 카테고리 선택 시 subCategory 세팅
    useEffect(() => {
        if (!selectedCategory) {
            setSubCategories([]);
            return;
        }
        const category = categories.find((c) => String(c.categoryIdx) === String(selectedCategory));
        setSubCategories(category?.subCategories || []);
        setSelectedSubCategory(""); //상위 카테고리 바뀌면 소카테고리 초기화
    }, [selectedCategory, categories]);

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
    const [postOK, setPostOK] = useState("N"); //택배배송 체크여부
    const [pickupOK, setPickupOK] = useState("N"); //직접 픽업 체크여부
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

    //배송비, 픽업방법 탭 주소지 세팅
    useEffect(() => {
        user.username &&
            myAxios(token, setToken)
                .get("/seller/mypage/myProfile?sellerId=" + user.username)
                .then((res) => {
                    const sellerData = res.data;
                    console.log("sellerData : " + sellerData);

                    setDeliveryData({
                        postType: "bundle",
                        shippingFee: sellerData.basicPostCharge ?? "",
                    });

                    setPickupData({
                        zipcode: sellerData.pickupZonecode ?? "",
                        address: sellerData.pickupAddr1 ?? "",
                        detailAddress: sellerData.pickupAddr2 ?? "",
                    });
                })
                .catch(console.error);
    }, [user]);

    //상품 공개 유무
    const [visible, setVisible] = useState(0); // hide = 0, open = 1

    //폼 제출 start
    const onSubmit = (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("sellerId", user.username);

            // 0) 판매업체
            formData.append("username", user.username);

            // 1) 상품명
            formData.append("name", productName);

            // 2) 이미지
            if (thumbRef.current?.files[0]) {
                formData.append("thumbnailFile", thumbRef.current.files[0]); //썸네일
            }
            if (addRef.current?.files.length > 0) {
                Array.from(addRef.current.files).forEach((file) => {
                    formData.append("addImageFiles", file); //추가이미지
                });
            }
            if (detailRef.current?.files.length > 0) {
                Array.from(detailRef.current.files).forEach((file) => {
                    formData.append("detailImageFiles", file); //상세이미지
                });
            }

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

            for (let [k, v] of formData.entries()) console.log(k, v);

            // 8) 서버 전송
            myAxios(token, setToken)
                .post(`/seller/product/regist`, formData)
                .then((res) => {
                    console.log(res);
                    console.log(res.data);

                    if (res.data.success === true) {
                        let productIdx = res.data.productIdx;
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
            alert("등록 중 오류 발생");
        }
    };
    //폼 제출 end

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame regiFrame">
                    <div className="headerFrame">
                        <i className="bi bi-plus-square" />
                        <span>상품 등록</span>
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
                                <Input type="text" className="" name="name" placeholder="상품명을 입력하세요" onChange={(e) => setProductName(e.target.value)} />
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>

                            {/* 썸네일 이미지 첨부 */}
                            <FormGroup className="position-relative">
                                <Label className="input_title" style={{ minWidth: "fit-content" }}>
                                    썸네일<span className="required">*</span>
                                </Label>
                                <Tippy content="상품 이미지 첨부하기" theme="custom">
                                    <img src="/Paperclip.svg" className="pointer" onClick={() => thumbRef.current.click()} />
                                </Tippy>
                                {/* ↓선택된 파일 갖고있는 용 */}
                                <Input type="file" name="thumbnailFileIdx" accept="image/*" innerRef={thumbRef} onChange={handleThumbChange} hidden />

                                {/* 이미지 미리보기 */}
                                {thumbPreview && (
                                    <div id="thumbPreview" className="img_previewBox">
                                        <div className="preview-wrap">
                                            <img src={thumbPreview} className="preview-img" />
                                            <button type="button" className="delete-btn" onClick={deleteThumb}>
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FormGroup>

                            {/* 추가 이미지 첨부 */}
                            <FormGroup className="position-relative">
                                <Label className="input_title">추가이미지 (최대 5장까지)</Label>
                                <Tippy content="상품의 추가이미지 첨부하기" theme="custom">
                                    <img src="/Paperclip.svg" className="pointer" onClick={() => addRef.current.click()} />
                                </Tippy>

                                {/* ↓선택된 파일 갖고있는 용 */}
                                <Input type="file" name="addImageFiles" accept="image/*" innerRef={addRef} onChange={handleAddChange} multiple hidden />

                                {/* 이미지 미리보기 */}
                                {addPreviewList.length > 0 && (
                                    <div className="img_previewBox">
                                        {addPreviewList.map((img, idx) => (
                                            <div key={idx} className="preview-wrap">
                                                <img src={img} className="preview-img" />
                                                <button className="delete-btn" onClick={() => deleteAddImage(idx)}>
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FormGroup>

                            {/* 상세 이미지 첨부 */}
                            <FormGroup className="position-relative mb-4">
                                <Label className="input_title">
                                    상세이미지 (최대 2장)<span className="required">*</span>
                                </Label>
                                <Tippy content="본문 상세 이미지 첨부하기" theme="custom">
                                    <img src="/Paperclip.svg" className="pointer" onClick={() => detailRef.current.click()} />
                                </Tippy>

                                {/* ↓선택된 파일 갖고있는 용 */}
                                <Input type="file" name="detailImageFiles" accept="image/*" innerRef={detailRef} onChange={handleDetailChange} multiple hidden />

                                {/* 이미지 미리보기 */}
                                {detailPreviewList.length > 0 && (
                                    <div className="img_previewBox">
                                        {detailPreviewList.map((img, idx) => (
                                            <div key={idx} className="preview-wrap">
                                                <img src={img} className="preview-img" />
                                                <button className="delete-btn" onClick={() => deleteDetailImage(idx)}>
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                        placeholder="가격을 입력하세요"
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
                                    <Label for="examplePassword" className="input_title">
                                        판매가
                                    </Label>
                                    <div className="unit_set">
                                        <Input
                                            className=" unit"
                                            value={salePrice}
                                            placeholder="실제 판매하실 가격을 입력하세요"
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
                                    <Label for="examplePassword" className="input_title">
                                        할인율
                                    </Label>
                                    <div className="unit_set">
                                        <Input
                                            className=" unit"
                                            value={discountRate}
                                            placeholder="할인율을 입력하세요"
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
                                                                        value={formatNumber(val.price)}
                                                                        onChange={(e) => {
                                                                            const raw = toNumber(e.target.value); // , 제거
                                                                            const updated = [...options];
                                                                            updated[optionIdx].values[valueIdx].price = raw; // 숫자만 저장
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
                            <button type="button" className="primary-button saveBtn" onClick={onSubmit}>
                                등록 <i className="bi bi-arrow-right-short"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
