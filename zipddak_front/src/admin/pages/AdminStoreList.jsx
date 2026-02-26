import { useEffect, useState } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import AdminPaging from "./AdminPaging";

export default function AdminStoreList() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    // 전문 서비스
    const [defaultProductCode, setDefaultProductCode] = useState(0);

    // 검색 키워드
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(1);

    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);

    const [sellerList, setSellerList] = useState([]);
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

    const productCode = [
        {
            productCode: 0,
            label: "전체",
        },
        {
            productCode: 1,
            label: "주방",
        },
        {
            productCode: 6,
            label: "욕실",
        },
        {
            productCode: 14,
            label: "중문/도어",
        },
        {
            productCode: 15,
            label: "폴딩도어",
        },
        {
            productCode: 16,
            label: "벽지/장판/마루",
        },
        {
            productCode: 17,
            label: "타일",
        },
        {
            productCode: 18,
            label: "시트/필름",
        },
        {
            productCode: 19,
            label: "스위치/콘센트",
        },
        {
            productCode: 20,
            label: "커튼블라인드",
        },
        {
            productCode: 21,
            label: "페인트",
        },
        {
            productCode: 22,
            label: "조명",
        },
    ];

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const clearFilter = () => {
        setDefaultState(1);
        setDefaultProductCode(0);
        setKeyword("");
        setSearchKeyword("");
        setPage(1);
    };

    // const testUser = [];

    const testUser = [
        {
            storeNo: 1,
            storeName: "홍길동",
            managerName: "hong123@kosta.com",
            reportCount: 0,
            storeTel: "010-1234-1234",
            createdAt: "2025-11-09",
            stateCode: 1,
        },
    ];

    // 검색
    const keywordSearch = async () => {
        console.log("클릭");

        setSearchKeyword(keyword);
        // 검색버튼 클릭시 새 배열로 초기화
        setSellerList([]);
        setPage(1);
    };

    const search = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/sellers?productCode=${defaultProductCode}&state=${defaultState}&keyword=${searchKeyword}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setSellerList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        if (!token) return;

        search();
    }, [token, page, defaultProductCode, defaultState, searchKeyword]);

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
                    <span className="font-15 medium">자재판매업체</span>
                </div>

                <div className="admin-middle-header-store admin-middle-store-filter">
                    {productCode.map((product) => (
                        <button
                            onClick={() => setDefaultProductCode(product.productCode)}
                            className={defaultProductCode === product.productCode ? "admin-expert-select-major store-product-type" : "admin-expert-default-major store-product-type"}
                            key={product.productCode}
                        >
                            {product.label}
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
                    {testUser.length === 0 ? (
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
                                            <span className="font-14 medium">업체번호</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">업체명</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">대표자 이름</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">누적 신고 수</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">업체 전화번호</span>
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
                                    {sellerList.map((seller) => (
                                        <tr key={seller.sellerIdx}>
                                            <td>
                                                <span className="font-14">{seller.sellerIdx}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{seller.compName}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{seller.brandName}</span>
                                            </td>

                                            <td>
                                                <span className="font-14">{seller.reportCount}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{seller.managerTel}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{seller.createdAt}</span>
                                            </td>
                                            <td>
                                                <div className="user-state-badge">
                                                    {seller.state === "ACTIVE" ? (
                                                        <div className="user-state-code-1">
                                                            <span className="font-12 medium">정상</span>
                                                        </div>
                                                    ) : seller.state === "STOPPED" ? (
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
