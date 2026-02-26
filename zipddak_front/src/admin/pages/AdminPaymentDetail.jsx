import { useState } from "react";
import "../css/AdminDetail.css";
import AdminSidebar from "./AdminNav";

export default function AdminPaymentDetail() {
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

    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}

            <div className="admin-detail-div">
                <div className="admin-detail-top-div">
                    <span className="font-18 medium">결제 내역</span>
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
                            <span className="font-18 bold admin-detail-profile-span">결제 정보</span>
                        </div>

                        {/* 프로필 테이블 */}
                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">회원 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>회원명</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>아이디</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>휴대전화</span>
                                        </td>
                                        <td>
                                            <span>{test.gender === "male" ? "남성" : "여성"}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">결제 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>결제 번호</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>결제 금액</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>결제 상태</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>결제 일시</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">환불 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>환불요청일</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>환불 사유</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>처리 상태</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>환불 금액</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
