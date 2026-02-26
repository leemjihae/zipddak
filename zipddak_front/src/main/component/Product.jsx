import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Product.css";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { baseUrl } from "../../config";

export function Products({ product, toggleFavorite }) {
    const navigate = useNavigate();

    return (
        <div className="Product-cards" onClick={() => navigate(`/zipddak/product/${product.productIdx}`)}>
            <div className="product-images">
                <img src={`${baseUrl}/imageView?type=product&filename=${product.fileRename}`} alt="상품" />
                <button
                    style={{ backgroundColor: "transparent" }}
                    onClick={(e) => {
                        e.stopPropagation(); // 화면 이동 클릭 막음
                        // 로그인이 안되어있으면 막음
                        username && toggleFavorite();
                    }}
                    className="favorite-icon"
                >
                    {product.favorite ? <i className="bi bi-heart-fill"></i> : <i className="bi bi-heart"></i>}
                </button>
            </div>

            <div className="product-infos">
                <span className="store-names">{product.brandName}</span>
                <div className="product-names">
                    {product?.name?.length > 35
                             ? product.name.slice(0, 35) + "..."
                             : product?.name}
                </div>
                <div>
                    {product.discount ? (
                        <>
                            {/* 세일 퍼센트 */}
                            <span className="sale">{product.discount}%</span>
                            <del>
                                <span>{product.price?.toLocaleString()} </span>
                            </del>
                            {/* 세일 가격 */}
                            <span className="sale-price">{product.salePrice?.toLocaleString()}원</span>
                        </>
                    ) : (
                        <span className="sale-price">{product.price?.toLocaleString()}원</span>
                    )}
                </div>
                <div>
                    <i className="bi bi-star-fill star-icons"></i>
                    <span className="review-counts">{product.avgRating}</span>(<span className="review-counts">{product.reviewCount}</span>)
                </div>
            </div>
        </div>
    );
}
