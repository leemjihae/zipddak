import { useState, useEffect } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import AdminPaging from "./AdminPaging";

export default function PaymentHistory() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    // 전문 서비스
    const [defaultMajor, setDefaultMajor] = useState(1);

    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);

    // 검색 키워드
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(1);

    const [paymentList, setPaymentList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const userState = [
        {
            stateCode: 1,
            label: "결제 완료",
        },
        {
            stateCode: 2,
            label: "취소/환불",
        },
    ];

    const expertMajor = [
        {
            majorCode: 1,
            label: "전체",
        },
        {
            majorCode: 2,
            label: "공구 대여",
        },
        {
            majorCode: 3,
            label: "전문가 매칭",
        },
        {
            majorCode: 4,
            label: "자재 구매",
        },
        {
            majorCode: 5,
            label: "멤버십",
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
        setSaleList([]);
        setPage(1);
    };

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const search = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/payments?state=${defaultState}&type=${defaultMajor}&keyword=${searchKeyword}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setPaymentList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        if (!token) return;

        search();
    }, [token, defaultState, defaultMajor, searchKeyword, page]);

    // const testUser = [];

    const testUser = [
        {
            paymentNo: 1,
            userName: "홍길동",
            service: "자재 구매",
            payment: 10000,
            paymentDate: "2025-11-09",
            stateCode: 1,
        },
        {
            paymentNo: 2,
            userName: "홍길동",
            service: "자재 구매",
            payment: 10000,
            paymentDate: "2025-11-09",
            stateCode: 2,
        },
        {
            paymentNo: 3,
            userName: "홍길동",
            service: "자재 구매",
            payment: 10000,
            paymentDate: "2025-11-09",
            stateCode: 3,
        },
    ];

    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}
            {/* 회원 관리 */}
            <div className="admin-userList-div">
                <div className="admin-userList-top-div">
                    <span className="font-18 medium">결제내역</span>
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
                    {paymentList.length === 0 ? (
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
                                            <span className="font-14 medium">결제번호</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">주문번호</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">구매상품</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">결제 승인 시간</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">결제수단</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">결제금액</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">처리상태</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentList.map((payment) => (
                                        <tr key={payment.paymentIdx}>
                                            <td>
                                                <span className="font-14">{payment.paymentIdx}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{payment.orderId}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{payment.orderName}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{new Date(payment.approvedAt).toLocaleString("ko-KR")}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{payment.method}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{payment.amount.toLocaleString()}원</span>
                                            </td>
                                            <td>
                                                <div className="user-state-badge">
                                                    {payment.state === "DONE" ? (
                                                        <div className="payment-state-code-1">
                                                            <span className="font-12 medium">결제완료</span>
                                                        </div>
                                                    ) : (
                                                        <div className="payment-state-code-3">
                                                            <span className="font-12 medium">취소/환불</span>
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
