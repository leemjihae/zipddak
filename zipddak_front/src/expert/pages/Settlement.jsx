import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export function Settlement() {
  const [settlements, setSettlements] = useState({});
  const [pageBtn, setPageBtn] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    allPage: 0,
    curPage: 1,
    endPage: 0,
    startPage: 1,
  });
  const [selectDate, setSelectDate] = useState({
    startDate: null,
    endDate: null,
  });

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  // 정산목록 조회
  const getSettlements = (page, startDate, endDate) => {
    myAxios(token, setToken)
      .get(
        "http://localhost:8080" +
          `/settlementList?username=${user.username}&page=${page}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) => {
        setSettlements(res.data.settlements);
        return res.data.pageInfo;
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

  useEffect(() => {
    getSettlements(1, selectDate.startDate, selectDate.endDate);
  }, []);

  return (
    <div className="mypage-layout">
      <h1 className="mypage-title">매출정산 관리</h1>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          {/* 날짜 선택 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Input
              type="date"
              bsSize="sm"
              style={{ width: "140px", height: "32px" }}
              onChange={(e) => {
                setSelectDate({ ...selectDate, startDate: e.target.value });
                setSettlements([]);
                getSettlements(
                  pageInfo.curPage,
                  e.target.value,
                  selectDate.endDate
                );
              }}
            ></Input>{" "}
            -{" "}
            <Input
              type="date"
              bsSize="sm"
              style={{ width: "140px", height: "32px" }}
              onChange={(e) => {
                setSelectDate({ ...selectDate, endDate: e.target.value });
                setSettlements([]);
                getSettlements(
                  pageInfo.curPage,
                  e.target.value,
                  selectDate.endDate
                );
              }}
            ></Input>
          </div>

          {/* 요약 카드 */}
          <div
            style={{
              display: "flex",
              width: "250px",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              borderRadius: "8px",
              border: "1px solid #EFF1F5",
            }}
          >
            <p
              style={{
                color: "#6A7685",
                fontSize: "12px",
                fontWeight: "400",
                whiteSpace: "nowrap",
              }}
            >
              매출 건 수 {settlements.totalSalesCount}건
            </p>
            <p
              style={{
                color: "#303441",
                fontSize: "14px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                margin: "6px 0 16px 0",
              }}
            >
              이번 달 총 매출금액
            </p>
            <p
              style={{
                color: "#303441",
                fontSize: "16px",
                fontWeight: "600",
                whiteSpace: "nowrap",
                textAlign: "right",
                width: "100%",
              }}
            >
              {Number(settlements.totalSalesAmountInteger).toLocaleString()}원
            </p>
          </div>
        </div>

        <table className="mypage-table">
          <thead>
            <tr>
              <td>서비스명</td>
              <td>고객결제금액</td>
              <td>플랫폼수수료</td>
              <td>정산금액</td>
              <td>작업기간(일수)</td>
              <td>정산여부</td>
              <td>관리자코멘트</td>
            </tr>
          </thead>
          <tbody>
            {settlements?.settlementItems?.map((settlement) => (
              <>
                <tr>
                  <td>{settlement.serviceName}</td>
                  <td style={{ fontWeight: "500" }}>
                    {Number(settlement.customerPayment).toLocaleString()}원
                  </td>
                  <td style={{ fontWeight: "500" }}>
                    {Number(settlement.platformFee).toLocaleString()}원
                  </td>
                  <td style={{ fontWeight: "500" }}>
                    {Number(settlement.settlementAmount).toLocaleString()}원
                  </td>
                  {settlement.workStartDate !== null ? (
                    <td>
                      {settlement.workStartDate} - {settlement.workEndDate}(
                      <span style={{ color: "#FF5833" }}>
                        {settlement.workDays}
                      </span>
                      )
                    </td>
                  ) : (
                    <td></td>
                  )}

                  <td
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={
                        settlement.state === "COMPLETED"
                          ? { fontWeight: "500" }
                          : { color: "#FF5833", fontWeight: "600" }
                      }
                    >
                      {settlement.state === "COMPLETED"
                        ? "정산완료"
                        : "정산예정"}
                    </span>
                    <span style={{ fontSize: "11px" }}>
                      {settlement.completedAt}
                    </span>
                  </td>
                  <td>{settlement.comment}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination className="my-pagination">
        {pageBtn.map((b) => (
          <PaginationItem key={b} active={b === pageInfo.curPage}>
            <PaginationLink
              onClick={() => {
                setSettlements([]);
                getSettlements(b, selectDate.startDate, selectDate.endDate);
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
