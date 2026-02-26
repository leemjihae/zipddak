import { useState, useEffect } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table, Modal, ModalBody } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import AdminPaging from "./AdminPaging";

export default function AdminSwitchAccountRequests() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 페이지 강제 새로고침
    const [refreshFlag, setRefreshFlag] = useState(false);

    // 전문 서비스
    const [defaultRole, setDefaultRole] = useState(1);
    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);
    // 속성명
    const [defaultColumn, setDefaultColumn] = useState(1);
    // 검색 키워드
    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [page, setPage] = useState(1);

    const [userList, setUserList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    // 전문가 상세
    const [expertInfo, setExpertInfo] = useState({});
    const [selectExpertIdx, setSelectExpertIdx] = useState(0);
    const [expertResult, setExpertResult] = useState(0);
    // 판매업체 상세
    const [sellerInfo, setSellerInfo] = useState({});
    const [selectSellerIdx, setSelectSellerIdx] = useState(0);
    const [sellerResult, setSellerResult] = useState(0);

    // 전문가 요청
    const requestExpert = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/requestExpert?state=${defaultState}&column=${defaultColumn}&keyword=${searchKeyword}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setUserList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    // 판매업체 요청
    const requestSeller = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/requestSeller?state=${defaultState}&column=${defaultColumn}&keyword=${searchKeyword}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setUserList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        if (!token) return;
        // if (searchKeyword === "") return;
        // defaultRole 값에 따라 상태 변경
        if (defaultRole === 1) {
            requestExpert(); // 상태 바꾸면서 즉시 호출
        } else if (defaultRole === 2) {
            requestSeller(); // 상태 바꾸면서 즉시 호출
        }
    }, [token, defaultRole, page, searchKeyword, defaultState, defaultColumn, refreshFlag]);

    // 카테고리가 바뀔때마다 페이지 1로 초기화
    useEffect(() => {
        if (!page) return;

        setPage(1);
        setPageInfo({});
    }, [defaultRole]);

    const userState = [
        {
            stateCode: 1,
            label: "대기",
        },
        {
            stateCode: 2,
            label: "거부",
        },
    ];

    const roleCode = [
        {
            roleCode: 1,
            label: "전문가",
        },
        {
            roleCode: 2,
            label: "자재판매업체",
        },
    ];

    const modalTest = {
        userNo: 1,
        userName: "홍길동",
        peopleCount: 5,
        major: "수리",
        userTel: "010-1234-1234",
        requestedAt: "2025-11-09",
        switchStateCode: 1,
        businessNumber: "123-12-12345",
        address: "서울시 금천구",
        bank: "국민",
        accountNum: "000000-00-000000",
    };

    const storeTest = {
        userNo: 1,
        storeName: "홍길동",
        tel: "010-1234-1234",
        homeLink: "https://",
        businessNumber: "123-12-12345",
        bank: "국민",
        accountNum: "000000-00-000000",
    };

    // 컬럼 정의
    const columns =
        defaultRole === 1
            ? [
                  { label: "신청자아이디", key: "username" },
                  { label: "신청자", key: "name" },
                  { label: "전화번호", key: "phone" },
                  { label: "사업자 번호", key: "businesslicense" },
                  { label: "전문분야", key: "mainService" },
                  { label: "직원수", key: "employeeCount" },
                  { label: "신청일", key: "createdAt" },
                  { label: "처리상태", key: "activityStatus" },
              ]
            : [
                  { label: "회사명", key: "requestNo" },
                  { label: "브랜드명", key: "storeName" },
                  { label: "대표자", key: "userName" },
                  { label: "전화번호", key: "userTel" },
                  { label: "사업자 번호", key: "businessNumber" },
                  { label: "홈페이지", key: "hompageLink" },
                  { label: "신청일", key: "requestedAt" },
                  { label: "처리상태", key: "switchStateCode" },
              ];

    const filterOptions =
        defaultRole === 1
            ? [
                  // 전문가
                  { value: 1, label: "전체" },
                  { value: 2, label: "신청자" },
                  { value: 3, label: "전화번호" },
                  { value: 4, label: "사업자 번호" },
              ]
            : [
                  // 자재판매업체
                  { value: 1, label: "전체" },
                  { value: 2, label: "회사명" },
                  { value: 3, label: "브랜드명" },
                  { value: 4, label: "대표자" },
                  { value: 5, label: "전화번호" },
                  { value: 6, label: "사업자 번호" },
              ];

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const clearFilter = () => {
        setDefaultState(1);
        setDefaultColumn(1);
        setKeyword("");
        setSearchKeyword("");
        setPage(1);
    };

    // 검색
    const keywordSearch = async () => {
        console.log(defaultColumn);

        setSearchKeyword(keyword);
        // 검색버튼 클릭시 새 배열로 초기화
        setUserList([]);
        setPage(1);
    };

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const closeBtn = (
        <button className="close" onClick={toggle} type="button">
            &times;
        </button>
    );

    const requestExpertInfo = (expertIdx) => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/requestExpertInfo?expertIdx=${expertIdx}`)
            .then((res) => {
                console.log(res.data);
                setExpertInfo(res.data);
            });
    };

    const requestSellerInfo = (sellerIdx) => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/requestSellerInfo?sellerIdx=${sellerIdx}`)
            .then((res) => {
                console.log(res.data);
                setSellerInfo(res.data);
            });
    };

    const switchExpert = async () => {
        await myAxios(token, setToken).post(`${baseUrl}/admin/switchExpert`, {
            expertIdx: selectExpertIdx,
            expertResult: expertResult,
        });

        toggle();
        setRefreshFlag((prev) => !prev);
    };

    const switchSeller = async () => {
        await myAxios(token, setToken).post(`${baseUrl}/admin/switchSeller`, {
            sellerIdx: selectSellerIdx,
            sellerResult: sellerResult,
        });

        toggle();
        setRefreshFlag((prev) => !prev);
    };

    // const testUser = [];

    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}
            {/* 회원 관리 */}
            <div className="admin-userList-div">
                <div className="admin-userList-top-div">
                    <span className="font-18 medium">전환신청 / 입점신청</span>
                </div>

                <div className="admin-middle-header admin-middle-filter">
                    {roleCode.map((role) => (
                        <button
                            onClick={() => setDefaultRole(role.roleCode)}
                            className={defaultRole === role.roleCode ? "admin-expert-select-major" : "admin-expert-default-major"}
                            key={role.roleCode}
                        >
                            {role.label}
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
                        <select className="admin-userList-filter-select font-13" value={defaultColumn} onChange={(e) => setDefaultColumn(e.target.value)}>
                            {filterOptions.map((opt, idx) => (
                                <option key={idx} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
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

                <div>
                    {userList.length === 0 ? (
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
                                        {columns.map((col) => (
                                            <td key={col.key}>
                                                <span className="font-14 medium">{col.label}</span>
                                            </td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* 전문가일 경우 */}
                                    {defaultRole === 1 &&
                                        userList.map((user) => (
                                            <tr
                                                onClick={() => {
                                                    requestExpertInfo(user.expertIdx);
                                                    setSelectExpertIdx(user.expertIdx);
                                                    toggle();
                                                }}
                                                key={user.userName}
                                            >
                                                <td>
                                                    <span className="font-14">{user.username}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.name}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.phone}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.businessLicense}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.mainService}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.employeeCount}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.createdAt}</span>
                                                </td>
                                                <td>
                                                    <div className="user-state-badge">
                                                        {user.activityStatus === "WAITING" ? (
                                                            <div className="request-state-code-1">
                                                                <span className="font-12 medium">대기</span>
                                                            </div>
                                                        ) : (
                                                            <div className="request-state-code-2">
                                                                <span className="font-12 medium">거부</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    {/* 판매 업체일 경우 */}
                                    {defaultRole === 2 &&
                                        userList.map((user) => (
                                            <tr
                                                onClick={() => {
                                                    requestSellerInfo(user.sellerIdx);
                                                    setSelectSellerIdx(user.sellerIdx);
                                                    toggle();
                                                }}
                                                key={user.sellerIdx}
                                            >
                                                <td>
                                                    <span className="font-14">{user.compName}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.brandName}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.ceoName}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.managerTel}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.compBno}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.compHp}</span>
                                                </td>
                                                <td>
                                                    <span className="font-14">{user.createdAt}</span>
                                                </td>
                                                <td>
                                                    <div className="user-state-badge">
                                                        {user.activityStatus === "WAITING" ? (
                                                            <div className="request-state-code-1">
                                                                <span className="font-12 medium">대기</span>
                                                            </div>
                                                        ) : (
                                                            <div className="request-state-code-2">
                                                                <span className="font-12 medium">거부</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>

                            <Modal className="admin-custom-modal" style={{ width: "960px" }} isOpen={modal} toggle={toggle}>
                                <ModalBody>
                                    {defaultRole === 1 ? (
                                        <div className="admin-userList-switchId-modal">
                                            <div>
                                                <div className="admin-userList-switchId-firstTd">
                                                    <span className="font-18 semibold">프로필</span>
                                                </div>
                                                <table className="admin-userList-switchId-modal-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd admin-modal-firstTd">
                                                                <span className="font-14">실명</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{expertInfo.activityName}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">활동명</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{expertInfo.name}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">직원수</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{expertInfo.employeeCount}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">제공서비스</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">
                                                                    {expertInfo.service?.map((service, idx) => (
                                                                        <span style={{ marginRight: "15px" }} key={idx}>
                                                                            {service}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">사업자번호</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{expertInfo.businessLicense?.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3")}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">계좌번호</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{expertInfo.account}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">은행</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{expertInfo.bank}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">예금주</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{expertInfo.host}</span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div>
                                                <div className="admin-userList-switchId-firstTd">
                                                    <span className="font-18 semibold">사업자 등록증</span>
                                                </div>
                                                <div className="admin-userList-switchId-modal-imgs-div">
                                                    {expertInfo.businessPdfFile && expertInfo.fileStoragePath && (
                                                        <iframe
                                                            src={`${baseUrl}/pdf/expert/${encodeURIComponent(expertInfo.businessPdfFile)}`}
                                                            width="100%"
                                                            height="600px"
                                                            title="사업자등록증 PDF"
                                                            frameBorder="0"
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="admin-userList-switchId-firstTd">
                                                    <span className="font-18 semibold">전환 처리</span>
                                                </div>
                                                <table className="admin-userList-switchId-switch-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">처리</span>
                                                            </td>
                                                            <td>
                                                                <div className="admin-userList-modal-radio-div">
                                                                    <div className="admin-userList-modal-radio-div-in">
                                                                        <input onChange={() => setExpertResult(1)} className="admin-userList-modal-radio" type="radio" name="switch" id="switch-ok" />
                                                                        <label htmlFor="switch-ok" className="font-14">
                                                                            전환 승인
                                                                        </label>
                                                                    </div>
                                                                    <div className="admin-userList-modal-radio-div-in">
                                                                        <input onChange={() => setExpertResult(2)} className="admin-userList-modal-radio" type="radio" name="switch" id="switch-no" />
                                                                        <label htmlFor="switch-no" className="font-14">
                                                                            반려
                                                                        </label>

                                                                        {/* <input className="admin-userList-modal-reason-input font-14" type="text" placeholder="반려 사유를 작성해주세요" /> */}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="admin-userList-switchId-buttons">
                                                <button onClick={toggle} className="admin-userList-switchId-backBtn font-12 semibold">
                                                    취소
                                                </button>
                                                <button onClick={switchExpert} className="admin-userList-switchId-endBtn font-12 semibold">
                                                    처리 완료
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="admin-userList-switchId-modal">
                                            <div>
                                                <div className="admin-userList-switchId-firstTd">
                                                    <span className="font-18 semibold">프로필</span>
                                                </div>
                                                <table className="admin-userList-switchId-modal-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd admin-modal-firstTd">
                                                                <span className="font-14">회사명</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{sellerInfo.compName}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">브랜드명</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{sellerInfo.brandName}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">대표자</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{sellerInfo.ceoName}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">전화번호</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{sellerInfo.phone}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">사업자번호</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{sellerInfo.businessLicense}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">취급품목</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">
                                                                    {sellerInfo.items?.map((item, idx) => (
                                                                        <span style={{ marginRight: "15px" }} key={idx}>
                                                                            {item}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">계좌번호</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{sellerInfo.account}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">은행</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{sellerInfo.bank}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">예금주</span>
                                                            </td>
                                                            <td>
                                                                <span className="font-14">{sellerInfo.host}</span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div>
                                                <div className="admin-userList-switchId-firstTd">
                                                    <span className="font-18 semibold">사업자 등록증</span>
                                                </div>
                                                <div className="admin-userList-switchId-modal-imgs-div">
                                                    {sellerInfo.businessLicense && (
                                                        <iframe
                                                            src={`${baseUrl}/pdf/seller/${encodeURIComponent(sellerInfo.businessLicense)}`}
                                                            width="100%"
                                                            height="600px"
                                                            title="사업자등록증 PDF"
                                                            frameBorder="0"
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="admin-userList-switchId-firstTd">
                                                    <span className="font-18 semibold">전환 처리</span>
                                                </div>
                                                <table className="admin-userList-switchId-switch-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="admin-userList-switchId-modal-table-trtd">
                                                                <span className="font-14">처리</span>
                                                            </td>
                                                            <td>
                                                                <div className="admin-userList-modal-radio-div">
                                                                    <div className="admin-userList-modal-radio-div-in">
                                                                        <input onChange={() => setSellerResult(1)} className="admin-userList-modal-radio" type="radio" name="switch" id="switch-ok" />
                                                                        <label htmlFor="switch-ok" className="font-14">
                                                                            전환 승인
                                                                        </label>
                                                                    </div>
                                                                    <div className="admin-userList-modal-radio-div-in">
                                                                        <input onChange={() => setSellerResult(2)} className="admin-userList-modal-radio" type="radio" name="switch" id="switch-no" />
                                                                        <label htmlFor="switch-no" className="font-14">
                                                                            반려
                                                                        </label>

                                                                        {/* <input className="admin-userList-modal-reason-input font-14" type="text" placeholder="반려 사유를 작성해주세요" /> */}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="admin-userList-switchId-buttons">
                                                <button onClick={toggle} className="admin-userList-switchId-backBtn font-12 semibold">
                                                    취소
                                                </button>
                                                <button onClick={switchSeller} className="admin-userList-switchId-endBtn font-12 semibold">
                                                    처리 완료
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </ModalBody>
                            </Modal>

                            <AdminPaging pageInfo={pageInfo} handlePageClick={handlePageClick} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
