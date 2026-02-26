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
                    <span className="font-18 medium">신고 내역</span>
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
                            <span className="font-18 bold admin-detail-profile-span">신고 정보</span>
                        </div>

                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">신고 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고번호</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 일자</span>
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
                                            <span>{test.gender === "male" ? "남성" : "여성"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 유형</span>
                                        </td>
                                        <td>
                                            <span>{test.gender === "male" ? "남성" : "여성"}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="admin-userList-switchId-modal-business-down font-14 semibold">글 보기</button>
                        </div>
                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">신고자 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고자</span>
                                        </td>
                                        <td>
                                            <span>{test.name}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">신고 대상 정보</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 대상</span>
                                        </td>
                                        <td>
                                            <span>{test.username}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 사유</span>
                                        </td>
                                        <td>
                                            <span>{test.userTel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 누적</span>
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
                                <span className="font-18 semibold">신고 이력(3)</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 일자</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>처리 상태</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 유형</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 일자</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>처리 상태</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 유형</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 일자</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>처리 상태</span>
                                        </td>
                                        <td className="admin-detail-tr-td">
                                            <span>신고 유형</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="admin-detail-last-table-div">
                            <div className="admin-detail-table-header-div">
                                <span className="font-18 semibold">신고 처리</span>
                            </div>
                            <table className="admin-detail-table">
                                <tbody>
                                    <tr>
                                        <td className="admin-detail-tr-td" style={{ width: "120px" }}>
                                            <span>처리 방법</span>
                                        </td>
                                        <td>
                                            <div className="admin-userList-report-radio-div">
                                                <div className="admin-userList-modal-radio-div-in">
                                                    <input className="admin-userList-modal-radio" type="radio" name="switch" id="report-return" />
                                                    <label htmlFor="report-return" className="font-14">
                                                        신고 반려
                                                    </label>
                                                </div>
                                                <div className="admin-userList-modal-radio-div-in">
                                                    <input className="admin-userList-modal-radio" type="radio" name="switch" id="report-chance" />
                                                    <label htmlFor="report-chance" className="font-14">
                                                        경고 조치
                                                    </label>
                                                </div>
                                                <div className="admin-userList-modal-radio-div-in">
                                                    <input className="admin-userList-modal-radio" type="radio" name="switch" id="report-stop" />
                                                    <label htmlFor="report-stop" className="font-14">
                                                        활동 정지
                                                    </label>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="admin-detail-tr-td">
                                            <span>처리 메모</span>
                                        </td>
                                        <td>
                                            <input className="admin-detail-report-comment-input font-14" type="text" placeholder="처리 코멘트" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="admin-detail-report-complate-button-div">
                        <button className="font-14 bold">처리 완료</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
