import { useEffect, useState } from "react";
import { Input, Modal, ModalBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import PublicRequestCard from "../component/PublicRequestCard";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";
import "../css/expertEstimate.css";

export default function PublicRequest() {
    const [requestList, setRequestList] = useState([]);
    const [requestDetail, setRequestDetail] = useState(null);

    const [lastId, setLastId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [targetRequest, setTargetRequest] = useState(); // 선택한 요청서
    const [isCustomSelected, setIsCustomSelected] = useState(false); // "맞춤견적" 선택 여부
    const [token, setToken] = useAtom(tokenAtom);
    const [user, setUser] = useAtom(userAtom);

    // 알림 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달 안에 들어갈 메세지
    const [modalMessage, setModalMessage] = useState("");

    const navigate = useNavigate();

    // 공개 요청서 목록 조회
    const getRequestList = async (lastId, size) => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const res = await myAxios(token, setToken).get(`http://localhost:8080/publicRequestsList?size=${size}` + (lastId ? `&lastId=${lastId}` : ""));

            const data = res.data;

            // 데이터 없으면 종료
            if (data.length === 0) {
                setHasMore(false);
                setIsLoading(false);
                return;
            }

            // 기존 리스트 뒤에 append
            setRequestList((prev) => [...prev, ...data]);

            // 다음 요청을 위한 lastId 저장 (마지막 requestIdx)
            setLastId(data[data.length - 1].requestIdx);
        } catch (err) {
            console.log(err);
        }

        setIsLoading(false);
    };

    // 전문가가 메인 서비스를 등록하지 않았을때, 마이페이지로 이동시키기
    useEffect(() => {
        if (!user || !token) return;

        console.log(user);
        console.log(token);
        myAxios(token, setToken)
            .get(`${baseUrl}/expert/mainServiceCheck?username=${user.username}`)
            .then((res) => {
                if (res.data === false) {
                    console.log(res.data);
                    setModalMessage("대표서비스를 먼저 등록해주세요.");
                    setIsModalOpen(true);
                    setTimeout(() => {
                        setIsModalOpen(false);
                        navigate("/expert/profile/edit");
                    }, 1500);
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [user, token]);

    // 공개 요청서 상세 조회
    const getRequestDetail = (requestIdx) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/publicRequestsDetail?requestIdx=${requestIdx}`)
            .then((res) => {
                setRequestDetail(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getRequestList(null, 20);
    }, []);

    // 스크롤 막기
    useEffect(() => {
        document.body.style.overflow = "hidden";

        // 페이지 벗어날 때 원상복구
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // 페이지 하단 감지
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    getRequestList(lastId, 20);
                }
            },
            { threshold: 1 }
        );

        const target = document.querySelector("#scroll-end");
        if (target) observer.observe(target);

        return () => observer.disconnect();
    }, [lastId, hasMore, isLoading]);

    // 날짜 변환 함수
    function timeAgo(sqlDateString) {
        const now = new Date();
        const date = new Date(sqlDateString);

        // 날짜만 비교
        const diffMs = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
        const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDay < 1) return "오늘";
        return `${diffDay}일 전`;
    }

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
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "48px 0",
                    gap: "30px",
                    flex: 1.3,
                    height: "100%",
                    overflowY: "auto",
                    paddingRight: "8px",
                }}
            >
                <h1 className="mypage-title">공개 요청서</h1>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginBottom: "100px",
                    }}
                >
                    {/* <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <Input
              type="select"
              style={{
                width: "100px",
                height: "30px",
                padding: "4px 14px",
                alignItems: "center",
                borderRadius: "16px",
                border: "1px solid #E0E5EB",
                fontSize: "14px",
                color: "#303441",
              }}
            >
              <option value="">카테고리</option>
            </Input>
            <div
              style={{
                display: "flex",
                height: "30px",
                padding: "4px 16px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "16px",
                border: isCustomSelected
                  ? "1px solid #293341"
                  : "1px solid #E0E5EB",
                fontSize: "14px",
                color: isCustomSelected ? "#fff" : "#303441",
                backgroundColor: isCustomSelected ? "#293341" : "#fff",
                cursor: "pointer",
              }}
              onClick={() => setIsCustomSelected(!isCustomSelected)}
            >
              맞춤견적
            </div>
          </div> */}
                    {requestList.map((request, idx) => (
                        <PublicRequestCard
                            key={`${request?.requestIdx}-${idx}`}
                            request={request}
                            onClick={() => {
                                setTargetRequest(request);
                                getRequestDetail(request.requestIdx);
                            }}
                            isSelect={request?.requestIdx === targetRequest?.requestIdx}
                        />
                    ))}
                    <div id="scroll-end" style={{ height: "20px" }}></div>
                </div>
            </div>
            {requestDetail ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "48px 0",
                        width: "100%",
                        flex: 2,
                        borderRight: "1px solid #EFF1F5",
                        borderLeft: "1px solid #EFF1F5",

                        height: "100%",
                        overflowY: "auto",
                        paddingRight: "8px",
                        marginBottom: "100px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            padding: "0 20px 30px 20px",
                            flexDirection: "column",
                            gap: "16px",
                            borderBottom: "1px solid #EFF1F5",
                        }}
                    >
                        <p
                            style={{
                                display: "flex",
                                gap: "4px",
                                fontSize: "13px",
                                color: "#6A7685",
                            }}
                        >
                            {timeAgo(requestDetail.createdAt)} · 견적 보낸 전문가
                            <span
                                style={{
                                    color: "#FF5833",
                                    fontWeight: "500",
                                }}
                            >
                                {requestDetail.expertResponseCount}명
                            </span>
                        </p>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                }}
                            >
                                {requestDetail.categoryName}
                            </p>
                            <button className="primary-button" style={{ width: "100px", height: "33px" }} onClick={() => navigate(`/expert/requests/detail/${requestDetail.requestIdx}`)}>
                                견적 보내기
                            </button>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            padding: "30px 0",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                padding: "0 20px 30px 20px",
                                flexDirection: "column",
                                gap: "20px",
                                borderBottom: "1px solid #EFF1F5",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                }}
                            >
                                요청상세
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                    color: "#6A7685",
                                    fontSize: "14px",
                                }}
                            >
                                <p>
                                    <span
                                        style={{
                                            minWidth: "74px",
                                            display: "inline-block",
                                        }}
                                    >
                                        예산
                                    </span>
                                    {Number(requestDetail.budget).toLocaleString()}원
                                </p>
                                <p>
                                    <span
                                        style={{
                                            minWidth: "74px",
                                            display: "inline-block",
                                        }}
                                    >
                                        지역
                                    </span>
                                    {requestDetail.location}
                                </p>
                                <p>
                                    <span
                                        style={{
                                            minWidth: "74px",
                                            display: "inline-block",
                                        }}
                                    >
                                        희망 일정
                                    </span>
                                    {requestDetail.preferredDate}
                                </p>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                padding: "30px 20px",
                                flexDirection: "column",
                                gap: "20px",
                                borderBottom: "1px solid #EFF1F5",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                }}
                            >
                                추가 요청사항
                            </p>

                            <p
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "400",
                                }}
                            >
                                {requestDetail.additionalRequest}
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                }}
                            >
                                {[requestDetail.image1, requestDetail.image2, requestDetail.image3].filter(Boolean).map((img, idx) => (
                                    <img key={idx} src={`http://localhost:8080/imageView?type=expert&filename=${img}`} width="80px" height="80px" />
                                ))}
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                padding: "30px 20px",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                }}
                            >
                                고객 정보
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <img
                                    src={requestDetail.requesterProfile ? `http://localhost:8080/imageView?type=profile&filename=${requestDetail.requesterProfile}` : "/default-profile.png"}
                                    width="40px"
                                    height="40px"
                                    style={{ borderRadius: "26px" }}
                                />
                                <div
                                    style={{
                                        color: "#6A7685",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {requestDetail.requesterName}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        전문가 매칭 {requestDetail.requesterMatchCount}회
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        flex: 2,
                        borderRight: "1px solid #EFF1F5",
                        borderLeft: "1px solid #EFF1F5",
                    }}
                ></div>
            )}

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
        </div>
    );
}
