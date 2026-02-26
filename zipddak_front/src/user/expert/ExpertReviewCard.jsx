import "../css/ExpertReviewCard.css";

export default function ExpertReviewCard({ expertReview }) {
    // const expertReview = {
    //     profileImg: "/images/기본회원프로필.jpg",
    //     nickname: "닉네임",
    //     reviewScore: 4.3,
    //     createdAt: "2025-11-28",
    //     images: ["/images/이미지테스트.png", "/images/이미지테스트.png", "/images/이미지테스트.png"],
    //     reviewContent: "리뷰 내용이 들어갑니다.",
    // };

    return (
        <div>
            <div className="expertReview-div">
                <div className="expertReview-writer-info-div">
                    <img className="expertReview-writer-img" src={expertReview.profileImgStoragePath + "/" + expertReview.profileImg} />
                    <div className="expertReview-writer-review-info">
                        <span className="font-13 medium">{expertReview.nickname}</span>
                        <div className="expertReview-review-date">
                            {/* 별 채우는 코드 */}
                            <div style={{ display: "flex", gap: "2px" }}>
                                {[1, 2, 3, 4, 5].map((i) => {
                                    const score = expertReview.score; // 예: 3.7
                                    let fillPercent = 0;

                                    if (score >= i) {
                                        fillPercent = 100; // 완전 채움
                                    } else if (score + 1 > i) {
                                        fillPercent = (score - (i - 1)) * 100; // 남은 부분만 채우기
                                    }

                                    return (
                                        <div key={i} style={{ position: "relative", width: "15px", height: "20px" }}>
                                            {/* 빈 별 */}
                                            <i
                                                className="bi bi-star"
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    fontSize: "15px",
                                                    color: "#ddd",
                                                }}
                                            ></i>

                                            {/* 채워진 별 (width로 부분만 보이게) */}
                                            <i
                                                className="bi bi-star-fill"
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: `${fillPercent}%`,
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    fontSize: "15px",
                                                    color: "#FFD700", // 노란색(원하면 변경)
                                                }}
                                            ></i>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 리뷰를 단 날짜를 계산 */}
                            <span className="font-12" style={{ marginLeft: "5px" }}>
                                {(() => {
                                    const createdDate = new Date(expertReview.createdAt);
                                    const now = new Date();

                                    const diffMs = now - createdDate;
                                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                                    // 당일이면 "오늘"
                                    if (diffDays < 1) {
                                        return "오늘";
                                    }

                                    // 30일 이내면 "N일 전"
                                    if (diffDays < 30) {
                                        return `${diffDays}일 전`;
                                    }

                                    // 30일 이상이면 날짜 그대로
                                    return expertReview.createdAt;
                                })()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 이미지가 있는 경우에만 보여주기 */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {expertReview.image1 && <img className="review-image" src={`${expertReview.imgStoragePath}/${expertReview.image1}`} alt="review-1" />}

                    {expertReview.image2 && <img className="review-image" src={`${expertReview.imgStoragePath}/${expertReview.image2}`} alt="review-2" />}

                    {expertReview.image3 && <img className="review-image" src={`${expertReview.imgStoragePath}/${expertReview.image3}`} alt="review-3" />}
                </div>

                {/* 리뷰 내용 */}
                <div className="font-14">{expertReview.content}</div>
            </div>

            <hr className="expertReview-hr" />
        </div>
    );
}
