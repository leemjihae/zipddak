import { useState, useEffect } from "react";
import "../css/AdminUserList.css";
import AdminSidebar from "./AdminNav";
import { Input, Table, Modal, ModalBody } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import AdminPaging from "./AdminPaging";

export default function AdminSettlementList() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    // 전문 서비스
    const [defaultMajor, setDefaultMajor] = useState(1);

    const today = new Date();

    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevMonthStr = `${prevMonthDate.getFullYear()}-${(prevMonthDate.getMonth() + 1).toString().padStart(2, "0")}`;

    // 기본값을 저번 달로 설정
    const [month, setMonth] = useState(prevMonthStr);

    const [flag, setFlag] = useState(true);

    // 속성명
    const [page, setPage] = useState(1);

    const [comment, setcomment] = useState("");

    // 활동 상태
    const [defaultState, setDefaultState] = useState(1);

    const [settlementList, setSettlementList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const [selectSettlement, setSelectSettlement] = useState({});

    const userState = [
        {
            stateCode: 1,
            label: "정산 대기",
        },
        {
            stateCode: 2,
            label: "정산 완료",
        },
    ];

    const clearFilter = () => {
        setDefaultState(1);
        setMonth(prevMonthStr);
    };

    // const testUser = [];

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const [useCate, setCate] = useState(1);

    const cateNo = [
        {
            cate: 1,
            label: "전문가",
        },
        {
            cate: 2,
            label: "판매업체",
        },
    ];

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const closeBtn = (
        <button className="close" onClick={toggle} type="button">
            &times;
        </button>
    );

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

    const search = () => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/settlement?type=${useCate}&month=${month}&state=${defaultState}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setSettlementList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        if (!token) return;

        search();
    }, [token, month, defaultMajor, defaultState, page, useCate, flag]);

    const settlementDetail = (settlementIdx) => {
        myAxios(token, setToken)
            .get(`${baseUrl}/admin/settlementDetail?settlementIdx=${settlementIdx}`)
            .then((res) => {
                console.log(res.data);
                setSelectSettlement(res.data);
            });
    };

    const settlementComplate = () => {
        myAxios(token, setToken)
            .post(`${baseUrl}/admin/settlementComplate`, {
                settlementIdx: selectSettlement.settlementIdx,
                comment: comment,
            })
            .then((res) => {
                if (res.data) {
                    toggle();
                    setFlag(!flag);
                }
            });
    };

    return (
        <div className="admin-body-div">
            {/* <AdminSidebar /> */}
            {/* 회원 관리 */}
            <div className="admin-userList-div">
                <div className="admin-userList-top-div">
                    <span className="font-18 medium">정산 관리</span>
                </div>

                {/* 중 헤더 */}
                <div className="admin-middle-header">
                    {cateNo.map((cate) => (
                        <button onClick={() => setCate(cate.cate)} className={cate.cate === useCate ? "admin-settlement-select" : "admin-settlement-default"} key={cate.cate}>
                            {cate.label}
                        </button>
                    ))}
                </div>

                {/* 검색 필터 라인 */}
                <div className="admin-filter-line-div-settlement">
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
                                    <label
                                        style={{
                                            marginLeft: "5px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                        htmlFor={state.stateCode}
                                    >
                                        <span className="font-14">{state.label}</span>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* 우측 검색 필터 */}
                        <div className="admin-userList-filter-right">
                            <Input value={month} max={prevMonthStr} onChange={(e) => setMonth(e.target.value)} type="month" id="monthInput" className="admin-filter-input-date font-13" />
                            {/* 초기화 버튼 */}
                            <button onClick={clearFilter} className="admin-userList-clean-button font-13 medium">
                                초기화
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    {settlementList.length === 0 ? (
                        <div
                            style={{
                                height: "45px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottom: "1px solid #eaecf0",
                            }}
                        >
                            <span className="font-12 medium">정산 해줄 회원이 없습니다.</span>
                        </div>
                    ) : (
                        <div className="admin-userList-table-div">
                            <Table hover className="admin-userList-table">
                                <thead>
                                    <tr>
                                        <td>
                                            <span className="font-14 medium">정산번호</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">대상아이디</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">대상이름</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">총 금액</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">수수료</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">정산금액</span>
                                        </td>
                                        <td>
                                            <span className="font-14 medium">정산상태</span>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {settlementList.map((settlement) => (
                                        <tr
                                            onClick={() => {
                                                settlementDetail(settlement.settlementIdx);
                                                toggle();
                                            }}
                                            key={settlement.settlementIdx}
                                        >
                                            <td>
                                                <span className="font-14">{settlement.settlementIdx}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{settlement.username}</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{settlement.name}</span>
                                            </td>

                                            <td>
                                                <span className="font-14">{settlement.totalAmount?.toLocaleString()}원</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{settlement.feeRate}%</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{settlement.settlementTotalAmount?.toLocaleString()}원</span>
                                            </td>
                                            <td>
                                                <span className="font-14">{settlement.state === "PENDING" ? "정산대기" : "정산완료"}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <Modal className="admin-custom-modal" style={{ width: "960px" }} isOpen={modal} toggle={toggle}>
                                <ModalBody>
                                    <div className="admin-userList-switchId-modal">
                                        <div>
                                            <div className="admin-userList-switchId-firstTd">
                                                <span className="font-18 semibold">정산 기본 정보</span>
                                            </div>
                                            <table className="admin-userList-switchId-modal-table">
                                                <tbody>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd admin-modal-firstTd">
                                                            <span className="font-14">정산번호</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">{selectSettlement.settlementIdx}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd">
                                                            <span className="font-14">대상아이디</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">{selectSettlement.username}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd">
                                                            <span className="font-14">대상이름</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">{selectSettlement.name}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd">
                                                            <span className="font-14">대상유형</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">{selectSettlement.userType === "EXPERT" ? "전문가" : "판매업체"}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd">
                                                            <span className="font-14">정산 기간</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">{selectSettlement.month?.toString().slice(0, 7)}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd">
                                                            <span className="font-14">총 금액</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">{selectSettlement.totalAmount}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd">
                                                            <span className="font-14">수수료</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">{selectSettlement.feeRate}%</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd">
                                                            <span className="font-14">총 정산 금액</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">{selectSettlement.settlementTotalAmount}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* <div>
                                            <div className="admin-userList-switchId-firstTd">
                                                <span className="font-18 semibold">
                                                    거래 내역 <span>3건</span>
                                                </span>
                                            </div>
                                            <table className="admin-userList-settlement-modal-table">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <span className="font-14">거래 ID</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">거래일자</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">거래금액</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">수수료</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">정산금액</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span className="font-14">거래 ID</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">거래일자</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">거래금액</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">수수료</span>
                                                        </td>
                                                        <td>
                                                            <span className="font-14">정산금액</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div> */}

                                        <div>
                                            <div className="admin-userList-switchId-firstTd">
                                                <span className="font-18 semibold">관리자 코멘트 입력 / 보기</span>
                                            </div>
                                            <table className="admin-userList-switchId-switch-table">
                                                <tbody>
                                                    <tr>
                                                        <td className="admin-userList-switchId-modal-table-trtd">
                                                            <span className="font-14">코멘트 입력</span>
                                                        </td>
                                                        <td>
                                                            <input
                                                                readOnly={selectSettlement.state === "COMPLETED"}
                                                                style={{
                                                                    width: "700px",
                                                                    height: "36px",
                                                                    paddingLeft: "10px",
                                                                    borderRadius: "6px",
                                                                }}
                                                                className="font-14"
                                                                type="text"
                                                                placeholder="정산 내용을 입력해주세요"
                                                                value={comment}
                                                                onChange={(e) => setcomment(e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="admin-userList-switchId-buttons">
                                            {selectSettlement.state === "COMPLETED" ? (
                                                <button style={{ height: "33px" }} onClick={toggle} className="admin-userList-settlement-endBtn font-12 semibold">
                                                    확인
                                                </button>
                                            ) : (
                                                <button onClick={toggle} className="admin-userList-switchId-backBtn font-12 semibold">
                                                    취소
                                                </button>
                                            )}

                                            {selectSettlement.state === "COMPLETED" ? (
                                                <></>
                                            ) : (
                                                <button onClick={settlementComplate} className="admin-userList-settlement-endBtn font-12 semibold">
                                                    정산
                                                </button>
                                            )}
                                        </div>
                                    </div>
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
