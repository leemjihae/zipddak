import { useEffect, useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { Eye, MessageCircle, Heart } from "lucide-react";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import { useNavigate } from "react-router";

export default function Likes() {
    const [tab, setTab] = useState("공구");

    const [productLikes, setProductLikes] = useState([]);
    const [toolLikes, setToolLikes] = useState([]);
    const [expertLikes, setExpertLikes] = useState([]);
    const [communityLikes, setCommunityLikes] = useState([]);

    const [pageBtn, setPageBtn] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        allPage: 0,
        curPage: 1,
        endPage: 0,
        startPage: 1,
    });

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const navigate = useNavigate();

    // 관심 상품목록 조회
    const getProductLikes = (page) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/likeList/product?username=${user.username}&page=${page}`)
            .then((res) => {
                setProductLikes(res.data.favoriteProductList);
                return res.data.pageInfo;
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

    // 상품 좋아요 토글
    const toggleProductLike = (productIdx) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/like/product?username=${user.username}&productIdx=${productIdx}`)
            .then(() => {
                getProductLikes();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 관심 공구목록 조회
    const getToolLikes = (page) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/likeList/tool?username=${user.username}&page=${page}`)
            .then((res) => {
                setToolLikes(res.data.favoriteToolList);
                return res.data.pageInfo;
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

    // 공구 좋아요 토글
    const toggleToolLike = (toolIdx) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/like/tool?username=${user.username}&toolIdx=${toolIdx}`)
            .then(() => {
                getToolLikes();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 관심 전문가목록 조회
    const getExpertLikes = (page) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/likeList/expert?username=${user.username}&page=${page}`)
            .then((res) => {
                setExpertLikes(res.data.favoriteExpertList);
                return res.data.pageInfo;
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

    // 전문가 좋아요 토글
    const toggleExpertLike = (expertIdx) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/like/expert?username=${user.username}&expertIdx=${expertIdx}`)
            .then(() => {
                getExpertLikes();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 관심 커뮤니티목록 조회
    const getCommunityLikes = (page) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/likeList/community?username=${user.username}&page=${page}`)
            .then((res) => {
                setCommunityLikes(res.data.favoriteCommunityList);
                return res.data.pageInfo;
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

    // 커뮤니티 좋아요 토글
    const toggleCommunityLike = (communityIdx) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/like/community?username=${user.username}&communityIdx=${communityIdx}`)
            .then(() => {
                getCommunityLikes();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (tab === "상품") {
            getProductLikes(1);
        } else if (tab === "공구") {
            getToolLikes(1);
        } else if (tab === "전문가") {
            getExpertLikes(1);
        } else if (tab === "커뮤니티") {
            getCommunityLikes(1);
        }
    }, [tab]);

    return (
        <div className="mypage-layout">
            <h1 className="mypage-title">관심</h1>

            <div className="mypage-tabList">
                <div className={tab === "공구" ? "isActive" : ""} onClick={() => setTab("공구")}>
                    공구
                </div>
                <div className={tab === "전문가" ? "isActive" : ""} onClick={() => setTab("전문가")}>
                    전문가
                </div>
                <div className={tab === "상품" ? "isActive" : ""} onClick={() => setTab("상품")}>
                    상품
                </div>
                <div className={tab === "커뮤니티" ? "isActive" : ""} onClick={() => setTab("커뮤니티")}>
                    커뮤니티
                </div>
            </div>

            {tab === "공구" && toolLikes.length !== 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "20px",
                    }}
                >
                    {toolLikes.map((tool) => (
                        <a href="#" className="Tool-card-m">
                            <div className="tool-image-m">
                                {/* <i className="bi bi-heart favorite-icon"></i> */}
                                <div className="favorite-icon" onClick={() => toggleToolLike(tool.toolIdx)}>
                                    <Heart color="red" fill="red" />
                                </div>
                            </div>

                            <div className="tool-info-m">
                                <div className="tool-name-m">{tool.toolName}</div>
                                <span className="tool-address-m">{tool.tradeAddr}</span>
                                <div>
                                    <span className="oneday-m">1일</span>
                                    <span className="rental-price-m">{tool.rentalPrice}원</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
            {tab === "전문가" && expertLikes.length !== 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "20px",
                    }}
                >
                    {expertLikes.map((expert) => (
                        <div
                            style={{ cursor: "pointer", height: "190px" }}
                            onClick={() => {
                                navigate(`/zipddak/expertProfile/${expert.expertIdx}`);
                            }}
                            className="expert-div"
                        >
                            <div className="expert-img-div">
                                <img className="expert-img" src={`${baseUrl}/imageView?type=expert&filename=${expert.profileImage}`} />
                                <div className="expert-name-div">
                                    <span className="font-14 semibold">{expert.activityName}</span>
                                    <span className="font-13">{expert.mainService}</span>
                                </div>
                            </div>

                            {/* 별점 */}
                            <div className="expert-star-div">
                                <i className="bi bi-star-fill expert-star"></i>
                                <span className="font-13 medium">{expert.avgScore}</span>
                                <span className="font-12 expert-review-count">({expert.reviewCount})</span>
                            </div>

                            <div className="expert-info-div">
                                <div className="expert-career-div">
                                    <span className="font-13">
                                        <i className="bi bi-geo-alt font-11"></i>
                                        {expert.activityArea}
                                    </span>
                                </div>

                                {/* 경력 + 고용 */}
                                <div className="expert-career-div">
                                    <span className="font-13">
                                        <i className="bi bi-award font-11"></i>경력
                                        {expert.careerCount < 12 ? "1년 미만" : `${Math.floor(expert.careerCount / 12)}년`}
                                    </span>
                                    <i className="bi bi-dot font-11"></i>
                                    <span className="font-13">
                                        <i className="bi bi-emoji-smile font-11"></i>고용
                                        {expert.matchingCount}회
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {tab === "상품" && productLikes.length !== 0 && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "20px",
                    }}
                >
                    {productLikes.map((product) => (
                        <a href="#" className="Product-card" style={{ width: "100%" }}>
                            <div className="product-image">
                                <div className="favorite-icon" onClick={() => toggleProductLike(product.productIdx)}>
                                    <Heart color="red" fill="red" />
                                </div>
                            </div>

                            <div className="product-info">
                                <span className="store-name">{product.brandName}</span>
                                <div className="product-name">{product.productName}</div>
                                <div>
                                    {product.discount !== 0 && <span className="sale">{product.discount}%</span>}
                                    <span className="sale-price"> {typeof product.price === "number" ? product.price.toLocaleString(): ""}</span>
                                </div>
                                <div>
                                    <i className="bi bi-star-fill star-icon"></i>
                                    <span className="review-count">{product.avgScore}</span>(<span className="review-count">{product.reviewCount}</span>)
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
            {tab === "커뮤니티" && communityLikes.length !== 0 && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    {communityLikes.map((community) => (
                        <a href="#" className="Com-card">
                            <div className="Com-infoBox">
                                <div className="Com-info">
                                    <span className="Com-category">{community.categoryName}</span>
                                    <div className="Com-title">{community.title}</div>
                                    <span className="Com-content">{community.content}</span>
                                </div>
                                <div className="Com-reaction">
                                    <span className="Com-writer">{community.writerNickname}</span>
                                    <div className="favs">
                                        <Eye size={15} />
                                        {community.views}
                                    </div>
                                    <i className="bi bi-dot dot"></i>
                                    <div className="chats">
                                        <MessageCircle size={15} />
                                        {community.replyCount}
                                    </div>
                                </div>
                            </div>

                            <div className="Com-image"></div>
                        </a>
                    ))}
                </div>
            )}

            <Pagination className="my-pagination">
                {pageBtn.map((b) => (
                    <PaginationItem key={b} active={b === pageInfo.curPage}>
                        <PaginationLink
                            onClick={() => {
                                if (tab === "상품") {
                                    setProductLikes([]);
                                    getProductLikes(b);
                                } else if (tab === "공구") {
                                    setToolLikes([]);
                                    getToolLikes(b);
                                } else if (tab === "전문가") {
                                    setExpertLikes([]);
                                    getExpertLikes(b);
                                } else if (tab === "커뮤니티") {
                                    setCommunityLikes([]);
                                    getCommunityLikes(b);
                                }
                            }}
                        >
                            {b}
                        </PaginationLink>
                    </PaginationItem>
                ))}
            </Pagination>
        </div>
    );
}
