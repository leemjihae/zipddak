import { useState } from "react";
import "../css/AdminDetail.css";
import AdminSidebar from "./AdminNav";

export default function AdminSalesDetail() {
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
                    <span className="font-18 medium">판매 내역</span>
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
                            <span className="font-18 bold admin-detail-profile-span">판매 정보</span>
                        </div>

                        {/* 프로필 테이블 */}
                        <div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>주문번호</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>주문일자</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>주문 상태</span>
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
                                <span className="font-18 semibold">판매 업체 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>상호명</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>대표자</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>휴대폰 번호</span>
                                        </td>
                                        <td>
                                            <span>{test.gender === "male" ? "남성" : "여성"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>취급 품목</span>
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
                                <span className="font-18 semibold">구매자 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>대여자</span>
                                        </td>
                                        <td>
                                            <span>{test.name}</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>아이디</span>
                                        </td>
                                        <td>
                                            <span>{test.nickname}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>휴대폰 번호</span>
                                        </td>
                                        <td>
                                            <span>{test.username}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">주문 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody className="admin-detail-table-sales-detail-table">
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>상품 번호</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>업체명</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>상품이름</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>규격/색상</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>수량</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>합계 금액</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>상품 번호</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>업체명</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>상품이름</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>규격/색상</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>수량</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>합계 금액</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>상품 번호</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>업체명</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>상품이름</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>규격/색상</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>수량</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>합계 금액</span>
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
                                            <span>{test.username}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>결제 금액</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
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
                        <div className="admin-detail-last-table-div">
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">환불 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>환불 요청일</span>
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
                                            <span>처리상태</span>
                                        </td>
                                        <td>
                                            <span>{test.gender === "male" ? "남성" : "여성"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>환불 금액</span>
                                        </td>
                                        <td>
                                            <span>{test.gender === "male" ? "남성" : "여성"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>처리 일자</span>
                                        </td>
                                        <td>
                                            <span>{test.gender === "male" ? "남성" : "여성"}</span>
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
