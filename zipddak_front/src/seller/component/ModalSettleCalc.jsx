import table from "../css/table.module.css";
import { Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useState, useEffect, useRef } from "react";
import { myAxios } from "../../config.jsx";
import modal from "../css/modal.module.css";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";

export default function ModalSettleCalc({ settleCalcModalOpen, setSettleCalcModalOpen, sellerId, productName }) {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [selectedSalesMonth, setSelectedSalesMonth] = useState(null);

    const showSalesHistory = async () => {
        if (!selectedSalesMonth) {
            alert("조회할 월을 선택하세요");
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append("sellerId", user.username);
            params.append("month", selectedSalesMonth); //선택한 날짜 그대로 발송

            const showSalesHistoryUrl = `/settle/showMySalesHistory?${params.toString()}`;

            // 8) 서버 전송
            const res = await myAxios(token, setToken).get(showSalesHistoryUrl);
            if (res.data.success) {
                console.log(res.data);
            } else {
                alert("조회 결과가 없습니다");
            }
        } catch (err) {
            console.error(err);
            alert("매출 목록 조회 실패");
        }
    };

    return (
        <>
            <Modal isOpen={settleCalcModalOpen} toggle={() => setSettleCalcModalOpen(false)} className={[modal.modalFrame, modal.settleCalcModalFrame].join(" ")}>
                <ModalHeader toggle={() => setSettleCalcModalOpen(false)} className={modal.modalHeader}>
                    정산금액 모의계산
                </ModalHeader>
                <ModalBody className={modal.modalBody}>
                    <div className={modal.settleCalcContent}>
                        <div className={modal.contentParts}>
                            <Input
                                type="month"
                                onChange={(e) => {
                                    setSelectedSalesMonth(e.target.value);
                                }}
                            />
                            <button type="button" className="sub-button" onClick={showSalesHistory}>
                                조회
                            </button>
                        </div>
                    </div>
                    <div className={modal.settleCalcContent}>
                        <table className={[table.salesTable, table.table_border].join(" ")}>
                            <thead>
                                <tr>
                                    <th style={{ width: "25%" }}>날짜</th>
                                    <th style={{ width: "25%" }}>총 결제금액 합 </th>
                                    <th style={{ width: "25%" }}>고객부담 배송비 합</th>
                                    <th style={{ width: "25%" }}>순 매출액 합</th>
                                </tr>
                            </thead>
                            <div className={table.yScrollFrame}>
                                <tbody></tbody>
                            </div>
                        </table>
                    </div>

                    <div className="btn_part">
                        <button className="primary-button" style={{ height: "33px" }}>
                            계산하기
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
