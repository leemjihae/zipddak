import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Input, Modal, ModalBody } from "reactstrap";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export function InquiryForm() {
  const [type, setType] = useState("");
  const [content, setContent] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [images, setImages] = useState([]); // 이미지 미리보기 URL 배열
  const [files, setFiles] = useState([]); // 실제 업로드용 이미지 File 배열

  const imgRef = useRef(null);
  const navigate = useNavigate();

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  // 문의 작성
  const submitInquiry = () => {
    const formData = new FormData();

    formData.append("type", type);
    formData.append("content", content);
    formData.append("writerUsername", user.username);
    formData.append("writerType", "EXPERT");
    formData.append("answererType", "ADMIN");

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
            navigate("/expert/mypage/inquiries");
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
                name="inquiryType"
                value="ACCOUNT"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">계정</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                name="inquiryType"
                value="PAYMENT"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">결제</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                name="inquiryType"
                value="USER_MATCHING"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">사용자 매칭</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                name="inquiryType"
                value="SUGGESTION"
                onChange={handleTypeChange}
              />
              <laebl for="inquiryType">제안</laebl>
            </div>
            <div className="mypage-radio">
              <Input
                id="inquiryType"
                type="radio"
                name="inquiryType"
                value="ETC"
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
