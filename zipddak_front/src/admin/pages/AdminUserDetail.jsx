import { useState } from "react";
import "../css/AdminDetail.css";
import AdminSidebar from "./AdminNav";

export default function AdminUserDetail() {
    const test = {
        profileImg: "/images/기본회원프로필.jpg",
        name: "홍길동",
        nickname: "길동이",
        username: "hong123@naver.com",
        userTel: "010-0000-0000",
        birthDate: "2000-01-01",
        gender: "male",
    };

    const testTable1 = [
        {
            rentalNo: 1,
            productName: "공구 이름",
            provider: "홍길동",
            rentalDate: "2025-11-09",
            rentalPrice: 10000,
            rentalState: "결제 완료",
        },
    ];

    const testTable2 = [
        {
            orderNo: 1,
            storeName: "자재 업체",
            productName: "자재 명",
            productSize: "120x120x1200mm",
            productColor: "블랙",
            orderDate: "2025-11-09",
            orderPrice: 10000,
            orderState: "결제 상태",
        },
    ];

    const testTable3 = [
        {
            matchingNo: 1,
            expertName: "홍길동",
            service: "홍길동",
            matchingDate: "2025-11-09",
            totalPrice: 1000000,
            matchingState: "결제 완료",
        },
    ];

    const [selectBtn, setSelectBtn] = useState(1);

    const btnItems = [
        {
            btnId: 1,
            label: "대여 내역",
        },
        {
            btnId: 2,
            label: "구매 내역",
        },
        {
            btnId: 3,
            label: "전문가 매칭 내역",
        },
    ];

    const columns =
        selectBtn === 1
            ? [
                  { label: "대여번호", key: "rentalNo" },
                  { label: "공구명", key: "productName" },
                  { label: "빌려준 사람", key: "provider" },
                  { label: "대여 날짜", key: "rentalDate" },
                  { label: "결제 금액", key: "rentalPrice" },
                  { label: "결제 상태", key: "rentalState" },
              ]
            : selectBtn === 2
            ? [
                  { label: "자재 업체 명", key: "storeName" },
                  { label: "자재 상품 명", key: "productName" },
                  { label: "규격 / 색상", key: "sizeAndColor" },
                  { label: "구매 날짜", key: "orderDate" },
                  { label: "결제 금액", key: "orderPrice" },
                  { label: "결제 상태", key: "orderState" },
              ]
            : [
                  { label: "전문가명", key: "expertName" },
                  { label: "시공 분야", key: "service" },
                  { label: "작업 일자", key: "workDate" },
                  { label: "견적 금액", key: "estimateAmount" },
                  { label: "결제 상태", key: "paymentStatus" },
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
                            <span className="font-18 bold admin-detail-profile-span">회원 정보</span>
                        </div>

                        {/* 프로필 테이블 */}
                        <table className="admin-detail-table">
                            <tbody>
                                <tr>
                                    <td className="admin-detail-profileImg-td">
                                        <span>프로필 이미지</span>
                                    </td>
                                    <td>
                                        <img className="admin-detail-user-profileImg" src={test.profileImg} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span>이름</span>
                                    </td>
                                    <td>
                                        <span>{test.name}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span>닉네임</span>
                                    </td>
                                    <td>
                                        <span>{test.nickname}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span>아이디</span>
                                    </td>
                                    <td>
                                        <span>{test.username}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span>휴대폰 번호</span>
                                    </td>
                                    <td>
                                        <span>{test.userTel}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span>생년월일</span>
                                    </td>
                                    <td>
                                        <span>{test.birthDate}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span>성별</span>
                                    </td>
                                    <td>
                                        <span>{test.gender === "male" ? "남성" : "여성"}</span>
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
                                                <span>{column.label}</span>
                                            </td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectBtn === 1
                                        ? testTable1.map((table) => (
                                              <tr key={table.rentalNo}>
                                                  <td>
                                                      <span>{table.rentalNo}</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.productName}</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.provider}</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.rentalDate}</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.rentalPrice.toLocaleString()}원</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.rentalState}</span>
                                                  </td>
                                              </tr>
                                          ))
                                        : selectBtn === 2
                                        ? testTable2.map((table) => (
                                              <tr key={table.rentalNo}>
                                                  <td>
                                                      <span>{table.storeName}</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.productName}</span>
                                                  </td>
                                                  <td>
                                                      <div className="admin-detail-second-table-td-div">
                                                          <span>{table.productSize}</span>
                                                          <span>{table.productColor}</span>
                                                      </div>
                                                  </td>
                                                  <td>{table.orderDate}</td>
                                                  <td>
                                                      <span>{table.orderPrice.toLocaleString()}원</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.orderState}</span>
                                                  </td>
                                              </tr>
                                          ))
                                        : testTable3.map((table) => (
                                              <tr key={table.matchingNo}>
                                                  <td>
                                                      <span>{table.expertName}</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.service}</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.matchingDate}</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.totalPrice.toLocaleString()}원</span>
                                                  </td>
                                                  <td>
                                                      <span>{table.matchingState}</span>
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
