import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Input } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";
import { useNavigate } from "react-router";

export default function RequestActive() {
    const [request, setRequest] = useState({}); // 요청서 상세
    const [expertList, setExpertList] = useState([]); // 전문가 목록
    const [estimate, setEstimate] = useState(null); // 선택한 전문가 견적서 상세
    const [costList, setCostList] = useState([]); // 견적서 비용 상세
    const [selectedExpertIdx, setSelectedExpertIdx] = useState(null); // 선택한 전문가 id
    const [selectedExpertUsername, setSelectedExpertUsername] = useState(null); // 선택한 전문가 username
    const [expert, setExpert] = useState(null);

    const [open, setOpen] = useState(true);

    const navigate = useNavigate();

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 진행중인 요청서 조회
    const getRequest = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/active/requestDetail?username=${user.username}`)
            .then((res) => {
                console.log(res.data.requestDetail);
                setRequest(res.data.requestDetail);
                setExpertList(res.data.expertList);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 견적서 상세 조회
    const getEstimateDetail = (estimateIdx) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/active/estimateDetail?estimateIdx=${estimateIdx}`)
            .then((res) => {
                setEstimate(res.data.estimateDetail);
                setCostList(res.data.costList);
                setSelectedExpertUsername(res.data.expertUsername);
                setExpert(res.data.expertDetail);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 요청 취소하기
    const stopRequest = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/request/stop?requestIdx=${request.requestIdx}`)
            .then(() => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 채팅하기
    const chat = (e) => {
        e.preventDefault();

        myAxios(token, setToken)
            .post("http://localhost:8080/message-room", {
                type: "EXPERT",
                sendUsername: user.username,
                recvUsername: selectedExpertUsername,
                estimateIdx: estimate.estimateIdx,
            })
            .then((res) => {
                const roomId = res.data;
                window.scrollTo(0, 0);
                navigate(`/zipddak/message?roomId=${roomId}`);
            });
    };

    // 사전진단 매핑
    const DIAGNOSIS_TYPE_MAPPING = {
        VISIT: "현장 방문 필요",
        PHOTO: "사진으로 진단 가능",
    };
    // 수리방식 매핑
    const REPAIR_TYPE_MAPPING = {
        PART: "부분 수리",
        ALL: "전체 교체",
        CHECK: "점검만 진행",
    };
    // 철거여부 매핑
    const DEMOLITION_TYPE_MAPPING = {
        INCLUDED: "기존 자재 철거 포함",
        EXTRA: "철거 비용 별도",
        NONE: "철거 없음",
    };
    // 컨설팅방식 매핑
    const CONSULTING_TYPE_MAPPING = {
        ONLINE: "온라인 (채팅/화상)",
        VISIT: "직접 방문",
    };

    // 시공비, 자재비 총액
    const getCostTotalByType = (costList, type) => {
        return costList.filter((cost) => cost.type === type).reduce((sum, cost) => sum + Number(cost.amount || 0), 0);
    };
    const buildTotal = getCostTotalByType(costList, "BUILD");
    const materialTotal = getCostTotalByType(costList, "MATERIAL");

    // 기타 비용 총액
    const getExtraCostTotal = (estimate) => {
        return (
            Number(estimate.consultingLaborCost || 0) +
            Number(estimate.stylingDesignCost || 0) +
            Number(estimate.threeDImageCost || 0) +
            Number(estimate.reportProductionCost || 0) +
            Number(estimate.demolitionCost || 0) +
            Number(estimate.disposalCost || 0) +
            Number(estimate.etcFee || 0)
        );
    };

    // 전체 견적금액 총액
    const getTotalAmount = (costList, estimate) => {
        const buildTotal = getCostTotalByType(costList, "BUILD");
        const materialTotal = getCostTotalByType(costList, "MATERIAL");
        const extraTotal = getExtraCostTotal(estimate);

        return buildTotal + materialTotal + extraTotal;
    };

    useEffect(() => {
        user.username && getRequest();
    }, [user.username]);

    return (
        <div className="mypage-layout">
            {!request ? (
                <>
                    <h1 className="mypage-title">진행중인 견적 요청</h1>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                padding: "40px",
                                textAlign: "center",
                                color: "#6A7685",
                                fontSize: "14px",
                            }}
                        >
                            진행중인 요청이 없습니다.
                        </div>
                        <button
                            onClick={() => {
                                navigate("/zipddak/findExpert");
                            }}
                            className="primary-button"
                            style={{ width: "200px", height: "40px" }}
                        >
                            견적 요청하러가기
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "16px",
                        }}
                    >
                        <h1 className="mypage-title">{request.smallServiceName ? request.smallServiceName : request.largeServiceName}</h1>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                justifyContent: "space-between",
                                fontWeight: "400",
                                fontSize: "15px",
                            }}
                        >
                            <p>
                                요청일 <span>{request.requestAt}</span>
                            </p>
                            <p
                                style={{
                                    color: "#6A7685",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                }}
                                onClick={() => stopRequest()}
                            >
                                요청 취소하기
                            </p>
                        </div>
                    </div>
                    {/* 요청 상세 */}
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                            }}
                        >
                            <h3 className="mypage-sectionTitle" style={{ borderBottom: "none", padding: 0 }}>
                                요청 상세
                            </h3>
                            <i className={`bi bi-chevron-${open ? "up" : "down"}`} onClick={() => setOpen(!open)} />
                        </div>
                        {open && (
                            <div style={{ paddingTop: "20px" }}>
                                {request.place && (
                                    <div
                                        style={{
                                            display: "flex",
                                            padding: "20px 0",
                                            alignItems: "flex-start",
                                            alignSelf: "stretch",
                                            borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                        }}
                                    >
                                        <p
                                            style={{
                                                minWidth: "220px",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            시공할 공간은 어디인가요?
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {request.place}
                                        </p>
                                    </div>
                                )}
                                {request.constructionSize && (
                                    <div
                                        style={{
                                            display: "flex",
                                            padding: "20px 0",
                                            alignItems: "flex-start",
                                            alignSelf: "stretch",
                                            borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                        }}
                                    >
                                        <p
                                            style={{
                                                minWidth: "220px",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            시공 사이즈
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {request.constructionSize}
                                        </p>
                                    </div>
                                )}
                                {request.midServiceName && (
                                    <div
                                        style={{
                                            display: "flex",
                                            padding: "20px 0",
                                            alignItems: "flex-start",
                                            alignSelf: "stretch",
                                            borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                        }}
                                    >
                                        <p
                                            style={{
                                                minWidth: "220px",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            어떤 서비스를 원하시나요?
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {request.midServiceName}
                                        </p>
                                    </div>
                                )}
                                {request.purpose && (
                                    <div
                                        style={{
                                            display: "flex",
                                            padding: "20px 0",
                                            alignItems: "flex-start",
                                            alignSelf: "stretch",
                                            borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                        }}
                                    >
                                        <p
                                            style={{
                                                minWidth: "220px",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            시공 목적이 무엇인가요?
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {request.purpose}
                                        </p>
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        padding: "20px 0",
                                        alignItems: "flex-start",
                                        alignSelf: "stretch",
                                        borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                    }}
                                >
                                    <p
                                        style={{
                                            minWidth: "220px",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        시공희망장소
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {request.location}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        padding: "20px 0",
                                        alignItems: "flex-start",
                                        alignSelf: "stretch",
                                        borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                    }}
                                >
                                    <p
                                        style={{
                                            minWidth: "220px",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        예산을 선택해주세요.
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {request.budget?.toLocaleString()}원
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        padding: "20px 0",
                                        alignItems: "flex-start",
                                        alignSelf: "stretch",
                                        borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                    }}
                                >
                                    <p
                                        style={{
                                            minWidth: "220px",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        시공 희망일이 언제인가요?
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {request.preferredDate}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        padding: "20px 0",
                                        alignItems: "flex-start",
                                        alignSelf: "stretch",
                                        borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                    }}
                                >
                                    <p
                                        style={{
                                            minWidth: "220px",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        추가 요청사항
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {request.additionalRequest ? request.additionalRequest : "-"}
                                    </p>
                                </div>
                                {request.image1Idx && (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {[request.image1Idx, request.image2Idx, request.image3Idx]
                                            .filter((img) => img)
                                            .map((img, idx) => (
                                                <img key={idx} src={`http://localhost:8080/imageView?type=expert&filename=${img}`} width="80px" height="80px" />
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {expertList.length !== 0 ? (
                        <div
                            style={{
                                display: "flex",
                                gap: "16px",
                                alignItems: "center",
                                alignSelf: "stretch",
                            }}
                        >
                            {expertList.map((expert) => (
                                <div
                                    style={{
                                        display: "flex",
                                        width: "88px",
                                        padding: "14px 16px",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "10px",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        border: selectedExpertIdx === expert.estimateIdx ? "1px solid rgba(179, 235, 255, 0.50)" : "1px solid #EFF1F5",

                                        background: selectedExpertIdx === expert.estimateIdx ? "rgba(179, 235, 255, 0.10)" : "#FFF",

                                        transition: "all 0.2s ease",
                                    }}
                                    key={expert.estimateIdx}
                                    onClick={() => {
                                        setSelectedExpertIdx(expert.estimateIdx);
                                        getEstimateDetail(expert.estimateIdx);
                                    }}
                                >
                                    <img
                                        src={expert.profileImage ? `http://localhost:8080/imageView?type=expert&filename=${expert.profileImage}` : "/default-profile.png"}
                                        width="40px"
                                        height="40px"
                                    />
                                    <p style={{ whiteSpace: "nowrap" }}>{expert.activityName}</p>
                                    <p style={{ fontWeight: "600", whiteSpace: "nowrap" }}>{Math.floor(expert.totalCost / 10000)}만원</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{
                                padding: "40px",
                                textAlign: "center",
                                color: "#6A7685",
                                fontSize: "14px",
                            }}
                        >
                            받은 견적서가 없습니다.
                        </div>
                    )}

                    {expertList.length !== 0 && (
                        <>
                            {!estimate ? (
                                <div
                                    style={{
                                        padding: "40px",
                                        textAlign: "center",
                                        color: "#6A7685",
                                        fontSize: "14px",
                                    }}
                                >
                                    전문가를 선택하면 견적서가 표시됩니다.
                                </div>
                            ) : (
                                <>
                                    <div
                                        style={{
                                            display: "flex",
                                            height: "60px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            border: "1px solid rgba(255, 88, 51, 0.15)",
                                            background: "rgba(255, 88, 51, 0.05)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                display: "flex",
                                                paddingLeft: "30px",
                                                alignItems: "center",
                                                gap: "10px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            <p>총 견적 금액</p>
                                            <p>{getTotalAmount(costList, estimate)?.toLocaleString()}원</p>
                                        </div>
                                        <div
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                display: "flex",
                                                paddingLeft: "30px",
                                                alignItems: "center",
                                                gap: "10px",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                borderLeft: "1px solid rgba(255, 88, 51, 0.15)",
                                            }}
                                        >
                                            <p>예상 작업 기간</p>
                                            {estimate.workDurationType === "HOUR" && <p>{estimate.workDurationValue}시간</p>}
                                            {estimate.workDurationType === "DAY" && <p>{estimate.workDurationValue}일</p>}
                                            {estimate.workDurationType === "WEEK" && <p>{estimate.workDurationValue}주</p>}
                                            {estimate.workDurationType === "MONTH" && <p>{estimate.workDurationValue}개월</p>}
                                        </div>
                                    </div>

                                    {/* 견적서 상세 */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "30px",
                                        }}
                                    >
                                        <div style={{ minWidth: "310px", maxWidth: "310px" }}>
                                            <h3 className="mypage-sectionTitle">견적 금액 상세</h3>
                                            {/* 시공비 */}
                                            {costList
                                                .filter((cost) => cost.type === "BUILD")
                                                .map((cost) => (
                                                    <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                        <label style={{ width: "150px" }}>{cost.label}</label>
                                                        <p
                                                            style={{
                                                                fontWeight: "600",
                                                                textAlign: "right",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {cost.amount?.toLocaleString()} 원
                                                        </p>
                                                    </div>
                                                ))}
                                            {buildTotal !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label
                                                        style={{
                                                            width: "150px",
                                                            fontWeight: "600",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        시공비 합계
                                                    </label>
                                                    <p
                                                        style={{
                                                            width: "100%",
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            fontSize: "16px",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {buildTotal?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}

                                            {/* 자재비 */}
                                            {costList
                                                .filter((cost) => cost.type === "MATERIAL")
                                                .map((cost) => (
                                                    <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                        <label style={{ width: "150px" }}>{cost.label}</label>
                                                        <p
                                                            style={{
                                                                fontWeight: "600",
                                                                textAlign: "right",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {cost.amount?.toLocaleString()} 원
                                                        </p>
                                                    </div>
                                                ))}
                                            {materialTotal !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label
                                                        style={{
                                                            width: "150px",
                                                            fontWeight: "600",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        자재비 합계
                                                    </label>
                                                    <p
                                                        style={{
                                                            width: "100%",
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            fontSize: "16px",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {materialTotal?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}

                                            {/* 그 외 비용 */}
                                            {estimate.consultingLaborCost !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label style={{ width: "150px" }}>컨설팅 인건비</label>
                                                    <p
                                                        style={{
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {estimate.consultingLaborCost?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}
                                            {estimate.stylingDesignCost !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label style={{ width: "150px" }}>스타일링 디자인비</label>
                                                    <p
                                                        style={{
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {estimate.stylingDesignCost?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}
                                            {estimate.threeDImageCost !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label style={{ width: "150px" }}>3D이미지 작업비</label>
                                                    <p
                                                        style={{
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {estimate.threeDImageCost?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}
                                            {estimate.reportProductionCost !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label style={{ width: "150px" }}>보고서 제작비</label>
                                                    <p
                                                        style={{
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {estimate.reportProductionCost?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}
                                            {estimate.demolitionCost !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label style={{ width: "150px" }}>철거비</label>
                                                    <p
                                                        style={{
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {estimate.demolitionCost?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}
                                            {estimate.disposalCost !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label style={{ width: "150px" }}>폐기물 처리비</label>
                                                    <p
                                                        style={{
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {estimate.disposalCost?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}
                                            {estimate.etcFee !== 0 && (
                                                <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                    <label style={{ width: "150px" }}>기타비용</label>
                                                    <p
                                                        style={{
                                                            fontWeight: "600",
                                                            textAlign: "right",
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {estimate.etcFee?.toLocaleString()} 원
                                                    </p>
                                                </div>
                                            )}
                                            <div className="labelInput-wrapper" style={{ padding: "16px 40px" }}>
                                                <label
                                                    style={{
                                                        width: "150px",
                                                        fontWeight: "600",
                                                        fontSize: "16px",
                                                    }}
                                                >
                                                    총 견적 금액
                                                </label>
                                                <p
                                                    style={{
                                                        fontWeight: "600",
                                                        textAlign: "right",
                                                        fontSize: "16px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {getTotalAmount(costList, estimate)?.toLocaleString()} 원
                                                </p>
                                            </div>
                                            {estimate.costDetail && <Input type="textarea" readOnly style={{ marginTop: "20px" }} value={estimate.costDetail} />}
                                        </div>
                                        <div style={{ width: "100%" }}>
                                            <h3 className="mypage-sectionTitle">작업 상세</h3>
                                            {estimate.diagnosisType && (
                                                <div className="labelInput-wrapper">
                                                    <label style={{ width: "150px" }}>사전 진단 필요 여부</label>
                                                    <p>{DIAGNOSIS_TYPE_MAPPING[estimate.diagnosisType]}</p>
                                                </div>
                                            )}
                                            {estimate.repairType && (
                                                <div className="labelInput-wrapper">
                                                    <label style={{ width: "150px" }}>수리 방식</label>
                                                    <p>{REPAIR_TYPE_MAPPING[estimate.repairType]}</p>
                                                </div>
                                            )}
                                            {estimate.demolitionType && (
                                                <div className="labelInput-wrapper">
                                                    <label style={{ width: "150px" }}>철거 방식</label>
                                                    <p>{DEMOLITION_TYPE_MAPPING[estimate.demolitionType]}</p>
                                                </div>
                                            )}
                                            {estimate.consultingType && (
                                                <div className="labelInput-wrapper">
                                                    <label style={{ width: "150px" }}>컨설팅 방식</label>
                                                    <p>{CONSULTING_TYPE_MAPPING[estimate.consultingType]}</p>
                                                </div>
                                            )}
                                            <div className="labelInput-wrapper">
                                                <label style={{ width: "150px" }}>작업 범위</label>
                                                <p>{estimate.workScope}</p>
                                            </div>
                                            <div className="labelInput-wrapper">
                                                <label style={{ width: "150px" }}>상세 설명</label>
                                                <p>{estimate.workDetail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 전문가 정보 */}
                                    <div>
                                        <h3 className="mypage-sectionTitle">전문가 정보</h3>
                                        <div
                                            style={{ cursor: "pointer", marginTop: "20px" }}
                                            onClick={() => {
                                                window.scrollTo(0, 0);
                                                navigate(`/zipddak/expertProfile/${expert.expertIdx}`);
                                            }}
                                            className="expert-div"
                                        >
                                            <div className="expert-img-div">
                                                <img className="expert-img" src={expert.profileImage ? `${baseUrl}/imageView?type=expert&filename=${expert.profileImage}` : "/default-profile.png"} />
                                                <div className="expert-name-div">
                                                    <span className="font-14 semibold">{expert.activityName}</span>
                                                    <span className="font-13">{expert.mainService}</span>
                                                </div>
                                            </div>

                                            {/* 별점 */}
                                            <div className="expert-star-div">
                                                <i className="bi bi-star-fill expert-star"></i>
                                                <span className="font-13 medium">{expert.avgScore}</span>
                                                <span className="font-12 expert-review-count">({expert.reviewCount})</span>
                                            </div>

                                            <div className="expert-info-div">
                                                <div className="expert-career-div">
                                                    <span className="font-13">
                                                        <i className="bi bi-geo-alt font-11"></i>
                                                        {expert.activityArea}
                                                    </span>
                                                </div>

                                                {/* 경력 + 고용 */}
                                                <div className="expert-career-div">
                                                    <span className="font-13">
                                                        <i className="bi bi-award font-11"></i>경력
                                                        {expert.careerCount < 12 ? "1년 미만" : `${Math.floor(expert.careerCount / 12)}년`}
                                                    </span>
                                                    <i className="bi bi-dot font-11"></i>
                                                    <span className="font-13">
                                                        <i className="bi bi-emoji-smile font-11"></i>고용
                                                        {expert.matchingCount}회
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="primary-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    chat(e);
                                                }}
                                                style={{
                                                    color: "#FF5833",
                                                    backgroundColor: "#fff",
                                                }}
                                            >
                                                채팅하기
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
