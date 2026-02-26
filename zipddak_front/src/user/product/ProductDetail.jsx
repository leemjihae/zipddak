import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/ProductDetail.css";
import { useState, useRef, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import axios from "axios";
import { baseUrl } from "../../config";
import { useParams } from "react-router";
import { orderListAtom } from "./productAtom";
import { useNavigate } from "react-router";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { myAxios } from "../../config";

export default function ProductDetail() {
    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const navigate = useNavigate();

    const [bottomSelect, setBottomSelect] = useState(1);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [cartModal, setCartModal] = useState(false);
    const cartToggle = () => setCartModal(!cartModal);

    const [inquiries, setInquiries] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [avgScore, setAvgScore] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [inquiryCount, setInquiryCount] = useState(0);
    const [product, setProduct] = useState({});

    const [files, setFiles] = useState([]);
    const [inquireContent, setInquireContent] = useState("");

    // 알림 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달 안에 들어갈 메세지
    const [modalMessage, setModalMessage] = useState("");

    // 관심 유무
    const [favorite, setFavorite] = useState(false);
    // 리뷰 현재 페이지
    const [reviewPage, setReviewPage] = useState(1);
    // 문의 현재 페이지
    const [inquiryPage, setInquiryPage] = useState(1);

    // 구매 총 금액
    const [totalPrice, setTotalPrice] = useState(0);

    // 상품 옵션
    const [productOption, setProductOption] = useState({});

    // 상품 옵션 상단
    const [selectOption, setSelectOption] = useState("");
    // const [selectColor, setSelectColor] = useState("");
    const [selectOptionInfo, setSelectOptionInfo] = useState({});

    // 상품 옵션 하단
    const [selectOption2, setSelectOption2] = useState("");
    const [selectOptionInfo2, setSelectOptionInfo2] = useState({});

    // 구매 목록 상품들
    const [orderList, setOrderList] = useAtom(orderListAtom);

    // 자재 상품 id
    const { productId } = useParams();

    // 규격 변경 핸들러
    const handleOptionChange = (value, type = "top") => {
        if (type === "top") {
            setSelectOption(value); // 규격 상태 변경
            setSelectOptionInfo({}); // 선택 옵션 초기화
        } else {
            setSelectOption2(value);
            setSelectOptionInfo2({});
        }
    };

    // 증가
    const increaseCount = (optionId) => {
        setOrderList((prevList) =>
            prevList.map((option) =>
                option.optionId === optionId
                    ? { ...option, count: option.count + 1 } // count 1 증가
                    : option
            )
        );
    };

    // 감소
    const decreaseCount = (optionId) => {
        setOrderList(
            (prevList) =>
                prevList
                    .map((option) =>
                        option.optionId === optionId
                            ? { ...option, count: option.count - 1 } // count 1 감소
                            : option
                    )
                    .filter((option) => option.count > 0) // 0보다 큰것만 보이게
        );
    };

    // 삭제
    const deleteOption = (optionId) => {
        setOrderList(
            (prevList) => prevList.filter((option) => option.optionId !== optionId) // 선택한걸 제외한 것만 남기게
        );
    };

    const handleOption = (optionId, type = "top") => {
        const targetOption = type === "top" ? selectOption : selectOption2;
        const selectedOption = productOption[targetOption]?.find((o) => o.optionId === Number(optionId));
        if (selectedOption) {
            const info = {
                optionId: selectedOption.optionId,
                price: selectedOption.price,
                color: selectedOption.color,
            };
            type === "top" ? setSelectOptionInfo(info) : setSelectOptionInfo2(info);
        } else {
            type === "top" ? setSelectOptionInfo({}) : setSelectOptionInfo2({});
        }
    };

    const addOption = (type = "top") => {
        const info = type === "top" ? selectOptionInfo : selectOptionInfo2;
        const name = type === "top" ? selectOption : selectOption2;
        if (!info.optionId) return;

        const existingIndex = orderList.findIndex((item) => item.optionId === info.optionId);
        if (existingIndex !== -1) {
            const updatedList = [...orderList];
            updatedList[existingIndex].count += 1;
            setOrderList(updatedList);
        } else {
            setOrderList([
                ...orderList,
                {
                    productId: product.productIdx,
                    optionId: info.optionId,
                    name,
                    value: info.color,
                    price: product.salePrice ? info.price + product.salePrice : info.price + product.price,
                    count: 1,
                },
            ]);
        }
    };

    const writeInquire = () => {
        if (!inquireContent) {
            setModalMessage("내용을 입력해주세요");
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 1500);

            return;
        }

        const formData = new FormData();

        formData.append("content", inquireContent);

        formData.append("productIdx", product.productIdx);

        formData.append("username", user.username);

        files.forEach((file) => {
            formData.append("files", file);
        });

        myAxios(token, setToken)
            .post(`${baseUrl}/user/writeInquire`, formData, {
                headers: {
                    "Content-Type": "multipary/form-data",
                },
            })
            .then((res) => {
                console.log(res.data);
                setModalMessage("문의가 등록되었습니다.");
                toggle();
                setIsModalOpen(true);
                setTimeout(() => {
                    setIsModalOpen(false);
                }, 1500);
            });
    };

    // 리뷰 더보기
    const loadMoreReviews = async () => {
        const nextPage = reviewPage + 1;

        try {
            const res = await axios.get(`${baseUrl}/reviews?productId=${productId}&page=${nextPage}`);

            if (res.data.length > 0) {
                setReviews((prev) => [...prev, ...res.data]);
                setReviewPage(nextPage);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 문의 더보기
    const loadMoreInquiries = async () => {
        if (!inquiryHasMore) return;

        const nextPage = inquiryPage + 1;

        try {
            const res = await axios.get(`${baseUrl}/inquiries?productId=${productId}&page=${nextPage}`);

            if (res.data.length > 0) {
                setInquiries((prev) => [...prev, ...res.data]);
                setInquiryPage(nextPage);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 관심 토글
    const favoriteToggle = async (productIdx) => {
        if (user.username === "") {
            navigate("/login");
            return;
        }
        await myAxios(token, setToken).post(`${baseUrl}/user/favoriteToggle`, {
            productIdx,
            username: user.username,
        });

        setFavorite(!favorite);
    };

    useEffect(() => {
        let sum = 0;
        orderList.forEach((order) => {
            sum += order.price * order.count;
        });
        setTotalPrice(sum);
    }, [orderList]); // orderList가 바뀔 때마다 totalPrice 계산

    // --- 섹션 refs ---
    const infoRef = useRef(null);
    const reviewRef = useRef(null);
    const askRef = useRef(null);
    const deliveryRef = useRef(null);

    const navItems = [
        { id: 1, label: "상품정보", ref: infoRef },
        { id: 2, label: "리뷰", ref: reviewRef, count: reviewCount },
        { id: 3, label: "문의", ref: askRef, count: inquiryCount },
        { id: 4, label: "배송/환불", ref: deliveryRef },
    ];

    const handleNavClick = (item) => {
        setBottomSelect(item.id);
        // item.ref.current?.scrollIntoView({ behavior: "auto", block: "start" });
        const top = item.ref.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top, behavior: "instant" });
    };

    // 장바구니에 담기
    const addCart = () => {
        if (user.username === "") {
            navigate("/login");
            return;
        }

        if (orderList.length === 0) {
            setModalMessage("한 개 이상의 상품을 담아주세요");
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 1500);
            return;
        }

        console.log(orderList);
        myAxios(token, setToken)
            .post(`${baseUrl}/user/addCart`, {
                orderListDto: orderList,
                username: user.username,
            })
            .then((res) => {
                setCartModal(true);
            });
    };

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5, // 50% 보이면 해당 섹션으로 인식
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // 어떤 ref가 보였는지 찾기
                    const visibleSection = navItems.find((item) => item.ref.current === entry.target);
                    if (visibleSection) {
                        setBottomSelect(visibleSection.id);
                    }
                }
            });
        }, options);

        // 모든 섹션 observer에 등록
        navItems.forEach((item) => {
            if (item.ref?.current) observer.observe(item.ref.current);
        });

        return () => {
            navItems.forEach((item) => {
                if (item.ref?.current) observer.unobserve(item.ref.current);
            });
        };
    }, []);

    useEffect(() => {
        if (!user) return;

        myAxios(token, setToken)
            .get(`${baseUrl}/product?productId=${productId}&username=${user.username}`)
            .then((res) => {
                const data = res.data;
                console.log(data);
                setAvgScore(data.avgScore);
                setReviewCount(data.reviewCount);
                setInquiries(data.productInquiries);
                setReviews(data.productReviews);
                setProduct(data.productDetailDto);
                setProductOption(data.productOption);
                setInquiryCount(data.inquiryCount);
                setFavorite(data.favorite);

                // 리뷰 페이지, 문의 페이지 1페이지로 초기화
                setReviewPage(1);
                setInquiryPage(1);

                // 구매 목록 초기화
                setOrderList([]);
            });
    }, [user]);

    return (
        <div className="body-div">
            <div style={{ padding: "72px 16px", marginTop: "0" }} className="ProductDetail-main-div">
                {/* 상품 상세 상단 */}
                <div className="detail-top">
                    {/* 좌측 상품 이미지 */}
                    <div>
                        {/* 메인 이미지 */}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <img style={{ border: "none", height: "auto", width: "640px" }} className="detail-main-img" src={`${baseUrl}/imageView?type=product&filename=${product.thumbnail}`}></img>
                        </div>
                        {/* 이미지 리스트 */}
                        <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "15px" }}>
                            {product.img1 && <img style={{ width: "120px", height: "120px" }} src={`${baseUrl}/imageView?type=product&filename=${product.img1}`}></img>}
                            {product.img2 && <img style={{ width: "120px", height: "120px" }} src={`${baseUrl}/imageView?type=product&filename=${product.img2}`}></img>}
                            {product.img3 && <img style={{ width: "120px", height: "120px" }} src={`${baseUrl}/imageView?type=product&filename=${product.img3}`}></img>}
                            {product.img4 && <img style={{ width: "120px", height: "120px" }} src={`${baseUrl}/imageView?type=product&filename=${product.img4}`}></img>}
                            {product.img5 && <img style={{ width: "120px", height: "120px" }} src={`${baseUrl}/imageView?type=product&filename=${product.img5}`}></img>}
                        </div>
                    </div>

                    {/* 우측 구매 항목 */}
                    <div className="detail-top-right">
                        <div className="detail-product-info">
                            {/* 카테고리 */}
                            {/* <div>
                                <span className="product-category">{product.category}</span>
                                {product.subCategory ? <span className="product-category"> - {product.subCategory}</span> : <></>}
                            </div> */}

                            {/* 업체명 */}
                            <span
                                onClick={() => {
                                    navigate(`/zipddak/storeInfo/${product.sellerIdx}`);
                                }}
                                style={{ cursor: "pointer", fontWeight: "600", color: "rgb(130, 140, 148)" }}
                                className="product-store-name"
                            >
                                {product.brandName}
                            </span>

                            <div className="detail-product-name-div" style={{ alignItems: "flex-start", margin: "5px 0 3px 0" }}>
                                {/* 상품 이름 */}
                                <div style={{ fontSize: "20px", fontWeight: "500" }} className="detail-product-name">
                                    {product.name}
                                </div>
                                <button onClick={() => favoriteToggle(product.productIdx)} style={{ border: "none", backgroundColor: "transparent" }}>
                                    {favorite ? <i className="bi bi-heart-fill product-like"></i> : <i className="bi bi-heart product-like"></i>}
                                </button>
                            </div>
                            <div className="detail-product-div-under">
                                <div className="detail-price-review-div">
                                    <div>
                                        {product.discount ? (
                                            <>
                                                <div className="detail-sale-div">
                                                    {/* 세일 퍼센트 */}
                                                    <span style={{ color: "rgb(130, 140, 148)" }} className="detail-sale-percent">
                                                        {product.discount}%
                                                    </span>
                                                    {/* 정가 */}
                                                    <del style={{ color: "rgb(194, 200, 204)" }} className="detail-default-price">
                                                        {product?.price?.toLocaleString()}원
                                                    </del>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "flex-end", marginBottom: "5px", marginTop: "3px" }}>
                                                    {/* 판매 가격 */}
                                                    <span style={{ display: "flex", alignItems: "center" }} className="detail-sale-price">
                                                        {product?.salePrice?.toLocaleString()}
                                                        <span style={{ fontSize: "25px", fontWeight: "400" }}>원</span>
                                                    </span>
                                                    <span style={{ marginLeft: "0" }} className="won"></span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ display: "flex", alignItems: "flex-end", marginBottom: "5px" }}>
                                                    {/* 판매 가격 */}
                                                    <span className="detail-sale-price">{product?.price?.toLocaleString()}원</span>
                                                    <span style={{ marginLeft: "0" }} className="won"></span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="detail-review" style={{ display: "flex", alignItems: "center" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "2px",
                                                lineHeight: "20px",
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5].map((i) => {
                                                const score = avgScore; // 예: 3.7
                                                let fillPercent = 0;

                                                if (score >= i) {
                                                    fillPercent = 100; // 완전 채움
                                                } else if (score + 1 > i) {
                                                    fillPercent = (score - (i - 1)) * 100; // 남은 부분만 채우기
                                                }

                                                return (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            position: "relative",
                                                            width: "15px",
                                                            height: "20px",
                                                        }}
                                                    >
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
                                        {/* 리뷰 수 */}
                                        <span className="detail-review-count">{reviewCount}개 리뷰</span>
                                    </div>
                                </div>
                                <hr className="hr" />
                                <div className="detail-select-option">
                                    <span className="detail-option-span">구매 옵션</span>
                                    <div className="detail-select-div">
                                        <select onChange={(e) => handleOptionChange(e.target.value, "top")} className="detail-select" defaultValue={"none"}>
                                            <option value="none" disabled>
                                                옵션
                                            </option>
                                            {Object.keys(productOption).map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="detail-select-div">
                                        <select onChange={(e) => handleOption(e.target.value, "top")} className="detail-select" value={selectOptionInfo.optionId || "none"}>
                                            <option value="none" disabled>
                                                선택값
                                            </option>
                                            {/* 점 표기법으로 접근하면 undefined */}
                                            {/* 대괄호 표기법으로 접근해야 접근이 가능 */}
                                            {productOption[selectOption]?.map((option) => (
                                                <option key={option.optionId} value={option.optionId}>
                                                    {option.color} + {option.price.toLocaleString()}원
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="detail-button-div">
                                        <button onClick={() => addOption("top")} type="button" className="detail-append-buy">
                                            구매 추가
                                        </button>
                                    </div>

                                    {/* 추가될 div 박스 만들기 */}
                                    {orderList.map((option) => (
                                        <div key={option.optionId} className="detail-append-box">
                                            <div className="detail-append-box-top detail-box-son">
                                                <span className="detail-size">
                                                    {option.name}, {option.value}
                                                </span>
                                                <button className="count-button-style" onClick={() => deleteOption(option.optionId)}>
                                                    <i className="bi bi-x-lg detail-x-button"></i>
                                                </button>
                                            </div>
                                            <div className="detail-append-box-bottom detail-box-son">
                                                {/* 수량 증감 버튼 */}
                                                <div className="detail-append-button">
                                                    <button className="count-button-style" onClick={() => decreaseCount(option.optionId)}>
                                                        <i className="bi bi-dash-lg append-button-son"></i>
                                                    </button>
                                                    <span className="append-button-son">{option.count}</span>
                                                    <button className="count-button-style" onClick={() => increaseCount(option.optionId)}>
                                                        <i className="bi bi-plus-lg append-button-son"></i>
                                                    </button>
                                                </div>
                                                {/* 가격 */}
                                                <span className="detail-order-price">{(option.price * option.count).toLocaleString()}원</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 여기까지 추가되는 div 박스 */}
                                </div>
                                <hr className="hr" />
                                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                    <div className="detail-order-price-div">
                                        <span className="detail-order-hard-span">주문 금액</span>
                                        {/* 주문 금액 */}
                                        <span className="detail-order-hard-price">{totalPrice.toLocaleString()}원</span>
                                    </div>
                                    <div className="font-15">배송정보</div>
                                    {/* <div className="font-14">
                                        방법 : {product.postYn ? <span className="font-14">(택배배송)</span> : <></>}
                                        {product.pickupYn ? <span className="font-14">(픽업가능)</span> : <></>}
                                    </div> */}
                                    <div className="font-14">배송 단위 : {product.postType === "single" ? <span className="font-14">개별배송</span> : <span className="font-14">묶음배송</span>}</div>
                                    <div className="font-14">배송비 : {product?.postCharge?.toLocaleString()}원</div>
                                </div>
                                <div className="detail-order-button-div">
                                    <button onClick={addCart} className="detail-order-button go-cart">
                                        장바구니
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (user.username === "") {
                                                navigate("/login");
                                            } else {
                                                if (orderList.length === 0) {
                                                    setModalMessage("한 개 이상의 상품을 담아주세요");
                                                    setIsModalOpen(true);
                                                    setTimeout(() => {
                                                        setIsModalOpen(false);
                                                    }, 1500);
                                                } else {
                                                    navigate("/zipddak/productOrder");
                                                }
                                            }
                                        }}
                                        className="detail-order-button go-order"
                                    >
                                        구매
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 상품 상세 아래 */}

                {/* 상품상세 하단 네비 */}
                <div className="detail-product-bottom-nav">
                    {navItems.map((item) => (
                        <button key={item.id} className={bottomSelect === item.id ? "bottom-nav-select-button" : "bottom-nav-button"} onClick={() => handleNavClick(item)}>
                            {item.label}
                            {item.count && <span>{item.count.toLocaleString()}</span>}
                        </button>
                    ))}
                </div>

                <div>
                    <div className="detail-product-bottom">
                        {/* 상품 상세 좌측 라인 */}
                        <div className="detail-bottom-left">
                            {/* 상품 정보 */}
                            <div ref={infoRef}>
                                <img style={{ border: "none", height: "auto" }} className="test-img-test" src={`${baseUrl}/imageView?type=product&filename=${product.detailImg1}`}></img>
                                {product.detailImg2 && <img className="test-img-test" src={`${baseUrl}/imageView?type=product&filename=${product.detailImg2}`}></img>}
                            </div>

                            {/* 리뷰 */}
                            <div ref={reviewRef} className="detail-bottom-reivew">
                                <div>
                                    <span className="detail-bottom-review-span">리뷰</span>
                                    {/* 리뷰 수 */}
                                    <span className="detail-bottom-review-count">{reviewCount}</span>
                                </div>

                                <div className="detail-bottom-review-box-div">
                                    {reviews.map((review) => (
                                        <div key={review.reviewProductIdx} className="detail-bottom-review-box">
                                            <div>
                                                {/* 사용자 닉네임 */}
                                                <span className="detail-bottom-review-nickname">{review.nickname}</span>
                                            </div>
                                            <div>
                                                <div className="detail-bottom-review-start-list-div">
                                                    <div style={{ display: "flex", gap: "2px" }}>
                                                        {[1, 2, 3, 4, 5].map((i) => {
                                                            const score = review.score; // 예: 3.7
                                                            let fillPercent = 0;

                                                            if (score >= i) {
                                                                fillPercent = 100; // 완전 채움
                                                            } else if (score + 1 > i) {
                                                                fillPercent = (score - (i - 1)) * 100; // 남은 부분만 채우기
                                                            }

                                                            return (
                                                                <div
                                                                    key={i}
                                                                    style={{
                                                                        position: "relative",
                                                                        width: "15px",
                                                                        height: "20px",
                                                                    }}
                                                                >
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
                                                    {/* 리뷰 작성일 */}
                                                    <span className="detail-bottom-review-created">{review.createdate}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: "15px" }}>
                                                {review.img1Name && (
                                                    <img style={{ border: "none" }} className="detail-bottom-review-img" src={`${baseUrl}/imageView?type=review&filename=${review.img1Name}`} />
                                                )}
                                                {review.img2Name && (
                                                    <img style={{ border: "none" }} className="detail-bottom-review-img" src={`${baseUrl}/imageView?type=review&filename=${review.img2Name}`} />
                                                )}
                                                {review.img3Name && (
                                                    <img style={{ border: "none" }} className="detail-bottom-review-img" src={`${baseUrl}/imageView?type=review&filename=${review.img3Name}`} />
                                                )}
                                            </div>

                                            <div className="detail-bottom-review-content">{review.content}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="productDetail-info-more-btn-div">
                                    {reviewCount > reviews.length && (
                                        <button onClick={loadMoreReviews} className="productDetail-info-more-btn">
                                            리뷰 더보기 <i className="bi bi-chevron-down"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* 문의 */}
                            <div ref={askRef} className="detail-bottom-ask">
                                <div className="detail-bottom-ask-title-div">
                                    <div>
                                        <span className="detail-bottom-ask-span">문의</span>
                                        {/* 문의 수 */}
                                        <span className="detail-bottom-ask-count">{inquiryCount}</span>
                                    </div>
                                    {/* 문의 하기 버튼 */}
                                    <button
                                        className="detail-bottom-ask-button"
                                        onClick={() => {
                                            if (user.username === "") {
                                                navigate("/login");
                                            } else {
                                                setModal(true);
                                            }
                                        }}
                                    >
                                        문의하기
                                    </button>
                                </div>

                                <div className="detail-bottom-ask-box-div">
                                    {inquiries.map((inquiry) => (
                                        <div className="detail-bottom-ask-box" key={inquiry.inquiryIdx}>
                                            <div>
                                                {/* 문의 사용자 닉네임 */}
                                                <span className="detail-bottom-ask-nickname">{inquiry.writerNickname}</span>
                                                {/* 문의 날짜 */}
                                                <span className="detail-bottom-ask-created">{inquiry.writeAt}</span>
                                            </div>
                                            <table className="productDetail-inquiry-table">
                                                <tbody className="detail-bottom-ask-table">
                                                    <tr>
                                                        <td className="detail-bottom-ask-Q-td">
                                                            <span className="detail-bottom-ask-Q">Q</span>
                                                        </td>
                                                        <td className="detail-bottom-ask-left-padding-0">
                                                            {/* 문의 내용 */}
                                                            <span className="detail-bottom-ask-content">{inquiry.content}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="detail-bottom-ask-A-td">
                                                            <span className="detail-bottom-ask-A">A</span>
                                                        </td>
                                                        <td className="detail-bottom-ask-left-padding-0">
                                                            {/* 자재업체 이름 */}
                                                            <span className="detail-bottom-ask-storeName">{inquiry.brandName}</span>
                                                            {/* 답변 날짜 */}
                                                            <span className="detail-bottom-ask-return-created">{inquiry.answerAt}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td className="detail-bottom-ask-left-padding-0">
                                                            <div className="detail-bottom-ask-return">{inquiry.answer}</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                    <div className="productDetail-info-more-btn-div">
                                        {inquiryCount > inquiries.length && (
                                            <button onClick={loadMoreInquiries} className="productDetail-info-more-btn">
                                                문의 더보기 <i className="bi bi-chevron-down"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {/* 문의하기 모달 */}
                                <Modal className="ask-modal-box" isOpen={modal} toggle={toggle}>
                                    <ModalHeader style={{ border: "none", paddingBottom: "0" }} toggle={toggle}>
                                        <span className="ask-title">문의하기</span>
                                    </ModalHeader>
                                    <div className="ask-modal-body">
                                        <Input
                                            onChange={(e) => setInquireContent(e.target.value)}
                                            style={{ fontSize: "14px" }}
                                            className="ask-modal-body-input"
                                            type="textarea"
                                            placeholder="문의하실 내용을 입력해주세요"
                                            rows={5}
                                        />
                                        <div>
                                            <div style={{ margin: "15px 0" }}>
                                                <span>첨부 이미지 파일은 최대 3장입니다.</span>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                <Input
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);

                                                        if (files.length > 3) {
                                                            e.target.value = ""; // 초기화
                                                            setModalMessage("파일은 최대 3장입니다.");
                                                            setIsModalOpen(true);
                                                            setTimeout(() => {
                                                                setIsModalOpen(false);
                                                            }, 1500);
                                                            return;
                                                        }

                                                        setFiles(files);
                                                    }}
                                                    multiple
                                                    type="file"
                                                    style={{ height: "33.5px" }}
                                                />
                                            </div>
                                            <div className="ask-modal-body-button-div">
                                                <button className="ask-modal-back ask-modal-button" type="button" onClick={toggle}>
                                                    취소
                                                </button>
                                                <button
                                                    className="ask-modal-write ask-modal-button"
                                                    type="button"
                                                    onClick={() => {
                                                        writeInquire();
                                                    }}
                                                >
                                                    등록하기
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            </div>

                            {/* 배송/환불 */}
                            <div ref={deliveryRef} className="detail-bottom-return-div">
                                {/* 배송 */}
                                <div>
                                    <span className="detail-bottom-return-title">
                                        <i className="bi bi-box-seam"></i> 배송
                                    </span>
                                    <table className="detail-bottom-return-table">
                                        <tbody>
                                            <tr>
                                                <td className="detail-bottom-return-table-first-td">배송 단위</td>
                                                {/* 배송 단위 */}
                                                <td>{product.postType === "single" ? <span>개별배송</span> : <span>묶음배송</span>}</td>
                                            </tr>
                                            <tr>
                                                <td className="detail-bottom-return-table-first-td">수령 방법</td>
                                                {/* 수령 방법 */}
                                                <td>
                                                    {product.postYn ? <span>(택배배송)</span> : <></>} {product.pickupYn ? <span>(픽업가능)</span> : <></>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="detail-bottom-return-table-first-td">배송비</td>
                                                {/* 배송비 */}
                                                <td>{product.postCharge?.toLocaleString()}원</td>
                                            </tr>
                                            <tr>
                                                <td className="detail-bottom-return-table-first-td">안내</td>
                                                <td>상품이 발송되면 송장번호를 마이페이지에서 확인하실 수 있습니다.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <span className="detail-bottom-return-title">
                                        <i className="bi bi-coin"></i> 환불
                                    </span>
                                    <div className="detail-bottom-return-second-div">
                                        <div>
                                            환불 신청은 <a href="#">마이페이지</a> <i className="bi bi-caret-right-fill"></i> <a href="#">주문 목록</a>에서 가능합니다.
                                        </div>
                                        <div>상품 수령 후 단순 변심으로 인한 환불 시, 왕복 배송비가 발생할 수 있습니다. </div>
                                        <div>환불 진행 상황은 마이페이지에서 확인하실 수 있습니다.</div>
                                    </div>
                                </div>
                                <div>
                                    <span className="detail-bottom-return-title">
                                        <i className="bi bi-arrow-repeat"></i> 반품/교환 불가능 사유
                                    </span>
                                    <div className="detail-bottom-return-third-div">
                                        <div>1. 이미 설치하거나 사용한 제품은 재판매가 어렵기 때문에 반품 불가.</div>
                                        <div>2. 제품의 포장이나 라벨이 훼손되어 상품 가치가 감소한 경우.</div>
                                        <div>
                                            3. 배송 후 일정 기간 <span className="detail-bottom-return-third-div-span">(예: 7일, 14일 등)</span> 이상 지난 경우, 또는 날씨·환경으로 인해 제품 가치가
                                            감소한 경우.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 상품 상세 우측 라인 (주문 폼) */}
                        <div className="detail-bottom-right">
                            <div className="detail-select-option">
                                <div className="detail-select-div">
                                    <select onChange={(e) => handleOptionChange(e.target.value, "bottom")} className="detail-select2" defaultValue={"none"}>
                                        <option disabled value="none">
                                            옵션
                                        </option>
                                        {Object.keys(productOption).map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="detail-select-div">
                                    <select onChange={(e) => handleOption(e.target.value, "bottom")} className="detail-select2" value={selectOptionInfo2.optionId || "none"}>
                                        <option value="none" disabled>
                                            선택값
                                        </option>
                                        {productOption[selectOption2]?.map((option) => (
                                            <option key={option.optionId} value={option.optionId}>
                                                {option.color} + {option.price.toLocaleString()}원
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="detail-button-div">
                                    <button onClick={() => addOption("bottom")} type="button" className="detail-append-buy">
                                        구매 추가
                                    </button>
                                </div>

                                {/* 추가될 div 박스 만들기 */}

                                {orderList.map((option) => (
                                    <div key={option.optionId} className="detail-append-box">
                                        <div className="detail-append-box-top detail-box-son2">
                                            <span className="detail-size">
                                                {option.name}, {option.value}
                                            </span>
                                            <button className="count-button-style" onClick={() => deleteOption(option.optionId)}>
                                                <i className="bi bi-x-lg detail-x-button"></i>
                                            </button>
                                        </div>
                                        <div className="detail-append-box-bottom detail-box-son2">
                                            {/* 수량 증감 버튼 */}
                                            <div className="detail-append-button">
                                                <button className="count-button-style" onClick={() => decreaseCount(option.optionId)}>
                                                    <i className="bi bi-dash-lg append-button-son"></i>
                                                </button>
                                                <span className="append-button-son">{option.count}</span>
                                                <button className="count-button-style" onClick={() => increaseCount(option.optionId)}>
                                                    <i className="bi bi-plus-lg append-button-son"></i>
                                                </button>
                                            </div>
                                            {/* 가격 */}
                                            <span className="detail-order-price">{(option.price * option.count).toLocaleString()}원</span>
                                        </div>
                                    </div>
                                ))}

                                {/* 여기까지 추가되는 div 박스 */}

                                <hr className="hr" />
                                <div>
                                    <div className="detail-order-price-div">
                                        <span className="detail-order-hard-span">주문 금액</span>
                                        <div>
                                            {/* 주문 금액 */}
                                            <span className="detail-order-hard-price2">{totalPrice.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-order-button-div">
                                    <button onClick={() => favoriteToggle(product.productIdx)} className="detail-bottom-order-heart">
                                        {favorite ? <i className="bi bi-heart-fill product-like"></i> : <i className="bi bi-heart product-like"></i>}
                                    </button>
                                    <button onClick={addCart} className="detail-order-button2 go-cart">
                                        장바구니
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (user.username === "") {
                                                navigate("/login");
                                            } else {
                                                if (orderList.length === 0) {
                                                    setModalMessage("한 개 이상의 상품을 담아주세요");
                                                    setIsModalOpen(true);
                                                    setTimeout(() => {
                                                        setIsModalOpen(false);
                                                    }, 1500);
                                                } else {
                                                    navigate("/zipddak/productOrder");
                                                }
                                            }
                                        }}
                                        className="detail-order-button2 go-order"
                                    >
                                        구매
                                    </button>
                                </div>

                                <Modal className="ask-modal-box" isOpen={cartModal} toggle={cartToggle}>
                                    <div className="ask-modal-body">
                                        <div>장바구니에 추가되었습니다.</div>
                                        <div className="ask-modal-body-button-div">
                                            <button className="ask-modal-back ask-modal-button" type="button" onClick={cartToggle}>
                                                확인
                                            </button>
                                            <button className="ask-modal-write ask-modal-button" type="button" onClick={() => navigate("/zipddak/cart")}>
                                                장바구니
                                            </button>
                                        </div>
                                    </div>
                                </Modal>

                                {/* 알림 모달창 */}
                                <Modal isOpen={isModalOpen} className="mypage-modal" style={{ width: "380px" }}>
                                    <ModalBody>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "8px",
                                                whiteSpace: "nowrap",
                                                fontSize: "14px",
                                            }}
                                        >
                                            <p>{modalMessage}</p>
                                        </div>
                                    </ModalBody>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
