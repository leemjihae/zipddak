import { useEffect, useState } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import AdminPaging from "./AdminPaging";

export default function AdminExpertList() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    // 전문 서비스
    const [defaultMajor, setDefaultMajor] = useState(0);

    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);
    // 속성명
    const [defaultColumn, setDefaultColumn] = useState(1);
    // 검색 키워드
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(1);

    const [expertList, setExpertList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const userState = [
        {
            stateCode: 1,
            label: "전체",
        },
        {
            stateCode: 2,
            label: "정상",
        },
        {
            stateCode: 3,
            label: "활동정지",
        },
        {
            stateCode: 4,
            label: "신청처리중",
        },
    ];

    const expertMajor = [
        {
            majorCode: 0,
            label: "전체",
        },
        {
            majorCode: 23,
            label: "수리",
        },
        {
            majorCode: 44,
            label: "인테리어",
        },
        {
            majorCode: 74,
            label: "시공/견적 컨설팅",
        },
    ];

    const clearFilter = () => {
        setDefaultState(1);
        setDefaultColumn(1);
        setDefaultMajor(0);
        setKeyword("");
        setSearchKeyword("");
        setPage(1);
    };

    // 검색
    const keywordSearch = async () => {
        console.log("클릭");

        setSearchKeyword(keyword);
        // 검색버튼 클릭시 새 배열로 초기화
        setExpertList([]);
        setPage(1);
    };

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const search = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/experts?major=${defaultMajor}&state=${defaultState}&column=${defaultColumn}&keyword=${searchKeyword}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setExpertList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        if (!token) return;

        search();
    }, [token, defaultMajor, defaultState, defaultColumn, searchKeyword, page]);

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
                    <span className="font-15 medium">전문가</span>
                </div>

                <div className="admin-middle-header admin-middle-filter">
                    {expertMajor.map((major) => (
                        <button
                            onClick={() => setDefaultMajor(major.majorCode)}
                            className={defaultMajor === major.majorCode ? "admin-expert-select-major" : "admin-expert-default-major"}
                            key={major.majorCode}
                        >
                            {major.label}
                        </button>
                    ))}
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
                        {/* 필터 select */}
                        <select onChange={(e) => setDefaultColumn(e.target.value)} className="admin-userList-filter-select font-13" name="" id="">
                            <option value={1}>전체</option>
                            <option value={2}>활동명</option>
                            <option value={3}>아이디</option>
                            <option value={4}>휴대전화</option>
                        </select>

                        {/* 검색 input */}
                        <div className="admin-userList-search-div">
                            <i className="bi bi-search"></i>
                            <Input onChange={(e) => setKeyword(e.target.value)} className="font-12 admin-userList-search-input" placeholder="검색어를 입력해주세요" />
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
                    {expertList.length === 0 ? (
                        <div
                            style={{
                                height: "45px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottom: "1px solid #eaecf0",
                            }}
                        >
                            <span className="font-12 medium">회원 정보를 검색해주세요.</span>
                        </div>
                    ) : (
                        <div className="admin-userList-table-div">
                            <Table hover className="admin-userList-table">
                                <thead>
                                    <tr>
                                        <td>
                                            <span className="font-14 medium">전문가 번호</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">활동명</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">아이디</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">누적 신고 수</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">카테고리</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">휴대전화</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">가입일</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">활동상태</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expertList.map((expert) => (
                                        <tr key={expert.expertIdx}>
                                            <td>
                                                <span className="font-14">{expert.expertIdx}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{expert.activityName}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{expert.username}</span>
                                            </td>

                                            <td>
                                                <span className="font-14">{expert.reportCount}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{expert.cateName}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{expert.phone}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{expert.createdAt}</span>
                                            </td>
                                            <td>
                                                <div className="user-state-badge">
                                                    {expert.state === "ACTIVE" ? (
                                                        <div className="user-state-code-1">
                                                            <span className="font-12 medium">정상</span>
                                                        </div>
                                                    ) : expert.state === "STOPPED" ? (
                                                        <div className="user-state-code-2">
                                                            <span className="font-12 medium">활동정지</span>
                                                        </div>
                                                    ) : (
                                                        <div className="user-state-code-3">
                                                            <span className="font-12 medium">신청처리중</span>
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
