export default function AdminPaging({ pageInfo, handlePageClick }) {
    return (
        <>
            {/* 페이징 div */}
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
        </>
    );
}
