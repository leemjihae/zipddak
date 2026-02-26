//css
import table from "../css/table.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";
import { priceFormat } from "../js/priceFormat.jsx";
// library
import { useNavigate } from "react-router-dom"; //페이지 이동
import { FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useState, useEffect, useRef } from "react";
import { myAxios, baseUrl } from "../../config.jsx";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";

export default function ProductList() {
    const pageTitle = usePageTitle("상품 조회 리스트");
    const navigate = useNavigate();
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [myProductList, setMyProductList] = useState([]);
    const [myProductCount, setmyProductCount] = useState(0);
    const [pageBtn, setPageBtn] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    //(필터) 셀러가 등록한 상품의 카테고리만 출력
    const [categories, setCategories] = useState([]);
    const [categoryMap, setCategoryMap] = useState({}); //리스트에 매핑할 카테고리Map
    useEffect(() => {
        if (!user) return;

        user.username &&
            myAxios(token, setToken)
                .get(`/seller/product/categories?sellerId=${user.username}`)
                .then((res) => {
                    setCategories(res.data); // 필터에 카테고리명 매핑

                    // categories를 이용한 categoryMap 생성
                    const map = Object.fromEntries(res.data.map((c) => [c.categoryIdx, c.name]));
                    setCategoryMap(map);
                })
                .catch((err) => console.error(err));
    }, [user]);

    // 필터 상태값
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [keyword, setKeyword] = useState("");
    //통합 필터 함수 형태 (API 호출)
    const fetchFilteredProducts = (page = 1) => {
        const category = selectedCategory.join(",");
        const status = selectedStatus.join(",");

        myAxios(token, setToken)
            .get("/seller/product/myProductList", {
                params: {
                    sellerId: user.username,
                    page,
                    category: category || null,
                    status: status || null,
                    keyword: keyword || null,
                },
            })
            .then((res) => {
                const data = res.data;

                setMyProductList(data.myProductList);
                setmyProductCount(data.myProductCount);

                setPageInfo({
                    curPage: data.curPage,
                    allPage: data.allPage,
                    startPage: data.startPage,
                    endPage: data.endPage,
                });

                const btns = [];
                for (let i = data.startPage; i <= data.endPage; i++) btns.push(i);
                setPageBtn(btns);
            })
            .catch((err) => console.error(err));
    };

    // (필터) 판매상태 선택
    const onChangeStatus = (e) => {
        const value = e.target.value;

        if (value === "all") {
            setSelectedStatus([]);
            return fetchFilteredProducts(1);
        }

        let newList;

        if (e.target.checked) {
            newList = [...selectedStatus, value];
        } else {
            newList = selectedStatus.filter((v) => v !== value);
        }

        setSelectedStatus(newList);
        fetchFilteredProducts();
    };

    // (필터) 카테고리 선택
    const onChangeCategory = (e) => {
        const value = e.target.value;

        if (value === "all") {
            setSelectedCategory([]);
            return fetchFilteredProducts(); // 통합 API 호출
        }

        let newList;

        if (e.target.checked) {
            newList = [...selectedCategory, Number(value)];
        } else {
            newList = selectedCategory.filter((v) => v !== Number(value));
        }

        setSelectedCategory(newList);
        fetchFilteredProducts();
    };

    // 검색/페이징 공통 함수
    const submit = (page = 1) => {
        const params = new URLSearchParams();

        params.append("sellerId", user.username);
        params.append("page", page);

        if (selectedStatus.length > 0) params.append("status", selectedStatus.join(","));
        if (selectedCategory.length > 0) params.append("category", selectedCategory.join(","));
        if (keyword) params.append("keyword", keyword);

        const productListUrl = `/seller/product/myProductList?${params.toString()}`;
        myAxios(token, setToken)
            .get(productListUrl)
            .then((res) => {
                const data = res.data;

                setMyProductList(data.myProductList);
                setmyProductCount(data.myProductCount);

                const pageData = {
                    curPage: data.curPage,
                    allPage: data.allPage,
                    startPage: data.startPage,
                    endPage: data.endPage,
                };
                setPageInfo(pageData);

                const btns = [];
                for (let i = pageData.startPage; i <= pageData.endPage; i++) {
                    btns.push(i);
                }
                setPageBtn(btns);
            })
            .catch((err) => console.log(err));
    };

    // 최초 1회 로딩
    // useEffect(() => {
    //     user.username && submit(1);
    // }, [user]);

    // 필터 변경 시 자동 submit
    useEffect(() => {
        user.username && submit(1);
    }, [selectedCategory, selectedStatus, user]);
    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame listFrame">
                    <div className="headerFrame">
                        <i className="bi bi-box2"></i>
                        <span>상품 조회</span>
                    </div>

                    <div className="bodyFrame">
                        <div className={table.tableFrame}>
                            {/* 필터영역 */}
                            <div className={table.filterArea}>
                                <div className={table.filterColumn}>
                                    <div className={table.filterTitle}>판매 상태</div>
                                    <div className={table.filterBody}>
                                        <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" value="all" checked={selectedStatus.length === 0} onChange={onChangeStatus} />
                                                전체
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" value="1" checked={selectedStatus.includes("1")} onChange={onChangeStatus} />
                                                판매중
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" value="0" checked={selectedStatus.includes("0")} onChange={onChangeStatus} />
                                                비공개
                                            </Label>
                                        </FormGroup>
                                        {/* <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" value="soldout" checked={selectedStatus.includes("soldout")} onChange={onChangeStatus} />
                                                품절
                                            </Label>
                                        </FormGroup> */}
                                    </div>
                                </div>
                                <div className={table.filterColumn}>
                                    <div className={table.filterTitle}>카테고리</div>
                                    <div className={table.filterBody}>
                                        {/* 전체 체크박스 */}
                                        <FormGroup check inline>
                                            <Label check>
                                                <Input type="checkbox" value="all" checked={selectedCategory.length === 0} onChange={onChangeCategory} />
                                                전체
                                            </Label>
                                        </FormGroup>

                                        {/* DB에서 받아온 카테고리만 렌더링 */}
                                        {categories.map((c) => (
                                            <FormGroup check inline key={c.categoryIdx}>
                                                <Label check>
                                                    <Input type="checkbox" value={c.categoryIdx} checked={selectedCategory.includes(c.categoryIdx)} onChange={onChangeCategory} />
                                                    {c.name}
                                                </Label>
                                            </FormGroup>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 테이블 영역 */}
                            <div className={table.tableArea}>
                                <div className={table.wholeTable}>
                                    <div className={table.tableHeader}>
                                        <div className={table.totalSearchBox}>
                                            <Input id="exampleSearch" name="search" placeholder="통합검색" type="search" className={table.searchInput} onChange={(e) => setKeyword(e.target.value)} />
                                            <button type="button" className="small-button" onClick={() => submit(1)}>
                                                검색
                                            </button>
                                        </div>
                                        <div className="btn_part">
                                            <button type="button" className="primary-button" onClick={() => navigate("/seller/productRegist")}>
                                                <i className="bi bi-plus-square"></i> 상품 등록
                                            </button>
                                        </div>
                                    </div>
                                    <div className={table.tableBody}>
                                        <table className={table.list_table}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "5%" }}>Img</th>
                                                    <th style={{ width: "35%" }}>상품명</th>
                                                    <th style={{ width: "10%" }}>카테고리</th>
                                                    <th style={{ width: "10%" }}>판매가</th>
                                                    <th style={{ width: "10%" }}>리뷰수</th>
                                                    <th style={{ width: "10%" }}>리뷰평점</th>
                                                    <th style={{ width: "10%" }}>판매상태</th>
                                                    <th style={{ width: "10%" }}>등록일</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {myProductList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className={table.noData} style={{ textAlign: "center" }}>
                                                            등록된 상품이 없습니다.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    myProductList.map((myProduct) => (
                                                        <tr key={myProduct.productIdx} onClick={() => navigate(`/seller/productDetail/${myProduct.productIdx}`)}>
                                                            <td className={table.img_cell} style={{ padding: "0" }}>
                                                                <img src={myProduct.thumbnailFileRename ? `${baseUrl}/imageView?type=product&filename=${myProduct.thumbnailFileRename}` : "/no_img.svg"} style={{ width: "50%" }} />
                                                            </td>
                                                            <td className={table.title_cell}> {myProduct.name}</td>
                                                            <td>{categoryMap[myProduct.categoryIdx] || "-"}</td>
                                                            <td>{myProduct.salePrice ? priceFormat(myProduct.salePrice) : priceFormat(myProduct.price)}</td>
                                                            <td>{myProduct.reviewCount}</td>
                                                            <td>{myProduct.reviewAvgScore}</td>
                                                            <td>{myProduct.visibleYn ? "판매중" : "비공개"}</td>
                                                            <td>{myProduct.createdAt}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className={table.totalCnt}>
                                        <p>[총 등록 상품 수: {myProductCount}]</p>
                                    </div>
                                </div>

                                <div className="pagination_part">
                                    <Pagination className={table.my_pagination}>
                                        <PaginationItem>
                                            <PaginationLink previous onClick={() => submit(pageInfo.curPage - 1)} />
                                        </PaginationItem>
                                        {pageBtn.map((p) => (
                                            <PaginationItem key={p} active={pageInfo.curPage == p}>
                                                <PaginationLink onClick={() => submit(p)}>{p}</PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationLink next onClick={() => submit(pageInfo.curPage + 1)} />
                                        </PaginationItem>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
