import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";
import { useNavigate, useSearchParams } from "react-router";

export default function SentEstimates() {
  const [tab, setTab] = useState("진행중인 견적요청");

  const [estimates, setEstimates] = useState([]);

  const [pageBtn, setPageBtn] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    allPage: 0,
    curPage: 1,
    endPage: 0,
    startPage: 1,
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  // 내 견적서 조회
  const getEstimates = (page, status) => {
    myAxios(token, setToken)
      .get(
        "http://localhost:8080" +
          `/sent/estimateList?username=${user.username}&page=${page}&status=${status}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setEstimates(data.estimateList);
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

  // 날짜 포멧팅
  function timeAgo(sqlDateString) {
    const now = new Date();
    const date = new Date(sqlDateString);

    // 날짜만 비교
    const diffMs = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
    const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDay < 1) return "오늘";
    return `${diffDay}일 전`;
  }

  useEffect(() => {
    if (tab === "진행중인 견적요청") {
      getEstimates(pageFromUrl, "progress");
    } else if (tab === "지난 견적요청") {
      getEstimates(pageFromUrl, "finish");
    }
  }, [tab, pageFromUrl]);

  return (
    <div className="mypage-layout">
      <h1 className="mypage-title">보낸 견적서</h1>

      <div className="mypage-tabList">
        <div
          className={tab === "진행중인 견적요청" ? "isActive" : ""}
          onClick={() => setTab("진행중인 견적요청")}
        >
          진행중인 견적요청
        </div>
        <div
          className={tab === "지난 견적요청" ? "isActive" : ""}
          onClick={() => setTab("지난 견적요청")}
        >
          지난 견적요청
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {estimates.map((estimate) => (
          <div
            style={{
              display: "flex",
              padding: "20px",
              flexDirection: "column",
              gap: "20px",
              flex: "1 0 0",
              borderRadius: "16px",
              border: "1px solid #EFF1F5",
            }}
            key={estimate.estimateIdx}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "14px",
              }}
            >
              <span
                style={{
                  width: "fit-content",
                  height: "20px",
                  display: "flex",
                  padding: "5px 10px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 88, 51, 0.50)",
                  background: "rgba(255, 88, 51, 0.05)",
                  color: "#FF5833",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                모집 중
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  alignSelf: "stretch",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    lineHeight: "18px",
                  }}
                >
                  {estimate.categoryName}
                </p>
                <p
                  style={{
                    color: "#6A7685",
                    fontSize: "13px",
                    fontWeight: "400",
                  }}
                >
                  {timeAgo(estimate.createdAt)}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "14px",
                alignSelf: "stretch",
                fontSize: "14px",
              }}
            >
              <p>
                <i
                  class="bi bi-geo-alt"
                  style={{ fontSize: "13px", marginRight: "2px" }}
                ></i>
                {estimate.location}
              </p>
              <p>
                {Number(estimate.budget).toLocaleString()}만원 ·{" "}
                {estimate.preferredDate}
              </p>
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "700",
                textAlign: "right",
              }}
            >
              {Number(estimate.totalCost).toLocaleString()}원
            </p>
            <button
              className="primary-button"
              style={{
                height: "33px",
                color: "#FF5833",
                backgroundColor: "#fff",
              }}
              onClick={() => {
                navigate(
                  `/expert/mypage/sent/estimate/${estimate.estimateIdx}?page=${pageInfo.curPage}`
                );
              }}
            >
              견적 상세 보기
            </button>
          </div>
        ))}
      </div>

      <Pagination className="my-pagination">
        {pageBtn.map((b) => (
          <PaginationItem key={b} active={b === pageInfo.curPage}>
            <PaginationLink
              onClick={() => {
                if (tab === "진행중인 견적요청") {
                  getEstimates(b, "progress");
                } else if (tab === "지난 견적요청") {
                  getEstimates(b, "finish");
                }
              }}
            >
              {b}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>
    </div>
  );
}
