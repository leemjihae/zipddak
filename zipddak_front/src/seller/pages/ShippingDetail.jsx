//css
import table from "../css/table.module.css";
import detail from "../css/detail.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";

import { FormGroup, Input, Label } from "reactstrap";
import Tippy from "@tippyjs/react";
import { useState, useEffect, useRef } from "react";

export default function OrderList() {
    const pageTitle = usePageTitle("주문관리 > 배송 내역 상세조회");

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i class="bi bi-newspaper"></i>
                        <span>배송 내역 상세조회</span>
                    </div>

                    <div className="bodyFrame">
                        <div className={detail.base_info}>
                            {/* 주문 정보 */}
                            <div className="position-relative mb-4">
                                <div className={detail.info_cell}>
                                    <div className={detail.info_cell}>
                                        <span className="input_title">주문 번호 </span>
                                        <Input readOnly />
                                    </div>
                                    <button type="button" className="sub-button " style={{ padding: "6px 8px", marginLeft: "8px" }}>
                                        주문 상세보기 <i className="bi bi-arrow-right-short"></i>
                                    </button>
                                </div>
                            </div>

                            {/* 배송지 정보 */}
                            <div className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    배송지 정보
                                </Label>
                                <div className={detail.detailFrame}>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">수령인 </span>
                                            <Input className="" readOnly />
                                        </div>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">연락처 </span>
                                            <Input className="" readOnly />
                                        </div>
                                    </div>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_line}>
                                            <span className="sub_title">배송지 </span>
                                            <div style={{ width: "100%" }}>
                                                <div className="addr_column mb-2">
                                                    <Input className="" style={{ width: "30%" }} placeholder="우편번호" readOnly />
                                                    <Input style={{ width: "70%" }} placeholder="도로명주소" readOnly />
                                                </div>
                                                <div className="addr_column">
                                                    <Input type="text" placeholder="상세주소" readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_line}>
                                            <span className="sub_title">배송 메모</span>
                                            <Input readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={detail.pd_list_table}>
                            <Label for="examplePassword" className="input_title">
                                배송 상품 리스트
                            </Label>
                            <div className={detail.product_list}>
                                <div className={table.tableBody}>
                                    <table className={table.detail_table}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }}>#</th>
                                                <th style={{ width: "5%" }}>Img</th>
                                                <th style={{ width: "15%" }}>상품명</th>
                                                <th style={{ width: "20%" }}>옵션</th>
                                                <th style={{ width: "5%" }}>수량</th>
                                                <th style={{ width: "10%" }}>금액</th>
                                                <th style={{ width: "10%" }}>주문상태</th>
                                                <th style={{ width: "10%" }}>배송비</th>
                                                <th style={{ width: "10%" }}>운송장번호</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>10</td>
                                                <td style={{ padding: "0" }}>
                                                    <img src="/no_img.svg" style={{ width: "60px" }} />
                                                </td>
                                                <td className={table.title_cell}>시트지[예림 인테리어 필름] 우드HW 시트지[예림 인테리어 필름] 우드HW</td>
                                                <td>색상 : 브라운</td>
                                                <td>1</td>
                                                <td>12,300</td>
                                                <td>[상품준비중]</td>
                                                <td className={table.ship_charge_cell} rowSpan={2}>
                                                    <span>3,000원</span>
                                                    <br />
                                                    <span style={{ fontSize: "10px" }}>15만원 이상 무료</span>
                                                </td>
                                                <td>-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
