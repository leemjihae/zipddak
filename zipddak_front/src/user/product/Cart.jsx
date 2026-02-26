import React, { useEffect, useState } from "react";
import "../css/Cart.css";
import axios from "axios";
import { baseUrl, myAxios } from "../../config";
import { orderListAtom } from "./productAtom";
import { useNavigate } from "react-router";
import { Modal } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";

export default function Cart() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [checkedItems, setCheckedItems] = useState({});
    const [groupedCart, setGroupedCart] = useState([]);
    const [orderList, setOrderList] = useAtom(orderListAtom);

    const handleCheck = (cartNo) => {
        setCheckedItems((prev) => ({
            ...prev,
            [cartNo]: !prev[cartNo], // 토글
        }));
    };

    const checkedCount = Object.values(checkedItems).filter((v) => v).length;

    useEffect(() => {
        if (!token) return;

        myAxios(token, setToken)
            .get(`${baseUrl}/user/cartList?page=1&username=${user.username}`)
            .then((res) => {
                console.log(res.data);
                setGroupedCart(res.data);

                setOrderList([]);
            });
    }, [token]);

    // 선택 상품 삭제
    const cartDeleteProducts = () => {
        setGroupedCart((prev) => {
            // 1. 각 store에서 선택된 product 제거
            const updated = prev
                .map((store) => ({
                    ...store,
                    productList: store.productList.filter((product) => !checkedItems[product.cartIdx]),
                }))
                // 2. productList가 비어 있으면 그 store 자체도 제거
                .filter((store) => store.productList.length > 0);

            return updated; // ⭐ 반드시 return 해야 state가 업데이트됨!
        });

        myAxios(token, setToken)
            .post(`${baseUrl}/user/cartList/delete`, {
                cartIdxs: Object.keys(checkedItems).map(Number),
            })
            .then((res) => {
                console.log(res.data);
            });
    };

    const calculateCheckedTotal = () => {
        let totalPrice = 0;
        let totalShippingFee = 0;

        groupedCart.forEach((store) => {
            const shippingGroups = store.productList.reduce((acc, product) => {
                if (!acc[product.postType]) acc[product.postType] = [];
                acc[product.postType].push(product);
                return acc;
            }, {});

            Object.values(shippingGroups).forEach((products) => {
                const isBundleGroup = products[0].postType === "bundle";

                if (!isBundleGroup) {
                    // ★ 개별배송
                    products.forEach((product) => {
                        console.log(product);
                        if (checkedItems[product.cartIdx]) {
                            const salePrice = Number(product.productSalePrice ?? 0);
                            const normalPrice = Number(product.productPrice ?? product.price ?? 0);
                            const option = Number(product.optionPrice ?? 0);

                            const basePrice = salePrice > 0 ? salePrice + option : normalPrice + option;

                            totalPrice += basePrice * Number(product.quantity ?? 1);
                            totalShippingFee += Number(product.postCharge ?? 0) * Number(product.quantity ?? 1);
                        }
                    });
                } else {
                    // ★ 묶음배송
                    let bundleCheckedAmount = 0;
                    let hasChecked = false;

                    products.forEach((product) => {
                        if (checkedItems[product.cartIdx]) {
                            hasChecked = true;

                            const salePrice = Number(product.productSalePrice ?? 0);
                            const normalPrice = Number(product.productPrice ?? product.price ?? 0);
                            const option = Number(product.optionPrice ?? 0);

                            const basePrice = salePrice > 0 ? salePrice + option : normalPrice + option;
                            const quantity = Number(product.quantity ?? 1);

                            // 전체 상품 금액 합산
                            const itemTotal = basePrice * quantity;

                            totalPrice += itemTotal;
                            bundleCheckedAmount += itemTotal;
                        }
                    });

                    if (!hasChecked) return;

                    // 무료배송 조건 체크
                    if (bundleCheckedAmount < store.freeChargeAmount) {
                        totalShippingFee += store.basicPostCharge;
                    }
                }
            });
        });

        return { totalPrice, totalShippingFee };
    };

    const { totalPrice, totalShippingFee } = calculateCheckedTotal();

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        const newCheckedItems = {};
        const newOrderList = [];

        // cart 상태를 기준으로 모든 cartNo 가져오기
        groupedCart.forEach((store) => {
            store.productList.forEach((product) => {
                newCheckedItems[product.cartIdx] = isChecked;

                // 모두선택 ON일 때만 orderList 채움
                if (isChecked) {
                    newOrderList.push({
                        productId: product.productIdx,
                        optionId: product.optionIdx,
                        name: product.optionName,
                        value: product.optionValue,
                        price: product.productSalePrice ? product.optionPrice + product.productSalePrice : product.optionPrice + product.productPrice,
                        count: product.quantity,
                    });
                }
            });
        });

        setCheckedItems(newCheckedItems);

        if (isChecked) {
            // 모두 선택 → 전체로 초기화
            setOrderList(newOrderList);
        } else {
            // 모두 해제 → 전체 비우기
            setOrderList([]);
        }
    };

    const increaseCount = (cartIdx, productIdx, optionIdx) => {
        // 1. groupedCart 업데이트
        setGroupedCart((prev) =>
            prev.map((store) => ({
                ...store,
                productList: store.productList.map((product) => (product.cartIdx === cartIdx ? { ...product, quantity: product.quantity + 1 } : product)),
            }))
        );
        // 2. orderListAtom 업데이트
        setOrderList((prev) => prev.map((order) => (order.productId === productIdx && order.optionId === optionIdx ? { ...order, count: order.count + 1 } : order)));

        // 3. DB에 카트 수량 증가 요청
        myAxios(token, setToken).post(`${baseUrl}/user/cartList/increaseCount`, {
            cartIdx,
        });
    };

    const decreaseCount = (cartIdx, productIdx, optionIdx) => {
        // 1. groupedCart 업데이트
        setGroupedCart((prev) =>
            prev
                .map((store) => ({
                    ...store,
                    productList: store.productList.map((product) => (product.cartIdx === cartIdx ? { ...product, quantity: product.quantity - 1 } : product)).filter((product) => product.quantity > 0), // 0이면 삭제
                }))
                .filter((store) => store.productList.length > 0)
        );

        // 2. orderListAtom 업데이트
        setOrderList(
            (prev) => prev.map((order) => (order.productId === productIdx && order.optionId === optionIdx ? { ...order, count: order.count - 1 } : order)).filter((order) => order.count > 0) // 0이면 삭제
        );

        // 3. db에 카트 수량 감소
        myAxios(token, setToken).post(`${baseUrl}/user/cartList/decreaseCount`, {
            cartIdx: cartIdx,
        });
    };

    return (
        <div className="body-div">
            <div style={{ padding: "72px 16px", display: "flex", flexDirection: "column" }} className="Cart-main-div">
                <div>
                    <span style={{ fontSize: "22px", fontWeight: "600" }} className="font-22 semibold">
                        장바구니
                    </span>
                </div>
                {/* 왼쪽 장바구니 목록 */}
                <div style={{ display: "flex", marginTop: "20px", justifyContent: "space-between" }}>
                    <div className="cart-product-info-list">
                        <div className="cart-top-selectAll-div" style={{ margin: "0" }}>
                            <div className="cart-top-selectAll-left-div">
                                <input
                                    type="checkbox"
                                    id="cartSelectAll"
                                    className="cart-selectAll-input"
                                    onChange={handleSelectAll}
                                    checked={Object.keys(checkedItems).length > 0 && Object.values(checkedItems).every((v) => v)}
                                />
                                <label style={{ fontSize: "14px", fontWeight: "500" }} htmlFor="cartSelectAll" className="font-14 medium">
                                    모두선택
                                </label>
                            </div>
                            <button className="cart-select-delete-button font-14 medium" onClick={cartDeleteProducts}>
                                선택삭제
                            </button>
                        </div>
                        <table className="cart-table">
                            <thead>
                                <tr className="cart-table-trtd">
                                    <td colSpan={2}>
                                        <span>상품정보</span>
                                    </td>
                                    <td style={{ width: "135px" }}>
                                        <span>수량</span>
                                    </td>
                                    <td style={{ width: "130px" }}>
                                        <span>상품금액</span>
                                    </td>
                                    <td style={{ width: "130px" }}>
                                        <span>배송단위</span>
                                    </td>
                                    <td style={{ width: "70px" }}>
                                        <span>배송비</span>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedCart.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "40px 0" }}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <img
                                                    style={{
                                                        width: "300px",
                                                        WebkitMaskImage: "radial-gradient(circle, #000 60%, transparent 100%)",
                                                        maskImage: "radial-gradient(circle, #000 60%, transparent 100%)",
                                                    }}
                                                    src="/cartEmpty.png"
                                                    alt=""
                                                />

                                                <span>장바구니에 담긴 상품이 없습니다.</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {groupedCart.map((store) => {
                                    // store.cartList를 배송단위별로 그룹핑
                                    const groupedByUnit = store.productList.reduce((acc, product) => {
                                        if (!acc[product.postType]) acc[product.postType] = [];
                                        acc[product.postType].push(product);
                                        return acc;
                                    }, {});

                                    return (
                                        <React.Fragment key={store.brandId}>
                                            {/* 업체 헤더 */}
                                            <tr className="store-row">
                                                <td colSpan={5}>
                                                    <div
                                                        className="store-title"
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        <div style={{ fontSize: "14px", fontWeight: "600" }} className="font-14 medium">
                                                            {store.brandName}
                                                        </div>
                                                        <span style={{ width: "230px" }}>묶음배송 무료 전환 기준금액 : {store.freeChargeAmount?.toLocaleString()}원</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href={"/zipddak/storeInfo/" + store.brandId} className="font-14 cart-store-info-a">
                                                        <span style={{ color: "gray" }}>업체 정보</span> <i className="bi bi-chevron-right" style={{ fontSize: "12px" }}></i>
                                                    </a>
                                                </td>
                                            </tr>

                                            {/* 배송단위별 그룹 */}
                                            {Object.entries(groupedByUnit).map(([unit, items], groupIdx, arr) => {
                                                const isLastGroup = groupIdx === arr.length - 1;
                                                return (
                                                    <React.Fragment key={unit}>
                                                        {items.map((product, idx) => (
                                                            <tr
                                                                key={product.cartIdx}
                                                                className="cart-product-under-tr"
                                                                style={{
                                                                    borderBottom: !isLastGroup && idx === items.length - 1 ? "1px solid #e6e6e6" : "none",
                                                                }}
                                                            >
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        value={product.cartIdx}
                                                                        className="cart-selectAll-input"
                                                                        checked={!!checkedItems[product.cartIdx]}
                                                                        onChange={() => {
                                                                            handleCheck(product.cartIdx);

                                                                            const isChecked = !checkedItems[product.cartIdx];

                                                                            if (isChecked) {
                                                                                // 체크 ON
                                                                                setOrderList((prev) => [
                                                                                    ...prev,
                                                                                    {
                                                                                        productId: product.productIdx,
                                                                                        optionId: product.optionIdx,
                                                                                        name: product.optionName,
                                                                                        value: product.optionValue,
                                                                                        price: product.productSalePrice
                                                                                            ? product.optionPrice + product.productSalePrice
                                                                                            : product.optionPrice + product.productPrice,
                                                                                        count: product.quantity,
                                                                                    },
                                                                                ]);
                                                                            } else {
                                                                                // 체크 OFF → 삭제
                                                                                setOrderList((prev) =>
                                                                                    prev.filter((item) => !(item.productId === product.productIdx && item.optionId === product.optionIdx))
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                </td>

                                                                <td style={{ width: "380px" }}>
                                                                    <div
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => {
                                                                            navigate(`/zipddak/product/${product.productIdx}`);
                                                                        }}
                                                                        className="cart-product-img-info-div"
                                                                    >
                                                                        <img
                                                                            style={{ border: "none" }}
                                                                            className="cart-product-img"
                                                                            src={`${baseUrl}/imageView?type=product&filename=${product.productImg}`}
                                                                            alt=""
                                                                        />
                                                                        <div className="cart-product-info-name">
                                                                            <span className="font-14 medium" style={{ fontWeight: "500" }}>
                                                                                {product.productName}
                                                                            </span>
                                                                            <span className="font-14" style={{ color: "#6A7685" }}>
                                                                                {product.optionName} / {product.optionValue}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div
                                                                        style={{
                                                                            width: "100%",
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                        }}
                                                                    >
                                                                        <div className="detail-append-button">
                                                                            <button
                                                                                className="count-button-style"
                                                                                onClick={() => decreaseCount(product.cartIdx, product.productIdx, product.optionIdx)}
                                                                            >
                                                                                <i className="bi bi-dash-lg append-button-son"></i>
                                                                            </button>
                                                                            <span className="font-14">{product.quantity}</span>
                                                                            <button
                                                                                className="count-button-style"
                                                                                onClick={() => increaseCount(product.cartIdx, product.productIdx, product.optionIdx)}
                                                                            >
                                                                                <i className="bi bi-plus-lg append-button-son"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td style={{ textAlign: "center" }}>
                                                                    {product.productSalePrice ? (
                                                                        <span className="font-14 medium">
                                                                            {((product.productSalePrice + product.optionPrice) * product.quantity).toLocaleString()}원
                                                                        </span>
                                                                    ) : (
                                                                        <span className="font-14 medium">{((product.productPrice + product.optionPrice) * product.quantity).toLocaleString()}원</span>
                                                                    )}
                                                                </td>

                                                                <td style={{ textAlign: "center" }}>
                                                                    <span className="font-15">{product.postType === "bundle" ? "묶음배송" : "개별배송"}</span>
                                                                </td>

                                                                {idx === 0 && (
                                                                    <td rowSpan={items.length} style={{ textAlign: "center" }}>
                                                                        <span className="font-15" style={{ fontWeight: "500" }}>
                                                                            {product.postType === "single"
                                                                                ? `${(product.postCharge * product.quantity).toLocaleString()}`
                                                                                : (() => {
                                                                                      let sum = 0;
                                                                                      store.productList?.map((p) => {
                                                                                          if (p.postType === "bundle") {
                                                                                              let hap =
                                                                                                  (p.productSalePrice ? p.productSalePrice + p.optionPrice : p.productPrice + p.optionPrice) *
                                                                                                  p.quantity;
                                                                                              sum += hap;
                                                                                          }
                                                                                      });
                                                                                      const returnPostCharge = sum >= store.freeChargeAmount ? 0 : store.basicPostCharge;
                                                                                      return returnPostCharge.toLocaleString();
                                                                                  })()}
                                                                            원
                                                                        </span>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* 결제 box */}
                    <div className="cart-pay-box" style={{ marginTop: "10px" }}>
                        <div style={{ height: "22.5px" }} className="cart-pay-box-top-info">
                            <span style={{ fontSize: "15px" }} className="font-15">
                                총 상품 금액
                            </span>
                            <span className="font-14">{totalPrice.toLocaleString()}원</span>
                        </div>
                        <div style={{ height: "22.5px" }} className="cart-pay-box-top-info cart-pay-box-top-second-div">
                            <span style={{ fontSize: "15px" }} className="font-15">
                                총 배송비
                            </span>
                            <span className="font-14">{totalShippingFee.toLocaleString()}원</span>
                        </div>
                        <div style={{ height: "44px" }} className="cart-pay-box-top-info cart-pay-box-top-last-div">
                            <span style={{ fontSize: "16px", fontWeight: "600" }} className="font-16 semibold">
                                결제 금액
                            </span>
                            <span style={{ fontSize: "22px", fontWeight: "600" }} className="font-22 semibold total-price-info">
                                {(totalPrice + totalShippingFee).toLocaleString()}
                                <span style={{ fontSize: "16px" }} className="font-16">
                                    원
                                </span>
                            </span>
                        </div>
                        {/* 구매 버튼 */}
                        {/* 수량 들어가야함 */}
                        <button
                            style={{ fontSize: "16px", fontWeight: "600" }}
                            onClick={() => {
                                if (orderList.length === 0) {
                                    setModal(true);
                                    setTimeout(() => setModal(false), 1500);
                                    return;
                                }
                                navigate("/zipddak/productOrder");
                            }}
                            className="cart-pay-box-bottom-button font-16 semibold"
                        >
                            {checkedCount}개 상품 구매하기
                        </button>
                    </div>
                </div>

                <Modal
                    className="ask-modal-box"
                    isOpen={modal}
                    toggle={toggle}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        whiteSpace: "nowrap",
                        fontSize: "14px",
                    }}
                >
                    <div className="ask-modal-body">
                        <div>1개 이상의 상품을 선택하셔야 합니다.</div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
