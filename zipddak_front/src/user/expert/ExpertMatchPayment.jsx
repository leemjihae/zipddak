import "../css/ExpertOrder.css";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../config";
import { loadTossPayments } from "@tosspayments/payment-sdk";

export default function ExpertMatchPayment() {
    const { estimateIdx } = useParams();
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [requestDto, setRequestDto] = useState({});
    const [expertDto, setExpertDto] = useState({});
    const [costDto, setCostDto] = useState({});

    const [checks, setChecks] = useState([false, false, false, false, false]);
    const [allChecked, setAllChecked] = useState(false);

    const handleCheck = (index) => {
        const newChecks = [...checks];
        newChecks[index] = !newChecks[index];
        setChecks(newChecks);

        // 모두 체크되면 전체 체크박스도 체크
        setAllChecked(newChecks.every((c) => c));
    };

    const handleAllCheck = () => {
        const newValue = !allChecked;
        setAllChecked(newValue);
        setChecks(checks.map(() => newValue));
    };

    const handlePayment = () => {
        if (checks.every((c) => c)) {
            // 결제 진행
            requestTossPaymentApi();
        } else {
            alert("모든 확인 항목을 체크해주세요.");
        }
    };

    useEffect(() => {
        if (user === null || user.username === "") return;

        myAxios(token, setToken)
            .get(`${baseUrl}/user/estimate?estimateIdx=${estimateIdx}&username=${user.username}`)
            .then((res) => {
                if (res.data === null) {
                    navigate("/zipddak/experts");
                    return;
                }
                console.log(res.data);
                setRequestDto(res.data.requestDto);
                setExpertDto(res.data.expertDto);
                setCostDto(res.data.costDto);
            });
    }, [user]);

    // 토스 페이먼츠 결제 요청 시작
    const requestTossPaymentApi = async () => {
        const res = await myAxios(token, setToken).post(`${baseUrl}/user/payment/estimate`, {
            username: user.username,
            expertIdx: expertDto.expertIdx,
            estimateIdx: estimateIdx,
            workDurationType: costDto.workDurationType,
            workDurationValue: costDto.workDurationValue,
            requestIdx: requestDto.requestIdx,
        });

        const { orderId, orderName, amount } = res.data;

        const encodedOrderName = encodeURIComponent(orderName);

        // 테스트 경우 클라이언트 키가 노출되어도 상관 없음
        // 실제 운영하는 환경에서는 서버에서 clientKey를 내려주고 클라이언트 요청시 가져와서 사용
        const tossPayments = await loadTossPayments("test_ck_Ba5PzR0ArnGLGeODLa1B8vmYnNeD");

        await tossPayments.requestPayment({
            method: "CARD",
            amount: amount,
            orderId: orderId,
            orderName: orderName,
            successUrl: `http://localhost:8080/user/payment/estimate/complete?expertIdx=${expertDto.expertIdx}`, // 성공시 서버쪽으로 보냄
            failUrl: "http://localhost:5173/zipddak/experts",
        });
    };

    return (
        <div className="body-div">
            <div className="expertOrder-main-div">
                <span style={{ fontSize: "22px", fontWeight: "600" }} className="font-22 semibold">
                    결제화면
                </span>

                <div className="expertOrder-table-div">
                    {/* 내 요청내용 div */}
                    <div>
                        <span style={{ fontSize: "18px", fontWeight: "600" }} className="font-18 semibold">
                            내 요청 내용
                        </span>
                        <table className="margin-top-20 expertOrder-table">
                            <tbody>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">작업 유형</span>
                                    </td>
                                    {/* 작업 유형 */}
                                    <td>
                                        <span className="font-14">
                                            {requestDto.cateName1}
                                            {requestDto.cateName2 ? ` - ${requestDto.cateName2}` : ""}
                                            {requestDto.cateName3 ? ` - ${requestDto.cateName3}` : ""}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">희망 일정</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{requestDto.preferredDate}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">예산</span>
                                    </td>
                                    {/* 예산 */}
                                    <td>
                                        <span className="font-14">{requestDto.budget?.toLocaleString()}</span>
                                        <span className="font-14"> 원</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">시공 장소</span>
                                    </td>
                                    {/* 시공 장소 */}
                                    <td>
                                        <span className="font-14">{requestDto.location}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">추가 요청사항</span>
                                    </td>
                                    {/* 추가 요청사항 */}
                                    <td>
                                        <span className="font-14">{requestDto.additionalRequest ? requestDto.additionalRequest : "-"}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 전문가 정보 div */}
                    <div>
                        <span style={{ fontSize: "18px", fontWeight: "600" }} className="font-18 semibold">
                            전문가 정보
                        </span>
                        <table className="margin-top-20 expertOrder-table">
                            <tbody>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">프로필 이미지</span>
                                    </td>
                                    {/* 작업 유형 */}
                                    <td>
                                        <img
                                            className="expertProfileImg-img"
                                            src={expertDto.imgName ? `http://localhost:8080/imageView?type=expert&filename=${expertDto.imgName}` : "/default-profile.png"}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">활동명</span>
                                    </td>
                                    {/* 활동명 */}
                                    <td>
                                        <span className="font-14">{expertDto.activityName}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">전문</span>
                                    </td>
                                    {/* 전문 */}
                                    <td>
                                        {/* 전문 카테고리 */}
                                        <div className="font-12 medium expertOrder-badge">
                                            <span>{expertDto.cateName}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">평점</span>
                                    </td>
                                    {/* 평점 */}
                                    <td>
                                        <span className="font-14">{expertDto.score}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">연락가능시간</span>
                                    </td>
                                    {/* 연락가능시간 */}
                                    <td>
                                        <span>
                                            {expertDto.contactStartTime?.substring(0, 5)} ~ {expertDto.contactEndTime?.substring(0, 5)}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 견적 금액 상세 div */}
                    <div>
                        <span style={{ fontSize: "18px", fontWeight: "600" }} className="font-18 semibold">
                            견적 금액 상세
                        </span>
                        <table className="margin-top-20 expertOrder-table">
                            <tbody>
                                {/* 배열로 받아와서 반복 */}
                                {costDto.largeServiceIdx === 74 ? (
                                    <>
                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span className="font-14">컨설팅 인건비</span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span className="font-14 semibold">{costDto.consultingLaborCost?.toLocaleString()}</span>
                                                    <span className="font-14 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span className="font-14">스타일링 / 디자인 작업비</span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span className="font-14 semibold">{costDto.stylingDesignCost?.toLocaleString()}</span>
                                                    <span className="font-14 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span className="font-14">3D 이미지 제작비</span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span className="font-14 semibold">{costDto.threeDImageCost?.toLocaleString()}</span>
                                                    <span className="font-14 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span className="font-14">보고서 제작비</span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span className="font-14 semibold">{costDto.reportProductionCost?.toLocaleString()}</span>
                                                    <span className="font-14 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span className="font-14">기타비용</span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span className="font-14 semibold">{costDto.etcFee?.toLocaleString()}</span>
                                                    <span className="font-14 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span style={{ fontSize: "16px", fontWeight: "500" }} className="font-16 semibold">
                                                    총 견적 금액
                                                </span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span style={{ color: "#ff5833", fontSize: "18px", fontWeight: "600" }} className="font-16 semibold">
                                                        {costDto.consCostSum?.toLocaleString()}
                                                    </span>
                                                    <span className="font-16 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <>
                                        {costDto.buildCostList?.map((cost) => {
                                            return (
                                                <tr key={cost.label}>
                                                    <td className="expertOrder-trtd">
                                                        <span className="font-14">{cost.label}</span>
                                                    </td>
                                                    <td>
                                                        <div className="expertOrder-price-div">
                                                            <span className="font-14">{cost.amount?.toLocaleString()}</span>
                                                            <span className="font-14"> 원</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                        <tr>
                                            <td style={{ borderBottom: "2px solid black" }} className="expertOrder-trtd">
                                                <span style={{ fontSize: "16px", fontWeight: "500" }} className="font-16 semibold">
                                                    시공비 합계
                                                </span>
                                            </td>
                                            <td style={{ borderBottom: "2px solid black" }}>
                                                <div className="expertOrder-price-div">
                                                    <span style={{ fontSize: "16px", fontWeight: "500" }} className="font-16 semibold">
                                                        {costDto.buildCostSum?.toLocaleString()}
                                                    </span>
                                                    <span className="font-16 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>
                                        {costDto.materialCostList?.map((cost) => {
                                            return (
                                                <tr key={cost.label}>
                                                    <td className="expertOrder-trtd">
                                                        <span className="font-14">{cost.label}</span>
                                                    </td>
                                                    <td>
                                                        <div className="expertOrder-price-div">
                                                            <span className="font-14 ">{cost.amount?.toLocaleString()}</span>
                                                            <span className="font-14 "> 원</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <td style={{ borderBottom: "2px solid black" }} className="expertOrder-trtd">
                                                <span style={{ fontSize: "16px", fontWeight: "500" }} className="font-16 semibold">
                                                    자재비 합계
                                                </span>
                                            </td>
                                            <td style={{ borderBottom: "2px solid black" }}>
                                                <div className="expertOrder-price-div">
                                                    <span style={{ fontSize: "16px", fontWeight: "500" }} className="font-16 semibold">
                                                        {costDto.materialCostSum?.toLocaleString()}
                                                    </span>
                                                    <span className="font-16 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span className="font-16 semibold">폐기물 처리비</span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span className="font-16 semibold">{costDto.disposalCost?.toLocaleString()}</span>
                                                    <span className="font-16 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span className="font-16 semibold">철거비</span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span className="font-16 semibold">{costDto.demolitionCost?.toLocaleString()}</span>
                                                    <span className="font-16 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="expertOrder-trtd">
                                                <span className="font-16 semibold">기타 비용</span>
                                            </td>
                                            <td>
                                                <div className="expertOrder-price-div">
                                                    <span className="font-16 semibold">{costDto.etcFee?.toLocaleString()}</span>
                                                    <span className="font-16 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ borderTop: "2px solid black" }} className="expertOrder-trtd">
                                                <span style={{ fontSize: "16px", fontWeight: "500" }} className="font-16 semibold">
                                                    총 결제 금액
                                                </span>
                                            </td>
                                            <td style={{ borderTop: "2px solid black" }}>
                                                <div className="expertOrder-price-div" style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ color: "#ff5833", fontSize: "18px", fontWeight: "600" }} className="font-16 semibold">
                                                        {(costDto.buildCostSum + costDto.materialCostSum + costDto.disposalCost + costDto.demolitionCost + costDto.etcFee)?.toLocaleString()}
                                                    </span>
                                                    <span className="font-16 semibold"> 원</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                        <div className="expertOrder-more-request-div font-14">{costDto.costDetail}</div>
                    </div>

                    {/* 확인 항목 div */}
                    <div>
                        <span style={{ fontSize: "18px", fontWeight: "600" }} className="font-18 semibold">
                            확인 항목
                        </span>
                        <div className="expertOrder-checkList-div">
                            {[
                                "견적 내용(서비스 항목, 작업 범위, 기간 등)을 정확히 확인했습니다.",
                                "결제 금액에 플랫폼 수수료 및 부가세가 포함되어 있음을 확인했습니다.",
                                "결제 후에는 전문가 배정 및 일정 조율이 진행되며, 단순 변심으로 인한 취소는 어려울 수 있음을 확인했습니다.",
                                "서비스 이용약관 및 개인정보 처리방침을 모두 확인했습니다.",
                                "결제 전 제공받은 견적서의 세부 항목(자재, 인건비, 수수료 등)을 모두 확인했습니다.",
                            ].map((text, i) => (
                                <div key={i} className="expertOrder-checkList">
                                    <input type="checkbox" className="expertOrder-checkbox" checked={checks[i]} onChange={() => handleCheck(i)} />
                                    <span className="font-14 expertOrder-span">{text}</span>
                                </div>
                            ))}

                            <div className="expertOrder-checkList expertOrder-checkList-all">
                                <input type="checkbox" className="expertOrder-checkbox" checked={allChecked} onChange={handleAllCheck} />
                                <span className="font-14 expertOrder-span semibold">모두 확인했습니다.</span>
                            </div>
                        </div>
                    </div>
                    {/* 결제 버튼 div */}
                    <div className="expertOrder-complate-div">
                        <button className="expertOrder-complate-button font-14 semibold" onClick={handlePayment}>
                            계약 확정 및 결제하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
