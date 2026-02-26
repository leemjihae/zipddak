import "../css/accordionBox.module.css";
import { FormGroup, Input, Label } from "reactstrap";

export default function AccordionBox() {
    return (
        <>
            <div className="accordionFrame">
                <div className="acco_header">
                    <p>
                        요청 일자 : <span>2025-11-10 12:25:30</span>{" "}
                    </p>
                </div>
                <div className="acco_body">
                    <div className="pd_list_table">
                        <Label for="examplePassword" className="sub_title">
                            반품 요청 상품
                        </Label>
                        <div className="product_list">
                            <div className="tableBody">
                                <table className="detailListTable">
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
                                            <th style={{ width: "10%" }}>금액</th>
                                            <th style={{ width: "5%" }}>처리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="shipping_bundle_deli">
                                            <td>
                                                <Input type="checkbox" />
                                            </td>
                                            <td>10</td>
                                            <td style={{ padding: "0" }}>
                                                <img src="/no_img.svg" style={{ width: "40px" }} />
                                            </td>
                                            <td>P123456</td>
                                            <td className="title_cell">시트지[예림 인테리어 필름] 우드HW 시트지[예림 인테리어 필름] 우드HW</td>
                                            <td>색상 : 브라운</td>
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

                    <div className="info_list_section">
                        <div className="info_column">
                            <div className="info_line ">
                                <Label for="" className="sub_title">
                                    요청사항
                                </Label>
                                <Input className="" style={{ width: "50%" }} placeholder="" readOnly />
                            </div>
                        </div>
                        <div className="info_column">
                            <div className="info_line ">
                                <Label for="" className="sub_title">
                                    첨부파일
                                </Label>
                                <div className="imgParts" style={{ width: "100%" }}>
                                    <img src="/no_img.svg" style={{ width: "40px" }} />
                                    <img src="/no_img.svg" style={{ width: "40px" }} />
                                    <img src="/no_img.svg" style={{ width: "40px" }} />
                                    <img src="/no_img.svg" style={{ width: "40px" }} />
                                    <img src="/no_img.svg" style={{ width: "40px" }} />
                                </div>
                            </div>
                        </div>
                        <div className="info_column">
                            <div className="info_line ">
                                <Label className="sub_title">수거 주소지 </Label>
                                <div style={{ width: "50%" }}>
                                    <div className="addr_column mb-2">
                                        <Input className="" style={{ width: "30%" }} placeholder="우편번호" readOnly />
                                        <Input style={{ width: "70%" }} placeholder="도로명주소" readOnly />
                                    </div>
                                    <div className="addr_column2 ">
                                        <Input type="text" placeholder="상세주소" readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info_column">
                            <div className="info_line ">
                                <Label className="sub_title">고객명</Label>
                                <Input className="" style={{ width: "50%" }} placeholder="" readOnly />
                            </div>
                        </div>
                        <div className="info_column">
                            <div className="info_line ">
                                <Label className="sub_title">반품 사유 </Label>
                                <div className="blockParts" style={{ width: "50%" }}>
                                    <Input className="mb-2" placeholder="반품사유" readOnly />
                                    <Input placeholder="구매자가 적은 내용" type="textarea" />
                                </div>
                            </div>
                        </div>
                        <div className="info_column">
                            <div className="info_line ">
                                <Label className="sub_title">반품 배송비</Label>
                                <div className="flexParts" style={{ width: "50%" }}>
                                    <Input className="" style={{ width: "70%" }} placeholder="" readOnly />
                                    <span>[구매자 부담]</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
