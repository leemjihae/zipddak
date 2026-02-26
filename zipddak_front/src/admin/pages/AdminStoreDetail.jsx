import { useState } from "react";
import "../css/AdminDetail.css";
import AdminSidebar from "./AdminNav";

export default function AdminExpertDetail() {
    const test = {
        logo: "/images/기본회원프로필.jpg",
        storeName: "길동이",
        ceoName: 1,
        items: ["벽지", "생활 용품"],
        tel: "도어 시공",
        businessNumber: "123-12-12345",
        bank: "국민",
        accountNumber: "000000-00-000000",
        introduction: "서울시 금천구",
    };

    const testTable1 = [
        {
            settlementId: 1,
            settlementPeriod: "홍길동",
            settlementAmount: "욕실 리모델링",
            startSettlement: "2025-11-00",
            endSettlement: "2025-11-00",
            settlementState: "2025-11-09",
        },
    ];

    const testTable2 = [
        {
            orderId: 1,
            orderCustomerName: "홍길동",
            orderProduct: "자재명",
            orderItemCount: 3,
            orderDate: "2025-11-09",
            orderAmount: 200000,
            orderState: "결제 완료",
        },
    ];

    const testTable3 = [
        {
            reportId: 1,
            reporterName: "홍길동",
            reportReason: "작업불만",
            reportDate: "2025-11-09",
            reportState: "완료",
        },
    ];

    const [selectBtn, setSelectBtn] = useState(1);

    const btnItems = [
        {
            btnId: 1,
            label: "정산 내역",
        },
        {
            btnId: 2,
            label: "주문 내역",
        },
        {
            btnId: 3,
            label: "신고 내역",
        },
    ];

    const columns =
        selectBtn === 1
            ? [
                  { label: "정산 번호", key: "settlementId" },
                  { label: "정산 기간", key: "settlementPeriod" },
                  { label: "정산 금액", key: "settlementAmount" },
                  { label: "정산 일자", key: "settlementDate" },
                  { label: "정산 상태", key: "settlementState" },
              ]
            : selectBtn === 2
            ? [
                  { label: "주문 번호", key: "orderId" },
                  { label: "주문 회원명", key: "orderCustomerName" },
                  { label: "주문 상품", key: "orderProduct" },
                  { label: "주문 일자", key: "orderDate" },
                  { label: "주문 금액", key: "orderAmount" },
                  { label: "주문 상태", key: "orderState" },
              ]
            : [
                  { label: "신고 번호", key: "reportId" },
                  { label: "신고자", key: "reporterName" },
                  { label: "신고 사유", key: "reportReason" },
                  { label: "신고일", key: "reportDate" },
                  { label: "처리 상태", key: "reportState" },
              ];

    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}

            <div className="admin-detail-div">
                <div className="admin-detail-top-div">
                    <span className="font-18 medium">회원 상세</span>
                </div>
                <div className="admin-detail-back-div">
                    <button className="admin-detail-back-button">
                        <i className="bi bi-arrow-left font-18"></i>
                        <span className="font-14 medium">목록</span>
                    </button>
                </div>

                {/* 상세 정보 div */}
                <div className="admin-detail-table-div">
                    <div className="admin-detail-table-second-div">
                        {/* 프로필 헤더 */}
                        <div className="admin-detail-profile-header">
                            <span className="font-18 bold admin-detail-profile-span">전문가 정보</span>
                        </div>

                        {/* 프로필 테이블 */}
                        <table className="admin-detail-table">
                            <tbody>
                                <tr>
                                    <td className="admin-detail-profileImg-td">
                                        <span className="font-14">업체 로고</span>
                                    </td>
                                    <td>
                                        <img className="admin-detail-user-profileImg" src={test.logo} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">상호명</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.storeName}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">대표자</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.ceoName}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">취급 품목</span>
                                    </td>
                                    <td>
                                        <div>
                                            {test.items.map((item) => (
                                                <span className="font-14">{item}, </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">휴대폰 번호</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.tel}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">사업자 번호</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.businessNumber}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">은행</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.bank}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">계좌번호</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.accountNumber}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td-intro">
                                        <span className="font-14">소개글</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.introduction}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* 아래 테이블 button div */}
                        <div className="admin-detail-under-tables">
                            <div className="admin-detail-under-table-buttons">
                                {btnItems.map((btn) => (
                                    <button onClick={() => setSelectBtn(btn.btnId)} className={selectBtn === btn.btnId ? "admin-detail-select-btn" : "admin-detail-default-btn"} key={btn.btnId}>
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="admin-detail-under-table-div">
                            <table className="admin-detail-under-table">
                                <thead>
                                    <tr>
                                        {columns.map((column) => (
                                            <td key={column.key}>
                                                <span className="font-14">{column.label}</span>
                                            </td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectBtn === 1
                                        ? testTable1.map((table) => (
                                              <tr key={table.settlementId}>
                                                  <td>
                                                      <span className="font-14">{table.settlementId}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.settlementPeriod}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.settlementAmount}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">
                                                          {table.startSettlement} ~ {table.endSettlement}
                                                      </span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.settlementState}</span>
                                                  </td>
                                              </tr>
                                          ))
                                        : selectBtn === 2
                                        ? testTable2.map((table) => (
                                              <tr key={table.orderId}>
                                                  <td>
                                                      <span className="font-14">{table.orderId}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.orderCustomerName}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">
                                                          {table.orderProduct} 외 {table.orderItemCount - 1}건
                                                      </span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.orderDate}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.orderAmount.toLocaleString()}원</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.orderState}</span>
                                                  </td>
                                              </tr>
                                          ))
                                        : testTable3.map((table) => (
                                              <tr key={table.reportId}>
                                                  <td>
                                                      <span className="font-14">{table.reportId}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.reporterName}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.reportReason}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.reportDate}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.reportState}</span>
                                                  </td>
                                              </tr>
                                          ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="admin-userList-paging-bar">
                            {/* 이전 버튼 */}
                            <button className="admin-userList-nextbutton">
                                <i className="bi bi-chevron-left"></i>
                                <span>이전</span>
                            </button>

                            {/* 페이지 가져와서 map 돌리기 */}
                            <div className="admin-userList-paging-button-div">
                                <button className="admin-userList-paging-curpage-button">1</button>
                                <button className="admin-userList-paging-button">2</button>
                                <button className="admin-userList-paging-button">3</button>
                            </div>

                            <button className="admin-userList-nextbutton">
                                <span>다음</span>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
