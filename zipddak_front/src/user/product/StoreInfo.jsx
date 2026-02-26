import "../css/StoreInfo.css";
import Product from "./Product";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { baseUrl, myAxios } from "../../config";
import { userAtom } from "../../atoms";
import { tokenAtom } from "../../atoms";
import { useAtomValue, useAtom } from "jotai/react";
import { useNavigate } from "react-router";

export default function StoreInfo() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const { sellerId } = useParams();
    const [sellerInfo, setSellerInfo] = useState({});
    const [productList, setProductList] = useState([]);
    const [bestProductList, setBestProductList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터 존재 여부
    const observer = useRef();
    const [page, setPage] = useState(1); // 현재 페이지
    const [reportReason, setReportReason] = useState("");

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const username = "rlawhdwh";
    const [cateNo, setCateNo] = useState(0);
    const [sellerCate, setSellerCate] = useState([0]);
    const pCate = [
        { cateNo: 0, name: "전체" },
        { cateNo: 1, name: "주방" },
        { cateNo: 6, name: "욕실" },
        { cateNo: 14, name: "중문/도어" },
        { cateNo: 15, name: "폴딩도어" },
        { cateNo: 16, name: "벽지/장판/마루" },
        { cateNo: 17, name: "타일" },
        { cateNo: 18, name: "시트/필름" },
        { cateNo: 19, name: "스위치/콘센트" },
        { cateNo: 20, name: "커튼블라인드" },
        { cateNo: 21, name: "페인트" },
        { cateNo: 22, name: "조명" },
    ];

    const reportSeller = () => {
        if (reportReason) {
            console.log(reportReason);
            axios.post(`${baseUrl}/reportSeller`, {
                reason: reportReason,
                sellerUsername: sellerInfo.username,
                username: "rlawhdwh",
            });
        }
    };

    const fetchProducts = async (value) => {
        setLoading(true);
        console.log(productList);

        try {
            // 테스트용으로 뒤에 username을 붙임
            const res = await axios.get(`${baseUrl}/getProductList/?sellerId=${sellerId}&page=${page}&cateNo=${cateNo}&username=rlawhdwh`);

            if (res.data.length === 0) {
                setHasMore(false);
            } else {
                setProductList((prev) => [...prev, ...res.data]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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

    const toggleFavorite = async (productIdx) => {
        try {
            await axios.post(`${baseUrl}/favoriteToggle`, { productIdx, username });

            // 일반 상품 목록
            setProductList((prev) => prev.map((p) => (p.productIdx === productIdx ? { ...p, favorite: !p.favorite } : p)));

            // 베스트 상품 목록
            setBestProductList((prev) => prev.map((p) => (p.productIdx === productIdx ? { ...p, favorite: !p.favorite } : p)));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!sellerId) return;

        axios.get(`${baseUrl}/storeInfo?sellerId=${sellerId}&username=${user.username}`).then((res) => {
            console.log(res.data);
            setSellerInfo(res.data);
            setSellerCate(res.data.handleItemCateIdx ? res.data.handleItemCateIdx.split(",").map(Number) : []);
            setBestProductList(res.data.bestProductList);
        });
    }, [sellerId]);

    useEffect(() => {
        if (!sellerId) return;

        setProductList([]); // 초기화
        setPage(1); // 1페이지로 리셋
        setHasMore(true);

        axios.get(`${baseUrl}/getProductList?sellerId=${sellerId}&page=1&cateNo=${cateNo}&username=${user.username}`).then((res) => {
            setProductList(res.data);
            setPage(2); // 다음 요청은 2페이지
        });
    }, [cateNo, sellerId]);

    useEffect(() => {
        // 첫 페이지는 카테고리 함수에서 처리함 → 여기서 무시
        if (page === 1) return;
        if (!hasMore) return;

        fetchProducts();
    }, [page, hasMore]);

    return (
        <div className="body-div">
            <div style={{ padding: "72px 16px" }} className="StoreInfo-main-div">
                {/* 자제 업체 정보 */}
                <div style={{ backgroundImage: 'url("/배너테스트.png")', backgroundSize: "860px 250px", backgroundRepeat: "no-repeat" }} className="store-info-top-div">
                    {/* 업체 정보 */}
                    <div style={{ width: "845px", padding: "30px 15px" }} className="store-info-top-left">
                        {/* 정보 위쪽 */}
                        <div>
                            <div className="store-info-name-report">
                                {/* 업체명 */}
                                <span style={{ fontSize: "25px", fontWeight: "600" }} className="font-24 semibold">
                                    {sellerInfo.brandName}
                                </span>
                                <button onClick={toggle} value={sellerInfo.sellerIdx} className="store-report-button">
                                    <i style={{ fontSize: "16px" }} className="bi bi-exclamation-triangle font-20"></i>
                                </button>
                            </div>
                            <div style={{ fontSize: "16px" }} className="font-16">
                                {sellerInfo.introduction}
                            </div>
                        </div>
                        <Modal className="ask-modal-box" isOpen={modal} toggle={toggle}>
                            <ModalHeader style={{ border: "none", paddingBottom: "0" }} toggle={toggle}>
                                <span className="ask-title">신고하기</span>
                            </ModalHeader>
                            <div className="ask-modal-body">
                                <div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "20px" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Input value="FAKE" onChange={(e) => setReportReason(e.target.value)} type="radio" name="reason" id="FAKE" style={{ marginRight: "20px" }} />{" "}
                                            <label htmlFor="FAKE" className="font-14">
                                                허위 정보 기재
                                            </label>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Input value="EXPENSIVE" onChange={(e) => setReportReason(e.target.value)} type="radio" name="reason" id="EXPENSIVE" style={{ marginRight: "20px" }} />{" "}
                                            <label htmlFor="EXPENSIVE" className="font-14">
                                                과도한 가격 책정
                                            </label>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Input value="DANGER" onChange={(e) => setReportReason(e.target.value)} type="radio" name="reason" id="DANGER" style={{ marginRight: "20px" }} />{" "}
                                            <label htmlFor="DANGER" className="font-14">
                                                불량/위험 자재 판매
                                            </label>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Input
                                                value="CONDITION_BREACH"
                                                onChange={(e) => setReportReason(e.target.value)}
                                                type="radio"
                                                name="reason"
                                                id="CONDITION_BREACH"
                                                style={{ marginRight: "20px" }}
                                            />{" "}
                                            <label htmlFor="CONDITION_BREACH" className="font-14">
                                                거래 조건 불이행
                                            </label>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Input
                                                value="TERMS_NOT_MET"
                                                onChange={(e) => setReportReason(e.target.value)}
                                                type="radio"
                                                name="reason"
                                                id="TERMS_NOT_MET"
                                                style={{ marginRight: "20px" }}
                                            />{" "}
                                            <label htmlFor="TERMS_NOT_MET" className="font-14">
                                                부적절한 언행 및 서비스
                                            </label>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Input
                                                value="DEAL_VIOLATION"
                                                onChange={(e) => setReportReason(e.target.value)}
                                                type="radio"
                                                name="reason"
                                                id="DEAL_VIOLATION"
                                                style={{ marginRight: "20px" }}
                                            />{" "}
                                            <label htmlFor="DEAL_VIOLATION" className="font-14">
                                                사기 의심 행위
                                            </label>
                                        </div>
                                    </div>
                                    <div className="ask-modal-body-button-div">
                                        <button className="ask-modal-back ask-modal-button" type="button" onClick={toggle}>
                                            취소
                                        </button>
                                        <button
                                            className="ask-modal-write ask-modal-button"
                                            type="button"
                                            onClick={() => {
                                                reportSeller();
                                                toggle();
                                            }}
                                        >
                                            신고하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                        {/* 정보 아래쪽 */}
                        <div>
                            <div style={{ height: "30px" }} className="store-info-under-div">
                                <i style={{ fontSize: "20px" }} className="bi bi-telephone font-20"></i>
                                <span style={{ fontSize: "15px" }} className="font-15 margin-left-10">
                                    {sellerInfo?.managerTel?.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")}
                                </span>
                            </div>
                            <div style={{ height: "30px" }} className="store-info-under-div">
                                <i style={{ fontSize: "20px" }} className="bi bi-house-door font-20"></i>
                                <span style={{ fontSize: "15px" }} className="font-15 margin-left-10">
                                    {sellerInfo.compAddr1 + " " + sellerInfo.compAddr2}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* 업체 이미지 */}
                    <div>
                        <img style={{ border: "none" }} className="store-info-img" src={`${baseUrl}/imageView?type=seller&filename=${sellerInfo.logoFileRename}`} />
                    </div>
                </div>

                {/* 베스트 상품 */}
                <div className="">
                    <span style={{ fontSize: "18px", fontWeight: "600" }} className="font-18 semibold">
                        베스트 상품
                    </span>
                    <div className="store-best-product">
                        {bestProductList.map((product) => (
                            <Product product={product} toggleFavorite={() => toggleFavorite(product.productIdx)} />
                        ))}
                    </div>
                </div>

                {/* 카테고리별 상품 모음 */}
                <div>
                    <div className="store-item-cate-div" style={{ marginBottom: "20px" }}>
                        {pCate.map((cate) => {
                            // 전체(0)는 항상 보여주고, 나머지는 sellerCate에 포함된 것만 보여줌
                            if (cate.cateNo === 0 || sellerCate.includes(cate.cateNo)) {
                                return (
                                    <button key={cate.cateNo} onClick={() => setCateNo(cate.cateNo)} className={cateNo === cate.cateNo ? "store-select-cate" : "store-default-cate"}>
                                        {cate.name}
                                    </button>
                                );
                            }
                            return null;
                        })}
                    </div>

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
                                key={product.productIdx}
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
        </div>
    );
}
