//css
import table from "../css/table.module.css";
import detail from "../css/detail.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";
import useSelectCheckbox from "../js/useSelectCheckbox.jsx";
import { priceFormat } from "../js/priceFormat.jsx";
import { koreaAmountFormat } from "../js/koreaAmountFormat.jsx";

//component
import ActionDropdownPortal from "../component/ActionDropdownPortal.jsx";
import ModalTrackingRegist from "../component/ModalTrackingRegist.jsx";

import { myAxios, baseUrl } from "../../config.jsx";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";
import { Input, Label, Spinner } from "reactstrap";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetail() {
    const pageTitle = usePageTitle("주문관리 > 주문 내역 상세조회");
    const navigate = useNavigate();
    const { orderIdx } = useParams();
    const [order, setOrder] = useState(null); //주문정보
    const [items, setItems] = useState(null); //주문아이템 정보
    const [freeChargeAmount, setFreeChargeAmount] = useState(null); //이 셀러의 무료배송 기준금액
    const [sellerOrderSummary, setSellerOrderSummary] = useState(null); //이 셀러의 주문상품 금액 정보
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false); //운송장번호 등록 모달 상태
    const [selectedItem, setSelectedItem] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null); //처리아이콘 클릭시 드롭다운 오픈
    const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 }); //처리아이콘 클릭시 드롭다운 위치
    const [user] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    //테이블 체크박스 상태
    const {
        checkedItems,

        handleAllCheck,
        handleItemCheck,

        isAllChecked,
        getSelected,
        requireSelected,
        resetChecked,
    } = useSelectCheckbox();

    //orderDetail 데이터 불러오기
    const getMyOrderDetail = () => {
        const params = new URLSearchParams();
        params.append("sellerId", user.username);
        params.append("num", orderIdx);

        const orderDetailUrl = `/seller/order/myOrderDetail?${params.toString()}`;

        myAxios(token, setToken)
            .get(orderDetailUrl)
            .then((res) => {
                console.log("orderDetail :", res.data);

                setOrder(res.data.orderData);
                setItems(res.data.myOrderItemList);
                setFreeChargeAmount(res.data.freeChargeAmount);
                setSellerOrderSummary(res.data.sellerOrderSummary);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //초기화면 로딩
    useEffect(() => {
        if (!user) return;
        user.username && getMyOrderDetail();
    }, [user]);

    // 데이터 로딩 전에는 렌더링 막기
    if (!order) {
        return (
            <div style={{ textAlign: "center", padding: "350px" }}>
                <Spinner style={{ color: "#ff5733" }}>Loading...</Spinner>
            </div>
        );
    }

    //택배사
    const getPostCompName = (code) => {
        switch (code) {
            case "4":
                return "CJ대한통운";
            case "8":
                return "롯데택배";
            case "5":
                return "한진택배";
            case "6":
                return "로젠택배";
            case "1":
                return "우체국택배";
            default:
                return "-";
        }
    };

    // 퀵처리 드롭박스 토글 로직 (중복 클릭 -> 닫힘)
    const toggleDropdown = (itemIdx) => {
        setOpenDropdown((prev) => (prev === itemIdx ? null : itemIdx));
    };
    // 클릭 위치 기준으로 드롭다운 좌표 계산
    const handleDropdownClick = (e, itemIdx) => {
        e.stopPropagation();
        const rect = e.target.getBoundingClientRect();

        // 아이콘 바로 아래에 붙도록
        setDropdownPos({
            x: rect.left,
            y: rect.bottom + 4,
        });
        toggleDropdown(itemIdx);
    };

    //배송방법별로 테이블 섹션 나누기
    const bundleItems = items.filter((it) => it.postType == "bundle");
    const singleItems = items.filter((it) => it.postType == "single");
    const allItems = [...bundleItems, ...singleItems];

    //처리완료된 상품 재처리 막기
    const selectableItems = [...bundleItems, ...singleItems].filter((it) => !it.trackingNo && it.orderStatus !== "반품완료" && it.orderStatus !== "교환완료");
    const selectableIdxs = selectableItems.map((it) => it.orderItemIdx);

    // 묶음 + 개별 합치기
    // 수량 합
    const totalQuantity = allItems.reduce((acc, cur) => acc + cur.quantity, 0); //acc: 누적값 , cur : 현재 순회 중인 배열 요소 하나
    // 단가 합
    const totalUnitPrice = allItems.reduce((acc, cur) => acc + cur.unitPrice * cur.quantity, 0);
    // 배송비 합
    const parsePrice = (val) => Number(String(val).replace(/[^0-9]/g, "")); //숫자만 걸러서 계산
    // const totalPostCharge = (bundleItems.length > 0 ? parsePrice(bundleItems[0].postCharge) : 0) + singleItems.reduce((acc, cur) => acc + parsePrice(cur.postCharge), 0);
    const isFreeShipping = totalUnitPrice > freeChargeAmount; // 무료 배송 조건
    const totalPostCharge = isFreeShipping ? 0 : (bundleItems.length > 0 ? parsePrice(bundleItems[0].postCharge) : 0) + singleItems.reduce((acc, cur) => acc + parsePrice(cur.postCharge), 0);

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i className="bi bi-newspaper"></i>
                        <span>주문 내역 상세조회</span>
                    </div>

                    <div className="bodyFrame">
                        <div className={detail.base_info}>
                            {/* 주문 정보 */}
                            <div className="position-relative mb-4">
                                <Label className="input_title">주문 정보</Label>

                                <div className={detail.detailFrame}>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">주문 번호 </span>
                                            <Input value={order.orderCode} readOnly />
                                        </div>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">주문 일자 </span>
                                            <Input value={order.createdAt} readOnly />
                                        </div>
                                    </div>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">주문 상태 </span>
                                            <span>상품준비중 </span>
                                        </div>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">결제 수단 </span>
                                            {/* <Input value="결제수단" readOnly /> */}
                                            <Input value="간편결제 (카카오페이)" readOnly />
                                        </div>
                                    </div>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">최종 결제 금액 </span>
                                            <Input value={priceFormat(sellerOrderSummary.finalTotal)} style={{ color: "red", marginRight: "5px" }} readOnly />원
                                        </div>
                                        <div className={detail.info_cell}></div>
                                    </div>
                                </div>
                            </div>

                            {/* 고객 정보 */}
                            <div className="position-relative mb-4">
                                <Label className="input_title">고객 정보</Label>
                                <div className={detail.detailFrame}>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">주문자 아이디 </span>
                                            <Input value={order.customerUsername} readOnly />
                                        </div>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">주문자명 </span>
                                            <Input value={order.customerName} readOnly />
                                        </div>
                                    </div>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">연락처 </span>
                                            <Input value={order.customerPhone} readOnly />
                                        </div>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">주문 횟수</span>
                                            {/* <Input value={order.orderCode} readOnly /> */}
                                            <Input value="12" readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 배송지 정보 */}
                            <div className="position-relative mb-4">
                                <Label className="input_title">배송지 정보</Label>
                                <div className={detail.detailFrame}>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">수령인 </span>
                                            <Input value={order.postRecipient} readOnly />
                                        </div>
                                        <div className={detail.info_cell}>
                                            <span className="sub_title">연락처 </span>
                                            <Input value={order.phone} readOnly />
                                        </div>
                                    </div>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_line}>
                                            <span className="sub_title">배송지 </span>
                                            <div style={{ width: "100%" }}>
                                                <div className="addr_column mb-2">
                                                    <Input className="" style={{ width: "30%" }} value={order.postZonecode} readOnly />
                                                    <Input style={{ width: "70%" }} value={order.postAddr1} readOnly />
                                                </div>
                                                <div className="addr_column2 ">
                                                    <Input type="text" value={order.postAddr2} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={detail.info_column}>
                                        <div className={detail.info_line}>
                                            <span className="sub_title">배송 메모</span>
                                            <Input value={order.postNote} readOnly />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={detail.pd_list_table}>
                            <Label className="input_title">주문 상품 리스트</Label>
                            <div className={detail.product_list}>
                                <div className={table.tableBody}>
                                    <table className={table.detail_table}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "auto" }}>
                                                    <Input type="checkbox" checked={isAllChecked(selectableIdxs.length)} onChange={(e) => handleAllCheck(selectableIdxs, e.target.checked)} disabled={selectableIdxs.length === 0} />
                                                </th>
                                                <th style={{ width: "auto" }}>#</th>
                                                <th style={{ width: "auto" }}>Img</th>
                                                <th style={{ width: "20%" }}>상품명</th>
                                                <th style={{ width: "auto" }}>옵션</th>
                                                <th style={{ width: "auto" }}>단가</th>
                                                <th style={{ width: "auto" }}>수량</th>
                                                <th style={{ width: "auto" }}>금액</th>
                                                <th style={{ width: "auto" }}>주문상태</th>
                                                <th style={{ width: "auto" }}>배송비</th>
                                                <th style={{ width: "auto" }}>운송장번호</th>
                                                <th style={{ width: "auto" }}>처리</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* 묶음 배송 */}
                                            {bundleItems.length > 0 &&
                                                bundleItems.map((it, idx) => (
                                                    <tr key={it.orderItemIdx} className={`${table.bundle_deli} ${idx === bundleItems.length - 1 ? "last-of-bundle" : ""}`}>
                                                        <td>
                                                            <Input type="checkbox" checked={checkedItems.has(it.orderItemIdx)} onChange={(e) => handleItemCheck(it.orderItemIdx, e.target.checked, bundleItems.length + singleItems.length)} disabled={!!it.trackingNo || it.orderStatus === "반품완료"} />
                                                        </td>
                                                        <td>{idx + 1}</td>
                                                        <td style={{ padding: "0" }}>
                                                            <img src={it.thumbnailFileRename ? `${baseUrl}/imageView?type=product&filename=${it.thumbnailFileRename}` : "/no_img.svg"} style={{ width: "60px" }} />
                                                        </td>
                                                        <td className={[table.title_cell, table.detail_title_cell, "pointer"].join(" ")} onClick={() => navigate(`/zipddak/product/${it.productIdx}`)}>
                                                            {it.productName}
                                                        </td>
                                                        <td className={table.option_cell}>
                                                            {it.productOptionIdx ? (
                                                                <span>
                                                                    {it.optionName} : {it.optionValue}
                                                                </span>
                                                            ) : (
                                                                "옵션없음"
                                                            )}
                                                        </td>
                                                        <td className="quantity_cell">{priceFormat(it.unitPrice)}</td>
                                                        <td className="quantity_cell">{it.quantity}</td>
                                                        <td className="unitPrice_cell">{priceFormat(it.unitPrice * it.quantity)}</td>
                                                        <td>{it.orderStatus}</td>

                                                        {idx === 0 && (
                                                            <td rowSpan={bundleItems.length} className={`${table.shipCharge_cell} ${"last-of-bundle-cell"}`}>
                                                                <span style={{ fontSize: "16px" }}>
                                                                    <span>{isFreeShipping ? "무료배송" : `${priceFormat(bundleItems[0].postCharge)} 원 `}</span>
                                                                </span>
                                                                <br />
                                                                <span style={{ fontSize: "10px" }}>
                                                                    <span>{koreaAmountFormat(freeChargeAmount)}</span>원 이상 무료
                                                                </span>
                                                            </td>
                                                        )}

                                                        <td>{it.trackingNo ? `${getPostCompName(it.pickupPostComp)} ${it.trackingNo}` : "-"}</td>
                                                        <td className="dropdown-wrapper" style={{ position: "relative" }}>
                                                            <i
                                                                className={`bi bi-three-dots-vertical ${it.trackingNo || it.orderStatus === "반품완료" ? "disabled_icon" : "pointer"}`}
                                                                onClick={(e) => {
                                                                    if (it.trackingNo || it.orderStatus === "반품완료") return;
                                                                    handleDropdownClick(e, it.orderItemIdx);
                                                                }}
                                                            ></i>
                                                        </td>

                                                        {openDropdown === it.orderItemIdx && (
                                                            <ActionDropdownPortal
                                                                pos={{ x: dropdownPos.x, y: dropdownPos.y }}
                                                                onClose={() => setOpenDropdown(null)}
                                                                menuItems={[
                                                                    {
                                                                        label: "운송장 등록",
                                                                        onClick: () => {
                                                                            setSelectedItem(it.orderItemIdx);
                                                                            setIsTrackingModalOpen(true); //모달 오픈
                                                                            setOpenDropdown(null); // 드롭다운 닫기
                                                                            console.log("운송장 등록", it.orderItemIdx);
                                                                        },
                                                                    },
                                                                ]}
                                                            />
                                                        )}
                                                    </tr>
                                                ))}
                                            {/* 개별 배송 */}
                                            {singleItems.map((it, idx) => (
                                                <tr key={it.orderItemIdx} className={`${table.single_deli} ${idx === singleItems.length - 1 ? "last-of-single" : ""}`}>
                                                    <td>
                                                        <Input type="checkbox" checked={checkedItems.has(it.orderItemIdx)} onChange={(e) => handleItemCheck(it.orderItemIdx, e.target.checked, bundleItems.length + singleItems.length)} />
                                                    </td>
                                                    <td>{bundleItems.length + idx + 1}</td>
                                                    <td>
                                                        <img src={it.thumbnailFileRename ? `${baseUrl}/imageView?type=product&filename=${it.thumbnailFileRename}` : "/no_img.svg"} style={{ width: "60px" }} />
                                                    </td>
                                                    <td className={[table.title_cell, table.detail_title_cell].join(" ")}>{it.productName}</td>
                                                    <td className={table.option_cell}>
                                                        {it.productOptionIdx ? (
                                                            <span>
                                                                {it.optionName} : {it.optionValue}
                                                            </span>
                                                        ) : (
                                                            "옵션없음"
                                                        )}
                                                    </td>
                                                    <td className="quantity_cell">{it.unitPrice}</td>
                                                    <td className="quantity_cell">{it.quantity}</td>
                                                    <td className="unitPrice_cell">{priceFormat(it.unitPrice * it.quantity)}</td>
                                                    <td>{it.orderStatus}</td>
                                                    <td className="postCharge_cell">
                                                        <span>
                                                            <span>{priceFormat(it.postCharge)}</span>원
                                                        </span>
                                                        <br />
                                                        <span style={{ fontSize: "10px" }}>1개당 부과</span>
                                                    </td>
                                                    <td>{it.trackingNumber ? it.trackingNumber : "-"}</td>
                                                    <td className="dropdown-wrapper" style={{ position: "relative" }}>
                                                        <i className="bi bi-three-dots-vertical pointer" onClick={(e) => handleDropdownClick(e, it.orderItemIdx)}></i>
                                                    </td>

                                                    {openDropdown === it.orderItemIdx && (
                                                        <ActionDropdownPortal
                                                            pos={{ x: dropdownPos.x, y: dropdownPos.y }}
                                                            onClose={() => setOpenDropdown(null)}
                                                            menuItems={[
                                                                {
                                                                    label: "운송장 등록",
                                                                    onClick: () => {
                                                                        setIsTrackingModalOpen(true); //모달 오픈
                                                                        setOpenDropdown(null); // 드롭다운 닫기
                                                                        console.log("운송장 등록", it.orderItemIdx);
                                                                    },
                                                                },
                                                            ]}
                                                        />
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                        {/* 합계 파트 */}
                                        <tfoot>
                                            <tr>
                                                <td colSpan={6}>합계</td>
                                                <td className="quantity_total">{totalQuantity}</td>
                                                <td className="unitPrice_total">{priceFormat(totalUnitPrice)}</td>
                                                <td></td>
                                                <td className="postCharge_total">{priceFormat(totalPostCharge)}</td>
                                                <td colSpan={2} style={{ textAlign: "right" }}>
                                                    최종 결제 금액 <span style={{ color: "red", marginLeft: "5px" }}>{priceFormat(totalUnitPrice + totalPostCharge)} </span>원
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                {selectableIdxs.length !== 0 && (
                                    <div className="btn_part">
                                        <div className="btn_group">
                                            <button
                                                type="button"
                                                className="primary-button"
                                                onClick={() => {
                                                    const selected = requireSelected(); //선택항목 없을경우 알럿
                                                    if (!selected) return;
                                                    setIsTrackingModalOpen(true);
                                                }}
                                            >
                                                운송장번호 등록
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <ModalTrackingRegist trackingModalOpen={isTrackingModalOpen} setTrackingModalOpen={setIsTrackingModalOpen} selectedItems={getSelected()} targetItemIdx={selectedItem} orderIdx={orderIdx} refresh={getMyOrderDetail} resetChecked={resetChecked} registType="FIRST_SEND" />

                        {/* 클레임 내역 사항 */}
                        <div className="position-relative mt-4"></div>
                    </div>
                </div>
            </main>
        </>
    );
}
