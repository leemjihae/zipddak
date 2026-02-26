import { Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useState } from "react";
import { myAxios } from "../../config.jsx";
import modal from "../css/modal.module.css";

export default function ModalTrackingRegist({ trackingModalOpen, setTrackingModalOpen, selectedItems, checkbox, targetItemIdx, orderIdx, refresh, registType }) {
    const [postComp, setPostComp] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");

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

            // → targetItems 로 API 호출
            await myAxios()
                .post("/registerTrackingNo", {
                    orderIdx: orderIdx,
                    itemIdxs: targetItems,
                    postComp: postComp,
                    trackingNumber: trackingNumber,
                    registType: registType,
                })
                .then((res) => {
                    if (res.data.success === true) {
                        alert(res.data.message);
                        setTrackingModalOpen(false); //모달 닫기
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
                        alert(err.response.data); // 예외 메시지 표시
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
            <Modal isOpen={trackingModalOpen} toggle={() => setTrackingModalOpen(false)} className={[modal.modalFrame, modal.trackingModalFrame].join(" ")}>
                <ModalHeader toggle={() => setTrackingModalOpen(false)} className={[modal.modalHeader, modal.trackingModalHeader].join(" ")}>
                    운송장 번호 등록
                </ModalHeader>
                <ModalBody className={[modal.modalBody, modal.trackingModalBody].join(" ")}>
                    <div className={modal.trackingModalContent}>
                        <p>선택된 상품 {targetItemIdx ? 1 : resolvedSelectedItems.length}개를 출고 처리하시겠습니까?</p>
                        <div className={modal.descTrackingModalColumn}>
                            <p>상품 발송 시 운송장번호를 등록해주세요.</p>
                            <p>
                                등록하면 주문 상태가 <span style={{ fontWeight: "600" }}>배송중</span>으로 변경됩니다.
                            </p>
                        </div>
                        <p style={{ color: "red" }}>처리 후 취소할 수 없습니다.</p>

                        <div className={modal.trackingModalColumn}>
                            <span className="sub_title">운송장 번호 </span>
                            <div className={modal.trackingInput}>
                                <Input type="select" style={{ width: "30%" }} onChange={(e) => setPostComp(e.target.value)}>
                                    <option>택배사</option>
                                    <option value="04">CJ대한통운</option>
                                    <option value="08">롯데택배</option>
                                    <option value="05">한진택배</option>
                                    <option value="06">로젠택배</option>
                                    <option value="01">우체국택배</option>
                                </Input>
                                <Input type="text" style={{ width: "70%" }} onChange={(e) => setTrackingNumber(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="btn_part">
                        <button className="primary-button" style={{ width: "100%", height: "33px" }} onClick={handleSave}>
                            저장
                        </button>
                        <button className="sub-button" style={{ width: "100%", height: "33px" }} onClick={() => setTrackingModalOpen(false)}>
                            취소
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
