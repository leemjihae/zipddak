import { Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { myAxios } from "../../config.jsx";
import modal from "../css/modal.module.css";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";

export default function ModalPdDelete({ deleteModalOpen, setDeleteModalOpen, productIdx, productName }) {
    const navigate = useNavigate();

    //제목 15자 넘어가면 말줄임표 처리
    const truncate = (text, maxLength = 15) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const productDelete = async () => {
        try {
            console.log("productIdx : " + productIdx);

            const formData = new FormData();
            formData.append("sellerId", user.username);
            formData.append("num", productIdx);

            // 8) 서버 전송
            const producDeleteUrl = `/product/myProductDelete`;
            myAxios(token, setToken)
                .post(producDeleteUrl, formData)
                .then((res) => {
                    if (res.data.success === true) {
                        alert(res.data.message);
                        navigate(`/seller/productList`); //상품 리스트로 이동
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.error(err);
            alert("상품 삭제 실패");
        }
    };

    return (
        <>
            <Modal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(false)} className={[modal.modalFrame, modal.refundModalFrame].join(" ")}>
                <ModalHeader toggle={() => setDeleteModalOpen(false)} className={[modal.modalHeader, modal.refundModalHeader].join(" ")}>
                    상품 삭제
                </ModalHeader>
                <ModalBody className={[modal.modalBody, modal.refundModalBody].join(" ")}>
                    <div className={modal.refundModalContent}>
                        <div className={modal.descRefundModalColumn}>
                            <p>
                                <span>{truncate(productName)}</span> 상품을 삭제 처리하시겠습니까?
                            </p>
                            <p style={{ color: "red" }}>처리 후 복구할 수 없습니다.</p>
                        </div>
                    </div>

                    <div className="btn_part">
                        <button className="primary-button" style={{ width: "100%", height: "33px" }} onClick={productDelete}>
                            삭제
                        </button>
                        <button className="sub-button" style={{ width: "100%", height: "33px" }} onClick={() => setDeleteModalOpen(false)}>
                            취소
                        </button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
