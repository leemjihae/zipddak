import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import MembershipInfoCard from "../component/MembershipInfoCard";
import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { Modal, ModalBody } from "reactstrap";
import { useLocation } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export function Membership() {
  const [membership, setMembership] = useState({});
  const [pageBtn, setPageBtn] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    allPage: 0,
    curPage: 1,
    endPage: 0,
    startPage: 1,
  });

  const user = useAtomValue(userAtom);
  const [token, setToken] = useAtom(tokenAtom);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  // 멤버십 결제
  const startMembershipPayment = async () => {
    try {
      // 1) orderId 생성
      const res = await myAxios(token, setToken).get(
        "http://localhost:8080/make/orderId"
      );
      const orderId = res.data;

      // 2) 토스 SDK 로딩
      const tossPayments = await loadTossPayments(
        "test_ck_Ba5PzR0ArnGLGeODLa1B8vmYnNeD"
      );

      // 3) 결제창 호출
      await tossPayments.requestPayment({
        method: "CARD",
        amount: 30000,
        orderId: orderId,
        orderName: "집딱 멤버십 결제",
        successUrl: `http://localhost:8080/membership/success?username=${user.username}`,
        failUrl: "http://localhost:5173/expert/membership",
      });
    } catch (e) {
      console.error("결제 오류:", e);
    }
  };

  // 멤버십 목록 조회
  const getMembership = (page) => {
    myAxios(token, setToken)
      .get(
        "http://localhost:8080" +
          `/membershipList?username=${user.username}&page=${page}`
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setMembership(data.membershipList);
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

  // Timestamp 포멧팅
  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  // 오늘 날짜 계산
  const today = new Date();
  const startDate = today.toISOString().split("T")[0];

  const endDateObj = new Date(today);
  endDateObj.setDate(endDateObj.getDate() + 30);
  const endDate = endDateObj.toISOString().split("T")[0];

  useEffect(() => {
    user.username && getMembership(1);
  }, [user.username]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isSuccess = params.get("success");

    if (isSuccess === "true") {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 0);

      const timer = setTimeout(() => {
        setIsModalOpen(false);
        window.history.replaceState(
          {},
          document.title,
          "/expert/mypage/membership"
        );
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return membership.isActiveMembership ? (
    <div className="mypage-layout">
      <h1 className="mypage-title">내 멤버십</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <MembershipInfoCard type="short" />
        <div
          style={{
            display: "flex",
            width: "266px",
            height: "126px",
            padding: "30px",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
            borderRadius: "8px",
            border: "1px solid #EFF1F5",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          <p>
            멤버십 종료일{" "}
            <span style={{ marginLeft: "20px" }}>{membership.finishDate}</span>
          </p>
          <p>
            총 가입기간{" "}
            <span
              style={{
                marginLeft: "20px",
                color: "#FF5833",
                fontWeight: "500",
              }}
            >
              {membership.totalMembershipMonths}개월
            </span>
          </p>
        </div>
      </div>
      <div>
        <h3 className="mypage-sectionTitle">결제내역</h3>
        <table className="mypage-table">
          <thead style={{ borderTop: "none" }}>
            <tr>
              <td>결제일</td>
              <td>결제내역</td>
              <td>이용기간</td>
              <td>결제금액</td>
              <td>결제방법</td>
              <td>결제영수증</td>
            </tr>
          </thead>
          <tbody>
            {membership.payments.map((payment) => (
              <tr>
                <td style={{ fontWeight: "500" }}>
                  {formatDate(payment.paymentDate)}
                </td>
                <td>{payment.paymentName}</td>
                <td>
                  {payment.usagePeriodStart} - {payment.usagePeriodEnd}
                </td>
                <td>{Number(payment.amount).toLocaleString()}원</td>
                <td>{payment.paymentMethod}</td>
                <td>
                  <span
                    onClick={() => window.open(payment.receiptUrl, "_blank")}
                  >
                    영수증
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination className="my-pagination">
        {pageBtn.map((b) => (
          <PaginationItem key={b} active={b === pageInfo.curPage}>
            <PaginationLink
              onClick={() => {
                setMembership([]);
                getMembership(b);
              }}
            >
              {b}
            </PaginationLink>
          </PaginationItem>
        ))}
      </Pagination>

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
            <p>성공적으로 가입되었습니다!</p>
          </div>
        </ModalBody>
      </Modal>
    </div>
  ) : (
    <div className="mypage-layout">
      <h1 className="mypage-title">내 멤버십</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "44px",
        }}
      >
        <MembershipInfoCard type="default" />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "44px",
          }}
        >
          <div style={{ width: "100%" }}>
            <h3 className="mypage-sectionTitle">고객정보</h3>
            <div className="labelInput-wrapper">
              <label style={{ width: "100px" }}>이름</label>
              <p>{user.name}</p>
            </div>
            <div className="labelInput-wrapper">
              <label style={{ width: "100px" }}>휴대폰 번호</label>
              <p>{user.phone}</p>
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <h3 className="mypage-sectionTitle">결제정보</h3>
            <div className="labelInput-wrapper">
              <label style={{ width: "100px" }}>총 결제금액</label>
              <p>30,000</p>
            </div>
            <div className="labelInput-wrapper">
              <label style={{ width: "100px" }}>멤버십 시작일</label>
              <p>{startDate}</p>
            </div>
            <div className="labelInput-wrapper">
              <label style={{ width: "100px" }}>멤버십 종료일</label>
              <p>{endDate}</p>
            </div>
          </div>

          <button
            className="primary-button"
            style={{ width: "200px", height: "40px", fontSize: "14px" }}
            onClick={() => startMembershipPayment()}
          >
            멤버십 가입하기
          </button>
        </div>
      </div>
      <p
        style={{
          color: "#6A7685",
          fontSize: "12px",
          fontWeight: "400",
          lineHeight: "18px",
        }}
      >
        본 멤버십은 월 단위 자동 결제 방식으로 운영됩니다.
        <br />
        사용자는 언제든 해지할 수 있으며, 해지 시 다음 결제 주기부터 자동 결제가
        중단됩니다.
      </p>
    </div>
  );
}
