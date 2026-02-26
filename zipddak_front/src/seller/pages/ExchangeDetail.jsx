// css
import table from "../css/table.module.css";
import detail from "../css/detail.module.css";
import acco from "../css/accordion.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";

import { FormGroup, Input, Label } from "reactstrap";
import Tippy from "@tippyjs/react";

import { useState, useEffect, useRef } from "react";

export default function OrderList() {
    const pageTitle = usePageTitle("주문관리 > 교환 내역 상세조회");

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i class="bi bi-newspaper"></i>
                        <span>교환 내역 상세조회</span>
                    </div>

                    <div className="bodyFrame">
                        {/* 주문 정보 */}
                        <div className="position-relative">
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

                        {/* 클레임상세 */}
                        <div className={detail.processFlow}>
                            <div className="position-relative mt-4">
                                <Label className="input_title">클레임 상세</Label>

                                {/* <AccordionBox /> */}
                                <div className={acco.accordionFrame}>
                                    <div className={acco.acco_header}>
                                        <p>
                                            요청 일자 : <span>2025-11-10 12:25:30</span>{" "}
                                        </p>
                                    </div>

                                    <div className={acco.claim_detail_body}>
                                        <div className={detail.pd_list_table}>
                                            <Label className="sub_title">교환 요청 상품</Label>
                                            <div className={detail.product_list}>
                                                <div className={[table.tableBody, table.table_border].join(" ")}>
                                                    <table className={table.claim_table}>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "5%" }}>
                                                                    <Input type="checkbox" />
                                                                </th>
                                                                <th style={{ width: "5%" }}>#</th>
                                                                <th style={{ width: "5%" }}>Img</th>
                                                                <th style={{ width: "20%" }}>상품명</th>
                                                                <th style={{ width: "15%" }}>옵션</th>
                                                                <th style={{ width: "15%" }}>교환 옵션</th>
                                                                <th style={{ width: "10%" }}>수량</th>
                                                                <th style={{ width: "10%" }}>금액</th>
                                                                <th style={{ width: "5%" }}>처리</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <Input type="checkbox" />
                                                                </td>
                                                                <td>10</td>
                                                                <td style={{ padding: "0" }}>
                                                                    <img src="/no_img.svg" style={{ width: "40px" }} />
                                                                </td>
                                                                <td className={table.title_cell}>시트지[예림 인테리어 필름] 우드HW 시트지[예림 인테리어 필름] 우드HW</td>
                                                                <td>색상 : 브라운</td>
                                                                <td>색상 : 레드</td>
                                                                <td>1 / 1</td>
                                                                <td>12,300</td>
                                                                <td>
                                                                    <i class="bi bi-three-dots-vertical pointer"></i>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={detail.info_list_section}>
                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">요청사항</Label>
                                                    <Input className="" style={{ width: "50%" }} placeholder="" readOnly />
                                                </div>
                                            </div>
                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">첨부파일</Label>
                                                    <div className={detail.imgParts} style={{ width: "100%" }}>
                                                        <img src="/no_img.svg" style={{ width: "40px" }} />
                                                        <img src="/no_img.svg" style={{ width: "40px" }} />
                                                        <img src="/no_img.svg" style={{ width: "40px" }} />
                                                        <img src="/no_img.svg" style={{ width: "40px" }} />
                                                        <img src="/no_img.svg" style={{ width: "40px" }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">수거 주소지 </Label>
                                                    <div style={{ width: "50%" }}>
                                                        <div className="addr_column mb-2">
                                                            <Input className="" style={{ width: "30%" }} placeholder="우편번호" readOnly />
                                                            <Input style={{ width: "70%" }} placeholder="도로명주소" readOnly />
                                                        </div>
                                                        <div className="addr_column ">
                                                            <Input type="text" placeholder="상세주소" readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">고객명</Label>
                                                    <Input className="" style={{ width: "50%" }} placeholder="" readOnly />
                                                </div>
                                            </div>

                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">교환품 배송지 </Label>
                                                    <div style={{ width: "50%" }}>
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
                                                    <Label className="sub_title">수령자명</Label>
                                                    <Input className="" style={{ width: "50%" }} placeholder="" readOnly />
                                                </div>
                                            </div>

                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">교환 사유 </Label>
                                                    <div className="blockParts" style={{ width: "50%" }}>
                                                        <Input className="mb-2" placeholder="교환사유" readOnly />
                                                        <Input placeholder="구매자가 적은 내용" type="textarea" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">교환 배송비</Label>
                                                    <div className={detail.flexParts} style={{ width: "50%" }}>
                                                        <Input className="" style={{ width: "70%" }} placeholder="" readOnly />
                                                        <span>[구매자 부담]</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="btn_part">
                                    <div className="btn_group">
                                        <button type="button" className="sub-button">
                                            <i class="bi bi-x"></i> 교환 거절
                                        </button>
                                        <button type="button" className="primary-button">
                                            교환 접수 <i className="bi bi-arrow-right-short"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 교환 수거 정보 */}
                            <div className="position-relative">
                                <Label className="input_title">교환 수거 정보</Label>

                                {/* <AccordionBox /> */}
                                <div className={acco.accordionFrame}>
                                    <div className={acco.acco_header}>
                                        <p>
                                            요청 일자 : <span>2025-11-10 12:25:30</span>
                                        </p>
                                    </div>

                                    <div className={acco.claim_detail_body}>
                                        <div className={detail.pd_list_table}>
                                            <Label className="sub_title">수거 상품</Label>
                                            <div className={detail.product_list}>
                                                <div className={[table.tableBody, table.table_border].join(" ")}>
                                                    <table className={table.claim_table}>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "5%" }}>
                                                                    <Input type="checkbox" />
                                                                </th>
                                                                <th style={{ width: "5%" }}>#</th>
                                                                <th style={{ width: "5%" }}>Img</th>
                                                                <th style={{ width: "15%" }}>상품번호</th>
                                                                <th style={{ width: "20%" }}>상품명</th>
                                                                <th style={{ width: "25%" }}>옵션</th>
                                                                <th style={{ width: "10%" }}>수량</th>
                                                                <th style={{ width: "10%" }}>수거 송장번호</th>
                                                                <th style={{ width: "5%" }}>처리</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr className={table.shipping_bundle_deli}>
                                                                <td>
                                                                    <Input type="checkbox" />
                                                                </td>
                                                                <td>10</td>
                                                                <td style={{ padding: "0" }}>
                                                                    <img src="/no_img.svg" style={{ width: "40px" }} />
                                                                </td>
                                                                <td>P123456</td>
                                                                <td className={table.title_cell}>시트지[예림 인테리어 필름] 우드HW 시트지[예림 인테리어 필름] 우드HW</td>
                                                                <td>색상 : 브라운</td>
                                                                <td>1</td>
                                                                <td>123456789</td>
                                                                <td>
                                                                    <i class="bi bi-three-dots-vertical pointer"></i>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="btn_part">
                                                    <button type="button" className="primary-button">
                                                        운송장번호 등록
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={detail.info_list_section}>
                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">수거 송장번호 </Label>
                                                    <div className={detail.flexParts} style={{ width: "50%" }}>
                                                        <Input className="" style={{ width: "30%" }} placeholder="택배사" readOnly />
                                                        <Input style={{ width: "50%" }} placeholder="송장번호" readOnly />
                                                        <button type="button" className="sub-button" style={{ width: "20%", padding: "8px" }}>
                                                            {/* 조회  */}
                                                            <i class="bi bi-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">회수 요청일</Label>
                                                    <Input className="" style={{ width: "50%" }} placeholder="" readOnly />
                                                </div>
                                            </div>

                                            <div className={detail.info_column}>
                                                <div className={detail.info_line}>
                                                    <Label className="sub_title">수거 완료일</Label>
                                                    <Input className="" style={{ width: "50%" }} placeholder="" readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 교환 처리 결과 */}
                        <div className="position-relative">
                            <Label className="input_title">교환 처리 결과</Label>

                            {/* <AccordionBox /> */}
                            <div className={acco.accordionFrame}>
                                <div className={acco.acco_header}>
                                    <p>
                                        처리 일자 : <span>2025-11-10 12:25:30</span>
                                    </p>
                                </div>

                                <div className={acco.claim_detail_body}>
                                    <div className={detail.pd_list_table}>
                                        <Label className="sub_title">교환 발송 상품</Label>
                                        <div className={detail.product_list}>
                                            <div className={[table.tableBody, table.table_border].join(" ")}>
                                                <table className={table.claim_table}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "5%" }}>#</th>
                                                            <th style={{ width: "5%" }}>Img</th>
                                                            <th style={{ width: "10%" }}>상품번호</th>
                                                            <th style={{ width: "20%" }}>상품명</th>
                                                            <th style={{ width: "25%" }}>옵션</th>
                                                            <th style={{ width: "10%" }}>수량</th>
                                                            <th style={{ width: "10%" }}>처리상태</th>
                                                            <th style={{ width: "10%" }}>사유</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>10</td>
                                                            <td style={{ padding: "0" }}>
                                                                <img src="/no_img.svg" style={{ width: "40px" }} />
                                                            </td>
                                                            <td>P123456</td>
                                                            <td className={table.title_cell}>시트지[예림 인테리어 필름] 우드HW 시트지[예림 인테리어 필름] 우드HW</td>
                                                            <td>색상 : 브라운</td>
                                                            <td>1 / 1</td>
                                                            <td>[교환완료]</td>
                                                            <td>수거, 검수완료</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={detail.info_list_section}>
                                        <div className={detail.info_column}>
                                            <div className={detail.info_line}>
                                                <Label className="sub_title">발송 송장번호 </Label>
                                                <div className={detail.flexParts} style={{ width: "50%" }}>
                                                    <Input className="" style={{ width: "30%" }} placeholder="택배사" readOnly />
                                                    <Input style={{ width: "50%" }} placeholder="송장번호" readOnly />
                                                    <button type="button" className="sub-button" style={{ width: "20%", padding: "8px" }}>
                                                        {/* 조회  */}
                                                        <i class="bi bi-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={detail.info_column}>
                                            <div className={detail.info_line}>
                                                <Label className="sub_title">교환품 출고일</Label>
                                                <Input className="" style={{ width: "50%" }} placeholder="" readOnly />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="section_divider" />

                                <div className={acco.claim_detail_body}>
                                    <div className={detail.pd_list_table}>
                                        <Label className="sub_title">교환 처리 제외</Label>
                                        <div className={detail.product_list}>
                                            <div className={[table.tableBody, table.table_border].join(" ")}>
                                                <table className={table.claim_table}>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "5%" }}>#</th>
                                                            <th style={{ width: "5%" }}>Img</th>
                                                            <th style={{ width: "10%" }}>상품번호</th>
                                                            <th style={{ width: "20%" }}>상품명</th>
                                                            <th style={{ width: "25%" }}>옵션</th>
                                                            <th style={{ width: "10%" }}>수량</th>
                                                            <th style={{ width: "10%" }}>처리상태</th>
                                                            <th style={{ width: "10%" }}>사유</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>10</td>
                                                            <td style={{ padding: "0" }}>
                                                                <img src="/no_img.svg" style={{ width: "40px" }} />
                                                            </td>
                                                            <td>P123456</td>
                                                            <td className={table.title_cell}>시트지[예림 인테리어 필름] 우드HW 시트지[예림 인테리어 필름] 우드HW</td>
                                                            <td>색상 : 브라운</td>
                                                            <td>1 / 1</td>
                                                            <td>[교환거절]</td>
                                                            <td>상품 훼손</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={detail.info_list_section}>
                                        <div className={detail.info_column}>
                                            <div className={detail.info_cell}>
                                                <Label className="sub_title">메모</Label>
                                                <Input placeholder="처리 내용" type="textarea" />
                                            </div>
                                        </div>

                                        <div className={detail.info_column}>
                                            <div className={detail.info_cell}>
                                                <Label className="sub_title">처리 완료일</Label>
                                                <Input className="" type="" readOnly />
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
