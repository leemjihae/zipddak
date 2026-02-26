import { Input } from "reactstrap";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "../css/ProductList.css";
import Product from "./Product";
import { baseUrl, myAxios } from "../../config";
import { userAtom } from "../../atoms";
import { tokenAtom } from "../../atoms";
import { useAtomValue, useAtom } from "jotai/react";
import { useNavigate } from "react-router";

export default function ProductList() {
    const navigate = useNavigate();

    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [flag, setFlag] = useState(false);
    const [pCateNo, setpCateNo] = useState(1);
    const [middleCateNo, setMiddleCateNo] = useState(1);
    const [filterNo, setFilterNo] = useState(1);

    const [productList, setProductList] = useState([]);

    const [page, setPage] = useState(1); // 현재 페이지
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터 존재 여부
    const observer = useRef();

    // 검색창에 있는 text 가져오기
    const inputRef = useRef(null);
    const [keyword, setKeyword] = useState("");

    // 주방 중분류
    const cate1Arr = [
        { middleCateNo: 1, name: "전체" },
        { middleCateNo: 2, name: "싱크볼" },
        { middleCateNo: 3, name: "후드" },
        { middleCateNo: 4, name: "주방수전" },
        { middleCateNo: 5, name: "주방상하부장" },
    ];

    // 욕실 중분류
    const cate2Arr = [
        { middleCateNo: 1, name: "전체" },
        { middleCateNo: 7, name: "욕실수전" },
        { middleCateNo: 8, name: "세면대" },
        { middleCateNo: 9, name: "양변기" },
        { middleCateNo: 10, name: "욕실상하부장" },
        { middleCateNo: 11, name: "파티션&샤워부스" },
        { middleCateNo: 12, name: "환풍기" },
        { middleCateNo: 13, name: "욕실기기&부자재" },
    ];

    const dataMap = {
        1: cate1Arr,
        6: cate2Arr,
    };

    // 정렬 필터
    const filter = [
        { filterNo: 1, name: "인기순" },
        { filterNo: 2, name: "최신순" },
        { filterNo: 3, name: "낮은가격순" },
        { filterNo: 4, name: "높은가격순" },
        { filterNo: 5, name: "평점 높은순" },
    ];

    const fetchProducts = async (value) => {
        setLoading(true);
        // const url = `${baseUrl}/productList/?keyword=${searchKeyword}&cate1=${pCateNo}&cate2=${middleCateNo}&sortId=${filterNo}&page=${page}&username=${username}`;

        console.log("실행");

        let searchKeyword;
        searchKeyword = value === undefined ? keyword : value;

        try {
            const url = `${baseUrl}/productList/?keyword=${searchKeyword}&cate1=${pCateNo}&cate2=${middleCateNo}&sortId=${filterNo}&page=${page}&username=${user.username}`;

            myAxios(token, setToken)
                .get(url)
                .then((res) => {
                    console.log(res.data);
                    if (res.data.length === 0) {
                        setHasMore(false); // 더 이상 데이터 없음
                    } else {
                        setProductList((prev) => [...prev, ...res.data]); // 기존 데이터에 추가
                    }
                });

            // const res = await axios.get(`${baseUrl}/productList/?keyword=${searchKeyword}&cate1=${pCateNo}&cate2=${middleCateNo}&sortId=${filterNo}&page=${page}&username=${user.username}`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 검색
    const keywordSearch = async () => {
        const value = inputRef.current.value;
        setKeyword(value);
        // 검색버튼 클릭시 새 배열로 초기화
        setProductList([]);
        setPage(1);
        fetchProducts(value);
    };

    // 마지막 상품 ref
    const lastProductRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1); // 마지막 아이템이 화면에 보이면 페이지 증가
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

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

    // 카테고리/정렬 변경 시 초기화 + 첫 페이지 데이터 가져오기
    useEffect(() => {
        setProductList([]); // 기존 데이터 초기화
        setPage(1);
        setHasMore(true);
    }, [pCateNo, middleCateNo, filterNo]);

    // 데이터 가져오기 (페이지 단위)
    useEffect(() => {
        if (!hasMore) {
            console.log("없음");
            return;
        }
        if (user?.username == null) return;

        fetchProducts();
    }, [page, pCateNo, middleCateNo, filterNo, flag]);

    return (
        <div className="body-div">
            <div className="productList-main-div">
                {/* 검색바 */}
                <div className="productList-search-bar">
                    <Input innerRef={inputRef} className="productList-search-input" placeholder="검색어를 입력해주세요" />
                    <button className="productList-search-btn" onClick={keywordSearch}>
                        <i className="bi bi-search"></i>
                    </button>
                </div>

                {/* 상품 카테고리 */}
                <div className="cate-list">
                    {[
                        { id: 1, img: "주방.jpg", label: "주방" },
                        { id: 6, img: "욕실.jpg", label: "욕실" },
                        { id: 14, img: "중문도어.jpg", label: "중문/도어" },
                        { id: 15, img: "폴딩도어.jpg", label: "폴딩도어" },
                        { id: 16, img: "장판.jpg", label: "벽지/장판/마루" },
                        { id: 17, img: "타일.jpg", label: "타일" },
                        { id: 18, img: "필름.jpg", label: "시트/필름" },
                        { id: 19, img: "콘센트.jpg", label: "스위치/콘센트" },
                        { id: 20, img: "커튼.jpg", label: "커튼블라인드" },
                        { id: 21, img: "페인트.jpg", label: "페인트" },
                        { id: 22, img: "조명.jpg", label: "조명" },
                    ].map((cate) => (
                        <button
                            key={cate.id}
                            className="p-cate-btn"
                            onClick={() => {
                                setHasMore(true);
                                setpCateNo(cate.id);
                                if (cate.id === 1 || cate.id === 6) setMiddleCateNo(1); // 주방/욕실만 middleCate 초기화
                            }}
                        >
                            <img style={pCateNo === cate.id ? { border: "3px solid #ff5833" } : undefined} className="p-cate-img" src={`/productCateImg/${cate.img}`} alt={cate.label} />
                            <span style={pCateNo === cate.id ? { color: "#ff5833", fontWeight: "700" } : undefined} className="p-cate-span">
                                {cate.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* 추가 카테고리, 정렬 필터 */}
                <div className="cate-filter">
                    {/* 주방, 욕실인 경우에만 보이는 중분류 */}
                    <div>
                        {dataMap[pCateNo]?.map((cate) => (
                            <button
                                className={middleCateNo === cate.middleCateNo ? "click-middle-cate" : "middle-cate"}
                                key={cate.middleCateNo}
                                onClick={() => {
                                    setHasMore(true);
                                    setMiddleCateNo(cate.middleCateNo);
                                    setFlag(!flag);
                                }}
                            >
                                {cate.name}
                            </button>
                        ))}
                    </div>
                    <div className="filter-div">
                        {filter.map((fil) => (
                            <button
                                key={fil.filterNo}
                                onClick={() => {
                                    setFilterNo(fil.filterNo);
                                    setFlag(!flag);
                                }}
                                className={filterNo === fil.filterNo ? "product-click-filter" : "product-filter"}
                            >
                                {fil.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 상품 리스트 */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        rowGap: "38px", // 위아래 간격
                        columnGap: "46.66px", // 좌우 간격 계산
                        width: "1200px",
                        justifyContent: "flex-start", // 좌측 정렬
                        boxSizing: "border-box",
                    }}
                >
                    {productList.map((product, index) => (
                        <div
                            key={product.name}
                            style={{
                                flex: "0 0 265px", // 고정 너비
                                boxSizing: "border-box",
                            }}
                            ref={productList.length === index + 1 ? lastProductRef : null}
                        >
                            <Product product={product} toggleFavorite={() => toggleFavorite(product.productIdx)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
