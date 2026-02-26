//css
import "../css/index.css";
import "../css/layout.css";
import "../css/frame.css";
import "../css/iconStyle.css";
import home from "../css/mainHome.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";

import { FormGroup, Input, Label } from "reactstrap";
import Tippy from "@tippyjs/react";

import StatCard from "../component/StatCard.jsx";
import StatCard2 from "../component/StatCard2.jsx";
import BarChart from "../component/BarChart.jsx";
import LineChart from "../component/LineChart.jsx";
import DonutChart from "../component/DonutChart.jsx";

export default function MainHome() {
    const pageTitle = usePageTitle("Home");

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className={[home.main, "main"].join(" ")}>
                <div className={home.main_column1}>
                    <StatCard />
                    <StatCard />
                    <StatCard />
                    <StatCard />
                </div>

                <div className={home.main_column2}>
                    <StatCard2 />
                </div>

                <div className={home.main_column3}>
                    <div className={home.more_stats}>
                        <span className="pointer"> 통계 더보기 →</span>
                    </div>
                    <div className={home.graph_body}>
                        <div className={home.cumulative_statistics}>
                            <div>
                                <p className={home.graph_title}>올해 카테고리별 누적 판매 통계</p>
                                <div className={home.graph_change}>
                                    <FormGroup check inline>
                                        <Label check style={{ display: "flex", alignItems: "flex-start" }}>
                                            <Input type="radio" name="radio2" />
                                            판매 수량
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check inline>
                                        <Label check style={{ display: "flex", alignItems: "flex-start" }}>
                                            <Input type="radio" name="radio2" />
                                            매출액
                                        </Label>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="graph">
                                <BarChart />
                                {/* <LineChart /> */}
                            </div>
                        </div>

                        <div className={home.etc_statistics}>
                            <p className={home.graph_title}>카테고리별 매출 비중</p>
                            <div className="graph">
                                <DonutChart />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
