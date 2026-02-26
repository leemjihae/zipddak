//js
import usePageTitle from "../js/usePageTitle.jsx";
import useModifyImgUpload from "../js/useModifyImgUpload.jsx";
import useCommaNumber from "../js/useCommaNumber.jsx";

// library
import { useState, useEffect, useCallback } from "react";
import { FormGroup, Input, Label, FormFeedback } from "reactstrap";
import Tippy from "@tippyjs/react";
import { myAxios, baseUrl } from "../../config.jsx";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";
import DaumPostcode from "react-daum-postcode";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "antd";

export default function MyProfile() {
    const pageTitle = usePageTitle("설정 > 프로필 관리");
    const navigate = useNavigate();
    const { sellerIdx } = useParams();

    const [user] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const shippingFee = useCommaNumber(); //기본 배송비
    const freeShippingLimit = useCommaNumber(); //무료배송 기준금액

    // -----------------------------
    // 기본정보 state
    // -----------------------------
    //이미지
    const {
        thumbRef,
        oldThumb,
        newThumbFile,
        deleteThumbIdx,

        setOldThumb,
        changeThumb,
        deleteThumb,

        validateBeforeSubmit,
        resetImageState,
    } = useModifyImgUpload({ requireDetailImage: false, maxDetailImages: 0 });

    //상호명
    const [brandName, setBrandName] = useState("");

    //홈페이지
    const [homepage, setHomepage] = useState("");

    //취급품목 선택
    const [handleItems, setHandleItems] = useState([]); //취급품목 목록 로딩
    const [selectedHandleItemIdx, setSelectedHandleItemIdx] = useState([]); //기존 선택했던 취급품목
    // 취급품목 리스트 세팅
    useEffect(() => {
        user.username &&
            myAxios(token, setToken)
                .get("/seller/product/categories/all")
                .then((res) => setHandleItems(res.data))
                .catch(() => alert("취급품목 로드 실패"));
    }, [user]);

    //출고지주소
    const [shipOutAddr, setShipOutAddr] = useState({
        zipcode: "",
        address: "",
        detailAddress: "",
    });

    //소개글
    const [introduction, setIntroduction] = useState("");

    // const [sellerId, setSellerId] = useState(0);

    //화면 새로고침용
    const [reloadKey, setReloadKey] = useState(0);
    const forceReload = () => {
        setReloadKey((prev) => prev + 1);
    };

    // -----------------------------
    // 기존 정보 불러오기
    // -----------------------------
    const fetchSellerProfile = useCallback(async () => {
        if (!user.username || !user) return;

        const params = new URLSearchParams({
            sellerId: user.username,
        });

        const sellerProfileUrl = `/seller/mypage/myProfile?${params}`;
        user.username &&
            (await myAxios(token, setToken)
                .get(sellerProfileUrl)
                .then((res) => {
                    const sellerProfile = res.data;

                    // 기존 로고 이미지
                    setOldThumb({
                        filename: sellerProfile.logoFileRename,
                        idx: sellerProfile.logoFileIdx,
                    });

                    //상호명
                    setBrandName(sellerProfile.brandName);

                    //홈페이지
                    setHomepage(sellerProfile.compHp);

                    //취급품목
                    setSelectedHandleItemIdx(sellerProfile.handleItemCateIdx.split(",").map(Number));

                    console.log("handleItems : " + handleItems);

                    setShipOutAddr({
                        zipcode: sellerProfile.pickupZonecode,
                        address: sellerProfile.pickupAddr1,
                        detailAddress: sellerProfile.pickupAddr2,
                    });

                    //기본 배송비
                    shippingFee.init(sellerProfile.basicPostCharge);

                    //무료배송 기준금액
                    freeShippingLimit.init(sellerProfile.freeChargeAmount);

                    //소개글
                    setIntroduction(sellerProfile.introduction);

                    // setSellerId(sellerProfile.sellerIdx);
                })
                .catch((err) => {
                    console.log(err.message);
                    console.log("error data : " + err.response.data.message);

                    if (err.response && err.response.data) {
                        alert("프로필 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
                        forceReload();
                    }
                }));
    }, [user?.username, token]);

    useEffect(() => {
        fetchSellerProfile();
    }, [fetchSellerProfile]);

    // -----------------------------
    // 주소 검색
    // -----------------------------
    const complateHandler = (data) => {
        console.log(data);
        let { zonecode, address } = data; //data중 원하는 데이터만 가져옴
        setShipOutAddr({ ...address, zipcode: zonecode, address: address });
    };

    const closeHandler = (state) => {
        // console.log(state);
        setIsPostModalOpen(false);
    };

    // -----------------------------
    // 체크박스 토글
    // -----------------------------
    const handleToggleHandleItem = (categoryIdx) => {
        setSelectedHandleItemIdx((prev) => {
            // 이미 선택된 경우 (제거)
            if (prev.includes(categoryIdx)) {
                return prev.filter((id) => id !== categoryIdx);
            }
            // 선택 안 된 경우 (추가)
            return [...prev, categoryIdx];
        });
    };

    // -----------------------------
    // 수정 폼 제출
    // -----------------------------
    const onModifySubmit = async (e) => {
        try {
            if (!validateBeforeSubmit()) return;

            const formData = new FormData();

            // 1) 이미지
            //기존 로고이미지 삭제시
            if (deleteThumbIdx) formData.append("deleteThumbIdx", deleteThumbIdx);
            //새로운 로고이미지 첨부시
            if (newThumbFile) formData.append("thumbnailFile", newThumbFile);

            // 2) 상호명
            formData.append("brandName", brandName);

            // 3) 홈페이지
            formData.append("compHp", homepage);

            // 4) 취급품목
            selectedHandleItemIdx.forEach((idx) => {
                formData.append("handleItemCateIdx", idx);
            });

            // 5) 출고지주소
            formData.append("pickupZonecode", shipOutAddr.zipcode);
            formData.append("pickupAddr1", shipOutAddr.address);
            formData.append("pickupAddr2", shipOutAddr.detailAddress);

            // 6) 기본 배송비
            formData.append("basicPostCharge", shippingFee.value);

            // 7) 무료배송 기준금액
            formData.append("freeChargeAmount", freeShippingLimit.value);

            // 8) 소개글
            formData.append("introduction", introduction);

            formData.append("sellerId", user.username);

            // for (let pair of formData.entries()) {
            //     console.log(pair[0], pair[1]);
            // }

            // 서버 전송
            const ProfileModifyUrl = `/seller/mypage/myProfileModify`;
            const res = await myAxios(token, setToken).post(ProfileModifyUrl, formData);
            if (res.data.success) {
                alert(res.data.message);
                resetImageState();
                await fetchSellerProfile();
            } else {
                alert(res.data.message);
                forceReload();
            }
        } catch (err) {
            console.log(err.message);
            console.log("error data : " + err.response.data.message);

            if (err.response && err.response.data) {
                alert("수정사항 등록 중 오류발생. 잠시 후 다시 시도해주세요.");
                forceReload();
            }
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
                        <i className="bi bi-person-circle" />
                        <span>프로필 관리</span>
                    </div>

                    <div className="bodyFrame">
                        <div className="descript">
                            <span className="required">*</span> : 필수 입력
                        </div>

                        {/* 로고 이미지 첨부 */}
                        <FormGroup className="position-relative">
                            <Label className="input_title" style={{ minWidth: "fit-content" }}>
                                로고<span className="required">*</span>
                            </Label>
                            <Tippy content="로고 이미지를 교체하시려면 클릭하세요." theme="custom">
                                <img src="/Paperclip.svg" className="pointer" onClick={() => thumbRef.current.click()} />
                            </Tippy>
                            <Input type="file" accept="image/*" innerRef={thumbRef} onChange={changeThumb} hidden />

                            {/* 이미지 미리보기 */}
                            <div className="img_previewBox">
                                {/* 기존 첨부된 이미지 미리보기 */}
                                {oldThumb && !newThumbFile && (
                                    <div className="preview-wrap">
                                        <img src={oldThumb.idx ? `${baseUrl}/imageView?type=seller&filename=${oldThumb.filename}` : "/no_img.svg"} className="preview-img" />
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

                        {/* 상호명 입력 */}
                        <FormGroup className="position-relative">
                            <Label for="sellerBrandName" className="input_title">
                                상점 이름<span className="required">*</span>
                            </Label>
                            <Input type="text" id="sellerBrandName" placeholder="상점명을 입력하세요." value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                            {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                        </FormGroup>

                        {/* 홈페이지 */}
                        <FormGroup className="position-relative mb-4">
                            <Label for="sellerHomepage" className="input_title">
                                홈페이지<span className="required">*</span>
                            </Label>
                            <Input type="text" id="sellerHomepage" placeholder="홈페이지가 있다면 홈페이지 주소를 입력해주세요." value={homepage} onChange={(e) => setHomepage(e.target.value)} />
                            {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                        </FormGroup>

                        {/* 취급품목 */}
                        <FormGroup className="position-relative">
                            <Label className="input_title">
                                취급 카테고리<span className="required">*</span>
                            </Label>
                            <div>
                                {handleItems.map((handle) => (
                                    <FormGroup key={handle.categoryIdx} check inline className="mt-2">
                                        <Label check>
                                            <Input type="checkbox" checked={selectedHandleItemIdx.includes(handle.categoryIdx)} onChange={() => handleToggleHandleItem(handle.categoryIdx)} />
                                            {handle.name}
                                        </Label>
                                    </FormGroup>
                                ))}
                            </div>
                        </FormGroup>

                        {/* 출고지 주소 */}
                        <FormGroup className=" position-relative mb-4">
                            <div className="unit_set">
                                <Label className="input_title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    출고지 주소
                                    <Tippy content="주소 검색" theme="custom">
                                        <button type="button" className="small-button" onClick={() => setIsPostModalOpen(!isPostModalOpen)}>
                                            <i className="bi bi-search"></i>
                                        </button>
                                    </Tippy>
                                </Label>
                                <span> *상품등록시 '직접 픽업'을 선택할 경우 이 주소지가 노출됩니다.</span>
                            </div>
                            <div className="addr_column mb-2">
                                <Input style={{ width: "30%" }} placeholder="우편번호" value={shipOutAddr.zipcode} readOnly />
                                <Input style={{ width: "70%" }} placeholder="도로명주소" value={shipOutAddr.address} readOnly />
                            </div>
                            <div className="addr_column ">
                                <Input
                                    type="text"
                                    placeholder="상세주소"
                                    value={shipOutAddr.detailAddress}
                                    onChange={(e) =>
                                        setShipOutAddr((prev) => ({
                                            ...prev,
                                            detailAddress: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </FormGroup>

                        {/* 기본 배송비 */}
                        <FormGroup className="position-relative">
                            <Label className="input_title">기본 배송비</Label>
                            <div className="unit_set">
                                <Input className=" unit" type="text" value={shippingFee.display} placeholder="기본배송비를 입력하세요" onChange={(e) => shippingFee.handleChange(e.target.value)} />
                                {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                                <span style={{ width: "100%" }}>원</span>
                            </div>
                        </FormGroup>

                        {/* 무료배송 */}
                        <FormGroup className="position-relative">
                            <Label className="input_title">무료배송 기준 금액</Label>
                            <div className="unit_set">
                                <Input className=" unit" type="text" value={freeShippingLimit.display} placeholder="무료배송 기준금액을 입력하세요" onChange={(e) => freeShippingLimit.handleChange(e.target.value)} />
                                <span style={{ width: "100%" }}>원 이상 구매시 (묶음배송 상품만 해당)</span>
                            </div>
                        </FormGroup>

                        {/* 소개글 */}
                        <FormGroup className="position-relative">
                            <Label className="input_title">상점 소개</Label>
                            <Input type="textarea" value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
                        </FormGroup>
                        <div className="btn_part">
                            <button type="button" className="primary-button saveBtn" onClick={onModifySubmit}>
                                저장 <i className="bi bi-arrow-right-short"></i>
                            </button>
                        </div>

                        {isPostModalOpen && (
                            <Modal title="주소 검색" open={isPostModalOpen} footer={null} onCancel={() => setIsPostModalOpen(false)}>
                                <DaumPostcode onComplete={complateHandler} onClose={closeHandler} />
                            </Modal>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
