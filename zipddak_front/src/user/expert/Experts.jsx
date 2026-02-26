import { RotateCcw } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import "../css/Experts.css";
import { Input } from "reactstrap";
import Expert from "./Expert";
import axios from "axios";
import { baseUrl, myAxios } from "../../config";
import { useNavigate } from "react-router";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";

export default function Experts() {
    const navigate = useNavigate();

    const [token, setToken] = useAtom(tokenAtom);
    const [user, setUser] = useAtom(userAtom);

    const [selectMajor, setSelectMajor] = useState(23);
    const [expertList, setExpertList] = useState([]);
    const [addExpertList, setAddExpertList] = useState([]);

    const [sort, setSort] = useState("popular");
    const [page, setPage] = useState(1); // 현재 페이지
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터 존재 여부
    const observer = useRef();

    const [flag, setFlag] = useState(false);

    // 검색창에 있는 text 가져오기
    const inputRef = useRef(null);
    const [keyword, setKeyword] = useState("");

    const expertMajor = [
        { majorId: 23, major: "수리 전문가" },
        { majorId: 44, major: "인테리어 전문가" },
        { majorId: 74, major: "컨설팅 전문가" },
    ];

    const fetchProducts = async (value) => {
        setLoading(true);

        let searchKeyword;
        searchKeyword = value === undefined ? keyword : value;

        try {
            // 테스트용으로 뒤에 username을 붙임
            const res = await myAxios().get(`${baseUrl}/experts?page=${page}&cateNo=${selectMajor}&sort=${sort}&keyword=${keyword}`);

            console.log(res.data);
            if (res.data.length === 0) {
                setHasMore(false); // 더 이상 데이터 없음
            } else {
                setExpertList((prev) => [...prev, ...res.data]); // 기존 데이터에 추가
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const keywordSearch = async () => {
        const value = inputRef.current.value === undefined ? keyword : inputRef.current.value;
        setKeyword(value);
        // 검색버튼 클릭시 새 배열로 초기화
        reset();
        fetchProducts(value);
    };

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

    // 정보 초기화
    const reset = () => {
        setExpertList([]);
        setAddExpertList([]);
        setPage(1);
        setHasMore(true);
    };

    const filterReset = () => {
        setExpertList([]);
        setAddExpertList([]);
        setPage(1);
        setHasMore(true);
        setKeyword("");
        setFlag(!flag);
    };

    // 첫 화면을 불러올때

    useEffect(() => {
        myAxios()
            .get(`${baseUrl}/addExperts?cateNo=${selectMajor}`)
            .then((res) => {
                console.log(res.data);
                setAddExpertList(res.data);
            });
    }, [selectMajor, flag]);

    useEffect(() => {
        if (!hasMore) return;

        fetchProducts();
    }, [page, hasMore, selectMajor, sort]);

    return (
        <div className="body-div">
            <div className="experts-main-div">
                {/* 전문가 목록 카테고리 */}
                <div className="experts-cate-select-bar">
                    <span className="font-22 semibold experts-cate-select-span">전문가 목록</span>
                    <div className="experts-cate-select-button-div">
                        {expertMajor.map((expert) => (
                            <button
                                key={expert.majorId}
                                onClick={() => {
                                    setSelectMajor(expert.majorId);
                                    reset();
                                }}
                                className={expert.majorId === selectMajor ? "experts-select-major" : "experts-default-major"}
                            >
                                {expert.major}
                            </button>
                        ))}
                    </div>
                </div>
                {/* 검색바 + 전문가 프로필 */}
                <div className="experts-search-expert-div">
                    <div style={{ display: "flex", gap: "15px" }}>
                        {/* 검색바 */}
                        <div className="experts-search-bar-div">
                            <Input
                                style={{ height: "33px" }}
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                ref={inputRef}
                                placeholder="검색어를 입력해주세요"
                                className="experts-search-bar-input font-14"
                            />
                            <button onClick={keywordSearch} className="experts-search-bar-button">
                                <i className="bi bi-search "></i>
                            </button>
                        </div>
                        <button onClick={filterReset} style={{ height: "45px", border: "none", backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <RotateCcw size={14} />
                            초기화
                        </button>
                    </div>

                    {/* 추천 전문가(광고) + 견적 요청 버튼 */}
                    <div className="experts-add-expert-div">
                        <span className="font-18 semibold add-experts-span">추천 전문가</span>
                        <button onClick={() => navigate("/zipddak/findExpert")} type="button" className="experts-request-button font-14 semibold">
                            견적 요청
                        </button>
                    </div>

                    {/* 광고 전문가 프로필 3개 */}
                    <div
                        className="experts-add-expert-list"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            rowGap: "50px", // 줄 간격
                        }}
                    >
                        {addExpertList.map((expert, index) => (
                            <Expert
                                key={index}
                                expert={expert}
                                style={{ flex: "0 0 32%", boxSizing: "border-box" }} // Expert 컴포넌트 안에서 style prop 받도록 수정 필요
                            />
                        ))}
                    </div>

                    <div style={{ width: "100%", height: "1px", backgroundColor: "lightgray", display: "flex", justifyContent: "center" }}></div>

                    {/* 전문가 + 정렬 필터 */}
                    <div className="experts-search-expert-sort">
                        <span className="font-18 semibold">전문가</span>
                        <select
                            onChange={(e) => {
                                setSort(e.target.value);
                                reset();
                            }}
                            className="experts-search-sort"
                            name=""
                            id=""
                        >
                            <option value="popular">인기순</option>
                            <option value="rating">평점순</option>
                            <option value="career">경력순</option>
                        </select>
                    </div>

                    {/* 전문가 프로필 3개씩 N줄 */}
                    <div
                        className="experts-add-expert-list"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            rowGap: "50px", // 줄 간격
                        }}
                    >
                        {expertList.map((expert, index) => (
                            <div key={expert.expertIdx} ref={expertList.length === index + 1 ? lastProductRef : null}>
                                <Expert
                                    expert={expert}
                                    style={{ flex: "0 0 32%", boxSizing: "border-box" }} // Expert 컴포넌트 안에서 style prop 받도록 수정 필요
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
