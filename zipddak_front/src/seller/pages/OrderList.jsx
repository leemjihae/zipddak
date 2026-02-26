//css
import table from "../css/table.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";
import { priceFormat } from "../js/priceFormat.jsx";

import { FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useNavigate } from "react-router-dom"; //페이지 이동
import { useState, useEffect, useRef } from "react";
import { myAxios } from "../../config.jsx";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";

export default function OrderList() {
    const pageTitle = usePageTitle("주문관리 > 주문 내역 리스트");
    const navigate = useNavigate();

    const [myOrderList, setMyOrderList] = useState([]);
    const [myOrderCount, setMyOrderCount] = useState(0);
    const [pageBtn, setPageBtn] = useState([]);
    const [pageInfo, setPageInfo] = useState({});
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 필터 상태값
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [searchDate, setSearchDate] = useState("");

    // 주문 상태 체크박스 value 고정
    const ORDER_STATUS = ["상품준비중", "배송중", "배송완료", "교환", "환불", "취소"];

    // 주문 상태 체크박스 변경
    const onChangeStatus = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (value === "all") {
            if (checked) {
                // 전체 선택하면 필터 초기화
                setSelectedStatus([]);
            }
            return;
        }

        if (checked) {
            setSelectedStatus((prev) => [...prev, value]);
        } else {
            setSelectedStatus((prev) => prev.filter((v) => v !== value));
        }
    };

    //날짜 변경 시 자동 검색
    useEffect(() => {
        user.username && submit(1);
    }, [searchDate, selectedStatus, user]);

    // 검색/페이징 공통 함수
    const submit = (page = 1) => {
        const params = new URLSearchParams();

        params.append("sellerId", user.username);
        params.append("page", page);

        if (searchDate) params.append("searchDate", searchDate);
        if (selectedStatus.length > 0) params.append("orderStateList", selectedStatus.join(","));
        if (keyword) params.append("keyword", keyword);

        const orderListUrl = `/seller/order/myOrderList?${params.toString()}`;

        myAxios(token, setToken)
            .get(orderListUrl)
            .then((res) => {
                const data = res.data;
                setMyOrderList(data.myOrderList);
                setMyOrderCount(data.myOrderCount);

                const pageData = {
                    curPage: data.curPage,
                    allPage: data.allPage,
                    startPage: data.startPage,
                    endPage: data.endPage,
                };
                setPageInfo(pageData);

                const btns = [];
                for (let i = pageData.startPage; i <= pageData.endPage; i++) {
                    btns.push(i);
                }
                setPageBtn(btns);
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i className="bi bi-basket3"></i>
                        <span>주문 내역</span>
                    </div>

                    <div className="bodyFrame">
                        <div className={table.tableFrame}>
                            {/* 필터영역 */}
                            <div className={table.filterArea}>
                                {/* 날짜 */}
                                <div className={table.filterColumn}>
                                    <div className={table.filterTitle}>주문일자</div>
                                    <FormGroup>
                                        <Input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                                    </FormGroup>
                                </div>

                                {/* 주문 상태 */}
                                <div className={table.filterColumn}>
                                    <div className={table.filterTitle}>주문 상태</div>
                                    <div className={table.filterBody}>
                                        <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" value="all" checked={selectedStatus.length === 0} onChange={onChangeStatus} />
                                                전체
                                            </Label>
                                        </FormGroup>

                                        {ORDER_STATUS.map((status) => (
                                            <FormGroup check inline key={status}>
                                                <Label check>
                                                    <Input type="checkbox" value={status} checked={selectedStatus.includes(status)} onChange={onChangeStatus} />
                                                    {status}
                                                </Label>
                                            </FormGroup>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 테이블 영역 */}
                            <div className={table.tableArea}>
                                <div className={table.wholeTable}>
                                    <div className={table.tableHeader}>
                                        <div className={table.totalSearchBox}>
                                            <Input name="search" placeholder="통합검색" type="search" className={table.searchInput} onChange={(e) => setKeyword(e.target.value)} />
                                            <button type="button" className="small-button" onClick={() => submit(1)}>
                                                검색
                                            </button>
                                        </div>
                                    </div>
                                    <div className={table.tableBody}>
                                        <table className={table.list_table}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "15%" }}>주문번호</th>
                                                    <th style={{ width: "30%" }}>상품명</th>
                                                    <th style={{ width: "20%" }}>구매자</th>
                                                    <th style={{ width: "10%" }}>결제금액</th>
                                                    <th style={{ width: "10%" }}>주문상태</th>
                                                    <th style={{ width: "15%" }}>주문일자</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myOrderList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className={table.noData} style={{ textAlign: "center" }}>
                                                            현재 주문건이 없습니다.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    myOrderList.map((myOrder) => (
                                                        <tr key={myOrder.orderIdx} onClick={() => navigate(`/seller/orderDetail/${myOrder.orderIdx}`)}>
                                                            <td>{myOrder.orderCode}</td>
                                                            <td className={table.title_cell}>
                                                                <span className={table.title_cell}>{myOrder.productName}</span> 포함 총 {myOrder.itemCount} 건
                                                            </td>
                                                            <td>{myOrder.customerUsername}</td>
                                                            <td className={table.price_cell}>{priceFormat(myOrder.totalAmount)}</td>
                                                            <td>{myOrder.orderStatus}</td>
                                                            <td>{myOrder.createdAt}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={table.totalCnt}>
                                        <p>[총 주문 건수: {myOrderCount}]</p>
                                    </div>
                                </div>
                                <div className="pagination_part">
                                    <Pagination className={table.my_pagination}>
                                        <PaginationItem>
                                            <PaginationLink previous onClick={() => submit(pageInfo.curPage - 1)} />
                                        </PaginationItem>

                                        {pageBtn.map((p) => (
                                            <PaginationItem key={p} active={pageInfo.curPage === p}>
                                                <PaginationLink onClick={() => submit(p)}>{p}</PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationLink next onClick={() => submit(pageInfo.curPage + 1)} />
                                        </PaginationItem>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
