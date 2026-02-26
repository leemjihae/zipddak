import { useState, useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { deliveryGroupsAtom } from "./orderAtoms";
import DeliveryButton from "./DeliveryButton";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";

export default function MarketReturns() {
    const [orders, setOrders] = useState([]);
    const [pageBtn, setPageBtn] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        allPage: 0,
        curPage: 1,
        endPage: 0,
        startPage: 1,
    });
    const [selectDate, setSelectDate] = useState({
        startDate: null,
        endDate: null,
    });

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const setDeliveryGroups = useSetAtom(deliveryGroupsAtom);

    const navigate = useNavigate();

    // 취소교환반품 목록 조회
    const getOrders = (page, startDate, endDate) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/market/returnList?username=${user.username}&page=${page}&startDate=${startDate}&endDate=${endDate}`)
            .then((res) => {
                console.log(res.data);
                return res.data;
            })
            .then((data) => {
                setOrders(data.orderListDtoList);
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

    useEffect(() => {
        if (!user || !token) return;

        getOrders(1, selectDate.startDate, selectDate.endDate);
    }, [user, token]);

    return (
        <div className="mypage-layout">
            <h1 className="mypage-title">취소·교환·반품 내역</h1>
            <div>
                {/* 날짜 선택 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        margin: "30px 0 14px 0",
                    }}
                >
                    <Input
                        type="date"
                        bsSize="sm"
                        style={{ width: "140px", height: "32px" }}
                        onChange={(e) => {
                            setSelectDate({ ...selectDate, startDate: e.target.value });
                            getOrders(pageInfo.curPage, e.target.value, selectDate.endDate);
                        }}
                    ></Input>{" "}
                    -{" "}
                    <Input
                        type="date"
                        bsSize="sm"
                        style={{ width: "140px", height: "32px" }}
                        onChange={(e) => {
                            setSelectDate({ ...selectDate, endDate: e.target.value });
                            getOrders(pageInfo.curPage, selectDate.startDate, e.target.value);
                        }}
                    ></Input>
                </div>

                <table className="mypage-table">
                    <thead>
                        <tr>
                            <td>상품정보</td>
                            <td width="80px">수량</td>
                            <td width="140px">결제금액</td>
                            <td width="168px">주문상태</td>
                            <td width="140px">배송비</td>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <>
                                {/* 주문번호 한 줄 */}
                                <tr style={{ borderTop: "1px solid rgba(0, 0, 0, 0.60)" }}>
                                    <td colSpan={6} style={{ height: "66px" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                <p>
                                                    주문번호{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {order.orderCode}
                                                    </span>
                                                </p>
                                                <p>
                                                    주문일자{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {order.orderDate}
                                                    </span>
                                                </p>
                                            </div>
                                            <p
                                                style={{
                                                    fontWeight: "400",
                                                    alignItems: "center",
                                                    display: "flex",
                                                    paddingLeft: "6px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    setDeliveryGroups(order.deliveryGroups);
                                                    window.scrollTo(0, 0);
                                                    navigate(`/zipddak/mypage/market/detail/${order.orderIdx}?type=return`);
                                                }}
                                            >
                                                주문상세
                                                <i className="bi bi-chevron-right" style={{ fontSize: "13px" }}></i>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                {order.deliveryGroups.map((group, gidx) => (
                                    <>
                                        {group.orderItems.map((item, idx) => (
                                            <tr
                                                style={
                                                    gidx === order.deliveryGroups.length - 1 && idx === group.orderItems.length - 1
                                                        ? { borderBottom: "1px solid rgba(0, 0, 0, 0.60)" }
                                                        : idx === group.orderItems.length - 1
                                                        ? {}
                                                        : { borderBottom: "none" }
                                                }
                                            >
                                                <td>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "10px",
                                                            paddingLeft: "10px",
                                                        }}
                                                    >
                                                        <img src={`${baseUrl}/imageView?type=product&filename=${item.thumbnail}`} width="80px" height="80px" />
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "flex-start",
                                                                textAlign: "left",
                                                                gap: "4px",
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
                                                                    fontSize: "13px",
                                                                    color: "#6A7685",
                                                                }}
                                                            >
                                                                {item.optionName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td style={{ fontWeight: "500" }}>{Number(item.price * item.quantity).toLocaleString()}원</td>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontWeight: "600",
                                                                fontSize: "16px",
                                                            }}
                                                        >
                                                            {item.orderStatus}
                                                        </p>
                                                        {(item.orderStatus === "교환회수" || item.orderStatus === "교환발송" || item.orderStatus === "반품회수") && (
                                                            <DeliveryButton tCode={item.postComp} invoice={item.trackingNo} />
                                                        )}
                                                    </div>
                                                </td>
                                                {idx === 0 && (
                                                    <td
                                                        rowSpan={group.orderItems.length}
                                                        style={{
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {group.deliveryType !== "pickup" ? (
                                                            group.appliedDeliveryFee !== 0 ? (
                                                                <p
                                                                    style={{
                                                                        fontWeight: "600",
                                                                    }}
                                                                >
                                                                    {Number(group.appliedDeliveryFee).toLocaleString()}원
                                                                </p>
                                                            ) : (
                                                                <p
                                                                    style={{
                                                                        fontWeight: "600",
                                                                    }}
                                                                >
                                                                    무료배송
                                                                </p>
                                                            )
                                                        ) : (
                                                            <p
                                                                style={{
                                                                    fontWeight: "600",
                                                                }}
                                                            >
                                                                직접픽업
                                                            </p>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </>
                                ))}
                                {/* <div style={{ height: "20px" }} /> */}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination className="my-pagination">
                {pageBtn.map((b) => (
                    <PaginationItem key={b} active={b === pageInfo.curPage}>
                        <PaginationLink onClick={() => getOrders(b, selectDate.startDate, selectDate.endDate)}>{b}</PaginationLink>
                    </PaginationItem>
                ))}
            </Pagination>
        </div>
    );
}
