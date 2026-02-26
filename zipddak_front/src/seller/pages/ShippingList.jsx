//css
import table from "../css/table.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";
//library
import { FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useNavigate } from "react-router-dom"; //페이지 이동
import { useState, useEffect, useRef } from "react";
import { myAxios } from "../../config.jsx";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";

export default function ShippingList() {
    const pageTitle = usePageTitle("주문관리 > 배송 관리");
    const navigate = useNavigate();
    const [token, setToken] = useAtom(tokenAtom);
    const [user, setUser] = useAtom(userAtom);

    const [myShippingList, setMyShippingList] = useState([]);
    const [myShippingCount, setMyShippingCount] = useState(0);
    const [pageBtn, setPageBtn] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    // 필터 상태값
    const [searchDate, setSearchDate] = useState(""); //주문일자
    const [selectedStatus, setSelectedStatus] = useState([]); //주문상태
    const [keyword, setKeyword] = useState(""); //검색어

    // 주문 상태 체크박스 value 고정
    const ORDER_STATUS = ["배송중", "배송완료", "교환", "환불"];

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

    //날짜 변경 시 자동 검색 + 필터 변경 시 자동 submit
    useEffect(() => {
        user.username && submit(1);
    }, [searchDate, selectedStatus]);

    // 검색/페이징 공통 함수
    const submit = (page = 1) => {
        const params = new URLSearchParams();

        params.append("sellerId", user.username);
        params.append("page", page);

        if (keyword) params.append("keyword", keyword);
        if (searchDate) params.append("searchDate", searchDate);
        if (selectedStatus.length > 0) params.append("orderStateList", selectedStatus.join(","));

        const shippingListUrl = `/seller/shipping/myShippingList?${params.toString()}`;

        myAxios(token, setToken)
            .get(shippingListUrl)
            .then((res) => {
                const data = res.data;
                console.log(data);

                setMyShippingList(data.myShippingList);
                setMyShippingCount(data.myShippingCount);

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

    // 최초 1회 로딩
    useEffect(() => {
        user.username && submit(1);
    }, [user]);

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i className="bi bi-truck"></i>
                        <span>배송 내역</span>
                    </div>

                    <div className="bodyFrame">
                        <div className={table.tableFrame}>
                            {/* 필터영역 */}
                            <div className={table.filterArea}>
                                <div className={table.filterColumn}>
                                    <div className={table.filterTitle}>주문일자</div>
                                    <FormGroup>
                                        <Input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
                                    </FormGroup>
                                </div>
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
                                            <button type="button" className="small-button">
                                                검색
                                            </button>
                                        </div>
                                    </div>
                                    <div className={table.tableBody}>
                                        <table className={table.list_table}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "auto" }}>주문번호</th>
                                                    <th style={{ width: "20%" }}>상품명</th>
                                                    <th style={{ width: "auto" }}>최초 출고일자</th>
                                                    <th style={{ width: "auto" }}>최초 송장번호</th>
                                                    <th style={{ width: "auto" }}>택배사</th>
                                                    <th style={{ width: "auto" }}>주문상태</th>
                                                    <th style={{ width: "auto" }}>주문일자</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myShippingList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className={table.noData} style={{ textAlign: "center" }}>
                                                            현재 배송 진행 건이 없습니다.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    myShippingList.map((myShipping) => (
                                                        <tr key={myShipping.trackingNo} onClick={() => navigate(`/seller/shippingDetail/${myShipping.orderIdx}`)}>
                                                            <td>{myShipping.orderCode}</td>
                                                            <td className={table.title_cell}>
                                                                <span className={table.title_cell}>{myShipping.shippingProductName}</span> 포함 총 {myShipping.itemCount} 건
                                                            </td>
                                                            <td>{myShipping.firstShipDate?.substring(0, 10)}</td>
                                                            <td>{myShipping.trackingNo}</td>
                                                            <td>{myShipping.postComp}</td>
                                                            <td>{myShipping.orderStatus}</td>
                                                            <td>{myShipping.orderDate}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={table.totalCnt}>
                                        <p>[총 배송 건수: {myShippingCount}]</p>
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
