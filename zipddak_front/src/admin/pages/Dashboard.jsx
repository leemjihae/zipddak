import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../config";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";
import DougnutChart from "./DougnutChart";
import LineChart from "./LineChart";
import BarChart from "./BarChart";

/* ======================
   숫자 카운트업 함수
====================== */
function animateCountUp(target, setValue, duration = 800) {
    let start = 0;
    const startTime = performance.now();

    function animate(time) {
        const progress = Math.min((time - startTime) / duration, 1);
        const current = Math.round(progress * target);
        setValue(current);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

export default function Dashboard() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [commission, setCommission] = useState({});
    const [membership, setMembership] = useState({});
    const [userCount, setUserCount] = useState({});
    const [join, setJoin] = useState({});

    // 차트에 보여줄 데이터
    const [dougnut, setDougnut] = useState({});
    const [line, setLine] = useState([]);
    const [bar, setBar] = useState([]);

    // 애니메이션용 상태
    const [commissionAmount, setCommissionAmount] = useState(0);
    const [membershipAmount, setMembershipAmount] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const [activeUser, setActiveUser] = useState(0);
    const [joinCount, setJoinCount] = useState(0);

    useEffect(() => {
        if (!token) return;

        myAxios(token, setToken)
            .get(`${baseUrl}/admin/dashboard`)
            .then((res) => {
                console.log(res.data);

                setCommission(res.data.commissionMap);
                setMembership(res.data.membershipMap);
                setUserCount(res.data.userCount);

                setDougnut(res.data.dougnut);
                setLine(res.data.matchingFeeList);
                setBar(res.data.orderFeeList);

                // ⭐ 여기!!!
                const joinData = res.data.joinCount || // 기대
                    res.data.JoinCount || // 실제 (대문자)
                    res.data.join || { thisMonthCount: 0, prevMonthCount: 0 }; // 혹시 모를 경우

                setJoin({
                    thisMonthCount: Number(joinData.thisMonthCount ?? 0),
                    prevMonthCount: Number(joinData.prevMonthCount ?? 0),
                });
            });
    }, [token]);

    // 수수료 애니메이션
    useEffect(() => {
        if (commission.amount != null) {
            animateCountUp(commission.amount, setCommissionAmount, 700);
        }
    }, [commission.amount]);

    // 멤버십 애니메이션
    useEffect(() => {
        if (membership.amount != null) {
            animateCountUp(membership.amount, setMembershipAmount, 700);
        }
    }, [membership.amount]);

    // 회원 수 애니메이션
    useEffect(() => {
        if (userCount.totalUser != null) {
            animateCountUp(userCount.totalUser, setTotalUser, 900);
        }
        if (userCount.activeUser != null) {
            animateCountUp(userCount.activeUser, setActiveUser, 900);
        }
    }, [userCount]);

    // 신규 가입자 애니메이션
    useEffect(() => {
        if (join?.thisMonthCount != null) {
            animateCountUp(join?.thisMonthCount, setJoinCount, 900);
        }
    }, [join]);

    return (
        <div style={{ backgroundColor: "#F8FAFB", width: "100%", height: "911px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "25px", padding: "30px" }}>
                <div style={{ display: "flex", gap: "25px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                        {/* 수수료 */}
                        <div style={{ display: "flex", gap: "25px" }}>
                            <Card title="이번달 수수료 수익">
                                <span style={{ fontSize: "20px" }}>{commissionAmount.toLocaleString()}원</span>
                                <Rate rate={commission.rateChange} />
                            </Card>

                            {/* 멤버십 */}
                            <Card title="이번달 멤버십 수익">
                                <span style={{ fontSize: "20px" }}>{membershipAmount.toLocaleString()}원</span>
                                <Rate rate={membership.rateChange} />
                            </Card>
                        </div>

                        {/* 회원 */}
                        <div style={{ display: "flex", gap: "25px" }}>
                            <Card title="총 회원수">
                                <span style={{ fontSize: "20px" }}>{totalUser.toLocaleString()}명</span>
                                <span style={{ fontSize: "16px" }}>
                                    활성 사용자 - {activeUser.toLocaleString()}명 ({userCount.activeRate}%)
                                </span>
                            </Card>

                            {/* 신규 가입 */}
                            <Card title="이번달 신규 가입자">
                                <span style={{ fontSize: "20px" }}>{joinCount?.toLocaleString()}명</span>
                                <span style={{ fontSize: "16px" }}>저번달 - {join?.prevMonthCount?.toLocaleString()}명</span>
                            </Card>
                        </div>
                    </div>
                    <div style={{ backgroundColor: "white", width: "545px", height: "265px", borderRadius: "15px", padding: "15px" }}>
                        <span style={{ fontSize: "16px" }}>수익구조</span>
                        <DougnutChart dougnut={dougnut} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "25px" }}>
                    {" "}
                    <div style={{ backgroundColor: "white", width: "545px", height: "400px", borderRadius: "15px", padding: "15px" }}>
                        <span style={{ fontSize: "16px" }}>월별 매칭 수수료</span>
                        <LineChart line={line} />
                    </div>{" "}
                    <div style={{ backgroundColor: "white", width: "545px", height: "400px", borderRadius: "15px", padding: "15px" }}>
                        <span style={{ fontSize: "16px" }}>월별 상품 판매 수수료</span>
                        <BarChart bar={bar} />
                    </div>{" "}
                </div>
            </div>
        </div>
    );
}

/* ======================
   공통 컴포넌트
====================== */
function Card({ title, children }) {
    return (
        <div
            style={{
                backgroundColor: "white",
                width: "260px",
                height: "120px",
                borderRadius: "15px",
                padding: "15px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "10px",
            }}
        >
            <span style={{ fontSize: "16px" }}>{title}</span>
            {children}
        </div>
    );
}

function Rate({ rate }) {
    const value = Number(rate) || 0;
    return (
        <span style={{ fontSize: "16px" }}>
            전월대비{" "}
            <span style={{ color: value > 0 ? "#146F00" : "#FF0000" }}>
                {value > 0 ? "+" : ""}
                {value}%
            </span>
        </span>
    );
}
