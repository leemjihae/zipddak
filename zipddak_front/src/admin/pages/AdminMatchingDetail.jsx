import { useState } from "react";
import "../css/AdminDetail.css";
import AdminSidebar from "./AdminNav";

export default function AdminMathcinDetail() {
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
            <AdminSidebar />

            <div className="admin-detail-div">
                <div className="admin-detail-top-div">
                    <span className="font-18 medium">매칭 내역</span>
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
                            <span className="font-18 bold admin-detail-profile-span">매칭 정보</span>
                        </div>

                        <table className="admin-detail-table">
                            <tbody>
                                <tr>
                                    <td className="admin-detail-tr-td">
                                        <span>작업 일자</span>
                                    </td>
                                    <td>
                                        <span>{test.name}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* 프로필 테이블 */}
                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">회원 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>이름</span>
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
                                            <span>휴대폰 번호</span>
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
                                <span className="font-18 semibold">전문가 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>활동명</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>대표 카테고리</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>활동지역</span>
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
                                <span className="font-18 semibold">요청 내용</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>작업 유형</span>
                                        </td>
                                        <td>
                                            <span>{test.name}</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>희망 작업 일정</span>
                                        </td>
                                        <td>
                                            <span>{test.nickname}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>예산</span>
                                        </td>
                                        <td>
                                            <span>{test.username}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>시공 장소</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>추가 요청사항</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">견적 금액 상세</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>타일</span>
                                        </td>
                                        <td>
                                            <span>{test.username}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>시공비 합계</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>총 견적 금액</span>
                                        </td>
                                        <td>
                                            <span>{test.birthDate}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="admin-detail-table-matching-textarea">추가 설명이 들어갑니다.</div>
                        </div>
                        <div className="admin-detail-last-table-div">
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">결제 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>총 결제 금액</span>
                                        </td>
                                        <td>
                                            <span className="font-14 semibold" style={{ color: "#E0624F" }}>
                                                {test.username}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>결제 방법</span>
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
                                            <span>결제 일자</span>
                                        </td>
                                        <td>
                                            <span>{test.gender === "male" ? "남성" : "여성"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>취소 일자</span>
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
