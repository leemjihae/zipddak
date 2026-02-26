import { Button } from "reactstrap";
import "../css/CommunityDetail.css";
import { Community } from "../../main/component/Community";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { baseUrl, myAxios } from "../../config";

export default function CommunityList() {
    const navigate = useNavigate();

    const [selectCate, setSelectCate] = useState(76);
    const [page, setPage] = useState(1);

    const [communityList, setCommunityList] = useState([]);
    const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });

    const cateList = [
        { no: 76, label: "우리집 자랑" },
        { no: 77, label: "자재 토론회" },
        { no: 78, label: "나만의 노하우" },
        { no: 79, label: "전문가에게 묻다" },
        { no: 80, label: "함께해요" },
        { no: 81, label: "전문가 소식" },
        { no: 82, label: "자유" },
    ];

    const fetchCommunity = (category, page) => {
        myAxios()
            .get(`${baseUrl}/communityList?category=${category}&page=${page}`)
            .then((res) => {
                setCommunityList(res.data.communityList);
                setPageInfo(res.data.pageInfo);
            });
    };

    useEffect(() => {
        fetchCommunity(selectCate, page);
    }, [selectCate, page]);

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    return (
        <div className="comList-container">
            <div className="row-cm commList-top">
                <span className="comLabel">커뮤니티</span>
                <Button onClick={() => navigate("/zipddak/community/write")}>글쓰기</Button>
            </div>

            <div className="d-tab-nav">
                {cateList.map((cate) => (
                    <div
                        key={cate.no}
                        onClick={() => {
                            setPage(1);
                            setSelectCate(cate.no);
                        }}
                        className={selectCate === cate.no ? "d-nav active" : "d-nav"}
                    >
                        {cate.label}
                    </div>
                ))}
            </div>

            <div className="col-cm commcardList">
                {communityList.map((item) => (
                    <Community key={item.communityId} community={item} />
                ))}
            </div>

            {/* 페이지 버튼 */}
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0", gap: "5px" }}>
                {/* 이전 버튼 */}
                <button
                    onClick={() => handlePageClick(pageInfo.curPage - 1)}
                    disabled={pageInfo.curPage === 1}
                    style={{
                        backgroundColor: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: pageInfo.curPage === 1 ? "not-allowed" : "pointer",
                        opacity: pageInfo.curPage === 1 ? 0.5 : 1,
                        fontWeight: "bold",
                        color: "#555",
                    }}
                >
                    &lt;
                </button>

                {/* 페이지 번호 버튼 */}
                {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, idx) => {
                    const pageNum = pageInfo.startPage + idx;
                    return (
                        <button
                            key={idx}
                            onClick={() => handlePageClick(pageNum)}
                            style={{
                                backgroundColor: pageInfo.curPage === pageNum ? "#FF5833" : "white",
                                color: pageInfo.curPage === pageNum ? "white" : "#555",
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                {/* 다음 버튼 */}
                <button
                    onClick={() => handlePageClick(pageInfo.curPage + 1)}
                    disabled={pageInfo.curPage === pageInfo.allPage}
                    style={{
                        backgroundColor: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: pageInfo.curPage === pageInfo.allPage ? "not-allowed" : "pointer",
                        opacity: pageInfo.curPage === pageInfo.allPage ? 0.5 : 1,
                        fontWeight: "bold",
                        color: "#555",
                    }}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}
