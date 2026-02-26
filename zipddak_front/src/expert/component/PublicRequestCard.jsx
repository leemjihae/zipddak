export default function PublicRequestCard({ request, onClick, isSelect }) {
    function timeAgo(sqlDateString) {
        const now = new Date();
        const date = new Date(sqlDateString);

        // 날짜만 비교
        const diffMs = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0);
        const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDay < 1) return "오늘";
        return `${diffDay}일 전`;
    }

    return (
        <div
            style={{
                display: "flex",
                padding: "20px",
                flexDirection: "column",
                gap: "12px",
                borderRadius: "16px",
                border: isSelect ? "1px solid rgba(179, 235, 255, 0.50)" : "1px solid #EFF1F5",
                backgroundColor: isSelect ? "rgba(179, 235, 255, 0.10)" : "#FFFFFF",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                }}
            >
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
                    모집 중
                </span>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#6A7685",
                        fontSize: "13px",
                        fontWeight: "400",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <img
                            src={request.requesterProfile ? `http://localhost:8080/imageView?type=profile&filename=${request.requesterProfile}` : "/default-profile.png"}
                            width="24px"
                            height="24px"
                            style={{ borderRadius: "24px" }}
                        />
                        <p>{request.requesterName}</p>
                        <p>
                            견적 보낸 전문가 <span style={{ color: "#FF5833", fontWeight: "500" }}>{request.expertResponseCount}명</span>
                        </p>
                    </div>
                    <p>{timeAgo(request.createdAt)}</p>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                }}
            >
                <p
                    style={{
                        fontSize: "15px",
                        fontWeight: "600",
                    }}
                >
                    {request.categoryName}
                </p>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        fontSize: "14px",
                    }}
                >
                    <p>
                        <i class="bi bi-geo-alt" style={{ fontSize: "13px", marginRight: "2px" }}></i>
                        {request.location}
                    </p>
                    <p>
                        {Number(request.budget).toLocaleString()}원 · {request.preferredDate}
                    </p>
                </div>
            </div>
        </div>
    );
}
