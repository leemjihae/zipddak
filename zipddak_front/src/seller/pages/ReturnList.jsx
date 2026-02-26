//css
import table from "../css/table.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";

import { FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { myAxios } from "../../config.jsx";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";

export default function ReturnList() {
    const pageTitle = usePageTitle("주문관리 > 반품 내역 리스트");
    const navigate = useNavigate();
    const [token, setToken] = useAtom(tokenAtom);
    const [user, setUser] = useAtom(userAtom);

    const [myRefundList, setMyRefundList] = useState([]);
    const [myRefundCount, setMyRefundCount] = useState(0);
    const [pageBtn, setPageBtn] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    // 필터 상태값
    const [searchOrderDate, setSearchOrderDate] = useState("");
    const [searchRequestDate, setSearchRequestDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [keyword, setKeyword] = useState("");

    // 처리 상태 체크박스 value 고정
    const REFUND_STATUS = ["반품요청", "반품회수", "반품완료", "반품거절"];

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

    // 처리 상태 체크박스 변경
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
    }, [searchOrderDate, searchRequestDate, selectedStatus, user]);

    // 검색/페이징 공통 함수
    const submit = (page = 1) => {
        const params = new URLSearchParams();

        params.append("sellerId", user.username);
        params.append("page", page);

        if (keyword) params.append("keyword", keyword);
        if (searchOrderDate) params.append("searchOrderDate", searchOrderDate);
        if (searchRequestDate) params.append("searchRequestDate", searchRequestDate);
        if (selectedStatus.length > 0) params.append("refundStateList", selectedStatus.join(","));

        const refundListUrl = `/seller/refund/myRefundList?${params.toString()}`;

        myAxios(token, setToken)
            .get(refundListUrl)
            .then((res) => {
                const data = res.data;
                setMyRefundList(data.myRefundList);
                setMyRefundCount(data.myRefundCount);

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
    // useEffect(() => {
    //     submit(1);
    // }, []);

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i className="bi bi-reply"></i>
                        <span>반품 관리</span>
                    </div>

                    <div className="bodyFrame">
                        <div className={table.tableFrame}>
                            {/* 필터영역 */}
                            <div className={table.filterArea}>
                                <div className={table.filterColumn}>
                                    <div className={table.filterTitle}>주문일자</div>
                                    <div>
                                        <FormGroup>
                                            <Input type="date" value={searchOrderDate} onChange={(e) => setSearchOrderDate(e.target.value)} />
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className={table.filterColumn}>
                                    <div className={table.filterTitle}>반품요청일</div>
                                    <div>
                                        <FormGroup>
                                            <Input type="date" value={searchRequestDate} onChange={(e) => setSearchRequestDate(e.target.value)} />
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className={table.filterColumn}>
                                    <div className={table.filterTitle}>처리상태</div>
                                    <div className={table.filterBody}>
                                        <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" value="all" checked={selectedStatus.length === 0} onChange={onChangeStatus} />
                                                전체
                                            </Label>
                                        </FormGroup>
                                        {REFUND_STATUS.map((status) => (
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
                                                    <th style={{ width: "10%" }}>주문일자</th>
                                                    <th style={{ width: "15%" }}>주문번호</th>
                                                    <th style={{ width: "15%" }}>상품명</th>
                                                    <th style={{ width: "10%" }}>구매자</th>
                                                    <th style={{ width: "10%" }}>택배사</th>
                                                    <th style={{ width: "10%" }}>수거송장</th>
                                                    <th style={{ width: "10%" }}>처리상태</th>
                                                    <th style={{ width: "15%" }}>반품요청일</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myRefundList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className={table.noData} style={{ textAlign: "center" }}>
                                                            게시물이 없습니다.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    myRefundList.map((myRefund) => (
                                                        <tr key={myRefund.refundIdx} onClick={() => navigate(`/seller/returnDetail/${myRefund.refundIdx}`)}>
                                                            <td>{myRefund.orderDate}</td>
                                                            <td>{myRefund.orderCode}</td>
                                                            <td className={table.title_cell}>
                                                                <span className={table.title_cell}>{myRefund.refundProductName}</span> 포함 총 {myRefund.refundItemCount} 건
                                                            </td>
                                                            <td>{myRefund.username}</td>
                                                            <td>{getPostCompName(myRefund.pickupPostComp)}</td>
                                                            <td>{myRefund.pickupTrackingNo ? myRefund.pickupTrackingNo : "-"}</td>
                                                            <td>{myRefund.orderStatus}</td>
                                                            <td>{myRefund.createdAt}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={table.totalCnt}>
                                        <p>[총 반품 건수: {myRefundCount}]</p>
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
