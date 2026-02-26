import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export function Inquiries() {
  const [inquiryList, setInquiryList] = useState([]);
  const [openRowId, setOpenRowId] = useState(null);
  const [pageBtn, setPageBtn] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    allPage: 0,
    curPage: 1,
    endPage: 0,
    startPage: 1,
  });

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  const navigate = useNavigate();

  // 내 문의내역 조회
  const getInquiryList = (page) => {
    myAxios(token, setToken)
      .get(
        "http://localhost:8080" +
          `/inquiryList?username=${user.username}&page=${page}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setInquiryList(data.inquiryList);
        return data.pageInfo;
      })
      .then((pageData) => {
        setPageInfo(pageData);
        let pageBtns = [];
        for (let i = pageData.startPage; i <= pageData.endPage; i++) {
          pageBtns.push(i);
        }
        setPageBtn([...pageBtns]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 행 토글
  const toggleRow = (id) => {
    if (openRowId === id) setOpenRowId(null);
    else setOpenRowId(id);
  };

  // 타입 매핑
  const inquiryTypeMap = {
    PAYMENT: "결제",
    SHIPPING: "배송",
    ORDER_ISSUE: "취소/교환/반품",
    RENTAL: "대여",
    EXPERT_MATCHING: "전문가 매칭",
    USER_MATCHING: "사용자 매칭",
    ACCOUNT: "계정",
    SETTLEMENT: "정산",
    SUGGESTION: "제안",
    MEMBERSHIP: "멤버십",
    SYSTEM: "시스템",
    PRODUCT: "상품",
    ETC: "기타",
  };
  const getInquiryTypeLabel = (type) => {
    return inquiryTypeMap[type] || "기타";
  };

  useEffect(() => {
    getInquiryList(1);
  }, []);

  return (
    <div className="mypage-layout">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1 className="mypage-title">1:1문의내역</h1>
        <button
          className="primary-button"
          style={{ width: "100px", height: "33px" }}
          onClick={() => navigate("/expert/mypage/inquiries/write")}
        >
          1:1문의하기
        </button>
      </div>

      <table className="mypage-table">
        <thead>
          <tr>
            <td>문의유형</td>
            <td>문의내용</td>
            <td>작성일</td>
            <td>답변일</td>
            <td>답변상태</td>
          </tr>
        </thead>
        <tbody>
          {inquiryList.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <div
                  style={{
                    width: "100%",
                    padding: "40px",
                    textAlign: "center",
                    color: "#6A7685",
                    fontSize: "14px",
                  }}
                >
                  작성한 문의가 없습니다.
                </div>
              </td>
            </tr>
          ) : (
            inquiryList.map((inquiry) => (
              <>
                <tr
                  key={inquiry.inquiryIdx}
                  onClick={() => toggleRow(inquiry.inquiryIdx)}
                >
                  <td style={{ width: "120px", fontWeight: "500" }}>
                    {getInquiryTypeLabel(inquiry.type)}
                  </td>
                  <td style={{ textAlign: "left" }}>{inquiry.content}</td>
                  <td style={{ width: "110px" }}>{inquiry.writeAt}</td>
                  <td style={{ width: "110px" }}>{inquiry.answerAt}</td>
                  <td style={{ width: "90px", fontWeight: "500" }}>
                    {inquiry.answer !== null ? "답변완료" : "답변예정"}
                  </td>
                </tr>

                {openRowId === inquiry.inquiryIdx && (
                  <tr>
                    <td colSpan="4" style={{ background: "#FDFDFD" }}>
                      <div
                        style={{
                          display: "flex",
                          padding: "0 60px 20px",
                          alignItems: "center",
                          gap: "56px",
                        }}
                      >
                        <span
                          style={{
                            color: "#888",
                            fontSize: "32px",
                            fontStyle: "normal",
                            fontWeight: "500",
                            lineHeight: "150%",
                          }}
                        >
                          Q
                        </span>
                        <div>
                          <p>{inquiry.content}</p>
                          {inquiry.image1 && (
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                marginTop: "14px",
                              }}
                            >
                              {[inquiry.image1, inquiry.image2, inquiry.image3]
                                .filter((img) => img)
                                .map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    width="50px"
                                    height="50px"
                                  />
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {inquiry.answer && (
                        <div
                          style={{
                            display: "flex",
                            padding: "20px 60px 0",
                            alignItems: "center",
                            gap: "56px",
                          }}
                        >
                          <span
                            style={{
                              color: "#FF5833",
                              fontSize: "32px",
                              fontStyle: "normal",
                              fontWeight: "500",
                              lineHeight: "150%",
                            }}
                          >
                            A
                          </span>
                          <p>{inquiry.answer}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))
          )}
        </tbody>
      </table>

      <Pagination className="my-pagination">
        {pageBtn.map((b) => (
          <PaginationItem key={b} active={b === pageInfo.curPage}>
            <PaginationLink onClick={() => getInquiryList(b)}>
              {b}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
    </div>
  );
}
