import { useState } from "react";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

export default function DeliveryButton({ tCode, invoice }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formId = `delivery-form-${invoice}`;

  const handleClick = () => {
    setIsModalOpen(true);

    // 모달이 열린 뒤에 submit 해야 iframe이 제대로 로드됨
    setTimeout(() => {
      document.getElementById(formId).submit();
    }, 100);
  };

  return (
    <>
      <button
        className="primary-button"
        style={{
          width: "68px",
          height: "33px",
        }}
        onClick={handleClick}
      >
        배송조회
      </button>

      <Modal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(false)}
        className="mypage-modal"
      >
        <ModalHeader toggle={() => setIsModalOpen(false)}></ModalHeader>
        <ModalBody style={{ height: "80vh" }}>
          <iframe
            name="delivery-iframe"
            style={{ width: "100%", height: "100%", border: "none" }}
          ></iframe>

          {/* 숨겨진 폼 */}
          <form
            id={formId}
            action="https://info.sweettracker.co.kr/tracking/1"
            method="post"
            target="delivery-iframe"
            style={{ display: "none" }}
          >
            <input type="hidden" name="t_key" value="yY5k3n0nzkMoIO3AWfhYNw" />
            <input type="hidden" name="t_code" value={tCode} />
            <input type="hidden" name="t_invoice" value={invoice} />
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}
