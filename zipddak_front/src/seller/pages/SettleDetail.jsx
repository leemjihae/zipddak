//css
import table from "../css/table.module.css";
import detail from "../css/detail.module.css";
import acco from "../css/accordion.module.css";
import settle from "../css/settle.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";

import { FormGroup, Input, Label } from "reactstrap";
import Tippy from "@tippyjs/react";

import { useState, useEffect, useRef } from "react";

export default function SettleDetail() {
    const pageTitle = usePageTitle("정산관리 > 정산 내역 상세보기");

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i class="bi bi-newspaper"></i>
                        <span>정산 내역 상세보기</span>
                    </div>

                    <div className="bodyFrame">
                        <div className="descript">
                            <span style={{ fontSize: "12px", color: "#6d758f" }} className="pointer">
                                ※ 수수료 계산 기준
                            </span>
                        </div>
                        <div className={settle.settle_detailFrame}>
                            <div className="content_column">
                                <Input bsSize="lg" className={settle.settle_detail_title} placeholder="2025년 10월" />
                                <div className={table.tableBody}>
                                    <table className={table.detail_info_table}>
                                        <tbody>
                                            <tr>
                                                <th style={{}}>정산기간</th>
                                                <td colSpan={3}>2025-11-07</td>
                                            </tr>
                                            <tr>
                                                <th style={{}}>당월 누적 주문 건수</th>
                                                <td>2025-11-07</td>
                                                <th style={{}}>당월 총 매출 </th>
                                                <td>2025-11-07</td>
                                            </tr>
                                            <tr>
                                                <th style={{}}>고객부담 배송비</th>
                                                <td>2025-11-07</td>
                                                <th style={{}}>당월 순수 매출액</th>
                                                <td>2025-11-07</td>
                                            </tr>
                                            <tr>
                                                <th style={{}}>플랫폼 수수료</th>
                                                <td>2025-11-07</td>
                                                <th style={{}}>최종 정산금액</th>
                                                <td>2025-11-07</td>
                                            </tr>
                                            <tr>
                                                <th style={{}}>입금 계좌 정보</th>
                                                <td>2025-11-07</td>
                                                <th style={{}}>주문일자</th>
                                                <td>2025-11-07</td>
                                            </tr>
                                            <tr>
                                                <th style={{}}>정산 일자</th>
                                                <td>2025-11-07</td>
                                                <th style={{}}>입금 일자</th>
                                                <td>2025-11-07</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 관리자 코멘트 */}
                            <div className="content_column">
                                <Input bsSize="lg" className={settle.settle_detail_title} placeholder="관리자 코멘트" />
                                <Input type="textarea" />
                            </div>

                            {/* 매출 내역 한번에 보기 */}
                            <div className="content_column">
                                <Input bsSize="lg" className={settle.settle_detail_title} placeholder="2025년 10월 매출 내역 한번에 보기" />
                                <div className={["position-relative", acco.accordion_container].join(" ")}>
                                    <div className={acco.accordionToggleBox}>
                                        <div className={acco.accordion_header}>
                                            <p className="input_title">
                                                <span>날짜별 매출 상세 </span>
                                            </p>
                                            <span className="accordion_toggle_icon">
                                                <i class="bi bi-chevron-down pointer"></i>
                                            </span>
                                        </div>

                                        <div className={acco.accordion_body}>
                                            <div className={detail.product_list}>
                                                <div className={table.tableBody}>
                                                    <table className={table.settle_table}>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "10%" }}>날짜</th>
                                                                <th style={{ width: "auto" }}>카테고리1</th>
                                                                <th style={{ width: "auto" }}>카테고리2</th>
                                                                <th style={{ width: "auto" }}>카테고리3</th>
                                                                <th style={{ width: "auto" }}>카테고리4</th>
                                                                <th style={{ width: "auto" }}>카테고리5</th>
                                                                <th style={{ width: "auto" }}>카테고리6</th>
                                                                <th style={{ width: "auto" }}>카테고리7</th>
                                                                <th style={{ width: "auto" }}>카테고리8</th>
                                                                <th style={{ width: "auto" }}>카테고리9</th>
                                                                <th style={{ width: "auto" }}>카테고리10</th>
                                                                <th style={{ width: "auto" }}>카테고리11</th>
                                                                <th style={{ width: "10%" }}>합계</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className={table.date_cell}>2025-11-30</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>1,234,000</td>
                                                                <td>122,340,000</td>
                                                            </tr>
                                                        </tbody>
                                                        <tfoot>
                                                            <td>합계</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>122,340,000</td>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={acco.accordionToggleBox}>
                                        <div className={acco.accordion_header}>
                                            <p className="input_title">
                                                <span>주문건별 매출 상세</span>
                                            </p>
                                            <span className="accordion_toggle_icon">
                                                <i class="bi bi-chevron-down pointer"></i>
                                            </span>
                                        </div>

                                        <div className={acco.accordion_body}>
                                            <div className={detail.product_list}>
                                                <div className={table.tableBody}>
                                                    <table className={table.settle_table}>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "15%" }}>주문번호</th>
                                                                <th style={{ width: "auto" }}>최종 결제 금액</th>
                                                                <th style={{ width: "auto" }}>고객부담 배송비</th>
                                                                <th style={{ width: "auto" }}>순 매출액</th>
                                                                <th style={{ width: "auto" }}>수수료</th>
                                                                <th style={{ width: "auto" }}>최종 정산액</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>20251120-123456</td>
                                                                <td>1,234,000</td>
                                                                <td>7,000</td>
                                                                <td>50,000</td>
                                                                <td>3,500</td>
                                                                <td>46,500</td>
                                                            </tr>
                                                            <tr>
                                                                <td>20251120-123454</td>
                                                                <td>1,234,000</td>
                                                                <td>7,000</td>
                                                                <td>50,000</td>
                                                                <td>3,500</td>
                                                                <td>46,500</td>
                                                            </tr>
                                                        </tbody>
                                                        <tfoot>
                                                            <td>합계</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>1,234,000</td>
                                                            <td>122,340,000</td>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
