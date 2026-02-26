import { Button } from "reactstrap";
import { ArrowRight } from "lucide-react";
import Product from "../../user/product/Product";
import { useAtom, useSetAtom } from "jotai/react";
import { tokenAtom, userAtom } from "../../atoms";
import { useEffect, useState } from "react";
import { myAxios } from "../../config";

export default function Best() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [product, setProduct] = useState([]);

    const bestList = () => {
        const usernamePharam = user ? user.username : "";

        let url = `/main/best`;
        if (usernamePharam) {
            url += `?username=${usernamePharam}`;
        }

        const tokenPharam = token ? token : null;

        myAxios(tokenPharam, setToken)
            .get(url)
            .then((res) => {
                console.log(res.data);
                setProduct(res.data);
            })
            .catch((err) => {
                console.log(err);
                console.error("뭔데", err);
            });
    };

    useEffect(() => {
        bestList();
    }, [token]);

    //3-4 배치
    const allProducts = product;
    const top3 = allProducts.slice(0, 3);
    const under3 = allProducts.slice(3);

    //나머지 상품들을 4개씩 묶음 (chunk)으로 분리
    const groupedRows = [];
    for (let i = 0; i < under3.length; i += 4) {
        groupedRows.push(under3.slice(i, i + 4));
    }

    return (
        <>
            <div className="Main-container">
                <div className="card-box">
                    <div className="top">
                        <div className="title-box">
                            <div className="title-main">
                                <span>자재 베스트</span>
                                <span className="s-count">100</span>
                            </div>

                            <Button className=" tertiary-button nonePd">
                                <div className="row-cm">
                                    <span>마켓 둘러보기</span>
                                    <ArrowRight size={15} />
                                </div>
                            </Button>
                        </div>
                    </div>

                    <div className="card-container">
                        {/* 1. 첫 번째 줄 (3개) */}
                        <div className="cards first-row">
                            {top3.map((productCard, index) => (
                                <Product key={productCard.productIdx} product={productCard} toggleFavorite={productCard.isFavorite} label={index + 1} />
                            ))}
                        </div>

                        {/* 2. 나머지 줄 (전체 인덱스: 3 ~ 99) */}
                        {groupedRows.map((row, rowIndex) => {
                            // 각 행이 시작하는 전체 인덱스:
                            // (첫 줄 3개) + (이전 행들의 누적 개수: rowIndex * 4)
                            const startingIndex = 3 + rowIndex * 4;

                            return (
                                <div key={`row-${rowIndex}`} className="cards standard-row">
                                    {row.map((productCard, indexInRow) => (
                                        // 현재 행 내 인덱스(indexInRow)에 시작 인덱스를 더하고 1을 더함
                                        <Product key={productCard.productIdx} product={productCard} toggleFavorite={productCard.isFavorite} label={startingIndex + indexInRow + 1} />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
