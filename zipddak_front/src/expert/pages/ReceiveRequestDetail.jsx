import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { myAxios } from "../../config";
import { Input, Modal, ModalBody, ModalHeader } from "reactstrap";

export default function ReceiveRequestDetail() {
    const { requestIdx } = useParams();
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;

    const [request, setRequest] = useState({});

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

    const navigate = useNavigate();

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 요청서 상세 조회
    const getRequest = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/receive/requestDetail?requestIdx=${requestIdx}`)
            .then((res) => {
                setRequest(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 견적서 보내기
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
            requestIdx: requestIdx,
            largeServiceIdx: request.largeServiceIdx,
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
            .post("http://localhost:8080/estimate/write", payload)
            .then((res) => {
                if (res.data) {
                    setIsSend(true);
                    setIsModalOpen(true);

                    setTimeout(() => {
                        navigate("/expert/mypage/receive/requests?page=1");
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

    useEffect(() => {
        getRequest();
    }, []);

    return (
        <div className="mypage-layout">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "16px",
                }}
            >
                <h1 className="mypage-title">{request.categoryName}</h1>
                <p>
                    요청일 <span>{request.createdAt}</span>
                </p>
            </div>

            <div>
                <h3 className="mypage-sectionTitle">요청자 정보</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "220px" }}>이름</label>
                    <p>{request.name}</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "220px" }}>휴대폰 번호</label>
                    <p>{request.phone}</p>
                </div>
            </div>

            <div>
                <h3 className="mypage-sectionTitle">요청 상세</h3>
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
                            시공할 부분을 모두 선택해주세요.
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
                            어떤 서비스를 원하시나요?
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

                {request.imageUrls && (
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "10px",
                        }}
                    >
                        {request.imageUrls.map((img, idx) => (
                            <img key={idx} src={`http://localhost:8080/imageView?type=expert&filename=${img}`} width="80px" height="80px" />
                        ))}
                    </div>
                )}
            </div>
            <div>
                <h3 className="mypage-sectionTitle" style={{ borderBottom: "none" }}>
                    추가 요청사항
                </h3>
                <Input type="textarea" value={request.additionalRequest} />
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
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
                        navigate(`/expert/mypage/receive/requests?page=${page}`);
                    }}
                >
                    목록
                </button>
                <button
                    className="primary-button"
                    style={{
                        height: "40px",
                        width: "200px",
                        fontSize: "14px",
                    }}
                    onClick={() => {
                        setIsModalOpen(true);
                    }}
                >
                    견적 작성
                </button>
            </div>

            {request.largeServiceIdx === 23 && (
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "553px" }}>
                    <ModalHeader toggle={() => setIsModalOpen(false)}>견적서 작성</ModalHeader>
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
                                        견적 보내기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            )}

            {request.largeServiceIdx === 44 && (
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "553px" }}>
                    <ModalHeader toggle={() => setIsModalOpen(false)}>견적서 작성</ModalHeader>
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
                                        견적 보내기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            )}

            {request.largeServiceIdx === 74 && (
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "553px" }}>
                    <ModalHeader toggle={() => setIsModalOpen(false)}>견적서 작성</ModalHeader>
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
                                        견적 보내기
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
