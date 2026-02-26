import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAtom } from "jotai";
import { tokenAtom } from "../../atoms";
import { myAxios } from "../../config";
import { Input } from "reactstrap";

export function MyWorksDetail() {
    const { matchingIdx } = useParams();
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;

    const [estimate, setEstimate] = useState({});
    const [costList, setCostList] = useState([]);

    const [token, setToken] = useAtom(tokenAtom);

    const navigate = useNavigate();

    // 작업 상세 조회
    const getEstimates = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/matching/expertDetail?matchingIdx=${matchingIdx}`)
            .then((res) => {
                setEstimate(res.data.matchingDetail);
                setCostList(res.data.matchingCostList);
            })
            .catch((err) => {
                console.log(err);
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

    // 작업상태 매핑
    const WORK_STATUS_LABEL = {
        PAYMENT_COMPLETED: "결제 완료",
        IN_PROGRESS: "작업 중",
        COMPLETED: "작업 완료",
        CANCELLED: "취소",
    };

    // 종료일-시작일
    const getDiffDays = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
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
        getEstimates();
    }, []);

    if (!estimate) {
        return <div className="mypage-layout">로딩 중...</div>;
    }

    return (
        <div className="mypage-layout">
            <h1 className="mypage-title">{estimate.smallServiceName}</h1>

            <div>
                <h3 className="mypage-sectionTitle">기본 정보</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>작업 상태</label>
                    <span
                        style={{
                            width: "fit-content",
                            height: "20px",
                            display: "flex",
                            padding: "5px 10px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 88, 51, 0.50)",
                            background: "rgba(255, 88, 51, 0.05)",
                            color: "#FF5833",
                            fontSize: "12px",
                            fontWeight: "500",
                            marginLeft: "12px",
                        }}
                    >
                        {WORK_STATUS_LABEL[estimate.matchingStatus]}
                    </span>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>작업 카테고리</label>
                    <p>
                        {estimate.largeServiceName} &gt; {estimate.midServiceName} &gt; {estimate.smallServiceName}
                    </p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>계약일</label>
                    <p>{estimate.matchingAt}</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>작업 예정일</label>
                    <p>
                        {estimate.workStartDate} ~ {estimate.workEndDate} ({getDiffDays(estimate.workStartDate, estimate.workEndDate)}일)
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "30px",
                }}
            >
                <div style={{ flex: 1 }}>
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
                    {estimate.costDetail && <Input type="textarea" style={{ marginTop: "20px" }} value={estimate.costDetail} />}
                </div>
                <div style={{ flex: 2 }}>
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

            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "30px",
                }}
            >
                <div style={{ flex: 1 }}>
                    <h3 className="mypage-sectionTitle">고객 정보</h3>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>이름</label>
                        <p>{estimate.name}</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>휴대폰 번호</label>
                        <p>{estimate.phone}</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ minWidth: "150px" }}>주소</label>
                        <p>
                            {estimate.zonecode}
                            <br /> {estimate.addr1} {estimate.addr2}
                        </p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>결제 금액</label>
                        <p
                            style={{
                                color: "#FF5833",
                                fontWeight: "600",
                            }}
                        >
                            {Number(estimate.totalAmount).toLocaleString()}원
                        </p>
                    </div>
                </div>
                <div style={{ flex: 2 }}>
                    <h3 className="mypage-sectionTitle">요청 상세 </h3>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>예산</label>
                        <p>{estimate.budget?.toLocaleString()}원</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>희망 시공일</label>
                        <p>{estimate.preferredDate}</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>시공 장소</label>
                        <p>{estimate.location}</p>
                    </div>
                    {estimate.place && (
                        <div className="labelInput-wrapper">
                            <label style={{ width: "150px" }}>시공할 공간</label>
                            <p>{estimate.place}</p>
                        </div>
                    )}
                    {estimate.purpose && (
                        <div className="labelInput-wrapper">
                            <label style={{ width: "150px" }}>시공 목적</label>
                            <p>{estimate.purpose}</p>
                        </div>
                    )}
                    {estimate.constructionSize && (
                        <div className="labelInput-wrapper">
                            <label style={{ width: "150px" }}>시공 사이즈</label>
                            <p>{estimate.constructionSize}</p>
                        </div>
                    )}
                    {estimate.additionalRequest && (
                        <div className="labelInput-wrapper">
                            <label style={{ width: "150px" }}>추가 요청사항</label>
                            <p>{estimate.additionalRequest}</p>
                        </div>
                    )}
                    {estimate.image1Idx && (
                        <div
                            style={{
                                display: "flex",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {[estimate.image1Idx, estimate.image2Idx, estimate.image3Idx]
                                .filter((img) => img)
                                .map((img, idx) => (
                                    <img key={idx} src={`http://localhost:8080/imageView?type=expert&filename=${img}`} width="80px" height="80px" />
                                ))}
                        </div>
                    )}
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <button
                    className="secondary-button"
                    style={{
                        height: "40px",
                        width: "200px",
                        fontSize: "14px",
                    }}
                    onClick={() => {
                        navigate(`/expert/mypage/works?page=${page}`);
                    }}
                >
                    목록
                </button>
            </div>
        </div>
    );
}
