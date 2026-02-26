import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Input, Modal, ModalBody } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { myAxios } from "../../config";

export default function InquiryForm() {
  const [type, setType] = useState("");
  const [orderItemIdx, setOrderItemIdx] = useState(null);
  const [answererType, setAnswererType] = useState("");
  const [content, setContent] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [images, setImages] = useState([]); // 이미지 미리보기 URL 배열
  const [files, setFiles] = useState([]); // 실제 업로드용 이미지 File 배열

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  const imgRef = useRef(null);
  const navigate = useNavigate();

  // 문의 작성
  const submitInquiry = () => {
    const formData = new FormData();

    formData.append("type", type);
    formData.append("content", content);
    formData.append("writerUsername", user.username);
    formData.append("writerType", "USER");
    formData.append("answererType", answererType);
    if (orderItemIdx !== null && orderItemIdx !== undefined) {
      formData.append("orderItemIdx", orderItemIdx);
    }

    // 파일 업로드
    files.forEach((file) => {
      formData.append("inquiriyImages", file);
    });

    myAxios(token, setToken)
      .post("http://localhost:8080" + "/inquiry/write", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data) {
          setIsModalOpen(true);

          setTimeout(() => {
            navigate("/zipddak/mypage/inquiries");
          }, 1500);
        }
      })
      .catch((err) => console.error(err));
  };

  // 문의 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages((prev) => [...prev, URL.createObjectURL(file)]);
    setFiles((prev) => [...prev, file]);
  };

  // 문의 타입 변경
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  useEffect(() => {
    // 답변자 타입 설정
    if (type === "SHIPPING" || type === "ORDER_ISSUE") {
      setAnswererType("SELLER");
    } else {
      setAnswererType("ADMIN");
    }
  }, [type]);

  return (
    <div className="mypage-layout">
      <h1 className="mypage-title">1:1문의작성</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="labelInput-wrapper"
          style={{
            borderBottom: "none",
          }}
        >
          <label style={{ width: "120px" }}>
            문의유형
            <span
              style={{
                color: "#F21724",
                fontSize: "14px",
                fontWeight: "700",
                marginLeft: "2px",
              }}
            >
              *
            </span>
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                value="PAYMENT"
                name="inquiryType"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">결제</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                value="SHIPPING"
                name="inquiryType"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">배송</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                value="ORDER_ISSUE"
                name="inquiryType"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">취소/교환/반품</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                value="RENTAL"
                name="inquiryType"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">대여</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                value="EXPERT_MATCHING"
                name="inquiryType"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">전문가 매칭</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                value="ACCOUNT"
                name="inquiryType"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">계정</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                value="ETC"
                name="inquiryType"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">기타</laebl>
            </div>
          </div>
        </div>
        <div
          className="labelInput-wrapper"
          style={{
            borderBottom: "none",
          }}
        >
          <label style={{ width: "120px" }}>주문번호</label>
          <Input
            style={{ width: "798px" }}
            disabled={
              type === "ORDER_ISSUE" ||
              type === "PAYMENT" ||
              type === "SHIPPING"
                ? false
                : true
            }
            onChange={(e) => setOrderItemIdx(e.target.value)}
          />
        </div>
        <div
          className="labelInput-wrapper"
          style={{
            borderBottom: "none",
          }}
        >
          <label style={{ width: "120px" }}>
            문의내용
            <span
              style={{
                color: "#F21724",
                fontSize: "14px",
                fontWeight: "700",
                marginLeft: "2px",
              }}
            >
              *
            </span>
          </label>
          <Input
            type="textarea"
            style={{ width: "798px" }}
            placeholder="내용을 자세하게 남겨주시면 정확한 답변이 가능합니다."
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div
          className="labelInput-wrapper"
          style={{
            borderBottom: "none",
          }}
        >
          <label style={{ width: "120px" }}>사진첨부</label>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              {images.map((img, idx) => (
                <div style={{ position: "relative" }}>
                  <img key={idx} src={img} width="60px" height="60px" />
                  <i
                    class="bi bi-x-circle-fill"
                    style={{
                      width: "16px",
                      height: "16px",
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setImages((prev) => prev.filter((_, i) => i !== idx));
                      setFiles((prev) => prev.filter((_, i) => i !== idx));
                    }}
                  />
                </div>
              ))}
              {images.length < 3 && (
                <div
                  onClick={() => imgRef.current.click()}
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "#000",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <i
                    class="bi bi-plus-lg"
                    style={{
                      fontSize: "30px",
                      color: "#fff",
                    }}
                  ></i>
                  <input
                    type="file"
                    hidden
                    ref={imgRef}
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
            <p
              style={{
                color: "#A0A0A0",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "20px",
                margin: "0",
              }}
            >
              상품 불량 및 오배송의 경우, 해당 제품 사진을 등록 부탁드립니다.
              <br />
              첨부파일은 최대 3개까지 등록가능합니다.
            </p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="primary-button"
          style={{ width: "200px", height: "40px", fontSize: "14px" }}
          onClick={() => submitInquiry()}
        >
          등록하기
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        className="mypage-modal"
        style={{ width: "380px" }}
      >
        <ModalBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              fontSize: "14px",
            }}
          >
            <p>문의가 접수되었습니다.</p>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
