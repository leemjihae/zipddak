import "../../css/common.css";
import "../css/Main.css";
import { Button } from "reactstrap";
import { Search, CirclePlus, MapPin, ArrowRight, UserStar, Store, MessageSquareHeart } from "lucide-react";
import Expertmain from "../component/Expert";
import Expert from "../../user/expert/Expert";
import { Toolmain, Tool } from "../component/Tool";
import { Community } from "../component/Community";
import { Products } from "../component/Product";
import { useEffect, useState } from "react";
import { myAxios, baseUrl } from "../../config";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { useNavigate, useParams } from "react-router";

export default function MainSearch() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [product, setProduct] = useState([]);
    const [expert, setExpert] = useState([]);
    const [tool, setTool] = useState([]);
    const [community, setCommunity] = useState([]);

    const { search } = useParams();
    const [keyword, setKeyword] = useState(search || "");

    //공구 주소 자르기
    const userAddressString = user?.addr1 || "";
    const userAdress = userAddressString.split(" ").slice(0, 2).join(" ");

    const navigate = useNavigate();

    //검색
    const [inputValue, setInputValue] = useState(search || "");

    const mainSearch = (e) => {
        e.preventDefault();

        const submittedKeyword = inputValue.trim();

        if (!submittedKeyword) {
            alert("검색어를 입력해주세요.");
            setKeyword("");
            return;
        }

        setKeyword(submittedKeyword);
    };

    //전문가 리스트
    const [eCategory, setECategory] = useState();
    const [eActiveCategory, setEActiveCategory] = useState(0);
    const [expertLength, setExpertLength] = useState(0);

    const expertCategory = (categoryNo) => {
        setECategory(categoryNo);
        setEActiveCategory(categoryNo);
    };

    const expertList = () => {
        const categoryPharam = eCategory ? eCategory : 1;
        const keywordPharam = keyword ? keyword : "";

        myAxios(token, setToken)
            .get(`/main/expert?keyword=${keywordPharam}&categoryNo=${categoryPharam}`)
            .then((res) => {
                console.log(res.data);
                setExpert(res.data.cards);
                setExpertLength(res.data.totalCount);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        expertList();
    }, [user.username, eCategory, keyword]);

    //상품 리스트
    const [pCategory, setPCategory] = useState(0);
    const [pActiveCategory, setPActiveCategory] = useState(0);
    const [productLength, setProductLength] = useState(0);

    const productCategory = (categoryNo) => {
        setPCategory(categoryNo);
        setPActiveCategory(categoryNo);
    };

    const productList = () => {
        const usernamePharam = user ? user.username : "";
        const categoryPharam = pCategory ? pCategory : 0;
        const keywordPharam = keyword ? keyword : "";

        let url = `/main/product?keyword=${keywordPharam}&categoryNo=${categoryPharam}`;
        if (usernamePharam) {
            url += `&username=${usernamePharam}`;
        }

        const tokenPharam = token ? token : null;

        myAxios(tokenPharam, setToken)
            .get(url)
            .then((res) => {
                console.log(res.data);
                setProduct(res.data.cards);
                setProductLength(res.data.totalCount);
            })
            .catch((err) => {
                console.log(err);
            });
    };

     //관심상품 토글
        useEffect(() => {
            productList();
        }, [user.username, pCategory]);
    
        const toggleFavorite = async (productIdx) => {
            if (user.username === "") {
                navigate("/login");
                return;
            }
    
            try {
                await myAxios(token, setToken).post(`${baseUrl}/user/favoriteToggle`, {
                    productIdx: productIdx,
                    username: user.username,
                });
    
                setProductList((prev) => prev.map((p) => (p.productIdx === productIdx ? { ...p, favorite: !p.favorite } : p)));
            } catch (error) {
                console.error(error);
            }
        };

    useEffect(() => {
        productList();
    }, [user.username, pCategory, keyword]);

    //공구 리스트
    const [tCategory, setTcategory] = useState(0);
    const [tActiveCategory, setTActiveCategory] = useState(0);
    const [toolLength, setToolLength] = useState(0);

    const toolCategory = (categoryNo) => {
        setTcategory(categoryNo);
        setTActiveCategory(categoryNo);
    };

    const toolList = () => {
        const usernamePharam = user ? user.username : "";
        const categoryPharam = tCategory ? tCategory : 0;
        const keywordPharam = keyword ? keyword : "";

        let url = `/main/tool?keyword=${keywordPharam}&categoryNo=${categoryPharam}`;
        if (usernamePharam) {
            url += `&username=${usernamePharam}`;
        }

        const tokenPharam = token ? token : null;

        myAxios(tokenPharam, setToken)
            .get(url)
            .then((res) => {
                console.log(res.data);
                setTool(res.data.cards);
                setToolLength(res.data.totalCount);
            })
            .catch((err) => {
                console.log(err);
            });
    };

     // 관심 공구 토글
        const toggleFavoriteTool = async (toolIdx) => {
            if (!user.username) {
                navigate("/zipddak/login");
                return;
            }
    
            await myAxios(token, setToken).post(
                `${baseUrl}/user/favoriteToggle/tool`,
                {
                    toolIdx,
                    username: user.username,
                }
            );
    
            setTool(prev =>
                prev.map(t =>
                    t.toolIdx === toolIdx
                        ? { ...t, favorite: !t.favorite }
                        : t
                )
            );
        };
    

    useEffect(() => {
        toolList();
    }, [user.username, tCategory, keyword]);

    //커뮤니티 리스트
    const [cCategory, setCCategory] = useState(0);
    const [cActiveCategory, setCActiveCategory] = useState(0);

    const communityCategory = (categoryNo) => {
        setCCategory(categoryNo);
        setCActiveCategory(categoryNo);
    };

    const communityList = () => {
        const categoryPharam = tCategory ? tCategory : 0;
        const keywordPharam = keyword ? keyword : "";

        const tokenPharam = token ? token : null;

        myAxios(tokenPharam, setToken)
            .get(`/main/community?keyword=${keywordPharam}&categoryNo=${categoryPharam}`)
            .then((res) => {
                console.log(res.data);
                setCommunity(res.data.cards);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        communityList();
    }, [cCategory]);

    //전체보기
    const searchMore = () => {};

    return (
        <>
            <div className="Main-container">
                <form className="search-form" onSubmit={mainSearch}>
                    <div className="search">
                        <input className="search-input" type="text" placeholder="통합검색" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    </div>
                    <Button className="primary-button" type="submit">
                        <div className="sbutton">
                            <Search size={18} />
                            <span className="btxt">검색</span>
                        </div>
                    </Button>
                </form>

                <div className="search-result">
                    <span className="reuslt">{keyword ? keyword : search}</span>
                    <span>에 대한 검색결과</span>
                </div>

                <div className="card-box">
                    <div className="top">
                        <div className="title-box">
                            <div className="title-main-main">
                                <UserStar />
                                <span>추천 전문가</span>
                                <span className="s-count">{expertLength}</span>
                            </div>
                            <div className="more" onClick={() => navigate(`/zipddak/experts`)}>
                                <span>전체보기</span>
                                <CirclePlus size={14} />
                            </div>
                        </div>
                        {expert.length > 0 ? (
                            <>
                                <div className="main-category">
                                    <div className={eActiveCategory === 0 ? "category-item active" : "category-item"} onClick={() => expertCategory(0)}>
                                        전체
                                    </div>

                                    <div className={eActiveCategory === 23 ? "category-item active" : "category-item"} onClick={() => expertCategory(23)}>
                                        시공/견적 컨설팅
                                    </div>

                                    <div className={eActiveCategory === 44 ? "category-item active" : "category-item"} onClick={() => expertCategory(44)}>
                                        수리
                                    </div>

                                    <div className={eActiveCategory === 74 ? "category-item active" : "category-item"} onClick={() => expertCategory(74)}>
                                        인테리어
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="line"></div>
                        )}
                    </div>
                    {expert.length > 0 ? (
                        <div className="expert-cards">
                            {Array.isArray(expert) && expert.map((expertCard) => <Expertmain key={expertCard.expertIdx} expert={expertCard} toggleFavorite={expertCard.isFavorite} />)}
                        </div>
                    ) : (
                        <div className="cards">
                            <span>검색결과가 없습니다!</span>
                        </div>
                    )}
                </div>

                <div className="card-box">
                    <div className="top">
                        <div className="title-box">
                            <div className="title-main-main">
                                <MapPin size={24} />
                                <span>공구대여</span>
                                <span className="s-count">{toolLength}</span>
                            </div>
                            <div className="more" onClick={() => navigate(`/zipddak/tool`)}>
                                <span>전체보기</span>
                                <CirclePlus size={14} />
                            </div>
                        </div>

                        {tool.length > 0 ? (
                            <div className="main-category">
                                <div className={tActiveCategory === 0 ? "category-item active" : "category-item"} onClick={() => toolCategory(0)}>
                                    전체
                                </div>

                                <div className={tActiveCategory === 83 ? "category-item active" : "category-item"} onClick={() => toolCategory(83)}>
                                    전동공구
                                </div>

                                <div className={tActiveCategory === 84 ? "category-item active" : "category-item"} onClick={() => toolCategory(84)}>
                                    일반공구
                                </div>

                                <div className={tActiveCategory === 85 ? "category-item active" : "category-item"} onClick={() => toolCategory(85)}>
                                    생활용품
                                </div>

                                <div className={tActiveCategory === 86 ? "category-item active" : "category-item"} onClick={() => toolCategory(86)}>
                                    기타공구
                                </div>

                                <div className={tActiveCategory === 87 ? "category-item active" : "category-item"} onClick={() => toolCategory(87)}>
                                    찾아요
                                </div>
                            </div>
                        ) : (
                            <div className="line"></div>
                        )}
                    </div>

                    {tool.length > 0 ? (
                        <div className="cards">
                            <div className="morecards">{Array.isArray(tool) && tool.map((toolCard) => <Tool key={toolCard.toolIdx} tool={toolCard} toggleFavoriteTool={toggleFavoriteTool} />)}</div>
                        </div>
                    ) : (
                        <div className="cards">
                            <span>검색결과가 없습니다!</span>
                        </div>
                    )}
                </div>

                {/* <div className="advertise"></div> */}

                <div className="card-box">
                    <div className="top">
                        <div className="title-box">
                            <div className="title-main-main">
                                <Store />
                                <span>자재 마켓</span>
                                <span className="s-count">{productLength}</span>
                            </div>
                            <div className="more" onClick={() => navigate(`/zipddak/productList`)}>
                                <span>전체보기</span>
                                <CirclePlus size={14} />
                            </div>
                        </div>

                        {product.length > 0 ? (
                            <div className="main-category">
                                <div className={pActiveCategory === 0 ? "category-item active" : "category-item"} onClick={() => productCategory(0)}>
                                    전체
                                </div>

                                <div className={pActiveCategory === 1 ? "category-item active" : "category-item"} onClick={() => productCategory(1)}>
                                    주방
                                </div>

                                <div className={pActiveCategory === 6 ? "category-item active" : "category-item"} onClick={() => productCategory(6)}>
                                    욕실
                                </div>

                                <div className={pActiveCategory === 14 ? "category-item active" : "category-item"} onClick={() => productCategory(14)}>
                                    중문/도어
                                </div>

                                <div className={pActiveCategory === 15 ? "category-item active" : "category-item"} onClick={() => productCategory(15)}>
                                    창호/폴딩도어
                                </div>

                                <div className={pActiveCategory === 16 ? "category-item active" : "category-item"} onClick={() => productCategory(16)}>
                                    벽지/장판/마루
                                </div>

                                <div className={pActiveCategory === 17 ? "category-item active" : "category-item"} onClick={() => productCategory(17)}>
                                    타일
                                </div>

                                <div className={pActiveCategory === 18 ? "category-item active" : "category-item"} onClick={() => productCategory(18)}>
                                    시트/필름
                                </div>

                                <div className={pActiveCategory === 19 ? "category-item active" : "category-item"} onClick={() => productCategory(19)}>
                                    스위치/콘센트
                                </div>

                                <div className={pActiveCategory === 20 ? "category-item active" : "category-item"} onClick={() => productCategory(20)}>
                                    커튼/블라인드
                                </div>

                                <div className={pActiveCategory === 21 ? "category-item active" : "category-item"} onClick={() => productCategory(21)}>
                                    페인트
                                </div>

                                <div className={pActiveCategory === 22 ? "category-item active" : "category-item"} onClick={() => productCategory(22)}>
                                    조명
                                </div>
                            </div>
                        ) : (
                            <div className="line"></div>
                        )}
                    </div>

                    {product.length > 0 ? (
                        <div className="cards">
                            <div className="morecards">
                                {Array.isArray(product) && product.map((productCard) => <Products key={productCard.productIdx} product={productCard} toggleFavorite={toggleFavorite} />)}
                            </div>
                        </div>
                    ) : (
                        <div className="cards">
                            <span>검색결과가 없습니다!</span>
                        </div>
                    )}
                </div>

                <div className="card-box">
                    <div className="top">
                        <div className="title-box">
                            <div className="title-main-main">
                                <MessageSquareHeart />
                                <span>커뮤니티</span>
                                <span className="s-count">{community.length}</span>
                            </div>
                            <div className="more" onClick={() => navigate(`/zipddak/community`)}>
                                <span>전체보기</span>
                                <CirclePlus size={14} />
                            </div>
                        </div>

                        {community.length > 0 ? (
                            <div className="main-category">
                                <div className={cActiveCategory === 0 ? "category-item active" : "category-item"} onClick={() => communityCategory(0)}>
                                    전체
                                </div>
                                <div className={cActiveCategory === 76 ? "category-item active" : "category-item"} onClick={() => communityCategory(76)}>
                                    우리집 자랑
                                </div>

                                <div className={cActiveCategory === 77 ? "category-item active" : "category-item"} onClick={() => communityCategory(77)}>
                                    자재 토론회
                                </div>

                                <div className={cActiveCategory === 78 ? "category-item active" : "category-item"} onClick={() => communityCategory(78)}>
                                    나만의 노하우
                                </div>

                                <div className={cActiveCategory === 79 ? "category-item active" : "category-item"} onClick={() => communityCategory(79)}>
                                    전문가에게 묻다
                                </div>

                                <div className={cActiveCategory === 80 ? "category-item active" : "category-item"} onClick={() => communityCategory(80)}>
                                    함께해요
                                </div>

                                <div className={cActiveCategory === 81 ? "category-item active" : "category-item"} onClick={() => communityCategory(81)}>
                                    전문가 소식
                                </div>

                                <div className={cActiveCategory === 82 ? "category-item active" : "category-item"} onClick={() => communityCategory(82)}>
                                    자유
                                </div>
                            </div>
                        ) : (
                            <div className="line"></div>
                        )}

                        {community.length > 0 ? (
                            <div className="community-cards">
                                <div className="grid-cm">{Array.isArray(community) && community.map((communityCard) => <Community key={communityCard.communityId} community={communityCard} />)}</div>
                            </div>
                        ) : (
                            <div className="cards">
                                <span>검색결과가 없습니다!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
