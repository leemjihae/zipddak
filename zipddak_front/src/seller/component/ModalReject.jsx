import { Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useState } from "react";
import { myAxios } from "../../config.jsx";
import modal from "../css/modal.module.css";
import { tokenAtom } from "../../atoms.jsx";
import { useAtom } from "jotai/react";

export default function ModalReject({ rejectModalOpen, setRejectModalOpen, selectedItems, checkbox, targetItemIdx, idx, refresh, rejectType }) {
    const [rejectReason, setRejectReason] = useState("");
    const [rejectDetailReason, setRejectDetailReason] = useState("");
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
            console.log("targetItems : " + targetItems);

            // → targetItems 로 API 호출
            const res = await myAxios(token, setToken)
                .post("/refundRejectItems", {
                    orderIdx: idx,
                    itemIdxs: targetItems,
                    // rejectReason: rejectReason,
                    // rejectDetailReason: rejectDetailReason,
                })
                .then((res) => {
                    console.log(res);
                    console.log(res.data);

                    if (res.data.success === true) {
                        alert(res.data.message);
                        setRejectModalOpen(false); //모달 닫기

                        //checkbox 기반 화면이면 checkbox reset
                        checkbox?.resetChecked?.();

                        refresh?.(); // 새로고침
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response && err.response.data) {
                        alert(err.response.data.message); // 예외 메시지 표시
                    } else {
                        alert("알 수 없는 오류 발생");
                    }
                });
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                alert(err.response.data.message); // 예외 메시지 표시
            } else {
                alert("처리실패");
            }
        }
    };

    return (
        <>
            <Modal isOpen={rejectModalOpen} toggle={() => setRejectModalOpen(false)} className={[modal.modalFrame, modal.refundModalFrame].join(" ")}>
                <ModalHeader toggle={() => setRejectModalOpen(false)} className={[modal.modalHeader, modal.refundModalHeader].join(" ")}>
                    {rejectType}
                </ModalHeader>
                <ModalBody className={[modal.modalBody, modal.refundModalBody].join(" ")}>
                    <div className={modal.refundModalContent}>
                        <div className={modal.descRefundModalColumn}>
                            <p>
                                선택된 상품 {targetItemIdx ? 1 : resolvedSelectedItems.length}개를 {rejectType} 처리하시겠습니까?
                            </p>
                            {/* <p style={{ color: "red" }}>처리 후 취소할 수 없습니다.</p> */}
                        </div>
                        {/* <div className={modal.refundModalContent} style={{ padding: "15px" }}>
                            <div className={modal.refundModalColumn}>
                                <span className="sub_title">
                                    거절 사유<span className="required">*</span>
                                </span>
                                <Input type="select" className={modal.selectReason} onChange={(e) => setRejectReason(e.target.value)}>
                                    <option>거절 사유 선택 (필수) </option>
                                    <option value="상품훼손">상품 훼손</option>
                                    <option value="기간지남">요청 가능 기간 지남</option>
                                    <option value="기타">기타</option>
                                </Input>
                            </div>
                            <div className={modal.refundModalColumn}>
                                <span className="sub_title">거절 내용 </span>
                                <Input type="textarea" className={modal.writeReason} placeholder="거절처리에 대한 상세사유를 적어주세요! (최대 2000자)" onChange={(e) => setRejectDetailReason(e.target.value)} />
                            </div>
                        </div> */}
                    </div>

                    <div className="btn_part">
                        <button className="primary-button" style={{ width: "100%", height: "33px" }} onClick={handleSave}>
                            저장
                        </button>
                        <button className="sub-button" style={{ width: "100%", height: "33px" }} onClick={() => setRejectModalOpen(false)}>
                            취소
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
