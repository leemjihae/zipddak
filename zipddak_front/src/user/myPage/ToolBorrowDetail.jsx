import { Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom, tokenAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";
import { useParams } from "react-router";

export default function ToolBorrowDetail() {
    const navigate = useNavigate();
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const { rentalIdx } = useParams();

    const [payment, setPayment] = useState({});
    const [rental, setRental] = useState({});
    const [tool, setTool] = useState({});

    useEffect(() => {
        if (!token || !user) return;

        myAxios(token, setToken)
            .get(`${baseUrl}/user/mypage/rentals/borrow?username=${user.username}&rentalIdx=${rentalIdx}`)
            .then((res) => {
                console.log(res.data);
                setPayment(res.data.payment);
                setRental(res.data.rental);
                setTool(res.data.tool);
            });
    }, [token, user]);

    return (
        <>
            <div className="myPage-rentalDetail-container">
                <div className="mypage-layout">
                    <h1 className="mypage-title">빌린 공구</h1>
                    <button
                        onClick={() => navigate("/zipddak/mypage/tools/rentals")}
                        style={{ padding: "0", width: "80px", height: "30px", display: "flex", alignItems: "center", border: "none", backgroundColor: "transparent" }}
                    >
                        <i style={{ fontSize: "30px" }} class="bi bi-arrow-left-short"></i>목록
                    </button>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div
                            style={{
                                width: "52px",
                                height: "20px",
                                border: "1px solid #FF5833",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "8px",
                                backgroundColor: "#FFF6F4",
                            }}
                        >
                            <span style={{ color: "#FF5833", fontSize: "12px", fontWeight: "500" }}>
                                {rental.state === "PAYED" ? "결제완료" : rental.state === "DELIVERY" ? "배송중" : rental.state === "RENTAL" ? "대여중" : "반납완료"}
                            </span>
                        </div>
                        <span style={{ fontSize: "15px", fontWeight: "500" }}>결제일자 {payment?.appAt?.split("T")[0]}</span>
                    </div>
                </div>

                {/* 내 요청내용 div */}
                <div>
                    <span style={{ fontSize: "16px", fontWeight: "600" }} className="font-18 semibold">
                        공구 정보
                    </span>
                    <div>
                        <a href="#" className="tool-h">
                            <div className="tool-image-h">
                                <img src={`${baseUrl}/imageView?type=tool&filename=${tool.toolImg}`} alt="" />
                            </div>

                            <div className="tool-info-h">
                                <div className="tool-name-h">{tool.toolName}</div>
                                <span className="tool-address-h">{tool.addr1 + " " + tool.addr2}</span>
                                <div>
                                    <span className="oneday-h">1일</span>
                                    <span className="rental-price-h">{tool.oneDayAmount?.toLocaleString()}원</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="expertOrder-table-div">
                    {/* 내 요청내용 div */}
                    <div>
                        <span style={{ fontSize: "16px", fontWeight: "600" }} className="font-18 semibold">
                            반납지 정보
                        </span>
                        <table className="margin-top-20 expertOrder-table">
                            <tbody>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">받는사람</span>
                                    </td>
                                    {/* 작업 유형 */}
                                    <td>
                                        <span className="font-14">{tool.ownerName}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">휴대폰 번호</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{tool?.ownerPhone?.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">주소</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{tool.addr1 + " " + tool.addr2}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="expertOrder-table-div">
                    {/* 내 요청내용 div */}
                    <div>
                        <span style={{ fontSize: "16px", fontWeight: "600" }} className="font-18 semibold">
                            결제 정보
                        </span>
                        <table style={{ width: "904px" }} className="margin-top-20 expertOrder-table">
                            <tbody>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">대여기간</span>
                                    </td>
                                    {/* 작업 유형 */}
                                    <td>
                                        <span className="font-14">{rental.startDate + " - " + rental.endDate}</span>
                                        <span style={{ marginLeft: "10px" }} className="oneday-h">
                                            {rental.dateDiff + 1}일
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">거래방식</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{rental.directRental ? "직거래" : rental.postRental ? "택배거래" : ""}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">대여금액</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{(tool.oneDayAmount * (rental.dateDiff + 1))?.toLocaleString()}원</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">배송비</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{rental.postCharge?.toLocaleString()}원</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">결제방식</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{payment.method}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">총 결제금액</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{payment.totalAmount?.toLocaleString()}원</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="expertOrder-table-div">
                    {/* 내 요청내용 div */}
                    <div>
                        <span style={{ fontSize: "16px", fontWeight: "600" }} className="font-18 semibold">
                            배송지 정보
                        </span>
                        <table className="margin-top-20 expertOrder-table">
                            <tbody>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">받는사람</span>
                                    </td>
                                    {/* 작업 유형 */}
                                    <td>
                                        <span className="font-14">{rental.recvName}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">휴대폰 번호</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{rental?.recvPhone?.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="expertOrder-trtd">
                                        <span className="font-14">주소</span>
                                    </td>
                                    {/* 희망 일정 */}
                                    <td>
                                        <span className="font-14">{rental.addr1 + " " + rental.addr2}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
