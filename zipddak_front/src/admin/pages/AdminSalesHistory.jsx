import { useState, useEffect } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import AdminPaging from "./AdminPaging";

export default function AdminSalesHistory() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);
    // 속성명
    const [defaultColumn, setDefaultColumn] = useState(1);
    // 검색 키워드
    const [startDate, setStartDate] = useState("");
    const [searchStartDate, setSearchStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");

    // 검색 키워드
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(1);

    const [saleList, setSaleList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const userState = [
        {
            stateCode: 1,
            label: "결제완료",
        },
        {
            stateCode: 2,
            label: "결제취소",
        },
        // {
        //     stateCode: 3,
        //     label: "상품준비중",
        // },
        // {
        //     stateCode: 4,
        //     label: "취소완료",
        // },
        // {
        //     stateCode: 5,
        //     label: "교환완료",
        // },
        // {
        //     stateCode: 6,
        //     label: "반품완료",
        // },
    ];

    const clearFilter = () => {
        setDefaultState(1);
        setStartDate("");
        setEndDate("");
        setSearchStartDate("");
        setSearchEndDate("");
        setKeyword("");
        setSearchKeyword("");
        setPage(1);
    };

    // 검색
    const keywordSearch = async () => {
        console.log("클릭");

        setSearchKeyword(keyword);
        setSearchStartDate(startDate);
        setSearchEndDate(endDate);
        // 검색버튼 클릭시 새 배열로 초기화
        setSaleList([]);
        setPage(1);
    };

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const search = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/sales?state=${defaultState}&column=${defaultColumn}&keyword=${searchKeyword}&startDate=${searchStartDate}&endDate=${searchEndDate}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setSaleList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        if (!token) return;

        search();
    }, [token, defaultState, page, searchKeyword, searchStartDate, searchEndDate]);

    // const testUser = [];

    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}
            {/* 회원 관리 */}
            <div className="admin-userList-div">
                <div className="admin-userList-top-div">
                    <span className="font-18 medium">이용 내역</span>
                </div>

                <div className="admin-middle-header admin-middle-filter">
                    <span className="font-15 medium">자재판매</span>
                </div>

                {/* 검색 필터 라인 */}
                <div className="admin-filter-sales-line-div" style={{ height: "60px" }}>
                    {/* 우측 검색 필터 */}
                    <div className="admin-sales-filter-right" style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                        {/* 활동 상태 */}
                        <div className="admin-userList-radio-div">
                            {userState.map((state) => (
                                <div key={state.stateCode} className="admin-radio-div">
                                    <input
                                        className="admin-radio"
                                        onChange={() => setDefaultState(state.stateCode)}
                                        checked={defaultState === state.stateCode}
                                        type="radio"
                                        name="userState"
                                        id={state.stateCode}
                                    />
                                    <label style={{ marginLeft: "5px", display: "flex", alignItems: "center" }} htmlFor={state.stateCode}>
                                        <span className="font-14">{state.label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="admin-filter-line-div-top">
                            <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} className="admin-filter-input-date font-13" type="date" />
                            <span className="font-22 medium">~</span>
                            <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} className="admin-filter-input-date font-13" type="date" />
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <select onChange={(e) => setDefaultColumn(e.target.value)} className="admin-userList-filter-select font-13" name="" id="">
                                <option value={1}>전체</option>
                                <option value={2}>주문번호</option>
                                <option value={3}>주문코드</option>
                                <option value={4}>구매자</option>
                            </select>

                            <div className="admin-userList-search-div">
                                <i className="bi bi-search"></i>
                                <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="font-12 admin-userList-search-input" placeholder="검색어를 입력해주세요" />
                            </div>

                            <button onClick={keywordSearch} className="admin-userList-search-button font-13 medium">
                                검색
                            </button>
                            <button onClick={clearFilter} className="admin-userList-clean-button font-13 medium">
                                초기화
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    {saleList.length === 0 ? (
                        <div
                            style={{
                                height: "45px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottom: "1px solid #eaecf0",
                            }}
                        >
                            <span className="font-12 medium">대여 내역이 존재하지 않습니다.</span>
                        </div>
                    ) : (
                        <div className="admin-userList-table-div">
                            <Table hover className="admin-userList-table">
                                <thead>
                                    <tr>
                                        <td>
                                            <span className="font-14 medium">주문번호</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">주문코드</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">구매자</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">수령인</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">결제금액</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">구매날짜</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">주문상태</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {saleList.map((sales) => (
                                        <tr key={sales.orderIdx}>
                                            <td>
                                                <span className="font-14">{sales.orderIdx}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{sales.orderCode}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{sales.buyer}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{sales.recv}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{sales.amount}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{sales.createdAt}</span>
                                            </td>
                                            <td>
                                                <div className="user-state-badge">
                                                    {sales.state === "결제완료" ? (
                                                        <div className="rental-state-code-1">
                                                            <span className="font-12 medium">결제완료</span>
                                                        </div>
                                                    ) : (
                                                        <div className="rental-state-code-3">
                                                            <span className="font-12 medium">결제취소</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <AdminPaging pageInfo={pageInfo} handlePageClick={handlePageClick} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
