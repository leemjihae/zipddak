//css
import table from "../css/table.module.css";
import sales from "../css/salesStatistics.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";
//component
import ModalSettleCalc from "../component/ModalSettleCalc";
// library
import { FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import Tippy from "@tippyjs/react";
import { useState, useEffect, useRef } from "react";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { myAxios } from "../../config.jsx";

export default function SalesStatistics() {
    const pageTitle = usePageTitle("정산관리 > 매출 통계 조회");

    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [cardData, setCardData] = useState(null);
    const [selectedSalesPeriod, setSelectedSalesPeriod] = useState("day");
    const [isSettleCalcModalOpen, setIsSettleCalcModalOpen] = useState(false); //모의계산기 모달 상태

    //초기화면 카드 로딩
    useEffect(() => {
        const params = new URLSearchParams();
        params.append("sellerId", user.username);
        const salesInfoUrl = `/seller/sales/mySalesCard?${params.toString()}`;

        user.username &&
            myAxios(token, setToken)
                .get(salesInfoUrl)
                .then((res) => {
                    console.log(res.data);
                    setCardData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
    }, [user]);

    //(테이블 헤더) 셀러가 갖고있는 상품의 카테고리만 출력
    const [categories, setCategories] = useState([]);
    const [rows, setRows] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const setDateByPeriod = (period) => {
        const today = new Date();

        if (period === "day") {
            const d = today.toISOString().slice(0, 10);
            setStartDate(d);
            setEndDate(d);
        }

        if (period === "month") {
            const y = today.getFullYear();
            const m = today.getMonth(); // 0-based

            const first = new Date(y, m, 1).toISOString().slice(0, 10);
            const last = new Date(y, m + 1, 0).toISOString().slice(0, 10);

            setStartDate(first);
            setEndDate(last);
        }

        if (period === "year") {
            const y = today.getFullYear();
            setStartDate(`${y}-01-01`);
            setEndDate(`${y}-12-31`);
        }
    };
    useEffect(() => {
        setDateByPeriod(selectedSalesPeriod);
    }, [selectedSalesPeriod]);

    //초기화면 테이블 로딩
    useEffect(() => {
        if (!startDate || !endDate) return;

        myAxios(token, setToken)
            .get("/sales/mySalesTable", {
                params: {
                    period: selectedSalesPeriod.toUpperCase(),
                    startDate,
                    endDate,
                    sellerId: user.username,
                },
            })
            .then((res) => {
                console.log(res.data);
                console.log("sales table response:", res.data);
                console.log("categories:", res.data.categories);

                setCategories(res.data.categories);
                setRows(res.data.rows);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [selectedSalesPeriod, startDate, endDate]);

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i className="bi bi-graph-up-arrow"></i>
                        <span>매출 통계</span>
                    </div>

                    <div className="bodyFrame">
                        <div className="btn_part">
                            <button
                                type="button"
                                className="sub-button "
                                onClick={() => {
                                    setIsSettleCalcModalOpen(true);
                                }}
                            >
                                <i className="bi bi-coin"></i> 정산금액 모의계산
                            </button>
                        </div>

                        <div className={sales.body_column}>
                            <div className={sales.salesCard}>
                                <div className="cardImage">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <div className="cardBody">
                                    {cardData && (
                                        <div className={sales.cardAmount}>
                                            {cardData.todaySalesAmount} <span>원</span>
                                        </div>
                                    )}
                                    <div className={sales.cardTitle}>당일 매출액</div>
                                </div>
                            </div>
                            <div className={sales.salesCard}>
                                <div className="cardImage">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <div className="cardBody">
                                    {cardData && (
                                        <div className={sales.cardAmount}>
                                            {cardData.todayExpectedSettleAmount} <span>원</span>
                                        </div>
                                    )}
                                    <div className={sales.cardTitle}>당일 예상 정산금액</div>
                                </div>
                            </div>
                            <div className={sales.salesCard}>
                                <div className="cardImage">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <div className="cardBody">
                                    {cardData && (
                                        <div className={sales.cardAmount}>
                                            {cardData.todayAverageOrderAmount} <span>원</span>
                                        </div>
                                    )}
                                    <div className={sales.cardTitle}>당일 평균주문금액(객단가)</div>
                                </div>
                            </div>
                            <div className={sales.salesCard}>
                                <div className="cardImage">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <div className="cardBody">
                                    {cardData && (
                                        <div className={sales.cardAmount}>
                                            {cardData.revenueChangeRate.toFixed(1)} <span>%</span>
                                        </div>
                                    )}
                                    <div className={sales.cardTitle}>전일 대비 매출 증감률</div>
                                </div>
                            </div>
                        </div>

                        <div className={sales.body_column}>
                            <div className={sales.change_period}>
                                <div className={sales.periodCriteria}>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input
                                                type="radio"
                                                name="salesPeriod"
                                                value="day"
                                                checked={selectedSalesPeriod === "day"}
                                                onChange={() => {
                                                    setSelectedSalesPeriod("day");
                                                }}
                                            />
                                            일자별
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input
                                                type="radio"
                                                name="salesPeriod"
                                                value="month"
                                                checked={selectedSalesPeriod === "month"}
                                                onChange={() => {
                                                    setSelectedSalesPeriod("month");
                                                }}
                                            />
                                            월간별
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Label check>
                                            <Input
                                                type="radio"
                                                name="salesPeriod"
                                                value="year"
                                                checked={selectedSalesPeriod === "year"}
                                                onChange={() => {
                                                    setSelectedSalesPeriod("year");
                                                }}
                                            />
                                            년도별
                                        </Label>
                                    </FormGroup>
                                </div>
                                <div className="tableBody">
                                    <table className={table.salesTable}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "10%" }}>날짜</th>
                                                {/* DB에서 받아온 카테고리만 렌더링 */}
                                                {categories.map((c) => (
                                                    <th style={{ width: "auto" }} key={c.categoryIdx}>
                                                        {c.name}
                                                    </th>
                                                ))}
                                                <th style={{ width: "10%" }}>합계</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row) => (
                                                <tr key={row.period}>
                                                    <td style={{ fontWeight: 600 }}>{row.period}</td>

                                                    {categories.map((c) => (
                                                        <td key={c.categoryIdx}>{(row.categorySales[c.categoryIdx] ?? 0).toLocaleString()}</td>
                                                    ))}

                                                    <td style={{ fontWeight: 600 }}>{row.total.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="pagination"></div>
                            </div>
                        </div>

                        <ModalSettleCalc settleCalcModalOpen={isSettleCalcModalOpen} setSettleCalcModalOpen={setIsSettleCalcModalOpen} sellerId={user.username} />
                    </div>
                </div>
            </main>
        </>
    );
}
