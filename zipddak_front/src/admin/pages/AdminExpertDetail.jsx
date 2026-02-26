import { useState } from "react";

import "../css/AdminDetail.css";
import AdminSidebar from "./AdminNav";

export default function AdminExpertDetail() {
    const test = {
        profileImg: "/images/기본회원프로필.jpg",
        nickname: "길동이",
        expertState: 1,
        membership: "가입",
        category: "도어 시공",
        service: ["바닥 시공", "도어 시공"],
        businessNumber: "123-12-12345",
        bank: "국민",
        accountNumber: "000000-00-000000",
        serviceArea: "서울시 금천구",
        employeeCount: 6,
    };

    const testTable1 = [
        {
            matchingNo: 1,
            customerName: "홍길동",
            constructionContent: "욕실 리모델링",
            contractDate: "2025-11-09",
            startWorkDate: "2025-11-09",
            endWorkDate: "2025-11-09",
            workState: "작업 완료",
        },
    ];

    const testTable2 = [
        {
            settlementId: 1234,
            salesAmount: 22000000,
            commission: 5,
            settlementAmount: 22000000,
            settlementState: "정산 완료",
            settlementDate: "2025-11-09",
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
            label: "작업 내역",
        },
        {
            btnId: 2,
            label: "정산 내역",
        },
        {
            btnId: 3,
            label: "신고 내역",
        },
    ];

    const columns =
        selectBtn === 1
            ? [
                  { label: "고객명", key: "customerName" },
                  { label: "시공 내용", key: "constructionContent" },
                  { label: "계약 일자", key: "contractDate" },
                  { label: "작업 기간", key: "workDuration" },
                  { label: "작업 상태", key: "workState" },
              ]
            : selectBtn === 2
            ? [
                  { label: "정산 번호", key: "settlementId" },
                  { label: "매출 금액", key: "salesAmount" },
                  { label: "수수료", key: "commission" },
                  { label: "정산 금액", key: "settlementAmount" },
                  { label: "정산 상태", key: "settlementState" },
                  { label: "정산 일자", key: "settlementDate" },
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
                                        <span className="font-14">프로필 이미지</span>
                                    </td>
                                    <td>
                                        <img className="admin-detail-user-profileImg" src={test.profileImg} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">활동명</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.nickname}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">활동상태</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.expertState}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">멤버십 가입 유무</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.membership}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">대표 카테고리</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.category}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">제공서비스</span>
                                    </td>
                                    <td>
                                        <div className="admin-detail-expert-service">
                                            {test.service.map((service) => (
                                                <div className="admin-detail-expert-service-badge font-14">{service}</div>
                                            ))}
                                        </div>
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
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">활동지역</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.serviceArea}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span className="font-14">직원수</span>
                                    </td>
                                    <td>
                                        <span className="font-14">{test.employeeCount}</span>
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
                                              <tr key={table.matchingNo}>
                                                  <td>
                                                      <span className="font-14">{table.customerName}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.constructionContent}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.contractDate}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">
                                                          {table.startWorkDate} ~ {table.endWorkDate}
                                                      </span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.workState}</span>
                                                  </td>
                                              </tr>
                                          ))
                                        : selectBtn === 2
                                        ? testTable2.map((table) => (
                                              <tr key={table.settlementId}>
                                                  <td>
                                                      <span className="font-14">{table.settlementId}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.salesAmount.toLocaleString()}원</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.commission}%</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.settlementAmount.toLocaleString()}원</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.settlementState}</span>
                                                  </td>
                                                  <td>
                                                      <span className="font-14">{table.settlementDate}</span>
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
