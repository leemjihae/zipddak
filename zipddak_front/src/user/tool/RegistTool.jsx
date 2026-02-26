import { SquarePlus, ChevronDown, MapPinned, Plus, CircleMinus, Minus, X } from "lucide-react";
import "../css/RegistTool.css";
import { Input, FormGroup, Label, Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { Modal as AddrModal } from "antd";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export default function RegistTool() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    //스크롤 탑
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const [tool, setTool] = useState({
        toolIdx: null,
        name: "",
        category: "83",
        rentalPrice: "",
        freeRental: false,
        content: "",
        directRental: false,
        postRental: false,
        freePost: false,
        postCharge: "",
        zonecode: "",
        addr1: "",
        addr2: "",
        postRequest: "배송시 요청사항 없음",
        satus: "ABLE",
        owner: "",
        thunbnail: null,
        img1: null,
        img2: null,
        img3: null,
        img4: null,
        img5: null,
        quickRental: false,
        settleBank: "",
        settleAccount: "",
        settleHost: "",
        tradeAddr1: "",
        tradeAddr2: "",
        tradeZonecode: "",
    });

    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const ChangeInput = (e) => {
        setTool({ ...tool, [e.target.name]: e.target.value });
    };

    //파일
    const fileRef = useRef(null);
    const detailRefs = useRef([]);
    const [thumbPreview, setThumbPreview] = useState();
    const [thumbnailFile, setThumbnailFile] = useState();

    const [detailImages, setDetailImages] = useState([]);

    const handleDetailChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const newImages = [...detailImages];
        newImages[index] = {
            file,
            preview: URL.createObjectURL(file),
        };

        setDetailImages(newImages);
    };

    const handleThumbRemove = (e) => {
        e.stopPropagation();
        if (thumbPreview) {
            URL.revokeObjectURL(thumbPreview); // 메모리 해제
        }

        setThumbPreview(undefined);
        setThumbnailFile(undefined);

        // input[type=file] 값 초기화
        if (fileRef.current) {
            fileRef.current.value = "";
        }
    };

    const handleDetailRemove = (e, index) => {
        e.stopPropagation();
        setDetailImages(prev => {
            const copy = [...prev];

            // blob 메모리 해제
            if (copy[index]?.preview) {
                URL.revokeObjectURL(copy[index].preview);
            }

            copy.splice(index, 1);
            return copy;
        });
    };

    //주소
    const [isAddOpen, setIsAddOpen] = useState(false);
    const complateHandler = (data) => {
        setTool({
            ...tool,
            zonecode: data.zonecode,
            addr1: data.address,
        });
    };
    const closeHandler = () => {
        setIsAddOpen(false);
    };

    //지도 주소

    const [isMapOpen, setIsMapOpen] = useState(false);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const fixedMarker = useRef(null);
    const clickMarker = useRef(null);
    const infowindow = useRef(null);

    const [clickedAddress, setClickedAddress] = useState("");
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        if (!isMapOpen || !window.kakao || !user?.addr1) return;

        map.current = new window.kakao.maps.Map(mapContainer.current, {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
            level: 1,
        });

        // 마커 이미지 설정
            const imageSrc =  "/zipddak_pin.png",
                imageSize = new window.kakao.maps.Size(64, 69),
                imageOption = { offset: new window.kakao.maps.Point(27, 69) };

            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        infowindow.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        const geocoder = new window.kakao.maps.services.Geocoder();

        // 고정 마커
        geocoder.addressSearch(user.addr1, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                map.current.setCenter(coords);

                fixedMarker.current = new window.kakao.maps.Marker({
                    position: coords,
                    map: map.current,
                    title: "내 주소",
                    image: markerImage,
                });

                // fixedMarker 클릭 시 선택
                window.kakao.maps.event.addListener(fixedMarker.current, "click", () => {
                    const address = result[0].address.address_name;
                    infowindow.current.setContent(
                        `<div style="padding:5px;">${address}</div>`
                    );
                    infowindow.current.open(map.current, fixedMarker.current);

                    setClickedAddress(address);
                    setSelectedMarker(fixedMarker.current);
                });
            }
        });

        // 클릭 마커 생성 (처음 안보임)
        clickMarker.current = new window.kakao.maps.Marker({ map: map.current,image: markerImage, });
        clickMarker.current.setMap(null);

        // 지도 클릭 시 클릭 마커 이동/표시
        map.current.addListener("click", (mouseEvent) => {
            const latlng = mouseEvent.latLng;

            clickMarker.current.setPosition(latlng);
            clickMarker.current.setMap(map.current);

            geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (res, stat) => {
                if (stat === window.kakao.maps.services.Status.OK) {
                    const detailAddr = res[0].address.address_name;
                    infowindow.current.setContent(
                        `<div style="padding:5px;">${detailAddr}</div>`
                    );
                    infowindow.current.open(map.current, clickMarker.current);

                    setClickedAddress(detailAddr);
                    setSelectedMarker(clickMarker.current);
                }
            });
        });
    }, [isMapOpen, user]);


    const handleSave = () => {
        if (!selectedMarker) return alert("마커를 선택하세요!");
        setIsMapOpen(false);
    };


    //무료 대여
    const [freeRental, setFreeRental] = useState(false);
    useEffect(() => {
        if (freeRental) {
            setTool((prev) => ({
                ...prev,
                rentalPrice: 0,
            }));
        }
    }, [freeRental]);

    //바로대여 여부
    const [quickRental, setQuickRental] = useState(false);

    //거래방식
    const [postRental, setPostRental] = useState(false);
    const [directRental, setDirectRental] = useState(false);

    //무료배송 여부
    const [freePost, setFreePost] = useState(false);

    useEffect(() => {
        if (freePost) {
            setTool((prev) => ({
                ...prev,
                postCharge: 0,
            }));
        }
    }, [freePost]);

    //주소지 설정
    const [useProfile, setUseProfile] = useState(false);
    useEffect(() => {
        if (useProfile && user) {
            setTool((prev) => ({
                ...prev,
                addr1: user.addr1 ?? "",
                addr2: user.addr2 ?? "",
                zonecode: user.zonecode ?? "",
            }));
        }

        if (!useProfile) {
            // 직접 입력 → 초기화
            setTool((prev) => ({
                ...prev,
                addr1: "",
                addr2: "",
                zonecode: "",
            }));
        }
    }, [useProfile, user]);

    //계좌
    const [userBank, setUserBank] = useState(true);
    useEffect(() => {
        if (userBank && user) {
            // 기본 계좌 사용
            setTool((prev) => ({
                ...prev,
                settleBank: user.settleBank ?? "",
                settleAccount: user.settleAccount ?? "",
                settleHost: user.settleHost ?? "",
            }));
        }

        if (!userBank) {
            // 직접 입력 → 초기화
            setTool((prev) => ({
                ...prev,
                settleBank: "",
                settleAccount: "",
                settleHost: "",
            }));
        }
    }, [userBank, user]);

    //대여 가능 상태설정
    const [toolStatus, setToolStatus] = useState("ABLE");

    //등록
    const regist = () => {
        console.log("why ");
        console.log(clickedAddress)

        const submitTool = {
            ...tool,
            owner: user.username,
            freeRental,
            quickRental,
            postRental,
            directRental,
            freePost,
            postCharge: postRental? tool.postCharge: 0,
            tradeAddr1: clickedAddress

        };

        if (!checkOption(submitTool)) return;

        const formData = new FormData();
        formData.append("tool", new Blob([JSON.stringify(submitTool)], { type: "application/json" }));

        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile);
        }

        detailImages.forEach((img) => {
            formData.append("images", img.file);
        });

        token &&
            myAxios(token, setToken)
                .post("/tool/regist", formData)

                .then((res) => {
                    console.log("inAxios");
                    if (res.data) {
                        setMessage("공구 등록 완료!");
                        setModal(true);
                    } else {
                        setMessage("공구 등록 실패");
                        setModal(true);
                    }
                    const toolIdx = res.data;
                    navigate(`/zipddak/tool/${toolIdx}`);
                })
                .catch((err) => {
                    console.log(err);
                });
    };

    //항목확인
    const checkOption = (submitTool) => {
        switch (true) {
            case !submitTool.name:
                setMessage("공구 이름을 등록해주세요");
                break;

            case submitTool.rentalPrice === "" || submitTool.rentalPrice == null:
                setMessage("공구 1일 대여 금액을 설정해주세요");
                break;

            case !submitTool.zonecode && !submitTool.tradeAddr1:
                setMessage("거래방식을 선택해주세요");
                break;

            case submitTool.postRental && (!submitTool.zonecode || !submitTool.addr1 || !submitTool.addr2):
                setMessage("택배거래시 공구를 되돌려받을 주소를 입력해주세요");
                break;

            case submitTool.postRental && submitTool.postCharge == null:
                setMessage("택배거래시 배송비를 설정해주세요");
                break;

            case !submitTool.settleAccount:
                setMessage("정산 계좌를 설정해주세요");
                break;

            default:
                return true;
        }

        setModal(true);
        return false;
    };

    return (
        <>
            <div className="regTool-container">
                <div className="regTool">
                    <div className="r-title">
                        <SquarePlus />
                        <span>내 공구 등록/수정</span>
                    </div>

                    <div className="regToolForm">
                        <div className="options">
                            <div className="row-cm" style={{ gap: "5px" }}>
                                <span className="o-label">공구명</span>
                                <span className="orange oFont">*</span>
                            </div>
                            <Input placeholder="상품명을 입력하세요" name="name" type="text" onChange={ChangeInput} />
                        </div>

                        <div className="options">
                            <span className="o-label">공구 썸네일</span>
                            <div className={thumbPreview ? "thumbnail" : "thumbnail add"} onClick={() => fileRef.current?.click()}>
                                {thumbPreview ?
                                    <>
                                        <img src={thumbPreview} alt="공구" />
                                        <button className="imgDeleteButton" onClick={(e) => handleThumbRemove(e)}><Minus color="#ffff" /></button>
                                    </>
                                    :
                                    <Plus size={50} color="#B6BCC9" strokeWidth={0.5} />}
                            </div>
                            <Input
                                type="file"
                                innerRef={fileRef}
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    setThumbnailFile(file);
                                    setThumbPreview(URL.createObjectURL(file));
                                }}
                            />
                        </div>

                        <div className="options">
                            <span className="o-label">상세이미지 (최대 5장)</span>

                            <div className="row-cm detail-img-list">
                                {/* 기존 이미지들 */}
                                {detailImages.map((img, idx) => (
                                    <div key={idx} className="thumbnail" onClick={() => detailRefs.current[idx]?.click()}>
                                        <img src={img.preview} alt={`detail-${idx}`} />
                                        <button className="imgDeleteButton" onClick={(e, idx) => handleDetailRemove(e, idx)}><Minus color="#ffff" /></button>

                                        <Input type="file" hidden accept="image/*" innerRef={(el) => (detailRefs.current[idx] = el)} onChange={(e) => handleDetailChange(e, idx)} />
                                    </div>
                                ))}

                                {/* + 버튼 (5개 미만일 때만) */}
                                {detailImages.length < 5 && (
                                    <div className="thumbnail add" onClick={() => detailRefs.current[detailImages.length]?.click()}>
                                        <Plus size={40} color="#B6BCC9" strokeWidth={0.5} />

                                        <Input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            innerRef={(el) => (detailRefs.current[detailImages.length] = el)}
                                            onChange={(e) => handleDetailChange(e, detailImages.length)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="options">
                            <div className="row-cm" style={{ gap: "5px" }}>
                                <span className="o-label">카테고리</span>
                                <span className="orange oFont">*</span>
                            </div>
                            <div className="check-col">
                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={83} checked={tool.category == 83}
                                            onChange={() => setTool(prev => ({ ...prev, category: 83 }))} /> 전동공구
                                    </Label>
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={84} checked={tool.category == 84}
                                            onChange={() => setTool(prev => ({ ...prev, category: 84 }))} /> 일반공구
                                    </Label>
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={85} checked={tool.category == 85}
                                            onChange={() => setTool(prev => ({ ...prev, category: 85 }))} /> 생활용품
                                    </Label>
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={86} checked={tool.category == 86}
                                            onChange={() => setTool(prev => ({ ...prev, category: 86 }))} />
                                        기타공구
                                    </Label>
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={87} checked={tool.category == 87}
                                            onChange={() => setTool(prev => ({ ...prev, category: 87 }))} />
                                        찾아요
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>

                        <div className="options">
                            <div className="row-cm" style={{ gap: "5px" }}>
                                <span className="o-label">1일 대여비</span>
                                <span className="orange oFont">*</span>
                            </div>
                            <div className="check-col">
                                <div className="won">
                                    <Input type="number" name="rentalPrice" className="wonInput" placeholder="1일 대여비" value={tool.rentalPrice} readOnly={freeRental} onChange={ChangeInput} />
                                    <span>원</span>
                                </div>
                                <FormGroup check>
                                    <Label check>
                                        <Input name="freeRental" id="checkbox2" type="checkbox" checked={freeRental} onChange={() => setFreeRental((prev) => !prev)} /> 무료대여
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>

                        <div className="options">
                            <span className="o-label">공구 상세설명</span>
                            <Input type="textarea" name="content" placeholder="공구의 상세한 설명을 적어주세요! (최대 2000자)" className="ttextarea" onChange={ChangeInput} />
                        </div>

                        <div className="options">
                            <div className="row-cm" style={{ gap: "5px" }}>
                                <span className="o-label">결제옵션</span>
                                <span className="orange oFont">*</span>
                            </div>
                            <div className="check-col">
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" defaultChecked disabled /> 문의후 대여
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input name="quickRental" type="checkbox" checked={quickRental} onChange={() => setQuickRental((prev) => !prev)} /> 바로대여
                                    </Label>
                                </FormGroup>
                                <span className="check-detail">바로대여 기능 선택 시 대여자가 조율 없이 대여기간, 대여 일정을 설정합니다</span>
                            </div>
                        </div>

                        <div className="options">
                            <div className="row-cm" style={{ gap: "5px" }}>
                                <span className="o-label">거래방식</span>
                                <span className="orange oFont">*</span>
                            </div>
                            <div className="check-col">
                                <FormGroup check>
                                    <Label check>
                                        <Input name="postRental" type="checkbox" checked={postRental} onChange={() => setPostRental((prev) => !prev)} /> 택배 배송
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input name="directRental" type="checkbox" checked={directRental} onChange={() => setDirectRental((prev) => !prev)} /> 직접 픽업
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>

                        {postRental && (
                            <div className="options">
                                <span className="o-label">배송비</span>
                                <div className="check-col">
                                    <div className="won">
                                        <Input type="number" name="postCharge" className="wonInput" placeholder="배송비" value={tool.postCharge} readOnly={freePost} onChange={ChangeInput} />
                                        <span>원</span>
                                    </div>
                                    <FormGroup check>
                                        <Label check>
                                            <Input name="freePost" type="checkbox" checked={freePost} onChange={() => setFreePost((prev) => !prev)} /> 무료배송
                                        </Label>
                                    </FormGroup>
                                </div>
                            </div>
                        )}

                        {postRental && (
                            <div className="options">
                                <div className="row-cm" style={{ gap: "5px" }}>
                                    <span className="o-label">받을 주소</span>
                                    <span className="orange oFont">*</span>
                                </div>
                                <div className="post-box">
                                    {user.addr1 && (
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="radio" checked={useProfile === true} onChange={() => setUseProfile(true)} />
                                                기본 주소지 (프로필 주소지)
                                            </Label>
                                        </FormGroup>
                                    )}
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="radio" checked={useProfile === false} onChange={() => setUseProfile(false)} /> 직접 입력
                                        </Label>
                                    </FormGroup>
                                    <div className="check-col">
                                        <Input className="zonecodeInput" type="text" name="zonecode" placeholder="우편번호" value={tool.zonecode} readOnly />
                                        {!useProfile && (
                                            <Button className="primary-button" onClick={() => setIsAddOpen(!isAddOpen)}>
                                                주소검색
                                            </Button>
                                        )}
                                    </div>
                                    <Input type="text" name="addr1" placeholder="지번/도로명주소" value={tool.addr1} readOnly />
                                    <Input type="text" name="addr2" placeholder="상세주소" value={tool.addr2} readOnly={useProfile} onChange={useProfile ? undefined : ChangeInput} />

                                    <Input name="postRequest" type="select" className="toolBank pqSelect" value={tool.postRequest} onChange={ChangeInput}>
                                        <option value={"배송시 요청사항 없음"}>배송시 요청사항</option>
                                        <option value={"문앞에 놔주세요"}>문앞에 놔주세요</option>
                                        <option value={"경비실에 맡겨주세요"}>경비실에 맡겨주세요</option>
                                    </Input>
                                </div>
                            </div>
                        )}

                        {isAddOpen && (
                            <AddrModal title="주소찾기" open={isAddOpen} footer={null} onCancel={() => setIsAddOpen(false)}>
                                <DaumPostcode onComplete={complateHandler} onClose={closeHandler} />
                            </AddrModal>
                        )}

                        {directRental && (
                            <div className="options">
                                <div className="row-cm" style={{ gap: "5px" }}>
                                    <span className="o-label">거래 희망장소</span>
                                    <span className="orange oFont">*</span>
                                </div>
    
                                <div className="check-col">
                                    <div className="location-box" style={{ width: "400px" }}>
                                        <input className="location" type="text" placeholder="지도에서 찾기" value={clickedAddress} readOnly

                                        ></input>
                                        <div className="">
                                            <Button className="primary-button mapPinI" onClick={() => { setIsMapOpen(true) }}>
                                                <MapPinned size={20} />
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                                <Input type="text" name="tradeAddr2" placeholder="추가 설명" maxLength={60} onChange={ChangeInput} />
                            </div>
                        )}

                        {isMapOpen && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100vw",
                                    height: "100vh",
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 1000,
                                }}
                            >
                                <div
                                    style={{
                                        width: "90%",
                                        maxWidth: "600px",
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        padding: "16px",
                                        position: "relative",
                                    }}
                                >
                                    <div className="row-cm">
                                        <div className="o-label">거래 희망 장소 선택</div>
                                    <button
                                        onClick={() => setIsMapOpen(false)}
                                        style={{ position: "absolute", top: 8, right: 8 , 
                                            backgroundColor:"transparent",
                                            border:"none"
                                        }}
                                    >
                                        <X />
                                    </button>
                                    </div>

                                    <div
                                        ref={mapContainer}
                                        style={{ width: "100%", height: "400px", marginBottom: "10px", marginTop: "25px" }}
                                    />

                                    <input
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        value={clickedAddress}
                                        onChange={(e) => setClickedAddress(e.target.value)}
                                        style={{ width: "100%", marginBottom: "10px" }}
                                    />

                                    <button className="primary-button" onClick={handleSave} style={{ width: "100%" }}>
                                        주소 저장
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="options">
                            <div className="row-cm">
                                <div className="row-cm" style={{ gap: "5px" }}>
                                    <span className="o-label">계좌번호</span>
                                    <span className="orange oFont">*</span>
                                </div>
                                {/* <span className="necc">*</span> */}
                            </div>
                            {user.settleAccount && (
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" checked={userBank === true} onChange={() => setUserBank(true)} />
                                        기본 계좌 (프로필 계좌)
                                    </Label>
                                </FormGroup>
                            )}
                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" checked={userBank === false} onChange={() => setUserBank(false)} /> 직접 입력
                                </Label>
                            </FormGroup>
                            <div className="input_detail">정산이 이루어지는 계좌입니다. 마이페이지의 정산계좌로 등록됩니다.</div>
                            {userBank ? (
                                <Input name="settleBank" type="text" className="toolBank sbSelect" value={tool.settleBank} readOnly />
                            ) : (
                                <Input name="settleBank" type="select" className="toolBank sbSelect" value={tool.settleBank} onChange={ChangeInput}>
                                    <option>은행 선택</option>
                                    <option value={"국민은행"}>국민은행</option>
                                    <option value={"신한은행"}>신한은행</option>
                                    <option value={"농협은행"}>농협은행</option>
                                    <option value={"카카오뱅크"}>카카오뱅크</option>
                                </Input>
                            )}

                            <Input
                                className="toolBank"
                                name="settleAccount"
                                placeholder="'-'제외 숫자로만 계좌번호 입력"
                                type="number"
                                value={tool.settleAccount}
                                readOnly={userBank}
                                onChange={userBank ? undefined : ChangeInput}
                            />
                            <Input className="toolBank" name="settleHost" placeholder="예금주" type="text" value={tool.settleHost} readOnly={userBank} onChange={userBank ? undefined : ChangeInput} />
                        </div>

                        <div className="options">
                            <span className="o-label">대여상태 설정</span>
                            <div className="check-col">
                                <FormGroup check>
                                    <Label check>
                                        <Input name="satus" type="radio" value={"ABLE"} checked={toolStatus == "ABLE"}
                                            onChange={() => {
                                                setToolStatus("ABLE");
                                                setTool(prev => ({ ...prev, satus: "ABLE" }));
                                            }} /> 대여가능
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input name="satus" type="radio" value={"INABLE"} checked={toolStatus == "INABLE"}
                                            onChange={() => {
                                                setToolStatus("INABLE");
                                                setTool(prev => ({ ...prev, satus: "INABLE" }));
                                            }} /> 대여중지
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                    <div className="btn-col">
                        <Button className="tertiary-button" onClick={() => navigate(`/zipddak/tool`)}>작성취소</Button>
                        <Button className="primary-button" onClick={regist}>
                            작성완료
                        </Button>
                    </div>
                </div>

                <Modal isOpen={modal}>
                    <ModalHeader>회원가입</ModalHeader>
                    <ModalBody>{message}</ModalBody>
                    <Button color="primary-button" onClick={() => setModal(false)}>
                        확인
                    </Button>
                </Modal>
            </div>
        </>
    );
}
