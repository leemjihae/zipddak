import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";
import { useNavigate, useSearchParams } from "react-router";

export default function RequestHistory() {
    const [chip, setChip] = useState("전체");

    const [requests, setRequests] = useState([]);

    const [pageBtn, setPageBtn] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        allPage: 0,
        curPage: 1,
        endPage: 0,
        startPage: 1,
    });

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 지난 요청서 조회
    const getRequests = (status, page) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/history/requestList?username=${user.username}&status=${status}&page=${page}`)
            .then((res) => {
                return res.data;
            })
            .then((data) => {
                setRequests(data.requestList);
                return data.pageInfo;
            })
            .then((pageData) => {
                setPageInfo(pageData);
                let pageBtns = [];
                for (let i = pageData.startPage; i <= pageData.endPage; i++) {
                    pageBtns.push(i);
                }
                setPageBtn([...pageBtns]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 날짜 포멧팅
    function timeAgo(sqlDateString) {
        const now = new Date();
        const date = new Date(sqlDateString);

        // 날짜만 비교
        const diffMs = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
        const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDay < 1) return "오늘";
        return `${diffDay}일 전`;
    }

    // 요청서상태 매핑
    const REQUEST_STATUS_LABEL = {
        RECRUITING: "모집 중",
        RECRUITED: "모집종료",
        STOPPED: "요청중단",
    };

    useEffect(() => {
        getRequests(chip, pageFromUrl);
    }, [pageFromUrl]);

    return (
        <div className="mypage-layout">
            <h1 className="mypage-title">과거 견적 요청</h1>

            <div className="mypage-chipList">
                <div
                    className={chip === "전체" ? "isActive" : ""}
                    onClick={() => {
                        setChip("전체");
                        getRequests("전체", pageInfo.curPage);
                    }}
                >
                    전체
                </div>
                <div
                    className={chip === "매칭완료" ? "isActive" : ""}
                    onClick={() => {
                        setChip("매칭완료");
                        getRequests("매칭완료", pageInfo.curPage);
                    }}
                >
                    매칭완료
                </div>
                <div
                    className={chip === "매칭실패" ? "isActive" : ""}
                    onClick={() => {
                        setChip("매칭실패");
                        getRequests("매칭실패", pageInfo.curPage);
                    }}
                >
                    매칭실패
                </div>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                }}
            >
                {requests.map((request) => (
                    <div
                        style={{
                            display: "flex",
                            padding: "20px",
                            flexDirection: "column",
                            gap: "20px",
                            flex: "1 0 0",
                            borderRadius: "16px",
                            border: "1px solid #EFF1F5",
                        }}
                        key={request.estimateIdx}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "14px",
                            }}
                        >
                            {request.status === "RECRUITING" ? (
                                <span
                                    style={{
                                        width: "fit-content",
                                        height: "20px",
                                        display: "flex",
                                        padding: "5px 10px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "8px",
                                        border: "1px solid rgba(255, 88, 51, 0.50)",
                                        background: "rgba(255, 88, 51, 0.05)",
                                        color: "#FF5833",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                    }}
                                >
                                    {REQUEST_STATUS_LABEL[request.status]}
                                </span>
                            ) : (
                                <span
                                    style={{
                                        width: "fit-content",
                                        height: "20px",
                                        display: "flex",
                                        padding: "5px 10px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: "8px",
                                        border: "1px solid #A1A6AD",
                                        background: "#E6EBF0",
                                        color: "#242933",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                    }}
                                >
                                    {REQUEST_STATUS_LABEL[request.status]}
                                </span>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    alignSelf: "stretch",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        lineHeight: "18px",
                                    }}
                                >
                                    {request.categoryName}
                                </p>
                                <p
                                    style={{
                                        color: "#6A7685",
                                        fontSize: "13px",
                                        fontWeight: "400",
                                    }}
                                >
                                    {timeAgo(request.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "14px",
                                alignSelf: "stretch",
                                fontSize: "14px",
                            }}
                        >
                            <p>
                                <i class="bi bi-geo-alt" style={{ fontSize: "13px", marginRight: "2px" }}></i>
                                {request.location}
                            </p>
                            <p>
                                {Number(request.budget)?.toLocaleString()}원 · {request.preferredDate}
                            </p>
                        </div>
                        {request.hasButton &&
                            (request.status === "RECRUITING" ? (
                                <button
                                    className="primary-button"
                                    style={{
                                        height: "33px",
                                        color: "#FF5833",
                                        backgroundColor: "#fff",
                                    }}
                                    onClick={() => {
                                        navigate(`/zipddak/mypage/expert/requests/active`);
                                    }}
                                >
                                    요청 상세 보기
                                </button>
                            ) : (
                                <button
                                    className="primary-button"
                                    style={{
                                        height: "33px",
                                        color: "#FF5833",
                                        backgroundColor: "#fff",
                                    }}
                                    onClick={() => {
                                        navigate(`/zipddak/mypage/expert/works/detail/${request.requestIdx}?page=1`);
                                    }}
                                >
                                    작업 상세 보기
                                </button>
                            ))}
                    </div>
                ))}
            </div>

            <Pagination className="my-pagination">
                {pageBtn.map((b) => (
                    <PaginationItem key={b} active={b === pageInfo.curPage}>
                        <PaginationLink onClick={() => setSearchParams({ page: b })}>{b}</PaginationLink>
                    </PaginationItem>
                ))}
            </Pagination>
        </div>
    );
}
