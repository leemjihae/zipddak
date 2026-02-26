import "../css/ProductOrder.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import { orderListAtom } from "./productAtom";
import { baseUrl } from "../../config";
import axios from "axios";
import { Modal as AddrModal } from "antd";
import DaumPostcode from "react-daum-postcode";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { myAxios } from "../../config";

export default function ProductOrder() {
    // const user = useAtomValue(userAtom);
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    // 알림 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달 안에 들어갈 메세지
    const [modalMessage, setModalMessage] = useState("");

    // 주문에 쓰일 데이터
    const [orderData, setOrderData] = useState({});

    const [brand, setBrand] = useState([]);

    const [orderList, setOrderList] = useAtom(orderListAtom);
    const [options, setOptions] = useState({});

    const [productInfo, setProductInfo] = useState([]);

    // 총 상품 금액
    const [productTotalPrice, setProductTotalPrice] = useState(0);
    // 총 결제 금액
    const [totalPrice, setTotalPrice] = useState(0);
    // 총 배송 금액
    const [postChargeTotal, setPostChargeTotal] = useState(0);

    const totalPostChargeAllBrands = brand.reduce((sumBrand, b) => {
        // ★ 개별배송 : 배송비 * 수량
        const singlePostCharge = b.orderList
            .filter((o) => o.postType === "single")
            .reduce((sum, o) => {
                const count = Number(o.count ?? 1);
                const post = Number(o.postCharge ?? 0);
                return sum + post * count;
            }, 0);

        // ★ 묶음배송 옵션 목록
        const bundleOptions = b.orderList.filter((o) => o.postType === "bundle");

        // ★ 묶음배송 총 금액 계산
        const bundleTotalPrice = bundleOptions.reduce((sum, o) => {
            const count = Number(o.count ?? 1);

            return sum + o.price * count;
        }, 0);

        // ★ 묶음배송 배송비
        let bundlePostCharge = 0;
        if (bundleOptions.length > 0) {
            bundlePostCharge = bundleTotalPrice >= Number(b.freeChargeAmount ?? 0) ? 0 : Number(b.basicPostCharge ?? 0);
        }

        const totalPostCharge = singlePostCharge + bundlePostCharge;

        return sumBrand + totalPostCharge;
    }, 0);

    const [isDefaultAddress, setIsDefaultAddress] = useState(false);

    const [recvUser, setRecvUser] = useState({
        recvier: "",
        tel: "",
        zonecode: "",
        addr1: "",
        detailAddress: "",
        requestContent: "",
        defaultAddress: isDefaultAddress,
    });

    //주소
    const [isAddOpen, setIsAddOpen] = useState(false);

    const complateHandler = (data) => {
        console.log(data);
        setRecvUser({
            ...recvUser,
            zonecode: data.zonecode,
            addr1: data.roadAddress || data.address,
        });
    };

    const closeHandler = (state) => {
        setIsAddOpen(false);
    };

    const changeRecvUserInfo = (e) => {
        setRecvUser({
            ...recvUser,
            [e.target.name]: e.target.value,
        });
    };

    // 수량 증가
    const increaseCount = (sellerIdx, productId, optionId) => {
        setBrand((prevBrands) =>
            prevBrands.map((brand) => {
                if (brand.sellerIdx === sellerIdx) {
                    return {
                        ...brand,
                        orderList: brand.orderList.map((option) => (option.optionId === optionId ? { ...option, count: option.count + 1 } : option)),
                    };
                }
                return brand;
            }),
        );

        // 2. Atom 업데이트
        setOrderList((prevOrders) => prevOrders.map((order) => (order.productId === productId && order.optionId === optionId ? { ...order, count: order.count + 1 } : order)));
    };

    // 수량 감소
    const decreaseCount = (sellerIdx, productId, optionId) => {
        // 현재 브랜드 찾기
        const targetBrand = brand.find((b) => b.sellerIdx === sellerIdx);
        if (!targetBrand) return;

        // 브랜드가 하나이고 + 남은 상품이 하나이고 + 그 상품 count == 1이면 막기
        if (brand.length === 1 && targetBrand.orderList.length === 1) {
            const targetOption = targetBrand.orderList.find((o) => o.productId === productId && o.optionId === optionId);

            if (targetOption && targetOption.count === 1) {
                setModalMessage("최소 1개 이상의 상품을 구매할 수 있습니다.");
                setIsModalOpen(true);
                setTimeout(() => {
                    setIsModalOpen(false);
                }, 1500);
                return;
            }
        }

        // 1. brand 업데이트
        setBrand((prevBrands) =>
            prevBrands.map((brand) => {
                if (brand.sellerIdx === sellerIdx) {
                    return {
                        ...brand,
                        orderList: brand.orderList.map((option) => (option.productId === productId && option.optionId === optionId ? { ...option, count: option.count - 1 } : option)).filter((option) => option.count > 0),
                    };
                }
                return brand;
            }),
        );

        // 2. Atom 업데이트
        setOrderList((prevOrders) => prevOrders.map((order) => (order.productId === productId && order.optionId === optionId ? { ...order, count: order.count - 1 } : order)).filter((order) => order.count > 0));
    };

    // 구매 목록에서 상품 삭제
    const removeProduct = (sellerIdx, optionId) => {
        // 현재 브랜드 찾기
        const targetBrand = brand.find((b) => b.sellerIdx === sellerIdx);
        if (!targetBrand) return;

        // 브랜드가 하나이고 + 남은 상품이 하나이고 + 그 상품 count == 1이면 막기
        if (brand.length === 1) {
            setModalMessage("최소 1개 이상의 상품을 구매할 수 있습니다.");
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 1500);
            return;
        }

        setBrand((prevBrands) =>
            prevBrands.map((brand) => {
                if (brand.sellerIdx === sellerIdx) {
                    return {
                        ...brand,
                        orderList: brand.orderList.filter((option) => option.optionId !== optionId),
                    };
                }
                return brand;
            }),
        );
    };

    // 위와 동일하게 채우기 버튼 클릭 이벤트
    const sameInfo = () => {
        setRecvUser({ ...recvUser, recvier: user.name, tel: user.tel });
    };

    useEffect(() => {
        let total = 0;
        brand.map((option) => {
            option.orderList.map((order) => {
                total += order.count * order.price;
            });
        });

        setPostChargeTotal(totalPostChargeAllBrands);
        setProductTotalPrice(total);
        total += postChargeTotal;
        setTotalPrice(total);
    }, [brand, postChargeTotal]);

    useEffect(() => {
        if (orderList.length > 0) {
            myAxios(token, setToken)
                .post(`${baseUrl}/user/orderListProduct2`, {
                    orderList,
                    username: user.username,
                })
                .then((res) => {
                    console.log(res.data);

                    setBrand(res.data.brandDto);

                    setUser({
                        ...user,
                        name: res.data.userInfo.name,
                        tel: res.data.userInfo.phone,
                    });

                    setRecvUser((prev) => ({
                        ...prev,
                        zonecode: res.data.userInfo.zonecode || "",
                        addr1: res.data.userInfo.addr1 || "",
                        detailAddress: res.data.userInfo.addr2 || "",
                    }));
                });
        }
    }, [orderList]);

    // 토스 페이먼츠 결제 요청 시작
    const requestTossPaymentApi = async () => {
        const { recvier, tel, zonecode, addr1, detailAddress } = recvUser;

        if (!recvier || !tel || !zonecode || !addr1 || !detailAddress) {
            setModalMessage("배송지 정보를 모두 입력해주세요.");
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 1500);
            return;
        }

        const res = await myAxios(token, setToken).post(`${baseUrl}/user/payment/product`, {
            username: user.username,
            brandList: brand,
            recvUser: {
                ...recvUser,
                defaultAddress: isDefaultAddress,
            },
        });

        const { orderId, orderName, amount } = res.data;

        const encodedOrderName = encodeURIComponent(orderName);

        // 테스트 경우 클라이언트 키가 노출되어도 상관 없음
        // 실제 운영하는 환경에서는 서버에서 clientKey를 내려주고 클라이언트 요청시 가져와서 사용
        const tossPayments = await loadTossPayments("test_ck_Ba5PzR0ArnGLGeODLa1B8vmYnNeD");

        await tossPayments.requestPayment({
            method: "CARD",
            amount: amount,
            orderId: orderId,
            orderName: orderName,
            successUrl: `http://localhost:8080/user/payment/complete?productId=${options.productId}&orderName=${encodedOrderName}&username=${user.username}`, // 성공시 서버쪽으로 보냄
            failUrl: "http://localhost:5173/zipddak/productOrder",
        });
    };

    return (
        <div className="body-div">
            <div className="ProductOrder-main-div">
                <div>
                    <div style={{ padding: "72px 16px" }} className="productOrder-body-div">
                        {/* 주문상품 좌측 정보 들 */}
                        <div className="productOrder-left">
                            {/* 주문상품 */}
                            <div>
                                <span className="product-order-check-span">주문 상품</span>
                                {/* 업체이름 div */}
                                {brand.map((brand) => {
                                    // 1. single 배송비 누적
                                    let singlePostCharge = brand.orderList.filter((o) => o.postType === "single").reduce((sum, o) => sum + o.postCharge * (o.count ?? 1), 0);

                                    // 2. bundle 합계
                                    const bundleOptions = brand.orderList.filter((o) => o.postType === "bundle");
                                    const bundleTotalPrice = bundleOptions.reduce((sum, o) => {
                                        const count = Number(o.count ?? 1);

                                        return sum + o.price * count;
                                    }, 0);

                                    // 3. bundle 배송비 계산
                                    let bundlePostCharge = 0;
                                    if (bundleOptions.length > 0) {
                                        bundlePostCharge = bundleTotalPrice >= brand.freeChargeAmount ? 0 : brand.basicPostCharge;
                                    }

                                    // 4. 브랜드 전체 배송비
                                    const totalPostCharge = singlePostCharge + bundlePostCharge;

                                    return (
                                        <React.Fragment key={brand.sellerIdx}>
                                            <div className="product-order-check-store-div">
                                                <span className="font-15">{brand.brandName}</span>
                                                {totalPostCharge !== 0 ? <span className="font-15">배송비: {totalPostCharge.toLocaleString()}원</span> : <span className="font-15">무료배송</span>}
                                            </div>

                                            {brand.orderList.map((option, index) => (
                                                <div className="product-order-check-detail" key={option.optionId}>
                                                    <div className="product-order-check-img-div">
                                                        <img style={{ border: "none" }} className="product-order-check-img" src={`${baseUrl}/imageView?type=product&filename=${option.productImg}`} />
                                                    </div>

                                                    <div className="product-order-check-buy-info">
                                                        <div className="product-order-check-info">
                                                            <span className="font-16">{option.productName}</span>
                                                            <span className="font-14">
                                                                {option.name} / {option.value}
                                                            </span>

                                                            <div className="detail-append-button">
                                                                <button className="count-button-style" onClick={() => decreaseCount(brand.sellerIdx, option.productId, option.optionId)}>
                                                                    <i className="bi bi-dash-lg append-button-son"></i>
                                                                </button>

                                                                <span className="font-14">{option.count}</span>

                                                                <button className="count-button-style" onClick={() => increaseCount(brand.sellerIdx, option.productId, option.optionId)}>
                                                                    <i className="bi bi-plus-lg append-button-son"></i>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="product-order-check-buy-right">
                                                            <button onClick={() => removeProduct(brand.sellerIdx, option.optionId)} className="count-button-style">
                                                                <i className="bi bi-x-lg detail-x-button"></i>
                                                            </button>
                                                            <span className="font-14">
                                                                {(option.price * option.count).toLocaleString()}
                                                                <span>원</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* 주문자 */}
                            <div>
                                <span className="product-order-check-span">주문자</span>
                                <div>
                                    <table className="product-order-info-table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span style={{ fontSize: "15px" }} className="font-15">
                                                        이름
                                                    </span>
                                                </td>
                                                <td>
                                                    <Input style={{ width: "240px", height: "38px" }} value={user.name} className="product-order-check-input font-15" onChange={(e) => setUser({ ...user, name: e.target.value })} />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <span style={{ fontSize: "15px" }} className="font-15">
                                                        전화번호
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="product-order-check-input-tel-div">
                                                        <Input style={{ width: "55px", height: "38px" }} className="product-order-check-input-tel-first font-15" value={"010"} readOnly />
                                                        <Input style={{ width: "175px", height: "38px" }} value={user.tel || ""} onChange={(e) => setUser({ ...user, tel: e.target.value })} maxLength={8} className="product-order-check-input-tel-second font-15" type="tel" />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 배송지 */}
                            <div>
                                <div className="product-order-check-address-div">
                                    <span className="product-order-check-span">배송지</span>
                                    <button className="product-order-check-address-same-button" onClick={() => sameInfo()}>
                                        위와 동일하게 채우기
                                    </button>
                                </div>
                                <div>
                                    <table className="product-order-check-address-table">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span style={{ fontSize: "15px" }} className="font-15">
                                                        받는사람
                                                    </span>
                                                </td>
                                                <td>
                                                    <Input style={{ width: "240px", height: "38px" }} name="recvier" onChange={changeRecvUserInfo} value={recvUser.recvier} className="product-order-check-input font-15" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span style={{ fontSize: "15px" }} className="font-15">
                                                        전화번호
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="product-order-check-input-tel-div">
                                                        <Input style={{ width: "55px", height: "38px" }} className="product-order-check-input-tel-first font-15" value={"010"} readOnly />
                                                        <Input style={{ width: "175px", height: "38px" }} name="tel" onChange={changeRecvUserInfo} value={recvUser.tel || ""} maxLength={8} className="product-order-check-input-tel-second font-15" type="tel" />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span style={{ fontSize: "15px" }} className="font-15">
                                                        주소
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="product-order-check-input-address-button-div">
                                                        <button style={{ width: "55px", height: "38px" }} className="product-order-check-input-address-button" onClick={() => setIsAddOpen(!isAddOpen)}>
                                                            찾기
                                                        </button>
                                                        <Input style={{ width: "175px", height: "38px" }} readOnly value={recvUser.zonecode || ""} name="postCode" className="product-order-check-input-address-input font-15" />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <Input style={{ width: "510px", height: "38px" }} readOnly value={recvUser.addr1 || ""} name="address" className="product-order-check-input-address font-15" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <Input style={{ width: "510px", height: "38px" }} name="detailAddress" value={recvUser.detailAddress || ""} onChange={changeRecvUserInfo} placeholder="상세주소를 입력해주세요" className="font-15 height-38" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <div style={{ width: "510px", height: "24px" }} className="product-order-check-input-save-address">
                                                        <input className="test" type="checkbox" id="beforeFormAddress" checked={isDefaultAddress} onChange={(e) => setIsDefaultAddress(e.target.checked)} />
                                                        <label htmlFor="beforeFormAddress">
                                                            <span className="font-15">기본 배송지로 저장</span>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span style={{ fontSize: "15px" }} className="font-15">
                                                        요청사항
                                                    </span>
                                                </td>
                                                <td>
                                                    <Input style={{ width: "510px", height: "38px" }} name="requestContent" onChange={changeRecvUserInfo} className="product-order-check-input-address-detail font-15" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽 결제 폼 */}
                        <div className="product-order-form-div">
                            <div className="product-order-form-div-top">
                                <div className="product-order-form-div-intop">
                                    <span style={{ fontWeight: "600", fontSize: "16px", height: "24px" }} className="font-16 semibold">
                                        결제금액
                                    </span>
                                    <div style={{ height: "22.5px" }} className="product-order-form-second">
                                        <span style={{ fontSize: "15px" }} className="font-15">
                                            총 상품 금액
                                        </span>
                                        <span style={{ fontSize: "14px" }} className="font-14">
                                            {productTotalPrice.toLocaleString()}원
                                        </span>
                                    </div>
                                    <div style={{ height: "22.5px" }} className="product-order-form-second">
                                        <span style={{ fontSize: "15px" }} className="font-15">
                                            배송비
                                        </span>
                                        <span style={{ fontSize: "14px" }} className="font-14">
                                            {postChargeTotal.toLocaleString()}원
                                        </span>
                                    </div>
                                    <div style={{ height: "33px" }} className="product-order-form-second">
                                        <span style={{ fontSize: "16px", fontWeight: "600" }} className="font-16 semibold">
                                            최종 결제 금액
                                        </span>
                                        <span>
                                            <span style={{ fontSize: "22px", fontWeight: "600" }} className="font-22 semibold order-price">
                                                {totalPrice.toLocaleString()}
                                            </span>
                                            원
                                        </span>
                                    </div>
                                </div>
                                {/* 아래 주문 확인 설명 */}
                                <div className="product-order-from-bottom-content">
                                    <span style={{ fontSize: "13px", fontWeight: "600" }} className="font-13 semibold">
                                        본인은 만 14세 이상이며, 주문 내용을 확인하였습니다.
                                    </span>
                                    <div className="font-11 product-order-from-bottom-content-indiv">
                                        본 사이트는 통신판매중개자로서 상품의 거래 당사자가 아닙니다. 따라서 판매자가 등록한 상품정보 및 거래 과정에서 발생하는 문제에 대해 책임을 지지 않습니다. 단, 이용자는 업체 신고 및 문의하기 기능을 통해 판매자와의 소통이 가능하며, 문제가 발생한 경우 이를 통해
                                        조치를 요청하실 수 있습니다.
                                    </div>
                                </div>
                            </div>
                            <button onClick={requestTossPaymentApi} style={{ fontSize: "16px", fontWeight: "600" }} className="product-order-from-bottom-button font-16 semibold">
                                {totalPrice.toLocaleString()}원 결제하기
                            </button>
                        </div>
                    </div>

                    <Modal className="ask-modal-box" isOpen={modal} toggle={toggle}>
                        <div className="ask-modal-body">
                            <div>한 개 이상의 상품을 선택해야 주문할 수 있습니다.</div>

                            <div className="ask-modal-body-button-div">
                                <button className="ask-modal-write ask-modal-button" type="button" onClick={toggle}>
                                    확인
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>

            {/* 알림 모달창 */}
            <Modal isOpen={isModalOpen} className="mypage-modal" style={{ width: "380px" }}>
                <ModalBody>
                    <div
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
                        <p>{modalMessage}</p>
                    </div>
                </ModalBody>
            </Modal>

            {isAddOpen && (
                <AddrModal title="주소찾기" open={isAddOpen} footer={null} onCancel={() => setIsAddOpen(false)}>
                    <DaumPostcode onComplete={complateHandler} onClose={closeHandler} />
                </AddrModal>
            )}
        </div>
    );
}
