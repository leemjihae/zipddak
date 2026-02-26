import { useState, useEffect } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import AdminPaging from "./AdminPaging";

export default function AdminMembership() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);
    // 검색 키워드
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(1);

    const [membershipList, setMembershipList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const userState = [
        {
            stateCode: 1,
            label: "활성",
        },
        {
            stateCode: 2,
            label: "만료",
        },
    ];

    const clearFilter = () => {
        setDefaultState(1);
        setKeyword("");
        setSearchKeyword("");
        setPage(1);
    };

    // 검색
    const keywordSearch = async () => {
        console.log("클릭");

        setSearchKeyword(keyword);
        // 검색버튼 클릭시 새 배열로 초기화
        setMembershipList([]);
        setPage(1);
    };

    // const testUser = [];

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const search = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/membership?state=${defaultState}&keyword=${searchKeyword}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setMembershipList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        if (!token) return;

        search();
    }, [token, defaultState, page, searchKeyword]);

    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}
            {/* 회원 관리 */}
            <div className="admin-userList-div">
                <div className="admin-userList-top-div">
                    <span className="font-18 medium">멤버십 가입 내역</span>
                </div>

                {/* 검색 필터 라인 */}
                <div className="admin-filter-line-div">
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

                <div>
                    {membershipList.length === 0 ? (
                        <div
                            style={{
                                height: "45px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottom: "1px solid #eaecf0",
                            }}
                        >
                            <span className="font-12 medium">데이터가 존재하지 않습니다.</span>
                        </div>
                    ) : (
                        <div className="admin-userList-table-div">
                            <Table hover className="admin-userList-table">
                                <thead>
                                    <tr>
                                        <td>
                                            <span className="font-14 medium">멤버십 번호</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">아이디</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">활동명</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">시작일</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">만료일</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">결제일</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">활성상태</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {membershipList.map((membership) => (
                                        <tr key={membership.membershipIdx}>
                                            <td>
                                                <span className="font-14">{membership.membershipIdx}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{membership.username}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{membership.activityName}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{membership.startDate}</span>
                                            </td>

                                            <td>
                                                <span className="font-14">{membership.endDate}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{new Date(membership.paymentDate).toLocaleString("ko-KR")}</span>
                                            </td>
                                            <td>
                                                <div className="user-state-badge">
                                                    {defaultState === 1 ? (
                                                        <div className="membership-state-code-1">
                                                            <span className="font-12 medium">활성</span>
                                                        </div>
                                                    ) : (
                                                        <div className="membership-state-code-2">
                                                            <span className="font-12 medium">만료</span>
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
