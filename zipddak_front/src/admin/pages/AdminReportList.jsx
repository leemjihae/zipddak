import { useState } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table } from "reactstrap";

export default function AdminReportList() {
    // 전문 서비스
    const [defaultRole, setDefaultRole] = useState(1);

    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);
    // 속성명
    const [defaultColumn, setDefaultColumn] = useState(1);
    // 검색 키워드
    const [keyword, setKeyword] = useState("");

    const userState = [
        {
            stateCode: 1,
            label: "접수",
        },
        {
            stateCode: 2,
            label: "완료",
        },
        {
            stateCode: 3,
            label: "반려",
        },
    ];

    const roleCode = [
        {
            roleCode: 1,
            label: "일반회원",
        },
        {
            roleCode: 2,
            label: "전문가",
        },
        {
            roleCode: 3,
            label: "판매업체",
        },
        {
            roleCode: 4,
            label: "커뮤니티",
        },
        {
            roleCode: 5,
            label: "후기",
        },
    ];

    const testUser = [
        {
            reportNo: 1,
            reportedEntity: "홍길동",
            reporter: "홍길동",
            reportReason: "신고 사유가 들어갑니다.",
            reportedAt: "2025-11-09",
            stateCode: 1,
            type: "user",
        },
        {
            reportNo: 2,
            reportedEntity: "홍길동",
            reporter: "홍길동",
            reportReason: "신고 사유가 들어갑니다.",
            reportedAt: "2025-11-09",
            stateCode: 2,
            type: "user",
        },
        {
            reportNo: 3,
            reportedEntity: "홍길동",
            reporter: "홍길동",
            reportReason: "신고 사유가 들어갑니다.",
            reportedAt: "2025-11-09",
            stateCode: 3,
            type: "user",
        },
    ];

    // 컬럼 정의
    const columns = [
        { label: "신고번호", key: "reportNo" },
        { label: "신고 대상 / 업체", key: "reportedEntity" },
        { label: "신고자", key: "reporter" },
        { label: "신고 사유", key: "reportReason" },
        { label: "신고일", key: "reportedAt" },
        { label: "처리상태", key: "stateCode" },
    ];

    const filterOptions = [
        // 전문가
        { value: "", label: "전체" },
        { value: "userName", label: "신고 대상" },
        { value: "userTel", label: "신고자" },
    ];

    const clearFilter = () => {
        setDefaultState(1);
        setDefaultColumn(1);
        setKeyword("");
    };

    // const testUser = [];

    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}
            {/* 회원 관리 */}
            <div className="admin-userList-div">
                <div className="admin-userList-top-div">
                    <span className="font-18 medium">신고 내역</span>
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
                            <Input onChange={(e) => setKeyword(e.target.value)} className="font-12 admin-userList-search-input" placeholder="검색어를 입력해주세요" />
                        </div>

                        <button className="admin-userList-search-button font-13 medium">검색</button>
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
                                        {columns.map((col) => (
                                            <td key={col.key}>
                                                <span className="font-14 medium">{col.label}</span>
                                            </td>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {testUser.map((report) => (
                                        <tr key={report.reportNo}>
                                            {columns.map((col) =>
                                                col.key === "stateCode" ? (
                                                    <td key={col.key}>
                                                        <div className="user-state-badge">
                                                            {report[col.key] === 1 ? (
                                                                <div className="request-state-code-1">
                                                                    <span className="font-12 medium">접수</span>
                                                                </div>
                                                            ) : report[col.key] === 2 ? (
                                                                <div className="request-state-code-2">
                                                                    <span className="font-12 medium">반려</span>
                                                                </div>
                                                            ) : (
                                                                <div className="request-state-code-3">
                                                                    <span className="font-12 medium">완료</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                ) : (
                                                    <td key={col.key}>
                                                        <span className="font-14">{report[col.key]}</span>
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* 페이징 div */}
                            <div className="admin-userList-paging-bar">
                                {/* 이전 버튼 */}
                                <button className="admin-userList-nextbutton">
                                    <i className="bi bi-chevron-left"></i>
                                    <span>이전</span>
                                </button>

                                {/* 페이지 가져와서 map 돌리기 */}
                                <div className="admin-userList-paging-button-div">
                                    <button className="admin-userList-paging-curpage-button">1</button>
                                    <button className="admin-userList-paging-button">2</button>
                                    <button className="admin-userList-paging-button">3</button>
                                </div>

                                <button className="admin-userList-nextbutton">
                                    <span>다음</span>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
