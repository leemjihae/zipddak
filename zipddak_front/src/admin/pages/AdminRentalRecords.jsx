import { useState, useEffect } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import AdminPaging from "./AdminPaging";

export default function AdminRentalRecords() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);

    // 속성명
    const [defaultColumn, setDefaultColumn] = useState(1);

    const [startDate, setStartDate] = useState("");
    const [searchStartDate, setSearchStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");

    // 검색 키워드
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(1);

    const [rentalList, setRentalList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const userState = [
        {
            stateCode: 1,
            label: "결제대기",
        },
        {
            stateCode: 2,
            label: "결제완료",
        },
        {
            stateCode: 3,
            label: "배송중",
        },
        {
            stateCode: 4,
            label: "대여중",
        },
        {
            stateCode: 5,
            label: "반납완료",
        },
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
        setRentalList([]);
        setPage(1);
    };

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const search = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/rentals?state=${defaultState}&column=${defaultColumn}&keyword=${searchKeyword}&startDate=${searchStartDate}&endDate=${searchEndDate}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setRentalList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        if (!token) return;

        search();
    }, [token, defaultState, page, searchKeyword, searchStartDate, searchEndDate]);
    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}
            {/* 회원 관리 */}
            <div className="admin-userList-div">
                <div className="admin-userList-top-div">
                    <span className="font-18 medium">회원관리</span>
                </div>

                {/* 중 헤더 */}
                <div className="admin-middle-header">
                    <span className="font-15 medium">대여내역</span>
                </div>

                {/* 검색 필터 라인 */}
                <div className="admin-filter-line-div-rental">
                    <div className="admin-filter-line-div-top">
                        <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} className="admin-filter-input-date font-13" type="date" />
                        <span className="font-22 medium">~</span>
                        <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} className="admin-filter-input-date font-13" type="date" />
                    </div>
                    <div className="admin-filter-line-div-under">
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

                        {/* 우측 검색 필터 */}
                        <div className="admin-userList-filter-right">
                            {/* 필터 select */}
                            <select onChange={(e) => setDefaultColumn(e.target.value)} className="admin-userList-filter-select font-13" name="" id="">
                                <option value={1}>전체</option>
                                <option value={2}>공구명</option>
                                <option value={3}>빌려준 사람</option>
                                <option value={4}>빌린 사람</option>
                            </select>

                            {/* 검색 input */}
                            <div className="admin-userList-search-div">
                                <i className="bi bi-search"></i>
                                <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="font-12 admin-userList-search-input" placeholder="검색어를 입력해주세요" />
                            </div>

                            {/* 검색 버튼 */}
                            <button onClick={keywordSearch} className="admin-userList-search-button font-13 medium">
                                검색
                            </button>

                            {/* 초기화 버튼 */}
                            <button onClick={clearFilter} className="admin-userList-clean-button font-13 medium">
                                초기화
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    {rentalList.length === 0 ? (
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
                                            <span className="font-14 medium">대여번호</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">공구명</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">빌려준 사람</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">빌린 사람</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">대여날짜</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">반납날짜</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">대여상태</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rentalList.map((rental) => (
                                        <tr key={rental.rentalIdx}>
                                            <td>
                                                <span className="font-14">{rental.rentalIdx}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{rental.toolName}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{rental.owner}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{rental.borrower}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{rental.startDate}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{rental.endDate}</span>
                                            </td>
                                            <td>
                                                <div className="user-state-badge">
                                                    {rental.state === "PRE" ? (
                                                        <div className="rental-state-code-1">
                                                            <span className="font-12 medium">결제대기</span>
                                                        </div>
                                                    ) : rental.state === "PAYED" ? (
                                                        <div className="rental-state-code-2">
                                                            <span className="font-12 medium">결제완료</span>
                                                        </div>
                                                    ) : rental.state === "DELIVERY" ? (
                                                        <div className="rental-state-code-2">
                                                            <span className="font-12 medium">배송중</span>
                                                        </div>
                                                    ) : rental.state === "RENTAL" ? (
                                                        <div className="rental-state-code-2">
                                                            <span className="font-12 medium">대여중</span>
                                                        </div>
                                                    ) : (
                                                        <div className="rental-state-code-3">
                                                            <span className="font-12 medium">반납완료</span>
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
