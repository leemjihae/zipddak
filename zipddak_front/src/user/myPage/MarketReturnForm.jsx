import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input, Modal, ModalBody } from "reactstrap";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";

export default function MarketReturnForm() {
    const { orderIdx } = useParams();
    const { state } = useLocation();

    const [order, setOrder] = useState({});
    const [deliveryGroups, setDeliveryGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [images, setImages] = useState([]); // 이미지 미리보기 URL 배열
    const [files, setFiles] = useState([]); // 실제 업로드용 이미지 File 배열

    const [reasonType, setReasonType] = useState("");
    const [reasonDetail, setReasonDetail] = useState("");
    const [shippingChargeType, setShippingChargeType] = useState("");
    const [totalProductAmount, setTotalProductAmount] = useState(0);
    const [returnShippingFee, setReturnShippingFee] = useState(0);
    const [finalRefundAmount, setFinalRefundAmount] = useState(0);

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const imgRef = useRef(null);
    const navigate = useNavigate();

    const customerFaultReasons = ["규격/사이즈를 잘못 선택함", "색상 또는 옵션을 잘못 선택함", "수량을 잘못 주문함", "단순 변심", "상품이 마음에 들지 않음", "현장에서 사용 불가(호환 문제)"];

    // 주문 상세 조회
    const getOrder = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/market/orderInfo?orderIdx=${orderIdx}`)
            .then((res) => {
                console.log(res.data);
                setOrder(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 반품 신청
    const submitReturn = () => {
        const formData = new FormData();

        formData.append("orderIdx", orderIdx);
        deliveryGroups.forEach((group) => {
            group.orderItems.forEach((item) => {
                formData.append("returnItemIdxs", item.orderItemIdx);
            });
        });
        formData.append("reasonType", reasonType);
        formData.append("reasonDetail", reasonDetail);
        formData.append("shippingChargeType", shippingChargeType);
        formData.append("returnShippingFee", returnShippingFee);
        formData.append("refundAmount", finalRefundAmount);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("returnImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/market/return", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setIsModalOpen(true);

                    setTimeout(() => {
                        navigate("/zipddak/mypage/market/orders");
                    }, 1500);
                }
            })
            .catch((err) => console.error(err));
    };

    // 반품사유 이미지 업로드
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImages((prev) => [...prev, URL.createObjectURL(file)]);
        setFiles((prev) => [...prev, file]);
    };

    useEffect(() => {
        getOrder();

        if (state) {
            console.log(state.deliveryGroups.deliveryGroups);
            setDeliveryGroups(state.deliveryGroups.deliveryGroups);
        }
    }, []);

    // 총 상품금액 계산
    useEffect(() => {
        if (!deliveryGroups) return;

        let total = 0;

        deliveryGroups.forEach((group) => {
            group.orderItems.forEach((item) => {
                total += item.price * item.quantity;
            });
        });

        setTotalProductAmount(total);
    }, [deliveryGroups]);

    // 반품배송비 및 최종환불예정금액 계산
    useEffect(() => {
        if (!reasonType) return;

        let shippingFee = 0;
        setShippingChargeType("SELLER");

        // 고객 귀책이면 배송비 부과
        if (customerFaultReasons.includes(reasonType)) {
            setShippingChargeType("BUYER");
            deliveryGroups.forEach((group) => {
                if (group.deliveryType === "post") {
                    shippingFee += group.appliedDeliveryFee;
                }
            });
        }

        setReturnShippingFee(shippingFee);
        setFinalRefundAmount(totalProductAmount - shippingFee);
    }, [reasonType]);

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
                <h1 className="mypage-title">반품신청</h1>
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
                            {order.createdAt}
                        </span>
                    </p>
                </div>
            </div>

            {/* 반품상품 정보 섹션 */}
            <div>
                <h3 className="mypage-sectionTitle">반품상품정보</h3>
                <table className="mypage-table" style={{ width: "100%" }}>
                    <thead style={{ borderTop: "none" }}>
                        <tr>
                            <td>상품정보</td>
                            <td width="80px">수량</td>
                            <td width="140px">상품금액</td>
                            <td width="168px">결제금액</td>
                            <td width="140px">배송비</td>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryGroups.map((group, gidx) => (
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
                                                        textAlign: "left",
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
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>{Number(item.price).toLocaleString()}원</td>
                                        <td>
                                            <p style={{ fontWeight: "500" }}>{Number(item.price * item.quantity).toLocaleString()}원</p>
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
                    </tbody>
                </table>
            </div>

            {/* 반품사유 섹션 */}
            <div>
                <h3 className="mypage-sectionTitle">반품 사유</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>반품 사유</label>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <Input type="select" required onChange={(e) => setReasonType(e.target.value)}>
                            <option value="" disabled selected hidden>
                                사유를 선택해주세요
                            </option>
                            <option disabled>--- 구매자 배송비 부담 ---</option>
                            <option>규격/사이즈를 잘못 선택함</option>
                            <option>색상 또는 옵션을 잘못 선택함</option>
                            <option>수량을 잘못 주문함</option>
                            <option>단순 변심</option>
                            <option>상품이 마음에 들지 않음</option>
                            <option>현장에서 사용 불가(호환 문제)</option>
                            <option disabled>--- 판매자 배송비 부담 ---</option>
                            <option>상품이 파손되었음</option>
                            <option>상품에 하자가 있어 사용이 어려움</option>
                            <option>제조 불량 또는 성능 이상이 있음</option>
                            <option>다른 상품이 배송됨</option>
                            <option>옵션/규격이 다르게 배송됨</option>
                            <option>일부만 배송됨 / 수량 오류 배송</option>
                        </Input>
                        <Input type="textarea" placeholder="현장 사용 여부, 규격 불일치, 파손 여부 등 자세한 내용을 입력해주세요." onChange={(e) => setReasonDetail(e.target.value)}></Input>
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                }}
                            >
                                {images.map((img, idx) => (
                                    <div style={{ position: "relative" }}>
                                        <img key={idx} src={img} width="60px" height="60px" />
                                        <i
                                            class="bi bi-x-circle-fill"
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                position: "absolute",
                                                top: "-4px",
                                                right: "-4px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setImages((prev) => prev.filter((_, i) => i !== idx));
                                                setFiles((prev) => prev.filter((_, i) => i !== idx));
                                            }}
                                        />
                                    </div>
                                ))}
                                {images.length < 3 && (
                                    <div
                                        onClick={() => imgRef.current.click()}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            background: "#000",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <i
                                            class="bi bi-plus-lg"
                                            style={{
                                                fontSize: "30px",
                                                color: "#fff",
                                            }}
                                        ></i>
                                        <input type="file" hidden ref={imgRef} onChange={handleImageUpload} />
                                    </div>
                                )}
                            </div>
                            <p
                                style={{
                                    color: "#A0A0A0",
                                    fontSize: "12px",
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    lineHeight: "20px",
                                    margin: "0",
                                }}
                            >
                                불량/파손 사유일 경우, 상태가 확인 가능한 사진을 함께 첨부해주세요.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 환불예정금액 섹션 */}
            <div>
                <h3 className="mypage-sectionTitle">환불예정금액</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>총 상품금액</label>
                    <p style={{ fontWeight: "600" }}>{Number(totalProductAmount).toLocaleString()}원</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>반품배송비</label>
                    <p style={{ fontWeight: "600" }}>
                        {Number(returnShippingFee).toLocaleString()}원
                        <span
                            style={{
                                color: "#A0A0A0",
                                fontSize: "12px",
                                fontWeight: "400",
                                marginLeft: "10px",
                            }}
                        >
                            단순 변심 환불 시 왕복 배송비는 고객 부담입니다.
                        </span>
                    </p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>최종환불예정금액</label>
                    <p style={{ fontWeight: "600", color: "#FF5833" }}>{Number(finalRefundAmount).toLocaleString()}원</p>
                </div>
            </div>
            {/* 회수지정보 섹션 */}
            <div>
                <h3 className="mypage-sectionTitle">회수지 정보</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>받는사람</label>
                    <p>{order.postRecipient}</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>휴대폰 번호</label>
                    <p>{order.phone}</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "150px" }}>주소</label>
                    <p>
                        {order.postZonecode} {order.postAddr1} {order.postAddr2}
                    </p>
                </div>
            </div>
            {/* 수거방법 섹션 */}
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

            {/* 목록 버튼 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button
                    className="secondary-button"
                    style={{ width: "200px", height: "40px", fontSize: "14px" }}
                    onClick={() => {
                        navigate("/zipddak/mypage/market/orders");
                    }}
                >
                    취소
                </button>
                <button className="primary-button" style={{ width: "200px", height: "40px", fontSize: "14px" }} onClick={() => submitReturn()}>
                    반품 신청 접수하기
                </button>
            </div>

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
                        <p>반품 신청이 접수되었습니다.</p>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}
