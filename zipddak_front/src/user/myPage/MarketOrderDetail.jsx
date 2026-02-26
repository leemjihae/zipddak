import { useState, useEffect } from "react";
import { useAtomValue, useAtom } from "jotai";
import { tokenAtom } from "../../atoms";
import { deliveryGroupsAtom } from "./orderAtoms";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { baseUrl, myAxios } from "../../config";

export default function MarketOrderDetail() {
    const { orderIdx } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");

    const [orderDetail, setOrderDetail] = useState(null);

    const deliveryGroups = useAtomValue(deliveryGroupsAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const navigate = useNavigate();

    // 주문 상세 조회
    const getOrderDetail = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/market/detail?orderIdx=${orderIdx}`)
            .then((res) => {
                console.log(res.data);
                setOrderDetail(res.data.orderDetail);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getOrderDetail();
    }, []);

    if (!orderDetail || deliveryGroups.length === 0) {
        return <div className="mypage-layout">로딩 중...</div>;
    }

    return (
        <div className="mypage-layout">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "20px",
                }}
            >
                <h1 className="mypage-title">주문상세</h1>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        fontWeight: "500",
                        fontSize: "15px",
                    }}
                >
                    <p>
                        주문번호{" "}
                        <span
                            style={{
                                fontWeight: "600",
                            }}
                        >
                            {orderDetail.orderCode}
                        </span>
                    </p>
                    <p>
                        주문일자{" "}
                        <span
                            style={{
                                fontWeight: "600",
                            }}
                        >
                            {orderDetail.orderDate}
                        </span>
                    </p>
                </div>
            </div>
            {/* 주문상품 정보 섹션 */}
            <div>
                <h3 className="mypage-sectionTitle">주문상품정보</h3>
                <table className="mypage-table" style={{ width: "100%" }}>
                    <thead style={{ borderTop: "none" }}>
                        <tr>
                            <td>상품정보</td>
                            <td width="70px">수량</td>
                            <td width="110px">상품금액</td>
                            <td width="110px">결제금액</td>
                            <td width="120px">주문상태</td>
                            <td width="140px">배송비</td>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryGroups?.map((group, gidx) => (
                            <>
                                {group.orderItems.map((item, idx) => (
                                    <tr
                                        style={
                                            gidx === deliveryGroups.length - 1 && idx === group.orderItems.length - 1
                                                ? { borderBottom: "1px solid rgba(0, 0, 0, 0.60)" }
                                                : idx === group.orderItems.length - 1
                                                ? {}
                                                : { borderBottom: "none" }
                                        }
                                        key={item.orderItemIdx}
                                    >
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <img src={`${baseUrl}/imageView?type=product&filename=${item.thumbnail}`} width="80px" height="80px" />
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "flex-start",
                                                        gap: "4px",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            fontSize: "13px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {group.brandName}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {item.productName}
                                                    </p>
                                                    <p
                                                        style={{
                                                            color: "#6A7685",
                                                        }}
                                                    >
                                                        {item.optionName}
                                                    </p>
                                                </div>
                                            </div>
                                            {item.exchangeOption && (
                                                <p
                                                    style={{
                                                        textAlign: "left",
                                                        padding: "3px 6px",
                                                        margin: "6px 0 0 90px",
                                                        width: "fit-content",
                                                        borderRadius: "4px",
                                                        fontSize: "13px",
                                                        border: "1px solid rgba(255, 88, 51, 0.50)",
                                                        background: "rgba(255, 88, 51, 0.03)",
                                                    }}
                                                >
                                                    교환희망옵션 - {item.exchangeOption}
                                                </p>
                                            )}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>{Number(item.price).toLocaleString()}원</td>
                                        <td>
                                            <p style={{ fontWeight: "500" }}>{Number(item.price * item.quantity).toLocaleString()}원</p>
                                        </td>
                                        <td>
                                            <p
                                                style={{
                                                    fontWeight: "600",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                {item.orderStatus}
                                            </p>
                                        </td>
                                        {idx === 0 && (
                                            <td rowSpan={group.orderItems.length} style={{ fontWeight: "500" }}>
                                                {group.deliveryType !== "pickup" ? (
                                                    group.appliedDeliveryFee !== 0 ? (
                                                        <p style={{ fontWeight: "600" }}>{Number(group.appliedDeliveryFee).toLocaleString()}원</p>
                                                    ) : group.deliveryFeeType === "bundle" ? (
                                                        <p style={{ fontWeight: "600" }}>무료배송</p>
                                                    ) : (
                                                        <p style={{ fontWeight: "600" }}>{(group.deliveryFeePrice * item.quantity).toLocaleString()}원</p>
                                                    )
                                                ) : (
                                                    <p style={{ fontWeight: "600" }}>직접픽업</p>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* 결제정보 섹션 */}
            <div>
                <h3 className="mypage-sectionTitle">결제정보</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>총 상품금액</label>
                    <p style={{ fontWeight: "600" }}>{Number(orderDetail.totalProductPrice).toLocaleString()}원</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>배송비</label>
                    <p>{Number(orderDetail.totalDeliveryFee).toLocaleString()}원</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>결제금액</label>
                    <p style={{ fontWeight: "600", color: "#FF5833" }}>{Number(orderDetail.totalPaymentPrice).toLocaleString()}원</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>결제방법</label>
                    <p>{orderDetail.paymentMethod}</p>
                </div>
            </div>
            {/* 환불정보 섹션(취소) */}
            {orderDetail.CancelInfo && (
                <div>
                    <h3 className="mypage-sectionTitle">취소정보</h3>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>총 상품금액</label>
                        <p style={{ fontWeight: "600" }}>{Number(orderDetail.totalProductPrice).toLocaleString()}원</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>환불금액</label>
                        <p style={{ fontWeight: "600", color: "#FF5833" }}>{Number(orderDetail.CancelInfo?.cancelAmount).toLocaleString()}원</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>취소일자</label>
                        <p>{orderDetail.CancelInfo?.cancelDate}</p>
                    </div>
                </div>
            )}
            {/* 환불정보 섹션(반품) */}
            {orderDetail.RefundInfo && (
                <div>
                    <h3 className="mypage-sectionTitle">반품정보</h3>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>총 상품금액</label>
                        <p style={{ fontWeight: "600" }}>{Number(orderDetail.totalProductPrice).toLocaleString()}원</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>차감금액</label>
                        <p>{Number(orderDetail.RefundInfo?.returnShippingFee).toLocaleString()}원</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>환불금액</label>
                        <p style={{ fontWeight: "600", color: "#FF5833" }}>{Number(orderDetail.RefundInfo?.refundAmount).toLocaleString()}원</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>반품일자</label>
                        <p>{orderDetail.RefundInfo?.refundDate}</p>
                    </div>
                </div>
            )}
            {/* 교환정보 섹션 */}
            {orderDetail.ExchangeInfo && (
                <div>
                    <h3 className="mypage-sectionTitle">교환정보</h3>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>배송비부담주체</label>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginLeft: "12px",
                            }}
                        >
                            <div className="mypage-radio">
                                <input id="shippingPayer" type="radio" name="shippingPayer" checked={orderDetail.ExchangeInfo?.shippingChargeType === "SELLER"} disabled />
                                <laebl for="shippingPayer">판매자</laebl>
                            </div>
                            <div className="mypage-radio">
                                <input id="shippingPayer" type="radio" name="shippingPayer" checked={orderDetail.ExchangeInfo?.shippingChargeType === "BUYER"} disabled />
                                <laebl for="shippingPayer">구매자</laebl>
                            </div>
                        </div>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>왕복배송비</label>
                        <p style={{ fontWeight: "600" }}>{Number(orderDetail.ExchangeInfo?.roundShippingFee).toLocaleString()}원</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>교환일자</label>
                        <p>{orderDetail.ExchangeInfo?.exchangeDate}</p>
                    </div>
                </div>
            )}
            {/* 주문자정보 + 배송지정보 섹션 */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "30px",
                }}
            >
                <div style={{ flex: 1 }}>
                    <h3 className="mypage-sectionTitle">주문자 정보</h3>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>주문자</label>
                        <p>{orderDetail.ordererName}</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>휴대폰 번호</label>
                        <p>{orderDetail.ordererPhone}</p>
                    </div>
                </div>
                <div style={{ flex: 2 }}>
                    <h3 className="mypage-sectionTitle">배송지 정보</h3>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>받는 사람</label>
                        <p>{orderDetail.receiverName}</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>휴대폰 번호</label>
                        <p>{orderDetail.receiverPhone}</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>주소</label>
                        <p>
                            {orderDetail.postCode} {orderDetail.address1} {orderDetail.address2}
                        </p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>배송요청사항</label>
                        <p>{orderDetail.deliveryMessage}</p>
                    </div>
                </div>
            </div>

            {/* 회수지정보 섹션 */}
            {orderDetail.ExchangeInfo && (
                <div>
                    <h3 className="mypage-sectionTitle">회수지 정보</h3>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>받는 사람</label>
                        <p>{orderDetail.ExchangeInfo?.reshipName}</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>휴대폰 번호</label>
                        <p>{orderDetail.ExchangeInfo?.reshipPhone}</p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>주소</label>
                        <p>
                            {orderDetail.ExchangeInfo?.reshipZipcode} {orderDetail.ExchangeInfo?.reshipAddr1} {orderDetail.ExchangeInfo?.reshipAddr2}
                        </p>
                    </div>
                    <div className="labelInput-wrapper">
                        <label style={{ width: "150px" }}>배송요청사항</label>
                        <p>{orderDetail.ExchangeInfo?.reshipPostMemo}</p>
                    </div>
                </div>
            )}

            {/* 수거방법 섹션 */}
            {(orderDetail.ReturnInfo || orderDetail.ExchangeInfo) && (
                <div>
                    <h3 className="mypage-sectionTitle">수거방법</h3>
                    <div
                        style={{
                            display: "flex",
                            padding: "20px 0",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "20px",
                            fontSize: "14px",
                        }}
                    >
                        <p
                            style={{
                                fontWeight: "500",
                            }}
                        >
                            판매자 지정택배에서 수거합니다.
                        </p>
                        <p
                            style={{
                                lineHeight: "18px",
                            }}
                        >
                            택배사에 직접 연락하지 않아도 영업일 기준
                            <br />
                            3일 이내에 방문 합니다.
                        </p>
                        <p
                            style={{
                                color: "#375FFF",
                            }}
                        >
                            방문 택배사 : CJ대한통운
                        </p>
                    </div>
                </div>
            )}
            {/* 목록 버튼 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                    className="secondary-button"
                    style={{ width: "200px", height: "40px", fontSize: "14px" }}
                    onClick={() => {
                        type == "order" ? navigate("/zipddak/mypage/market/orders") : navigate("/zipddak/mypage/market/returns");
                    }}
                >
                    목록
                </button>
            </div>
        </div>
    );
}
