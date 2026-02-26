import { useEffect, useRef, useState } from "react";
import "../css/message.css";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { useNavigate, useSearchParams } from "react-router";
import { Input, Modal, ModalBody, ModalHeader } from "reactstrap";

export default function Message() {
    const [searchParams] = useSearchParams();
    const initialRoomId = searchParams.get("roomId");

    /* 채팅 관련 상태 */
    const [stompConnected, setStompConnected] = useState(false);
    const [chip, setChip] = useState("EXPERT");
    const [inputMessage, setInputMessage] = useState("");
    const [selectMessageRoomIdx, setSelectMessageRoomIdx] = useState(initialRoomId ? Number(initialRoomId) : null); // 선택한 채팅방 아이디
    const [selectedRoom, setSelectedRoom] = useState(null); // 선택한 채팅방

    const [chatList, setChatList] = useState([]); // 채팅방 목록
    const [messages, setMessages] = useState([]); // 대화 내용

    /* 견적서 관련 상태 */
    const [estimate, setEstimate] = useState({});
    const [workDurationType, setWorkDurationType] = useState("HOUR"); // 예상작업시간 타입 HOUR | DAY | WEEK | MONTH
    const [workDurationValue, setWorkDurationValue] = useState(""); // 예상작업시간 값
    const [workScopes, setWorkScopes] = useState([]); // 작업범위 배열
    const [workDetail, setWorkDetail] = useState(""); // 작업상세설명

    const [processCosts, setProcessCosts] = useState([]); // 공정별시공비
    const [materialCosts, setMaterialCosts] = useState([]); // 자재비
    const [disposalCost, setDisposalCost] = useState(null); // 폐기물처리비
    const [demolitionCost, setDemolitionCost] = useState(null); // 철거비
    const [etcFee, setEtcFee] = useState(null); // 기타비용
    const [costDetail, setCostDetail] = useState(""); // 비용상세설명

    // 수리 견적서 관련 상태
    const [estimateIdx, setEstimateIdx] = useState(0);
    const [diagnosisType, setDiagnosisType] = useState(""); // 사전진단필요여부 VISIT | PHOTO
    const [repairType, setRepairType] = useState(""); // 수리방식 PART | ALL | CHECK

    // 인테리어 견적서 관련 상태
    const [demolitionType, setDemolitionType] = useState(null); // 철거여부 INCLUDED | EXTRA | NONE

    // 컨설팅 견적서 관련 상태
    const [consultingType, setConsultingType] = useState(null); // 컨설팅방식 ONLINE | VISIT
    const [consultingLaborCost, setConsultingLaborCost] = useState(null); // 컨설팅 인건비
    const [stylingDesignCost, setStylingDesignCost] = useState(null); // 스타일링디자인 작업비
    const [threeDImageCost, setThreeDImageCost] = useState(null); // 3D이미지 작업비
    const [reportProductionCost, setReportProductionCost] = useState(null); // 보고서 제작비

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSend, setIsSend] = useState(false);

    /* useRef */
    const isFirstRender = useRef(true);
    const clientRef = useRef(null);
    const roomSubRef = useRef(null);
    const roomListSubRef = useRef(null);
    const bottomRef = useRef(null);

    const navigate = useNavigate();

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [payState, setPayState] = useState({});
    // 결제가 이미 완료되었거나, 중단된 요청인지 판단
    useEffect(() => {
        console.log(selectedRoom);
        if (!user || !token || !selectedRoom) return;

        myAxios(token, setToken)
            .get(`${baseUrl}/user/checkMatchingState?estimateIdx=${selectedRoom.estimateIdx}`)
            .then((res) => {
                console.log(res.data);
                if (res.data !== null) setPayState(res.data);
            });
    }, [user, token, selectedRoom]);

    // 채팅방 목록 조회
    const getMessageRoomList = (type) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/messageRoomList?username=${user.username}&type=${type}`)
            .then((res) => {
                setChatList(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 채팅 전송
    const sendMessage = () => {
        if (!clientRef.current?.connected) return;

        clientRef.current.publish({
            destination: "/app/chat/send",
            body: JSON.stringify({
                messageRoomIdx: selectMessageRoomIdx,
                content: inputMessage,
                sendUsername: user.username,
                recvUsername: selectedRoom.roomSendUsername === user.username ? selectedRoom.roomRecvUsername : selectedRoom.roomSendUsername,
                sendButton: false,
            }),
        });

        setInputMessage("");
    };

    // 보낸 견적서 상세 조회
    const getEstimates = (estimateIdx) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/sent/estimateDetail?estimateIdx=${estimateIdx}`)
            .then((res) => {
                const detail = res.data.sentEstimateDetail;
                const costList = res.data.estimateCostList || [];

                // 기본 견적 정보
                setEstimate(detail);

                setWorkDurationType(detail.workDurationType);
                setWorkDurationValue(detail.workDurationValue ?? "");
                setWorkScopes(detail.workScope ? detail.workScope.split(",") : []);
                setWorkDetail(detail.workDetail ?? "");

                // 수리
                setDiagnosisType(detail.diagnosisType ?? "");
                setRepairType(detail.repairType ?? "");

                // 인테리어
                setDemolitionType(detail.demolitionType ?? null);

                // 컨설팅
                setConsultingType(detail.consultingType ?? null);
                setConsultingLaborCost(detail.consultingLaborCost ?? null);
                setStylingDesignCost(detail.stylingDesignCost ?? null);
                setThreeDImageCost(detail.threeDImageCost ?? null);
                setReportProductionCost(detail.reportProductionCost ?? null);

                // 기타 비용
                setDisposalCost(detail.disposalCost ?? null);
                setDemolitionCost(detail.demolitionCost ?? null);
                setEtcFee(detail.etcFee ?? null);
                setCostDetail(detail.costDetail ?? "");

                // 비용 리스트 분리
                const buildCosts = costList
                    .filter((c) => c.type === "BUILD")
                    .map((c) => ({
                        name: c.label,
                        price: c.amount,
                    }));

                const materialCosts = costList
                    .filter((c) => c.type === "MATERIAL")
                    .map((c) => ({
                        name: c.label,
                        price: c.amount,
                    }));

                setProcessCosts(buildCosts);
                setMaterialCosts(materialCosts);

                setIsModalOpen(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 모달 닫힘 시 데이터 초기화
    const resetEstimateForm = () => {
        setEstimate({});
        setWorkScopes([]);
        setProcessCosts([]);
        setMaterialCosts([]);
        setWorkDetail("");
        setCostDetail("");
    };

    // 최종 견적서로 업데이트
    const submitEstimate = () => {
        const costList = [];

        if (processCosts.length !== 0) {
            processCosts.forEach((item) => {
                costList.push({
                    type: "BUILD",
                    label: item.name,
                    amount: Number(item.price),
                });
            });
        }

        if (materialCosts.length !== 0) {
            materialCosts.forEach((item) => {
                costList.push({
                    type: "MATERIAL",
                    label: item.name,
                    amount: Number(item.price),
                });
            });
        }

        const payload = {
            estimateIdx: estimateIdx,
            requestIdx: estimate.requestIdx,
            largeServiceIdx: estimate.largeServiceIdx,
            username: user.username,

            workDurationType: workDurationType,
            workDurationValue: Number(workDurationValue),
            workScope: workScopes.join(","),
            workDetail: workDetail,

            diagnosisType: diagnosisType,
            repairType: repairType,
            demolitionType: demolitionType,
            consultingType: consultingType,

            costList,

            disposalCost: disposalCost ? Number(disposalCost) : 0,
            demolitionCost: demolitionCost ? Number(demolitionCost) : 0,
            etcFee: etcFee ? Number(etcFee) : 0,
            consultingLaborCost: consultingLaborCost ? Number(consultingLaborCost) : 0,
            stylingDesignCost: stylingDesignCost ? Number(stylingDesignCost) : 0,
            threeDImageCost: threeDImageCost ? Number(threeDImageCost) : 0,
            reportProductionCost: reportProductionCost ? Number(reportProductionCost) : 0,
            costDetail: costDetail,
        };

        myAxios(token, setToken)
            .post("http://localhost:8080/estimate/update", payload)
            .then((res) => {
                if (res.data) {
                    setIsSend(true);
                    setIsModalOpen(true);

                    setTimeout(() => {
                        clientRef.current.publish({
                            destination: "/app/chat/send",
                            body: JSON.stringify({
                                messageRoomIdx: selectMessageRoomIdx,
                                content: "",
                                sendUsername: user.username,
                                recvUsername: selectedRoom.roomSendUsername === user.username ? selectedRoom.roomRecvUsername : selectedRoom.roomSendUsername,
                                sendButton: true,
                            }),
                        });

                        setInputMessage("");
                        setIsModalOpen(false);
                        resetEstimateForm();
                    }, 1500);
                }
            })
            .catch((err) => console.error(err));
    };

    // 작업범위 체크박스
    const toggleScope = (scope) => {
        setWorkScopes((prev) => (prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]));
    };

    // 공정별 시공비 - 추가, 업데이트, 총액, 삭제
    const addProcessCost = () => {
        setProcessCosts((prev) => [...prev, { name: "", price: null }]);
    };
    const updateProcessCost = (idx, key, value) => {
        setProcessCosts((prev) => {
            const copy = [...prev];
            copy[idx] = {
                ...copy[idx],
                [key]: key === "price" ? parseNumberInput(value) : value,
            };
            return copy;
        });
    };
    const processTotal = processCosts.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const removeProcessCost = (idx) => {
        setProcessCosts((prev) => prev.filter((_, i) => i !== idx));
    };

    // 자재별 시공비 - 추가, 업데이트, 총액, 삭제
    const addMaterialCost = () => {
        setMaterialCosts((prev) => [...prev, { name: "", price: null }]);
    };
    const updateMaterialCost = (idx, key, value) => {
        setMaterialCosts((prev) => {
            const copy = [...prev];
            copy[idx] = {
                ...copy[idx],
                [key]: key === "price" ? parseNumberInput(value) : value,
            };
            return copy;
        });
    };
    const materialTotal = materialCosts.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const removeMaterialCost = (idx) => {
        setMaterialCosts((prev) => prev.filter((_, i) => i !== idx));
    };

    // 총 견적 금액 계산
    const totalCost =
        processTotal +
        materialTotal +
        Number(disposalCost) +
        Number(demolitionCost) +
        Number(etcFee) +
        Number(consultingLaborCost) +
        Number(stylingDesignCost) +
        Number(threeDImageCost) +
        Number(reportProductionCost);

    // 금액 포멧팅
    const formatNumber = (num) => {
        if (num === null || num === undefined) return "";
        return num.toLocaleString();
    };
    const handleMoneyChange = (setter) => (e) => {
        const raw = e.target.value.replaceAll(",", "");
        if (!/^\d*$/.test(raw)) return;
        setter(raw === "" ? null : Number(raw));
    };
    const parseNumberInput = (value) => {
        const raw = value.replaceAll(",", "");
        if (!/^\d*$/.test(raw)) return null;
        return raw === "" ? null : Number(raw);
    };

    // 시간 포멧팅
    function timeAgo(isoString) {
        const time = new Date(isoString);
        const now = new Date();
        const diff = Math.floor((now - time) / 1000);

        if (diff < 60) return "방금 전";
        if (diff < 3600) return Math.floor(diff / 60) + "분 전";
        if (diff < 86400) return Math.floor(diff / 3600) + "시간 전";
        if (diff < 604800) return Math.floor(diff / 86400) + "일 전";
        if (diff < 2592000) return Math.floor(diff / 604800) + "주 전";
        if (diff < 31536000) return Math.floor(diff / 2592000) + "개월 전";

        return Math.floor(diff / 31536000) + "년 전";
    }

    // 최초 목록 조회
    useEffect(() => {
        if (user.username) {
            if (user.expert) {
                getMessageRoomList("NOTUSER");
            } else {
                getMessageRoomList(chip);
            }
        }
    }, [user.username, chip]);

    // STOMP 연결 (최초 1회)
    useEffect(() => {
        //  if (clientRef.current) return;

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws-chat"),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("STOMP connected");
            setStompConnected(true);

            // 목록 구독
            roomListSubRef.current = client.subscribe(`/topic/chat/rooms/${user.username}`, (msg) => {
                const update = JSON.parse(msg.body);
                setChatList((prev) => prev.map((room) => (room.messageRoomIdx === update.messageRoomIdx ? { ...room, ...update, unreadCount: 0 } : room)));
            });
        };

        client.activate();
        clientRef.current = client;

        return () => client.deactivate();
    }, [user.username]);

    // 채팅방 선택 시 과거 대화 내역 조회 + 구독
    useEffect(() => {
        if (!stompConnected || !clientRef.current || !selectMessageRoomIdx) return;

        // 과거 메시지 조회
        myAxios(token, setToken)
            .get(`http://localhost:8080/messages?messageRoomIdx=${selectMessageRoomIdx}&username=${user.username}`)
            .then((res) => {
                setMessages(res.data);
            });

        // 이전 구독 해제
        roomSubRef.current?.unsubscribe();

        roomSubRef.current = clientRef.current.subscribe(`/topic/chat/room/${selectMessageRoomIdx}`, (msg) => {
            const message = JSON.parse(msg.body);
            console.log("실시간 수신:", message);

            setMessages((prev) => [...prev, message]);
        });

        return () => roomSubRef.current?.unsubscribe();
    }, [selectMessageRoomIdx, stompConnected]);

    // 채팅방 목록 로딩 후 자동 보정
    useEffect(() => {
        if (!initialRoomId) return;
        if (chatList.length === 0) return;

        const exists = chatList.some((room) => room.messageRoomIdx === Number(initialRoomId));

        if (exists) {
            setSelectMessageRoomIdx(Number(initialRoomId));
            setSelectedRoom(exists);
        }
    }, [chatList, initialRoomId]);

    const containerRef = useRef(null);

    // 새로운 메시지 도착 시 하단으로 스크롤
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const el = containerRef.current;
        if (!el) return;

        el.scrollTop = el.scrollHeight; // ← div 내부 최하단으로 이동
    }, [messages]);

    // 실시간 목록 업데이트 후 selectedRoom 동기화
    useEffect(() => {
        if (!selectMessageRoomIdx || chatList.length === 0) return;

        const updatedRoom = chatList.find((room) => room.messageRoomIdx === selectMessageRoomIdx);

        if (updatedRoom) {
            setSelectedRoom(updatedRoom);
        }
    }, [chatList, selectMessageRoomIdx]);

    return (
        <div
            style={{
                display: "flex",
                margin: "0 auto",
                width: "1200px",
                padding: "0 16px",
                gap: "30px",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* 채팅 목록 */}
            <div
                style={{
                    display: "flex",
                    width: "430px",
                    flexDirection: "column",
                    padding: "48px 0",
                    flex: 1.3,
                    height: "100%",
                    overflowY: "auto",
                    paddingRight: "8px",
                }}
            >
                <h3 className="message-title">채팅</h3>

                {user.expert ? (
                    <div style={{ margin: "16px" }}></div>
                ) : (
                    <div className="mypage-chipList">
                        <div
                            className={chip === "EXPERT" ? "isActive" : ""}
                            onClick={() => {
                                setChip("EXPERT");
                                setMessages([]);
                                setChatList([]);
                                setSelectMessageRoomIdx(0);
                                setSelectedRoom(null);
                                getMessageRoomList("EXPERT");
                            }}
                        >
                            전문가
                        </div>
                        <div
                            className={chip === "TOOL" ? "isActive" : ""}
                            onClick={() => {
                                setChip("TOOL");
                                setMessages([]);
                                setChatList([]);
                                setSelectMessageRoomIdx(0);
                                setSelectedRoom(null);
                                getMessageRoomList("TOOL");
                            }}
                        >
                            공구대여
                        </div>
                    </div>
                )}

                <div className="message-list">
                    {chatList.length !== 0 ? (
                        chatList.map((chat) => (
                            <div
                                className={selectMessageRoomIdx === chat.messageRoomIdx ? "message-list-card-active" : "message-list-card"}
                                onClick={() => {
                                    setSelectMessageRoomIdx(chat.messageRoomIdx);
                                    setSelectedRoom(chat);
                                }}
                            >
                                <div className="card-info-section">
                                    {chip === "TOOL" || user.expert ? (
                                        <img
                                            src={chat.userProfileImage ? `http://localhost:8080/imageView?type=profile&filename=${chat.userProfileImage}` : "/default-profile.png"}
                                            width="48px"
                                            height="48px"
                                            style={{ borderRadius: "999px" }}
                                        />
                                    ) : (
                                        <img
                                            src={chat.userProfileImage ? `http://localhost:8080/imageView?type=expert&filename=${chat.expertProfileImage}` : "/default-profile.png"}
                                            width="48px"
                                            height="48px"
                                        />
                                    )}
                                    <div>
                                        <p>{chip === "TOOL" || user.expert ? chat.nickname : chat.activityName}</p>
                                        <span>{chip === "TOOL" || user.expert ? chat.toolName : `${chat.mainService} · ${chat.addr1}`}</span>
                                    </div>
                                </div>
                                <div className="card-chat-section">
                                    <div>
                                        <p>{chat.lastMessage}</p>
                                        {chat.unreadCount !== 0 && <p className="confirmFalseCount-badge">{chat.unreadCount}</p>}
                                    </div>
                                    <span>{timeAgo(chat.updatedAt)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                padding: "40px",
                                textAlign: "center",
                                color: "#6A7685",
                                fontSize: "14px",
                            }}
                        >
                            진행중인 채팅이 없습니다.
                        </div>
                    )}
                </div>
            </div>
            {/* 채팅 상세 */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "48px 0",
                    width: "100%",
                    flex: 2,
                    borderRight: "1px solid #EFF1F5",
                    borderLeft: "1px solid #EFF1F5",
                    height: "100vh",
                    overflow: "hidden",
                    paddingRight: "8px",
                }}
            >
                {selectedRoom && (
                    <>
                        <div className="message-detail-title">
                            <div>
                                <img
                                    src={
                                        chip === "TOOL" || user.expert
                                            ? selectedRoom.userProfileImage
                                                ? `http://localhost:8080/imageView?type=profile&filename=${selectedRoom.userProfileImage}`
                                                : "/default-profile.png"
                                            : selectedRoom.expertProfileImage
                                            ? `http://localhost:8080/imageView?type=expert&filename=${selectedRoom.expertProfileImage}`
                                            : "/default-profile.png"
                                    }
                                    width="32px"
                                    height="32px"
                                    style={{ borderRadius: "999px" }}
                                />
                                <p>{chip === "TOOL" || user.expert ? selectedRoom.nickname : selectedRoom.activityName}</p>
                            </div>
                            {selectedRoom.roomRecvUsername === user.username &&
                                (chip === "TOOL" ? (
                                    <button className="primary-button" style={{ width: "100px", height: "33px" }}>
                                        결제 요청하기
                                    </button>
                                ) : (
                                    <button
                                        className="primary-button"
                                        style={{ width: "100px", height: "33px" }}
                                        onClick={() => {
                                            getEstimates(selectedRoom.estimateIdx);
                                            setEstimateIdx(selectedRoom.estimateIdx);
                                        }}
                                    >
                                        최종 견적 보내기
                                    </button>
                                ))}
                        </div>

                        <div className="message-detail-content" ref={containerRef}>
                            {messages.map((msg) =>
                                msg.sendUsername === user.username ? (
                                    msg.sendButton ? (
                                        <div className="message-bubble-send-hasButton">
                                            <span>{timeAgo(msg.createdAt)}</span>
                                            {chip === "EXPERT" && (
                                                <div>
                                                    <p style={{ lineHeight: "20px" }}>
                                                        말씀해주신 내용으로 진행 가능해요. <br />
                                                        결제하기를 누르시면 결제단계로 이동하고 <br />
                                                        <br />
                                                        <span
                                                            style={{
                                                                fontWeight: "600",
                                                                color: "#303441",
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            결제 후 매칭이 확정
                                                        </span>
                                                        됩니다.
                                                    </p>
                                                    <button
                                                        className="primary-button disabled-button"
                                                        style={{
                                                            width: "100px",
                                                            height: "33px",
                                                        }}
                                                        disabled
                                                    >
                                                        결제하기
                                                    </button>
                                                </div>
                                            )}
                                            {chip === "TOOL" && (
                                                <div>
                                                    <p style={{ lineHeight: "20px" }}>
                                                        아래 버튼을 눌러 결제를 진행해주세요. <br />
                                                        <span
                                                            style={{
                                                                fontWeight: "600",
                                                                color: "#303441",
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            결제가 완료되면 대여가 확정
                                                        </span>
                                                        됩니다.
                                                    </p>
                                                    <button
                                                        className="primary-button disabled-button"
                                                        style={{
                                                            width: "100px",
                                                            height: "33px",
                                                        }}
                                                        disabled
                                                    >
                                                        결제하기
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="message-bubble-send">
                                            <span>{timeAgo(msg.createdAt)}</span>
                                            <p>{msg.content}</p>
                                        </div>
                                    )
                                ) : msg.sendButton ? (
                                    <div className="message-bubble-recive-hasButton">
                                        <img
                                            src={
                                                chip === "TOOL" || user.expert
                                                    ? selectedRoom.userProfileImage
                                                        ? `http://localhost:8080/imageView?type=profile&filename=${selectedRoom.userProfileImage}`
                                                        : "/default-profile.png"
                                                    : selectedRoom.expertProfileImage
                                                    ? `http://localhost:8080/imageView?type=expert&filename=${selectedRoom.expertProfileImage}`
                                                    : "/default-profile.png"
                                            }
                                            width="32px"
                                            height="32px"
                                            style={{ borderRadius: "999px" }}
                                        />

                                        {chip === "EXPERT" && (
                                            <div className="message-bubble-recive-hasButton-wrapper">
                                                <div>
                                                    <p style={{ lineHeight: "20px" }}>
                                                        말씀해주신 내용으로 진행 가능해요. <br />
                                                        결제하기를 누르시면 결제단계로 이동하고 <br />
                                                        <br />
                                                        <span
                                                            style={{
                                                                fontWeight: "600",
                                                                color: "#303441",
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            결제 후 매칭이 확정
                                                        </span>
                                                        됩니다.
                                                    </p>
                                                    {payState.state ? (
                                                        <button
                                                            className="primary-button"
                                                            style={{
                                                                backgroundColor: "#293341",
                                                                border: "none",
                                                                width: "100px",
                                                                height: "33px",
                                                            }}
                                                            onClick={() => navigate(`/zipddak/mypage/expert/works/detail/${payState.matchingIdx}?page=1`)}
                                                        >
                                                            결제완료
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="primary-button"
                                                            style={{
                                                                width: "100px",
                                                                height: "33px",
                                                            }}
                                                            onClick={() => navigate(`/zipddak/expertMatchPayment/${selectedRoom.estimateIdx}`)}
                                                        >
                                                            결제하기
                                                        </button>
                                                    )}
                                                </div>
                                                <span>{timeAgo(msg.createdAt)}</span>
                                            </div>
                                        )}
                                        {chip === "TOOL" && (
                                            <div>
                                                <div>
                                                    <p style={{ lineHeight: "20px" }}>
                                                        아래 버튼을 눌러 결제를 진행해주세요. <br />
                                                        <span
                                                            style={{
                                                                fontWeight: "600",
                                                                color: "#303441",
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            결제가 완료되면 대여가 확정
                                                        </span>
                                                        됩니다.
                                                    </p>
                                                    <button
                                                        className="primary-button"
                                                        style={{
                                                            width: "100px",
                                                            height: "33px",
                                                        }}
                                                    >
                                                        결제하기
                                                    </button>
                                                </div>
                                                <span>{timeAgo(msg.createdAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="message-bubble-recive">
                                        <img
                                            src={
                                                chip === "TOOL" || user.expert
                                                    ? selectedRoom.userProfileImage
                                                        ? `http://localhost:8080/imageView?type=profile&filename=${selectedRoom.userProfileImage}`
                                                        : "/default-profile.png"
                                                    : selectedRoom.expertProfileImage
                                                    ? `http://localhost:8080/imageView?type=expert&filename=${selectedRoom.expertProfileImage}`
                                                    : "/default-profile.png"
                                            }
                                            width="32px"
                                            height="32px"
                                            style={{ borderRadius: "999px" }}
                                        />
                                        <div>
                                            <p>{msg.content}</p>
                                            <span>{timeAgo(msg.createdAt)}</span>
                                        </div>
                                    </div>
                                )
                            )}
                            <div ref={bottomRef} />
                        </div>

                        <div className="message-detail-send">
                            <Input
                                placeholder="메시지를 입력하세요"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    // 한글 조합 중이면 무시
                                    if (e.isComposing) return;
                                    // 키 자동 반복 방지 (꾹 눌렀을 때)
                                    if (e.repeat) return;
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                            <i
                                class="bi bi-arrow-up"
                                style={{
                                    fontSize: "24px",
                                    color: "rgba(173, 173, 173, 1)",
                                    padding: "0 10px",
                                    cursor: "pointer",
                                }}
                                onClick={sendMessage}
                            ></i>
                        </div>
                    </>
                )}
            </div>

            {/* 견적서 */}
            {estimate.largeServiceIdx === 23 && (
                <Modal
                    isOpen={isModalOpen}
                    toggle={() => {
                        setIsModalOpen(false);
                        resetEstimateForm();
                    }}
                    className="mypage-modal"
                    style={{ width: "553px" }}
                >
                    <ModalHeader
                        toggle={() => {
                            setIsModalOpen(false);
                            resetEstimateForm();
                        }}
                    >
                        최종 견적서를 보내시겠어요?
                    </ModalHeader>
                    <ModalBody style={{ padding: "0" }}>
                        <div
                            className="expert-estimate-form"
                            style={{
                                width: "100%",
                                border: "none",
                            }}
                        >
                            <div className="section-first">
                                <div className="set-wrapper">
                                    <p>사전 진단 필요 여부</p>
                                    <div className="set-radio">
                                        <div className="one-radio">
                                            <Input type="radio" name="diagnosis" checked={diagnosisType === "VISIT"} onChange={() => setDiagnosisType("VISIT")} />
                                            <label>현장 방문 필요</label>
                                        </div>
                                        <div className="one-radio">
                                            <Input type="radio" name="diagnosis" checked={diagnosisType === "PHOTO"} onChange={() => setDiagnosisType("PHOTO")} />
                                            <label>사진으로 진단 가능</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="set-wrapper">
                                    <p>수리 방식</p>
                                    <div className="set-radio">
                                        <div className="one-radio">
                                            <Input type="radio" name="repairType" checked={repairType === "PART"} onChange={() => setRepairType("PART")} />
                                            <label>부분 수리</label>
                                        </div>
                                        <div className="one-radio">
                                            <Input type="radio" name="repairType" checked={repairType === "ALL"} onChange={() => setRepairType("ALL")} />
                                            <label>전체 교체</label>
                                        </div>
                                        <div className="one-radio">
                                            <Input type="radio" name="repairType" checked={repairType === "CHECK"} onChange={() => setRepairType("CHECK")} />
                                            <label>점검만 진행</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section-second">
                                <div className="set-wrapper">
                                    <p>예상 작업 시간</p>
                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                        }}
                                    >
                                        <div className="expert-chip-list">
                                            {["HOUR", "DAY", "WEEK", "MONTH"].map((type) => (
                                                <span key={type} className={workDurationType === type ? "chip-active" : "chip"} onClick={() => setWorkDurationType(type)}>
                                                    {type === "HOUR" && "시간"}
                                                    {type === "DAY" && "일"}
                                                    {type === "WEEK" && "주"}
                                                    {type === "MONTH" && "개월"}
                                                </span>
                                            ))}
                                        </div>
                                        <Input type="number" value={workDurationValue} onChange={(e) => setWorkDurationValue(e.target.value)} placeholder="작업 기간 입력" />
                                    </div>
                                </div>
                                <div className="set-wrapper">
                                    <p>작업 범위</p>
                                    <div className="set-checkbox">
                                        <div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("사전 점검")} onChange={() => toggleScope("사전 점검")} />
                                                <label for="inquiryType" style={{ fontSize: "14px", fontWeight: "400" }}>
                                                    사전 점검
                                                </label>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("철거")} onChange={() => toggleScope("철거")} />
                                                <laebl for="inquiryType">철거</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("수리 / 시공 / 설치")} onChange={() => toggleScope("수리 / 시공 / 설치")} />
                                                <laebl for="inquiryType">수리 / 시공 / 설치</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("자재 구매 및 준비")} onChange={() => toggleScope("자재 구매 및 준비")} />
                                                <laebl for="inquiryType">자재 구매 및 준비</laebl>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("마감 작업")} onChange={() => toggleScope("마감 작업")} />
                                                <laebl for="inquiryType">마감 작업</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("잔여물 처리 및 청소")} onChange={() => toggleScope("잔여물 처리 및 청소")} />
                                                <laebl for="inquiryType">잔여물 처리 및 청소</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("사후 점검")} onChange={() => toggleScope("사후 점검")} />
                                                <laebl for="inquiryType">사후 점검</laebl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="set-wrapper">
                                    <p>작업 상세 설명</p>
                                    <Input type="textarea" value={workDetail} onChange={(e) => setWorkDetail(e.target.value)} />
                                </div>
                            </div>

                            <div className="section-third" style={{ margin: "0" }}>
                                <p className="cost-title">비용 내역</p>
                                <div className="cost-set-wrapper">
                                    <div className="add">
                                        <p>공정별 시공비</p>
                                        <button className="secondary-button" style={{ height: "33px", width: "68px" }} onClick={() => addProcessCost()}>
                                            추가
                                        </button>
                                    </div>
                                    <div className="cost-wrapper">
                                        <div className="cost-list">
                                            {processCosts.map((item, idx) => (
                                                <div key={idx} className="cost-one-line">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <Input style={{ width: "140px" }} value={item.name} onChange={(e) => updateProcessCost(idx, "name", e.target.value)} placeholder="공정" />
                                                        <Input
                                                            style={{ width: "240px" }}
                                                            value={formatNumber(item.price)}
                                                            onChange={(e) => updateProcessCost(idx, "price", e.target.value)}
                                                            placeholder="금액"
                                                        />
                                                    </div>
                                                    <button className="secondary-button" style={{ height: "33px", width: "68px" }} onClick={() => removeProcessCost(idx)}>
                                                        삭제
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p>
                                            시공비 합계
                                            <span>{processTotal.toLocaleString()} 원</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="cost-set-wrapper">
                                    <div className="add">
                                        <p>자재비</p>
                                        <button className="secondary-button" style={{ height: "33px", width: "68px" }} onClick={() => addMaterialCost()}>
                                            추가
                                        </button>
                                    </div>

                                    <div className="cost-wrapper">
                                        <div className="cost-list">
                                            {materialCosts.map((item, idx) => (
                                                <div key={idx} className="cost-one-line">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <Input style={{ width: "140px" }} value={item.name} onChange={(e) => updateMaterialCost(idx, "name", e.target.value)} placeholder="공정" />
                                                        <Input
                                                            style={{ width: "240px" }}
                                                            value={formatNumber(item.price)}
                                                            onChange={(e) => updateMaterialCost(idx, "price", e.target.value)}
                                                            placeholder="금액"
                                                        />
                                                    </div>
                                                    <button className="secondary-button" style={{ height: "33px", width: "68px" }} onClick={() => removeMaterialCost(idx)}>
                                                        삭제
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p>
                                            시공비 합계
                                            <span>{materialTotal.toLocaleString()} 원</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="etc-wrapper">
                                    <div className="etc-set-wrapper">
                                        <div className="etc-one-line">
                                            <p>폐기물 처리비</p>
                                            <Input style={{ width: "240px" }} value={formatNumber(disposalCost)} onChange={handleMoneyChange(setDisposalCost)} placeholder="금액을 입력해 주세요." />
                                        </div>
                                        <div className="etc-one-line">
                                            <p>철거비</p>
                                            <Input
                                                style={{ width: "240px" }}
                                                value={formatNumber(demolitionCost)}
                                                onChange={handleMoneyChange(setDemolitionCost)}
                                                placeholder="금액을 입력해 주세요."
                                            />
                                        </div>
                                        <div className="etc-one-line">
                                            <p>기타 비용</p>
                                            <Input style={{ width: "240px" }} value={formatNumber(etcFee)} onChange={handleMoneyChange(setEtcFee)} placeholder="금액을 입력해 주세요." />
                                        </div>
                                    </div>
                                    <p className="total">
                                        총 견적 금액
                                        <span>{totalCost.toLocaleString()} 원</span>
                                    </p>
                                </div>
                                <div className="set-wrapper">
                                    <p className="cost-title">비용 상세 설명</p>
                                    <Input
                                        type="textarea"
                                        value={costDetail}
                                        onChange={(e) => setCostDetail(e.target.value)}
                                        placeholder="예) 서비스 옵션, 추가 비용, 출장 비용, 재료에 따른 견적 차이 등"
                                    />
                                </div>
                                <div className="public-request-button-wrapper">
                                    <button
                                        className="primary-button"
                                        style={{
                                            width: "200px",
                                            height: "40px",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                        }}
                                        onClick={() => submitEstimate()}
                                    >
                                        결제 요청 보내기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            )}

            {estimate.largeServiceIdx === 44 && (
                <Modal
                    isOpen={isModalOpen}
                    toggle={() => {
                        setIsModalOpen(false);
                        resetEstimateForm();
                    }}
                    className="mypage-modal"
                    style={{ width: "553px" }}
                >
                    <ModalHeader
                        toggle={() => {
                            setIsModalOpen(false);
                            resetEstimateForm();
                        }}
                    >
                        최종 견적서를 보내시겠어요?
                    </ModalHeader>
                    <ModalBody style={{ padding: "0" }}>
                        <div
                            className="expert-estimate-form"
                            style={{
                                width: "100%",
                                border: "none",
                            }}
                        >
                            <div className="section-first">
                                <div className="set-wrapper">
                                    <p>철거 여부</p>
                                    <div className="set-radio">
                                        <div className="one-radio">
                                            <Input type="radio" name="demolition" checked={demolitionType === "INCLUDED"} onChange={() => setDemolitionType("INCLUDED")} />
                                            <label>기존 자재 철거 포함</label>
                                        </div>
                                        <div className="one-radio">
                                            <Input type="radio" name="demolition" checked={demolitionType === "EXTRA"} onChange={() => setDemolitionType("EXTRA")} />
                                            <label>철거 비용 별도</label>
                                        </div>
                                        <div className="one-radio">
                                            <Input type="radio" name="demolition" checked={demolitionType === "NONE"} onChange={() => setDemolitionType("NONE")} />
                                            <label>철거 없음</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section-second">
                                <div className="set-wrapper">
                                    <p>예상 작업 시간</p>
                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                        }}
                                    >
                                        <div className="expert-chip-list">
                                            {["HOUR", "DAY", "WEEK", "MONTH"].map((type) => (
                                                <span key={type} className={workDurationType === type ? "chip-active" : "chip"} onClick={() => setWorkDurationType(type)}>
                                                    {type === "HOUR" && "시간"}
                                                    {type === "DAY" && "일"}
                                                    {type === "WEEK" && "주"}
                                                    {type === "MONTH" && "개월"}
                                                </span>
                                            ))}
                                        </div>
                                        <Input type="number" value={workDurationValue} onChange={(e) => setWorkDurationValue(e.target.value)} placeholder="작업 기간 입력" />
                                    </div>
                                </div>
                                <div className="set-wrapper">
                                    <p>작업 범위</p>
                                    <div className="set-checkbox">
                                        <div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("사전 점검")} onChange={() => toggleScope("사전 점검")} />
                                                <label for="inquiryType" style={{ fontSize: "14px", fontWeight: "400" }}>
                                                    사전 점검
                                                </label>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("철거")} onChange={() => toggleScope("철거")} />
                                                <laebl for="inquiryType">철거</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("수리 / 시공 / 설치")} onChange={() => toggleScope("수리 / 시공 / 설치")} />
                                                <laebl for="inquiryType">수리 / 시공 / 설치</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("자재 구매 및 준비")} onChange={() => toggleScope("자재 구매 및 준비")} />
                                                <laebl for="inquiryType">자재 구매 및 준비</laebl>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("마감 작업")} onChange={() => toggleScope("마감 작업")} />
                                                <laebl for="inquiryType">마감 작업</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("잔여물 처리 및 청소")} onChange={() => toggleScope("잔여물 처리 및 청소")} />
                                                <laebl for="inquiryType">잔여물 처리 및 청소</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("사후 점검")} onChange={() => toggleScope("사후 점검")} />
                                                <laebl for="inquiryType">사후 점검</laebl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="set-wrapper">
                                    <p>작업 상세 설명</p>
                                    <Input type="textarea" value={workDetail} onChange={(e) => setWorkDetail(e.target.value)} />
                                </div>
                            </div>

                            <div className="section-third" style={{ margin: "0" }}>
                                <p className="cost-title">비용 내역</p>
                                <div className="cost-set-wrapper">
                                    <div className="add">
                                        <p>공정별 시공비</p>
                                        <button className="secondary-button" style={{ height: "33px", width: "68px" }} onClick={() => addProcessCost()}>
                                            추가
                                        </button>
                                    </div>
                                    <div className="cost-wrapper">
                                        <div className="cost-list">
                                            {processCosts.map((item, idx) => (
                                                <div key={idx} className="cost-one-line">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <Input style={{ width: "140px" }} value={item.name} onChange={(e) => updateProcessCost(idx, "name", e.target.value)} placeholder="공정" />
                                                        <Input
                                                            style={{ width: "240px" }}
                                                            value={formatNumber(item.price)}
                                                            onChange={(e) => updateProcessCost(idx, "price", e.target.value)}
                                                            placeholder="금액"
                                                        />
                                                    </div>
                                                    <button className="secondary-button" style={{ height: "33px", width: "68px" }} onClick={() => removeProcessCost(idx)}>
                                                        삭제
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p>
                                            시공비 합계
                                            <span>{processTotal.toLocaleString()} 원</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="cost-set-wrapper">
                                    <div className="add">
                                        <p>자재비</p>
                                        <button className="secondary-button" style={{ height: "33px", width: "68px" }} onClick={() => addMaterialCost()}>
                                            추가
                                        </button>
                                    </div>

                                    <div className="cost-wrapper">
                                        <div className="cost-list">
                                            {materialCosts.map((item, idx) => (
                                                <div key={idx} className="cost-one-line">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <Input style={{ width: "140px" }} value={item.name} onChange={(e) => updateMaterialCost(idx, "name", e.target.value)} placeholder="공정" />
                                                        <Input
                                                            style={{ width: "240px" }}
                                                            value={formatNumber(item.price)}
                                                            onChange={(e) => updateMaterialCost(idx, "price", e.target.value)}
                                                            placeholder="금액"
                                                        />
                                                    </div>
                                                    <button className="secondary-button" style={{ height: "33px", width: "68px" }} onClick={() => removeMaterialCost(idx)}>
                                                        삭제
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p>
                                            시공비 합계
                                            <span>{materialTotal.toLocaleString()} 원</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="etc-wrapper">
                                    <div className="etc-set-wrapper">
                                        <div className="etc-one-line">
                                            <p>폐기물 처리비</p>
                                            <Input style={{ width: "240px" }} value={formatNumber(disposalCost)} onChange={handleMoneyChange(setDisposalCost)} placeholder="금액을 입력해 주세요." />
                                        </div>
                                        <div className="etc-one-line">
                                            <p>철거비</p>
                                            <Input
                                                style={{ width: "240px" }}
                                                value={formatNumber(demolitionCost)}
                                                onChange={handleMoneyChange(setDemolitionCost)}
                                                placeholder="금액을 입력해 주세요."
                                            />
                                        </div>
                                        <div className="etc-one-line">
                                            <p>기타 비용</p>
                                            <Input style={{ width: "240px" }} value={formatNumber(etcFee)} onChange={handleMoneyChange(setEtcFee)} placeholder="금액을 입력해 주세요." />
                                        </div>
                                    </div>
                                    <p className="total">
                                        총 견적 금액
                                        <span>{totalCost.toLocaleString()} 원</span>
                                    </p>
                                </div>
                                <div className="set-wrapper">
                                    <p className="cost-title">비용 상세 설명</p>
                                    <Input
                                        type="textarea"
                                        value={costDetail}
                                        onChange={(e) => setCostDetail(e.target.value)}
                                        placeholder="예) 서비스 옵션, 추가 비용, 출장 비용, 재료에 따른 견적 차이 등"
                                    />
                                </div>
                                <div className="public-request-button-wrapper">
                                    <button
                                        className="primary-button"
                                        style={{
                                            width: "200px",
                                            height: "40px",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                        }}
                                        onClick={() => submitEstimate()}
                                    >
                                        결제 요청 보내기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            )}

            {estimate.largeServiceIdx === 74 && (
                <Modal
                    isOpen={isModalOpen}
                    toggle={() => {
                        setIsModalOpen(false);
                        resetEstimateForm();
                    }}
                    className="mypage-modal"
                    style={{ width: "553px" }}
                >
                    <ModalHeader
                        toggle={() => {
                            setIsModalOpen(false);
                            resetEstimateForm();
                        }}
                    >
                        최종 견적서를 보내시겠어요?
                    </ModalHeader>
                    <ModalBody style={{ padding: "0" }}>
                        <div
                            className="expert-estimate-form"
                            style={{
                                width: "100%",
                                border: "none",
                            }}
                        >
                            <div className="section-first">
                                <div className="set-wrapper">
                                    <p>컨설팅 범위</p>
                                    <div className="set-checkbox">
                                        <div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("레이아웃 (구조 배치) 제안")} onChange={() => toggleScope("레이아웃 (구조 배치) 제안")} />
                                                <label>레이아웃 (구조 배치) 제안</label>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("동선 개선 제안")} onChange={() => toggleScope("동선 개선 제안")} />
                                                <laebl for="inquiryType">동선 개선 제안</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("컬러/재질 추천")} onChange={() => toggleScope("컬러/재질 추천")} />
                                                <laebl for="inquiryType">컬러/재질 추천</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("가구/조명 추천")} onChange={() => toggleScope("가구/조명 추천")} />
                                                <laebl for="inquiryType">가구/조명 추천</laebl>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("스타일 보드 제작")} onChange={() => toggleScope("스타일 보드 제작")} />
                                                <laebl for="inquiryType">스타일 보드 제작</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input
                                                    type="checkbox"
                                                    checked={workScopes.includes("작업 범위에 따른 예상 공정 리스트 제공")}
                                                    onChange={() => toggleScope("작업 범위에 따른 예상 공정 리스트 제공")}
                                                />
                                                <laebl for="inquiryType">작업 범위에 따른 예상 공정 리스트 제공</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("3D 이미지(렌더링) 제작")} onChange={() => toggleScope("3D 이미지(렌더링) 제작")} />
                                                <laebl for="inquiryType">3D 이미지(렌더링) 제작</laebl>
                                            </div>
                                            <div className="one-checkbox">
                                                <Input type="checkbox" checked={workScopes.includes("PDF 제안서 작성")} onChange={() => toggleScope("PDF 제안서 작성")} />
                                                <laebl for="inquiryType">PDF 제안서 작성</laebl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="set-wrapper">
                                    <p>컨설팅 방식</p>
                                    <div className="set-radio">
                                        <div className="one-radio">
                                            <Input type="radio" name="consulting" checked={consultingType === "ONLINE"} onChange={() => setConsultingType("ONLINE")} />
                                            <label>온라인 (채팅/화상)</label>
                                        </div>
                                        <div className="one-radio">
                                            <Input type="radio" name="consulting" checked={consultingType === "VISIT"} onChange={() => setConsultingType("VISIT")} />
                                            <label>직접 방문</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section-second">
                                <div className="set-wrapper">
                                    <p>예상 소요 시간</p>
                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                        }}
                                    >
                                        <div className="expert-chip-list">
                                            {["HOUR", "DAY"].map((type) => (
                                                <span key={type} className={workDurationType === type ? "chip-active" : "chip"} onClick={() => setWorkDurationType(type)}>
                                                    {type === "HOUR" && "시간"}
                                                    {type === "DAY" && "일"}
                                                </span>
                                            ))}
                                        </div>
                                        <Input type="number" value={workDurationValue} onChange={(e) => setWorkDurationValue(e.target.value)} placeholder="작업 기간 입력" />
                                    </div>
                                </div>
                                <div className="set-wrapper">
                                    <p>컨설팅 상세 설명</p>
                                    <Input type="textarea" value={workDetail} onChange={(e) => setWorkDetail(e.target.value)} />
                                </div>
                            </div>

                            <div className="section-third" style={{ margin: "0" }}>
                                <p className="cost-title">비용 내역</p>
                                <div className="etc-wrapper">
                                    <div className="etc-set-wrapper">
                                        <div className="etc-one-line">
                                            <p style={{ width: "150px" }}>컨설팅 인건비</p>
                                            <Input
                                                style={{ width: "240px" }}
                                                value={formatNumber(consultingLaborCost)}
                                                onChange={handleMoneyChange(setConsultingLaborCost)}
                                                placeholder="금액을 입력해 주세요."
                                            />
                                        </div>
                                        <div className="etc-one-line">
                                            <p style={{ width: "150px" }}>스타일링/디자인 작업비</p>
                                            <Input
                                                style={{ width: "240px" }}
                                                value={formatNumber(stylingDesignCost)}
                                                onChange={handleMoneyChange(setStylingDesignCost)}
                                                placeholder="금액을 입력해 주세요."
                                            />
                                        </div>
                                        <div className="etc-one-line">
                                            <p style={{ width: "150px" }}>3D 이미지 제작비</p>
                                            <Input
                                                style={{ width: "240px" }}
                                                value={formatNumber(threeDImageCost)}
                                                onChange={handleMoneyChange(setThreeDImageCost)}
                                                placeholder="금액을 입력해 주세요."
                                            />
                                        </div>
                                        <div className="etc-one-line">
                                            <p style={{ width: "150px" }}>보고서 제작비</p>
                                            <Input
                                                style={{ width: "240px" }}
                                                value={formatNumber(reportProductionCost)}
                                                onChange={handleMoneyChange(setReportProductionCost)}
                                                placeholder="금액을 입력해 주세요."
                                            />
                                        </div>
                                        <div className="etc-one-line">
                                            <p style={{ width: "150px" }}>기타 비용</p>
                                            <Input style={{ width: "240px" }} value={formatNumber(etcFee)} onChange={handleMoneyChange(setEtcFee)} placeholder="금액을 입력해 주세요." />
                                        </div>
                                    </div>
                                    <p className="total">
                                        총 견적 금액
                                        <span>{totalCost.toLocaleString()} 원</span>
                                    </p>
                                </div>
                                <div className="set-wrapper">
                                    <p className="cost-title">비용 상세 설명</p>
                                    <Input
                                        type="textarea"
                                        value={costDetail}
                                        onChange={(e) => setCostDetail(e.target.value)}
                                        placeholder="예) 서비스 옵션, 추가 비용, 출장 비용, 재료에 따른 견적 차이 등"
                                    />
                                </div>
                                <div className="public-request-button-wrapper">
                                    <button
                                        className="primary-button"
                                        style={{
                                            width: "200px",
                                            height: "40px",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                        }}
                                        onClick={() => submitEstimate()}
                                    >
                                        결제 요청 보내기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            )}
            {isSend && (
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
                            <p>견적서가 전송되었습니다.</p>
                        </div>
                    </ModalBody>
                </Modal>
            )}
        </div>
    );
}
