import { Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useState } from "react";
import { myAxios } from "../../config.jsx";
import modal from "../css/modal.module.css";
import { tokenAtom } from "../../atoms.jsx";
import { useAtom } from "jotai/react";

export default function ModalAccept({ acceptModalOpen, setAcceptModalOpen, selectedItems, checkbox, targetItemIdx, idx, refresh, acceptType }) {
    const [acceptReason, setAcceptReason] = useState("");
    const [acceptDetailReason, setAcceptDetailReason] = useState("");
    const [token, setToken] = useAtom(tokenAtom);

    //선택된 아이템 계산
    const resolvedSelectedItems = selectedItems ?? checkbox?.getSelected?.() ?? [];

    const handleSave = async () => {
        try {
            let targetItems = [];

            if (targetItemIdx) {
                // 드롭다운 단일 처리
                targetItems = [targetItemIdx];
            } else if (resolvedSelectedItems.length > 0) {
                //체크박스 다중 처리
                targetItems = resolvedSelectedItems;
            } else {
                //아무것도 없으면 return
                alert("처리할 상품을 선택해주세요.");
                return;
            }
            console.log("orderIdx : " + idx);
            console.log("targetItems : " + targetItems);

            // → targetItems 로 API 호출
            const res = await myAxios(token, setToken)
                .post("/refundAcceptItems", {
                    orderIdx: idx,
                    itemIdxs: targetItems,
                    // acceptReason: acceptReason,
                    // acceptDetailReason: acceptDetailReason,
                })
                .then((res) => {
                    console.log(res);
                    console.log(res.data);

                    if (res.data.success === true) {
                        alert(res.data.message);
                        setAcceptModalOpen(false); //모달 닫기
                        checkbox?.resetChecked?.(); //체크박스 초기화
                        refresh?.(); // 새로고침
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.error(err);
            alert("요청 처리 실패");
        }
    };

    return (
        <>
            <Modal isOpen={acceptModalOpen} toggle={() => setAcceptModalOpen(false)} className={[modal.modalFrame, modal.refundModalFrame].join(" ")}>
                <ModalHeader toggle={() => setAcceptModalOpen(false)} className={[modal.modalHeader, modal.refundModalHeader].join(" ")}>
                    {acceptType}
                </ModalHeader>
                <ModalBody className={[modal.modalBody, modal.refundModalBody].join(" ")}>
                    <div className={modal.refundModalContent}>
                        <div className={modal.descRefundModalColumn}>
                            <p>
                                선택된 상품 {targetItemIdx ? 1 : resolvedSelectedItems.length}개를 {acceptType} 처리하시겠습니까?
                            </p>
                            <p style={{ color: "red" }}>처리 후 취소할 수 없습니다.</p>
                        </div>
                        {/* <div className={modal.refundModalContent} style={{ padding: "15px" }}>
                            <div className={modal.refundModalColumn}>
                                <span className="sub_title">처리 사유 </span>
                                <Input type="select" className={modal.selectReason} onChange={(e) => setAcceptReason(e.target.value)}>
                                    <option>환불 사유 선택 </option>
                                    <option value="재고없음">재고없음</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </Input>
                            </div>
                            <div className={modal.refundModalColumn}>
                                <span className="sub_title">처리 내용 </span>
                                <Input type="textarea" className={modal.writeReason} placeholder="환불처리에 대한 상세사유를 적어주세요! (최대 2000자)" onChange={(e) => setAcceptDetailReason(e.target.value)} />
                            </div>
                        </div> */}
                    </div>

                    <div className="btn_part">
                        <button className="primary-button" style={{ width: "100%", height: "33px" }} onClick={handleSave}>
                            저장
                        </button>
                        <button className="sub-button" style={{ width: "100%", height: "33px" }} onClick={() => setAcceptModalOpen(false)}>
                            취소
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
