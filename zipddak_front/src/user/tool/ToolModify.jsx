import { SquarePlus, ChevronDown, MapPinned, Plus, Minus } from "lucide-react";
import "../css/RegistTool.css";
import { Input, FormGroup, Label, Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { Modal as AddrModal } from "antd";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export default function ModifyTool() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const { toolIdx } = useParams();


    //기존 공구, rename값을 가진 dto
    const [tool, setTool] = useState();

    //공구 정보 불러오기
    const getTool = () => {
        const params = {
            toolIdx: toolIdx,
            username: user.username,
        };

        token &&
            myAxios(token, setToken)
                .get(`/tool/detail`, { params })
                .then((res) => {
                    console.log(res.data);
                    setTool(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
    };

    useEffect(() => {
        getTool();
    }, []);


    //스크롤 탑
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [tool])


    //수정할 공구 값
    const [toolModify, setToolModify] = useState({});
    useEffect(() => {
        if (tool) {
            setToolModify({ ...tool });
            setFreeRental(tool.freeRental);
            setQuickRental(tool.quickRental);
            setPostRental(tool.postRental);
            setDirectRental(tool.directRental);
            setFreePost(tool.freePost);
            setToolStatus(tool.satus);
        }
    }, [tool]);

    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const ChangeInput = (e) => {
        setToolModify({ ...toolModify, [e.target.name]: e.target.value });
    };

    //기존 이미지
    const [oldThumbnail, setOldThumbnail] = useState();

    useEffect(() => {

        if (!tool) return;
        console.log("tool.thumbnail:", tool.thunbnail);
        setOldThumbnail(tool.thunbnail);

    }, [tool])

    //파일
    const fileRef = useRef(null);
    const detailRefs = useRef([]);
    const [thumbPreview, setThumbPreview] = useState();

    const [thumbnailFile, setThumbnailFile] = useState();

    const [detailSlots, setDetailSlots] = useState([
        null, null, null, null, null
    ]);

    useEffect(() => {
        if (!tool) return;

        setDetailSlots([
            tool.img0 ?? null,
            tool.img1 ?? null,
            tool.img2 ?? null,
            tool.img3 ?? null,
            tool.img4 ?? null,
        ]);
    }, [tool]);

    const handleDetailChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setDetailSlots(prev => {
            const copy = [...prev];
            copy[index] = {
                file,
                preview: URL.createObjectURL(file),
            };
            return copy;
        });
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

        setDetailSlots(prev => {
            const copy = [...prev];

            if (copy[index]?.preview) {
                URL.revokeObjectURL(copy[index].preview);
            }

            copy[index] = null; // ⭐ splice 아님
            return copy;
        });
    };


    //택배거래 주소
    const [isAddOpen, setIsAddOpen] = useState(false);
  const complateHandler = (data) => {
    setToolModify(prev => ({
        ...prev,
        zonecode: data.zonecode,
        addr1: data.address
    }));
    setIsAddOpen(false); // 모달 닫기
};

    const closeHandler = () => {
        setIsAddOpen(false);
    };

    //직거래 주소
    const [isAddOpen2, setIsAddOpen2] = useState(false);
    const complateHandler2 = (data) => {
        setTool({
            ...prev,
            tradeZonecode: data.zonecode,
            tradeAddr1: data.address,
        });
    };
    const closeHandler2 = () => {
        setIsAddOpen2(false);
    };

    //무료 대여
    const [freeRental, setFreeRental] = useState();
    useEffect(() => {
        if (freeRental) {
            setToolModify((prev) => ({
                ...prev,
                rentalPrice: 0,
            }));
        }
    }, [freeRental]);

    //바로대여 여부
    const [quickRental, setQuickRental] = useState();

    //거래방식
    const [postRental, setPostRental] = useState();
    const [directRental, setDirectRental] = useState();

    //무료배송 여부
    const [freePost, setFreePost] = useState();

    useEffect(() => {
        if (freePost) {
            setToolModify((prev) => ({
                ...prev,
                postCharge: 0,
            }));
        }
    }, [freePost]);

    //주소지 설정
    const [useProfile, setUseProfile] = useState(false);
    useEffect(() => {
        if (useProfile && user) {
            setToolModify((prev) => ({
                ...prev,
                addr1: user.addr1 ?? "",
                addr2: user.addr2 ?? "",
                zonecode: user.zonecode ?? "",
            }));
        }

    }, [useProfile, user]);

    //계좌
    const [userBank, setUserBank] = useState(() => user?.settleAccount ? true : false);
    useEffect(() => {
    if (userBank && user) {
        setToolModify((prev) => ({
            ...prev,
            settleBank: prev.settleBank || user.settleBank || "",
            settleAccount: prev.settleAccount || user.settleAccount || "",
            settleHost: prev.settleHost || user.settleHost || "",
        }));
    }
}, [userBank, user]);

    //대여 가능 상태설정
    const [toolStatus, setToolStatus] = useState();

    //대여문의 수

    //수정등록
    const modify = () => {
        console.log("modify why ");

        const { thunbnail,img0, img1, img2, img3, img4, ...rest } = toolModify;

        const submitTool = {
            ...rest,
            freeRental,
            quickRental,
            postRental,
            directRental,
            freePost,
            satus: toolStatus,
            postCharge: toolModify.postCharge

        };

        if (!checkOption(submitTool)) return;

        const formData = new FormData();
        formData.append("tool", new Blob([JSON.stringify(submitTool)], { type: "application/json" }));

        if (thumbnailFile) {
            formData.append("thumbnail", thumbnailFile);
        }

        detailSlots.forEach((slot, idx) => {
            if (slot?.file) {
                formData.append("images", slot.file);
                formData.append("imageIndexes", idx);
            }
        });


        token &&
            myAxios(token, setToken)
                .post("/tool/modify", formData)

                .then((res) => {
                    console.log("inAxios");
                    if (res.data) {
                        setMessage("공구 수정 완료!");
                        setModal(true);
                    } else {
                        setMessage("공구 등록 실패");
                        setModal(true);
                    }
                    
                })
                .catch((err) => {
                    console.log(err);
                });
    };

    //취소
    const cancal = () => { };

    //항목확인
    const checkOption = (submitTool) => {
        switch (true) {
            case !submitTool.name:
                setMessage("공구 이름을 등록해주세요");
                break;

            case submitTool.rentalPrice === "" || submitTool.rentalPrice == null:
                setMessage("공구 1일 대여 금액을 설정해주세요");
                break;

            case !submitTool.zonecode && !submitTool.tradeZonecode:
                setMessage("거래방식을 선택해주세요");
                break;

            case !submitTool.zonecode || !submitTool.addr1 || !submitTool.addr2:
                setMessage("택배거래시 공구를 되돌려받을 주소를 입력해주세요");
                break;

            case submitTool.postRental && submitTool.postCharge == null:
                setMessage("택배거래시 배송비를 설정해주세요");
                break;

            case submitTool.settleAccount === "" || submitTool.settleAccount == null:
                setMessage("택배거래시 배송비를 설정해주세요");
                break;

            default:
                return true;
        }

        setModal(true);
        return false;
    };

    const successModify = () => {
        
        setModal(false);
        navigate(`/zipddak/tool/${toolIdx}`);
    }

    if (!tool) return <div>로딩중...</div>;
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
                            <Input placeholder="상품명을 입력하세요" name="name" type="text"
                                value={toolModify.name}
                                onChange={ChangeInput} />
                        </div>

                        <div className="options">
                            <span className="o-label">공구 썸네일</span>
                            <div
                                className={thumbPreview || oldThumbnail ? "thumbnail" : "thumbnail add"}
                                onClick={() => fileRef.current?.click()}
                            >

                                {/* 기존 썸네일 */}
                                {!thumbPreview && oldThumbnail && (
                                    <>
                                        <img
                                            src={`http://localhost:8080/imageView?type=tool&filename=${oldThumbnail}`}
                                            alt="기존 썸네일"
                                        />
                                        <button
                                            type="button"
                                            className="imgDeleteButton"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOldThumbnail(null);
                                            }}
                                        >
                                            <Minus color="#fff" />
                                        </button>
                                    </>
                                )}

                                {/* 새 썸네일 */}
                                {thumbPreview && (
                                    <>
                                        <img src={thumbPreview} alt="공구" />
                                        <button
                                            type="button"
                                            className="imgDeleteButton"
                                            onClick={handleThumbRemove}
                                        >
                                            <Minus color="#fff" />
                                        </button>
                                    </>
                                )}

                                {/* 아무것도 없을 때 */}
                                {!thumbPreview && !oldThumbnail && (
                                    <Plus size={50} color="#B6BCC9" strokeWidth={0.5} />
                                )}
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
                                {detailSlots.map((slot, idx) => (
                                    <div
                                        key={idx}
                                        className="thumbnail"
                                        onClick={() => detailRefs.current[idx]?.click()}
                                    >
                                        {/* 이미지가 있을 때 */}
                                        {slot ? (
                                            <>
                                                {typeof slot === "string" ? (
                                                    // 기존 이미지
                                                    <img
                                                        src={`http://localhost:8080/imageView?type=tool&filename=${slot}`}
                                                        alt={`detail-${idx}`}
                                                    />
                                                ) : (
                                                    // 새 이미지
                                                    <img
                                                        src={slot.preview}
                                                        alt={`detail-${idx}`}
                                                    />
                                                )}

                                                <button
                                                    type="button"
                                                    className="imgDeleteButton"
                                                    onClick={(e) => handleDetailRemove(e, idx)}
                                                >
                                                    <Minus color="#fff" />
                                                </button>
                                            </>
                                        ) : (
                                            // 빈 슬롯
                                            <Plus size={40} color="#B6BCC9" strokeWidth={0.5} />
                                        )}

                                        <Input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            innerRef={(el) => (detailRefs.current[idx] = el)}
                                            onChange={(e) => handleDetailChange(e, idx)}
                                        />
                                    </div>
                                ))}
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
                                        <Input name="category" type="radio" value={83} checked={toolModify.category == "83"} onChange={(e) =>
                                            setToolModify(prev => ({
                                                ...prev,
                                                category: e.target.value
                                            }))} /> 전동공구
                                    </Label>
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={84} checked={toolModify.category == "84"} onChange={(e) =>
                                            setToolModify(prev => ({
                                                ...prev,
                                                category: e.target.value
                                            }))} /> 일반공구
                                    </Label>
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={85} checked={toolModify.category == "85"}
                                            onChange={(e) =>
                                                setToolModify(prev => ({
                                                    ...prev,
                                                    category: e.target.value
                                                }))} /> 생활용품
                                    </Label>
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={86} checked={toolModify.category == "86"}
                                            onChange={(e) =>
                                                setToolModify(prev => ({
                                                    ...prev,
                                                    category: e.target.value
                                                }))} />
                                        기타공구
                                    </Label>
                                </FormGroup>

                                <FormGroup check>
                                    <Label check>
                                        <Input name="category" type="radio" value={87} checked={toolModify.category == "87"}
                                            onChange={(e) =>
                                                setToolModify(prev => ({
                                                    ...prev,
                                                    category: e.target.value
                                                }))} />
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
                                    <Input type="number" name="rentalPrice" className="wonInput" placeholder="1일 대여비" value={toolModify.rentalPrice} readOnly={freeRental} onChange={ChangeInput} />
                                    <span>원</span>
                                </div>
                                <FormGroup check>
                                    <Label check>
                                        <Input name="freeRental" id="checkbox2" type="checkbox" checked={toolModify.freeRental}
                                            onChange={(prev) => setToolModify({
                                                ...prev,
                                                freeRental: e.target.value
                                            })} /> 무료대여
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>

                        <div className="options">
                            <span className="o-label">공구 상세설명</span>
                            <Input type="textarea" name="content" placeholder="공구의 상세한 설명을 적어주세요! (최대 2000자)"
                                className="ttextarea"
                                value={toolModify.content}
                                onChange={ChangeInput} />
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
                                        <Input name="quickRental" type="checkbox" checked={toolModify.quickRental}
                                            onChange={(e) =>
                                                setToolModify(prev => ({ ...prev, quickRental: e.target.checked }))
                                            } />
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
                                        <Input name="postRental" type="checkbox" checked={toolModify.postRental}
                                            onChange={() => setPostRental(prev => ({
                                                ...prev,
                                                postRental: e.target.checked
                                            }))} /> 택배 배송
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input name="directRental" type="checkbox" checked={toolModify.directRental}
                                            onChange={() => setDirectRental((prev) => ({
                                                ...prev,
                                                directRental: e.target.checked
                                            }))} /> 직접 픽업
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>

                        {postRental && (
                            <div className="options">
                                <span className="o-label">배송비</span>
                                <div className="check-col">
                                    <div className="won">
                                        <Input type="number" name="postCharge" className="wonInput" placeholder="배송비" value={toolModify.postCharge} readOnly={freePost} onChange={ChangeInput} />
                                        <span>원</span>
                                    </div>
                                    <FormGroup check>
                                        <Label check>
                                            <Input name="freePost" type="checkbox" checked={toolModify.freePost} onChange={() => setFreePost((prev) => !prev)} /> 무료배송
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
                                        <Input className="zonecodeInput" type="text" name="zonecode" placeholder="우편번호" value={toolModify.zonecode} readOnly />
                                        {!useProfile && (
                                            <Button className="primary-button" onClick={() => setIsAddOpen(prev => !prev)}
>
                                                주소검색
                                            </Button>
                                        )}
                                    </div>
                                    <Input type="text" name="addr1" placeholder="지번/도로명주소" value={tool.addr1} readOnly />
                                    <Input type="text" name="addr2" placeholder="상세주소" value={toolModify.addr2} readOnly={useProfile} onChange={useProfile ? undefined : ChangeInput} />

                                    {useProfile === false &&
                                        <Input name="postRequest" type="select" className="toolBank pqSelect" value={toolModify.postRequest} onChange={ChangeInput}>
                                            <option value={"배송시 요청사항 없음"}>배송시 요청사항</option>
                                            <option value={"문앞에 놔주세요"}>문앞에 놔주세요</option>
                                            <option value={"경비실에 맡겨주세요"}>경비실에 맡겨주세요</option>
                                        </Input>
                                    }
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
                                <div className="post-box">
                                    <div className="check-col">
                                        <Input className="zonecodeInput" type="text" name="tradeZonecode" placeholder="우편번호" value={toolModify.tradeZonecode} readOnly />

                                        <Button className="primary-button" onClick={() => setIsAddOpen2(prev => !prev)}
>
                                            주소검색
                                        </Button>
                                    </div>
                                    <Input type="text" name="tradeAddr1" placeholder="지번/도로명주소" value={toolModify.tradeAddr1} readOnly />
                                    <Input type="text" name="tradeAddr2" placeholder="상세주소" value={toolModify.tradeAddr2} onChange={ChangeInput} />
                                </div>
                            </div>
                        )}

                        {isAddOpen2 && (
                            <AddrModal title="만나서 결제주소찾기" open={isAddOpen2} footer={null} onCancel={() => setIsAddOpen2(false)}>
                                <DaumPostcode onComplete={complateHandler2} onClose={closeHandler2} />
                            </AddrModal>
                        )}

                        <div className="options">
                            <div className="row-cm">
                                <div className="row-cm" style={{ gap: "5px" }}>
                                    <span className="o-label">계좌번호</span>
                                    <span className="orange oFont">*</span>
                                </div>
                                {/* <span className="necc">*</span> */}
                            </div>

                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" checked={userBank === true} onChange={() => setUserBank(true)} />
                                    등록한 계좌 (프로필 계좌)
                                </Label>
                            </FormGroup>


                            <FormGroup check>
                                <Label check>
                                    <Input type="radio" checked={userBank === false} onChange={() => setUserBank(false)} /> 직접 입력
                                </Label>
                            </FormGroup>

                            <div className="input_detail">정산이 이루어지는 계좌입니다. 마이페이지의 정산계좌로 등록됩니다.</div>
                            {userBank ? (
                                <Input name="settleBank" type="text" className="toolBank sbSelect"
                                    value={user.settleBank} readOnly />
                            ) : (
                                <Input name="settleBank" type="select" className="toolBank sbSelect"
                                    value={toolModify.settleBank} onChange={ChangeInput}>
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
                                value={toolModify.settleAccount}
                                readOnly={userBank}
                                onChange={userBank ? undefined : ChangeInput}
                            />
                            <Input className="toolBank" name="settleHost" placeholder="예금주" type="text"
                                value={toolModify.settleHost} readOnly={userBank}
                                onChange={userBank ? undefined : ChangeInput} />
                        </div>

                        <div className="options">
                            <span className="o-label">대여상태 설정</span>
                            <div className="check-col">
                                <FormGroup check>
                                    <Label check>
                                        <Input name="satus" type="radio" value={"ABLE"} checked={toolModify.satus == "ABLE"} onChange={() => setToolStatus("ABLE")} /> 대여가능
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input name="satus" type="radio" value={"INABLE"} checked={toolModify.satus == "INABLE"} onChange={() => setToolStatus("INABLE")} /> 대여중지
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                    <div className="btn-col">
                        <Button className="tertiary-button">작성취소</Button>
                        <Button className="primary-button" onClick={modify}>
                            작성완료
                        </Button>
                    </div>
                </div>

                <Modal isOpen={modal}>
                    <ModalHeader>공구 수정</ModalHeader>
                    <ModalBody>{message}</ModalBody>
                    <Button color="primary-button" onClick={successModify}>
                        확인
                    </Button>
                </Modal>
            </div>
        </>
    );
}
