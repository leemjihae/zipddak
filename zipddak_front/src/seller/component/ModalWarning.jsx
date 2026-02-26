import { Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { myAxios } from "../../config.jsx";
import modal from "../css/modal.module.css";
import { tokenAtom } from "../../atoms.jsx";
import { useAtom } from "jotai/react";

export default function ModalWarning({ warningModalOpen, setWarningModalOpen, info, refresh, type, warningType }) {
    const [token, setToken] = useAtom(tokenAtom);
    console.log(info);
    console.log(info.refundIdx);

    const actionHandling = async () => {
        try {
            // 8) 서버 전송
            if (warningType == "수거완료") {
                myAxios(token, setToken)
                    .post("/pickupComplated", {
                        num: info.refundIdx,
                        postComp: info.pickupPostComp,
                        trackingNumber: info.pickupTrackingNo,
                        claimType: type,
                    })
                    .then((res) => {
                        if (res.data.success === true) {
                            alert("수거완료 처리되었습니다.");
                            setWarningModalOpen(false); //모달 닫기
                            refresh?.();
                        } else {
                            alert("수거완료 처리 실패.");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        } catch (err) {
            console.error(err);
            alert("요청 처리 실패");
        }
    };

    return (
        <>
            <Modal isOpen={warningModalOpen} toggle={() => setWarningModalOpen(false)} className={[modal.modalFrame, modal.refundModalFrame].join(" ")}>
                <ModalHeader toggle={() => setWarningModalOpen(false)} className={[modal.modalHeader, modal.refundModalHeader].join(" ")}>
                    {warningType} 처리
                </ModalHeader>
                <ModalBody className={[modal.modalBody, modal.refundModalBody].join(" ")}>
                    <div className={modal.refundModalContent}>
                        <div className={modal.descRefundModalColumn}>
                            <p>{warningType} 처리하시겠습니까?</p>
                            {warningType != "수거완료" && <p style={{ color: "red" }}>처리 후 복구할 수 없습니다.</p>}
                        </div>
                    </div>

                    <div className="btn_part">
                        <button className="primary-button" style={{ width: "100%", height: "33px" }} onClick={actionHandling}>
                            저장
                        </button>
                        <button className="sub-button" style={{ width: "100%", height: "33px" }} onClick={() => setWarningModalOpen(false)}>
                            취소
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
