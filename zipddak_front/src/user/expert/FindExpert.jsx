import { useState, useEffect, useRef } from "react";
import { Input, ModalHeader, ModalBody } from "reactstrap";
import "../css/FindExpert.css";
import { Modal as AddrModal } from "antd";
import { Modal } from "reactstrap";
import DaumPostcode from "react-daum-postcode";
import { baseUrl, myAxios } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { expertIdxAtom } from "./expertAtom";

export default function FindExpert() {
    const chatEndRef = useRef(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const navigate = useNavigate();
    const [expertIdx, setExpertIdx] = useAtom(expertIdxAtom);
    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [modal, setModal] = useState(false);

    const toggle = () => {
        setModal(!modal);

        navigate("/zipddak/main");
    };

    const [requestForm, setRequestForm] = useState({});
    const [files, setFiles] = useState([]);

    // 알림 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달 안에 들어갈 메세지
    const [modalMessage, setModalMessage] = useState("");

    const serviceOptions = ["수리", "인테리어", "시공견적컨설팅"];

    const secondOptions = {
        수리: {
            "가전제품 수리": ["냉장고", "식기세척기", "인덕션", "세탁기", "에어컨", "기타 전자제품"],
            "문/창문 수리": ["도어락", "도어", "방범창", "방충망", "샷시"],
            "수도/보일러/전기 수리": ["싱크대", "보일러", "화장실 누수", "수도관련", "온수기", "전기배선"],
        },
        인테리어: {
            "부분 인테리어": ["도어 시공", "블라인드/커튼 시공", "샷시 설치", "신발장 시공", "싱크대 교체", "욕실/화장실 리모델링", "주방 리모델링", "중문 시공", "줄눈 시공"],
            "벽/천장 시공": ["단열필름 시공", "도배 시공", "몰딩 시공", "방음 시공", "아트월 시공", "외풍차단/틈막이 시공", "유리필름/시트 시공", "인테리어필름 시공", "페인트 시공"],
            "바닥 시공": ["마루 보수", "마루 시공", "바닥재 시공", "에폭시바닥 시공", "층간소음매트 시공", "카페트 시공", "타일 시공", "장판 시공"],
        },
        시공견적컨설팅: {
            거실: ["공간 효율화", "미관 향상", "기능 개선", "기타"],
            주방: ["공간 효율화", "미관 향상", "기능 개선", "기타"],
            "침실 / 아이방": ["공간 효율화", "미관 향상", "기능 개선", "기타"],
            "사무실 / 상업공간": ["공간 효율화", "미관 향상", "기능 개선", "기타"],
            기타: ["공간 효율화", "미관 향상", "기능 개선", "기타"],
        },
    };

    const commonQuestionsMap = {
        시공견적컨설팅: [
            { text: "예산은 어느 정도로 생각하시나요?", key: "budget", type: "text" },
            { text: "서비스 완료 희망일이나 방문 가능 날짜가 있나요?", key: "preferredDate", type: "date" },
            { text: "작업할 장소는 어딘가요?", key: "location", type: "text" },
            { text: "대략적인 작업 사이즈를 입력해주세요", key: "constructionSize", type: "text" },
            { text: "추가 요청사항이 있으면 알려주세요", key: "additionalRequest", type: "text" },
        ],
        수리: [
            { text: "예산은 어느 정도로 생각하시나요?", key: "budget", type: "text" },
            { text: "작업 희망일을 선택해주세요(변동될 수 있습니다.)", key: "preferredDate", type: "date" },
            { text: "작업할 장소는 어딘가요?", key: "location", type: "text" },
            { text: "추가 요청사항이 있으면 알려주세요", key: "additionalRequest", type: "text" },
        ],
        인테리어: [
            { text: "예산은 어느 정도로 생각하시나요?", key: "budget", type: "text" },
            { text: "작업 희망일을 선택해주세요", key: "preferredDate", type: "date" },
            { text: "작업할 장소는 어딘가요?", key: "location", type: "text" },
            { text: "대략적인 작업 사이즈를 입력해주세요", key: "constructionSize", type: "text" },
            { text: "추가 요청사항이 있으면 알려주세요", key: "additionalRequest", type: "text" },
        ],
    };

    const complateHandler = (data) => {
        setRequestForm({
            ...requestForm,
            addr1: data.roadAddress || data.address,
        });
    };

    const closeHandler = (state) => {
        setIsAddOpen(false);
    };

    const writeRequestForm = () => {
        const formData = new FormData();

        formData.append("userUsername", user.username);

        formData.append("expertIdx", expertIdx);

        Object.keys(requestForm).forEach((key) => {
            formData.append(key, requestForm[key]);
        });

        files.forEach((file) => {
            formData.append("files", file);
        });

        // FormData 내용 콘솔에 찍기
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        myAxios(token, setToken)
            .post(`${baseUrl}/user/writeRequest`, formData, {
                headers: {
                    "Content-Type": "multipary/form-data",
                },
            })
            .then((res) => {
                if (res.data) {
                    setModal(true);
                }
            });

        setExpertIdx(null); // 1️⃣ atom 초기화
        localStorage.removeItem("expertIdx"); // 2️⃣ storage 제거
    };

    const [messages, setMessages] = useState([{ id: 1, type: "bot", text: "원하시는 서비스를 선택해주세요", options: serviceOptions }]);
    const [category, setCategory] = useState(null);
    const [firstChoice, setFirstChoice] = useState(null);
    const [step, setStep] = useState(0); // 단계 관리
    const [commonStep, setCommonStep] = useState(0); // 공통 질문 단계
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 화면이 새로고침될때 요청서 초기화
    useEffect(() => {
        setRequestForm({});
    }, []);

    const handleSelect = (option) => {
        // 마지막 메시지에서 버튼 제거
        setMessages((prev) => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex].options) {
                newMessages[lastIndex] = { ...newMessages[lastIndex], options: [] };
            }
            // 사용자 메시지 추가
            newMessages.push({ id: newMessages.length + 1, type: "user", text: option });
            return newMessages;
        });

        // 이후 기존 로직 유지
        setTimeout(() => {
            if (step === 0) {
                setCategory(option);

                console.log(option);

                setRequestForm((prev) => ({
                    ...prev,
                    cate1: option,
                }));
                let firstQ = "";
                let firstOptions = [];
                if (option === "수리") {
                    firstQ = "어떤 수리를 원하시나요?";
                    firstOptions = ["가전제품 수리", "문/창문 수리", "수도/보일러/전기 수리"];
                } else if (option === "인테리어") {
                    firstQ = "인테리어 서비스를 선택해주세요";
                    firstOptions = ["부분 인테리어", "벽/천장 시공", "바닥 시공"];
                } else if (option === "시공견적컨설팅") {
                    firstQ = "시공할 공간은 어디인가요?";
                    firstOptions = ["거실", "주방", "침실 / 아이방", "사무실 / 상업공간", "기타"];
                }
                setMessages((prev) => [...prev, { id: prev.length + 1, type: "bot", text: firstQ, options: firstOptions }]);
                setStep(1);
                return;
            }

            if (step === 1) {
                setFirstChoice(option);

                // 시공 견적 일때는 cate2가 아니라 place
                category === "시공견적컨설팅"
                    ? setRequestForm((prev) => ({
                          ...prev,
                          place: option,
                      }))
                    : setRequestForm((prev) => ({
                          ...prev,
                          cate2: option,
                      }));

                let secondQText = category === "수리" ? `수리하실 ${option} 종류를 선택해주세요` : category === "인테리어" ? "작업 유형을 선택해주세요" : "이번 시공의 주된 목적은 무엇인가요?";
                setMessages((prev) => [...prev, { id: prev.length + 1, type: "bot", text: secondQText, options: secondOptions[category][option] || [] }]);
                setStep(2);
                return;
            }

            if (step === 2) {
                // 시공 견적 일때는 cate3가 아니라 purpose
                category === "시공견적컨설팅"
                    ? setRequestForm((prev) => ({
                          ...prev,
                          purpose: option,
                      }))
                    : setRequestForm((prev) => ({
                          ...prev,
                          cate3: option,
                      }));

                const questions = commonQuestionsMap[category] || [];
                setMessages((prev) => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        type: "bot",
                        text: questions[0].text,
                        key: questions[0].key,
                        typeInput: questions[0].type,
                        showInput: true, // 여기를 추가
                    },
                ]);
                setStep(3);
                setCommonStep(0);
                setInputValue("");
            }
        }, 500);
    };

    const handleCommonConfirm = (value) => {
        console.log(value);
        const questions = commonQuestionsMap[category] || [];

        setMessages((prev) => {
            const newMessages = [...prev];

            // 마지막 bot 메시지의 input만 제거
            for (let i = newMessages.length - 1; i >= 0; i--) {
                if (newMessages[i].type === "bot" && newMessages[i].showInput) {
                    newMessages[i] = { ...newMessages[i], showInput: false };
                    break;
                }
            }

            // 사용자 메시지 추가
            newMessages.push({ id: newMessages.length + 1, type: "user", text: value });

            // 다음 bot 메시지 추가
            if (commonStep + 1 < questions.length) {
                const nextStep = commonStep + 1;
                newMessages.push({
                    id: newMessages.length + 1,
                    type: "bot",
                    text: questions[nextStep].text,
                    key: questions[nextStep].key,
                    typeInput: questions[nextStep].type,
                    showInput: true, // input 표시
                });
            }

            return newMessages;
        });

        setInputValue("");
        setCommonStep((prev) => prev + 1);
    };

    // 마지막 추가 요청사항 처리
    const handleLastConfirm = (value) => {
        if (!value) return; // 빈값 무시
        setMessages((prev) => [...prev, { id: prev.length + 1, type: "user", text: value }, { id: prev.length + 2, type: "bot", text: "견적 요청서가 정상적으로 제출되었습니다!" }]);
        setInputValue(""); // 입력 초기화
    };

    useEffect(() => {
        if (!user) return;
        //
        if (user.username === "") {
            setModalMessage("로그인 후 견적요청을 할 수 있습니다.");
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
                navigate("/login");
            }, 1500);
            return;
        }

        myAxios(token, setToken)
            .get(`${baseUrl}/user/requestCheck?username=${user.username}`)
            .then((res) => {
                if (res.data) {
                    setModalMessage("이미 진행중인 견적요청이 있습니다. 마이페이지로 넘어갑니다.");
                    setIsModalOpen(true);
                    setTimeout(() => {
                        setIsModalOpen(false);
                        navigate("/zipddak/mypage/expert/requests/active");
                    }, 2000);
                    return;
                }
            });
    }, [user]);

    return (
        <div className="chat-window">
            {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble ${msg.type}`}>
                    <div className="font-14 medium">{msg.text}</div>

                    {msg.options && msg.options.length > 0 && (
                        <div className="options-box">
                            {msg.options.map((opt) => (
                                <button
                                    key={opt}
                                    className="option-btn"
                                    onClick={(e) => {
                                        handleSelect(opt);
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 공통 질문 입력칸 */}
                    {msg.type === "bot" && msg.showInput && (
                        <div className="common-input-box">
                            {msg.key === "location" ? (
                                // 작업할 장소는 어딘가요?
                                <div style={{ marginTop: "14px", width: "290px" }}>
                                    <div className="find-select-address-div">
                                        {/* 읽기 전용 주소 입력 */}
                                        <Input
                                            style={{ width: "215px" }}
                                            className="font-14"
                                            type="text"
                                            value={requestForm.addr1 || ""} // <<< 주소 값 바인딩
                                            readOnly
                                            placeholder="주소 찾기 버튼으로 선택"
                                        />

                                        {/* 우편번호 API 연결 */}
                                        <button className="find-select-address-button font-14" type="button" onClick={() => setIsAddOpen(!isAddOpen)}>
                                            주소찾기
                                        </button>
                                    </div>

                                    {/* 상세 주소 입력 */}
                                    <Input
                                        className="font-14"
                                        type="text"
                                        placeholder="상세 주소를 입력하세요"
                                        onChange={(e) => {
                                            setRequestForm({ ...requestForm, addr2: e.target.value });
                                        }}
                                        style={{ marginTop: "8px", height: "42px" }}
                                    />
                                    <div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
                                        <button
                                            style={{
                                                height: "42px",
                                                border: "none",
                                                borderRadius: "5px",
                                                backgroundColor: "#ff5833",
                                                color: "#ffffff",
                                                width: "50px",
                                            }}
                                            type="button"
                                            color="primary"
                                            size="sm"
                                            onClick={() => {
                                                // onClick={openPostcode}
                                                requestForm.addr1 && requestForm.addr2 && handleCommonConfirm(requestForm.addr1 + " " + requestForm.addr2);
                                            }}
                                            className="font-14"
                                        >
                                            다음
                                        </button>
                                    </div>
                                </div>
                            ) : msg.key === "constructionSize" ? (
                                // 대략적인 작업 사이즈를 입력해주세요
                                <div>
                                    <Input
                                        className="font-14"
                                        style={{ resize: "none", width: "290px", height: "100px", marginTop: "14px" }}
                                        type="textarea"
                                        placeholder="ex. 800 x 1,200mm 창문 4개"
                                        onChange={(e) => {
                                            setRequestForm({ ...requestForm, constructionSize: e.target.value });
                                            setInputValue(e.target.value);
                                        }}
                                    />
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
                                        <button
                                            style={{ width: "50px", height: "42px", border: "none", color: "#ffffff", backgroundColor: "#ff5833", borderRadius: "5px" }}
                                            type="button"
                                            color="primary"
                                            size="sm"
                                            onClick={() => requestForm.constructionSize && handleCommonConfirm(inputValue)}
                                            className="font-14"
                                        >
                                            다음
                                        </button>
                                    </div>
                                </div>
                            ) : msg.key === "budget" ? (
                                // 예산은 어느정도 생각하시나요?
                                <div style={{ marginTop: "14px" }}>
                                    <div className="find-expert-want-money">
                                        <Input
                                            style={{ width: "230px" }}
                                            className="font-14 want-money-input"
                                            type="number"
                                            min={1}
                                            onChange={(e) => {
                                                setRequestForm({ ...requestForm, budget: e.target.value });
                                                setInputValue(e.target.value);
                                            }}
                                        />
                                        <button
                                            className="font-14 money-button"
                                            type="button"
                                            color="primary"
                                            size="sm"
                                            onClick={() => {
                                                requestForm.budget && handleCommonConfirm(inputValue);
                                            }}
                                            style={{ height: "44px", width: "50px", marginLeft: "10px" }}
                                        >
                                            다음
                                        </button>
                                    </div>
                                </div>
                            ) : msg.key === "preferredDate" ? (
                                // 작업 희망일이 있나요?
                                <div style={{ marginTop: "14px" }}>
                                    <div className="findExpert-select-date-div">
                                        <Input
                                            className="font-14"
                                            type="date"
                                            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // 내일부터 선택 가능
                                            onChange={(e) => {
                                                setRequestForm({ ...requestForm, preferredDate: e.target.value });
                                                setInputValue(e.target.value);
                                            }}
                                            style={{ width: "230px" }}
                                        />
                                        <button
                                            style={{ height: "44px", width: "50px", marginLeft: "10px" }}
                                            type="button"
                                            className="font-14 select-date-button"
                                            size="sm"
                                            onClick={() => {
                                                requestForm.preferredDate && handleCommonConfirm(inputValue);
                                            }}
                                        >
                                            선택
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // 추가 요청 사항이 있으면 알려주세요?
                                <div>
                                    <div style={{ marginTop: "14px", width: "663px" }}>
                                        <Input
                                            className="font-14"
                                            type="textarea"
                                            style={{ width: "100%", height: "162px", resize: "none" }}
                                            onChange={(e) => setRequestForm({ ...requestForm, additionalRequest: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ margin: "15px 0" }}>
                                        <span>첨부 이미지 파일은 최대 3장입니다.</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Input
                                            accept="image/*"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);

                                                if (files.length > 3) {
                                                    e.target.value = ""; // 초기화
                                                    setModalMessage("첨부 이미지 파일은 최대 3장입니다.");
                                                    setIsModalOpen(true);
                                                    setTimeout(() => {
                                                        setIsModalOpen(false);
                                                    }, 1500);
                                                    return;
                                                }

                                                setFiles(files);
                                            }}
                                            multiple
                                            type="file"
                                            style={{ height: "33.5px" }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
                                        <button
                                            className="font-14 semibold"
                                            style={{ border: "none", borderRadius: "5px", height: "42px", backgroundColor: "#ff5833", color: "#ffffff", width: "122px" }}
                                            onClick={() => {
                                                writeRequestForm();
                                            }}
                                        >
                                            견적 요청서 제출
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            <div ref={chatEndRef} />

            <Modal className="ask-modal-box" isOpen={modal} toggle={toggle}>
                <div className="ask-modal-body">
                    <div>견적서 요청이 완료되었습니다.</div>
                    <div className="ask-modal-body-button-div">
                        <button className="ask-modal-back ask-modal-button" type="button" onClick={toggle}>
                            확인
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 알림 모달창 */}
            <Modal isOpen={isModalOpen} className="mypage-modal" style={{ width: "380px" }}>
                <ModalBody>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                            whiteSpace: "nowrap",
                            fontSize: "14px",
                        }}
                    >
                        <p>{modalMessage}</p>
                    </div>
                </ModalBody>
            </Modal>

            {isAddOpen && (
                <AddrModal title="주소찾기" open={isAddOpen} footer={null} onCancel={() => setIsAddOpen(false)}>
                    <DaumPostcode onComplete={complateHandler} onClose={closeHandler} />
                </AddrModal>
            )}
        </div>
    );
}
