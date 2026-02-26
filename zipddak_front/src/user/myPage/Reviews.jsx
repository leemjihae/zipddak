import { useEffect, useRef, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export default function Reviews() {
    const [tab, setTab] = useState("작성 가능한 후기");
    const [chip, setChip] = useState("TOOL"); // TOOL, EXPERT, PRODUCT

    const [myReviews, setMyReviews] = useState([]);
    const [beforeReviews, setBeforeReviews] = useState([]);
    const [receivedReviews, setReceivedReviews] = useState([]);

    const [modalType, setModalType] = useState(""); // 등록, 수정, 삭제
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetReview, setTargetReview] = useState({});
    const [rating, setRating] = useState(0);
    const [images, setImages] = useState([]); // 이미지 미리보기 URL 배열
    const [files, setFiles] = useState([]); // 실제 업로드용 이미지 File 배열

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const imgRef = useRef(null);

    // 후기 작성가능한 대여목록
    const getBeforeToolReviews = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/beforeReviewList/tool?username=${user.username}`)
            .then((res) => {
                setBeforeReviews(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 후기 작성가능한 매칭목록
    const getBeforeExpertReviews = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/beforeReviewList/expert?username=${user.username}`)
            .then((res) => {
                console.log(res.data);
                setBeforeReviews(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 후기 작성가능한 구매목록
    const getBeforeProductReviews = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/beforeReviewList/product?username=${user.username}`)
            .then((res) => {
                setBeforeReviews(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 작성한 대여 후기목록 조회
    const getMyToolReviews = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/reviewList/tool?username=${user.username}`)
            .then((res) => {
                setMyReviews(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 작성한 상품 후기목록 조회
    const getMyProductReviews = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/reviewList/product?username=${user.username}`)
            .then((res) => {
                setMyReviews(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 작성한 전문가 후기목록 조회
    const getMyExpertReviews = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/reviewList/expert?username=${user.username}`)
            .then((res) => {
                setMyReviews(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 받은 대여 후기목록 조회
    const getReceiveToolReviews = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/receive/reviewList/tool?username=${user.username}`)
            .then((res) => {
                setReceivedReviews(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 대여 후기 등록
    const submitToolReview = () => {
        const formData = new FormData();

        formData.append("score", rating);
        formData.append("content", targetReview.content);
        formData.append("writer", user.username);
        formData.append("toolIdx", targetReview.toolIdx);
        formData.append("rentalIdx", targetReview.rentalIdx);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("reviewImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/write/tool", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setTargetReview({});
                    setRating(0);
                    setImages([]);
                    setFiles([]);
                    getBeforeToolReviews();
                    setIsModalOpen(false);
                }
            })
            .catch((err) => console.error(err));
    };

    // 매칭 후기 등록
    const submitExpertReview = () => {
        const formData = new FormData();

        formData.append("score", rating);
        formData.append("content", targetReview.content);
        formData.append("writer", user.username);
        formData.append("expertIdx", targetReview.expertIdx);
        formData.append("matchingIdx", targetReview.matchingIdx);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("reviewImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/write/expert", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setTargetReview({});
                    setRating(0);
                    setImages([]);
                    setFiles([]);
                    getBeforeExpertReviews();
                    setIsModalOpen(false);
                }
            })
            .catch((err) => console.error(err));
    };

    // 구매 후기 등록
    const submitProductReview = () => {
        const formData = new FormData();

        formData.append("score", rating);
        formData.append("content", targetReview.content);
        formData.append("writer", user.username);
        formData.append("productIdx", targetReview.productIdx);
        formData.append("orderItemIdx", targetReview.orderItemIdx);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("reviewImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/write/product", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setTargetReview({});
                    setRating(0);
                    setImages([]);
                    setFiles([]);
                    getBeforeProductReviews();
                    setIsModalOpen(false);
                }
            })
            .catch((err) => console.error(err));
    };

    // 대여 후기 수정
    const modifyToolReview = () => {
        const formData = new FormData();

        formData.append("score", rating);
        formData.append("content", targetReview.content);
        formData.append("reviewToolIdx", targetReview.reviewToolIdx);

        if (images[0]?.idx) formData.append("img1", images[0].idx);
        if (images[1]?.idx) formData.append("img2", images[1].idx);
        if (images[2]?.idx) formData.append("img3", images[2].idx);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("reviewImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/modify/tool", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setTargetReview({});
                    setRating(0);
                    setImages([]);
                    setFiles([]);
                    getMyToolReviews();
                    setIsModalOpen(false);
                }
            })
            .catch((err) => console.error(err));
    };

    // 매칭 후기 수정
    const modifyExpertReview = () => {
        const formData = new FormData();

        formData.append("score", rating);
        formData.append("content", targetReview.content);
        formData.append("reviewExpertIdx", targetReview.reviewExpertIdx);

        if (images[0]?.idx) formData.append("img1", images[0].idx);
        if (images[1]?.idx) formData.append("img2", images[1].idx);
        if (images[2]?.idx) formData.append("img3", images[2].idx);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("reviewImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/modify/expert", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setTargetReview({});
                    setRating(0);
                    setImages([]);
                    setFiles([]);
                    getMyExpertReviews();
                    setIsModalOpen(false);
                }
            })
            .catch((err) => console.error(err));
    };

    // 구매 후기 수정
    const modifyProductReview = () => {
        const formData = new FormData();

        formData.append("score", rating);
        formData.append("content", targetReview.content);
        formData.append("reviewProductIdx", targetReview.reviewProductIdx);

        if (images[0]?.idx) formData.append("img1", images[0].idx);
        if (images[1]?.idx) formData.append("img2", images[1].idx);
        if (images[2]?.idx) formData.append("img3", images[2].idx);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("reviewImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/modify/product", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setTargetReview({});
                    setRating(0);
                    setImages([]);
                    setFiles([]);
                    getMyProductReviews();
                    setIsModalOpen(false);
                }
            })
            .catch((err) => console.error(err));
    };

    // 대여 후기 삭제
    const deleteToolReview = () => {
        console.log(targetReview);
        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/delete/tool", {
                reviewToolIdx: targetReview.reviewToolIdx,
            })
            .then((res) => {
                setIsModalOpen(false);
                getMyToolReviews();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 매칭 후기 삭제
    const deleteExpertReview = () => {
        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/delete/expert", {
                reviewExpertIdx: targetReview.reviewExpertIdx,
            })
            .then((res) => {
                setIsModalOpen(false);
                getMyExpertReviews();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 구매 후기 삭제
    const deleteProductReview = () => {
        myAxios(token, setToken)
            .post("http://localhost:8080" + "/review/delete/product", {
                reviewProductIdx: targetReview.reviewProductIdx,
            })
            .then((res) => {
                setIsModalOpen(false);
                getMyProductReviews();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 후기 이미지 업로드
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);

        setImages((prev) => [...prev, { url: localUrl, idx: null, isLocal: true }]);

        setFiles((prev) => [...prev, file]);
    };

    useEffect(() => {
        setImages([]);
        setFiles([]);
        setRating(0);
        setTargetReview({});

        if (tab === "작성한 후기") {
            if (chip === "TOOL") getMyToolReviews();
            else if (chip === "EXPERT") getMyExpertReviews();
            else if (chip === "PRODUCT") getMyProductReviews();
        } else if (tab === "작성 가능한 후기") {
            if (chip === "TOOL") getBeforeToolReviews();
            else if (chip === "EXPERT") getBeforeExpertReviews();
            else if (chip === "PRODUCT") getBeforeProductReviews();
        } else if (tab === "받은 후기") {
            getReceiveToolReviews();
        }
    }, [tab, chip]);

    return (
        <div className="mypage-layout">
            <h1 className="mypage-title">후기</h1>

            <div>
                {/* 탭 목록 */}
                <div className="mypage-tabList">
                    <div className={tab === "작성 가능한 후기" ? "isActive" : ""} onClick={() => setTab("작성 가능한 후기")}>
                        작성 가능한 후기
                    </div>
                    <div className={tab === "작성한 후기" ? "isActive" : ""} onClick={() => setTab("작성한 후기")}>
                        작성한 후기
                    </div>
                    <div className={tab === "받은 후기" ? "isActive" : ""} onClick={() => setTab("받은 후기")}>
                        받은 후기
                    </div>
                </div>

                {/* 칩 목록 */}
                {tab !== "받은 후기" && (
                    <div className="mypage-chipList">
                        <div className={chip === "TOOL" ? "isActive" : ""} onClick={() => setChip("TOOL")}>
                            공구
                        </div>
                        <div className={chip === "EXPERT" ? "isActive" : ""} onClick={() => setChip("EXPERT")}>
                            전문가
                        </div>
                        <div className={chip === "PRODUCT" ? "isActive" : ""} onClick={() => setChip("PRODUCT")}>
                            상품
                        </div>
                    </div>
                )}

                {tab === "작성 가능한 후기" && chip === "TOOL" && beforeReviews.length !== 0 && (
                    <>
                        {beforeReviews.map((review) => (
                            <div
                                // key={review.id}
                                style={{
                                    display: "flex",
                                    padding: "20px 0",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <img src={`http://localhost:8080/imageView?type=tool&filename=${review.toolThumbnail}`} width="80px" height="80px" style={{ objectFit: "cover" }} />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            fontSize: "14px",
                                        }}
                                    >
                                        <p style={{ fontWeight: "600" }}>{review.toolName}</p>
                                        <p style={{ fontWeight: "500" }}>{review.ownerNickname}</p>
                                    </div>
                                </div>

                                <button
                                    className="primary-button"
                                    style={{ width: "80px", height: "33px" }}
                                    onClick={() => {
                                        setModalType("등록");
                                        setTargetReview({
                                            ...review,
                                            title: review.toolName,
                                            subTitle: review.ownerNickname,
                                            thumbnail: review.toolThumbnail,
                                        });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    후기작성
                                </button>
                            </div>
                        ))}
                    </>
                )}
                {tab === "작성 가능한 후기" && chip === "PRODUCT" && beforeReviews.length !== 0 && (
                    <>
                        {beforeReviews.map((review) => (
                            <div
                                // key={review.id}
                                style={{
                                    display: "flex",
                                    padding: "20px 0",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <img src={`http://localhost:8080/imageView?type=product&filename=${review.productThumbnail}`} width="80px" height="80px" style={{ objectFit: "cover" }} />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            fontSize: "14px",
                                        }}
                                    >
                                        <p style={{ fontWeight: "600" }}>{review.productName}</p>
                                        <p style={{ fontWeight: "500" }}>{review.brandName}</p>
                                    </div>
                                </div>

                                <button
                                    className="primary-button"
                                    style={{ width: "80px", height: "33px" }}
                                    onClick={() => {
                                        setModalType("등록");
                                        setTargetReview({
                                            ...review,
                                            title: review.productName,
                                            subTitle: review.brandName,
                                            thumbnail: review.productThumbnail,
                                        });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    후기작성
                                </button>
                            </div>
                        ))}
                    </>
                )}
                {tab === "작성 가능한 후기" && chip === "EXPERT" && beforeReviews.length !== 0 && (
                    <>
                        {beforeReviews.map((review) => (
                            <div
                                // key={review.id}
                                style={{
                                    display: "flex",
                                    padding: "20px 0",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <img src={`http://localhost:8080/imageView?type=expert&filename=${review.expertThumbnail}`} width="80px" height="80px" style={{ objectFit: "cover" }} />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px",
                                            fontSize: "14px",
                                        }}
                                    >
                                        <p style={{ fontWeight: "600" }}>{review.activityName}</p>
                                        <p style={{ fontWeight: "500" }}>{review.matchingServiceName}</p>
                                    </div>
                                </div>

                                <button
                                    className="primary-button"
                                    style={{ width: "80px", height: "33px" }}
                                    onClick={() => {
                                        setModalType("등록");
                                        setTargetReview({
                                            ...review,
                                            title: review.activityName,
                                            subTitle: review.matchingServiceName,
                                            thumbnail: review.expertThumbnail,
                                        });
                                        setIsModalOpen(true);
                                    }}
                                >
                                    후기작성
                                </button>
                            </div>
                        ))}
                    </>
                )}

                {tab === "작성한 후기" && chip === "TOOL" && myReviews.length !== 0 && (
                    <>
                        {myReviews.map((review) => (
                            <table style={{ width: "100%" }}>
                                <tr style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.10)" }}>
                                    <td>
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                padding: "30px 0",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <img src={`http://localhost:8080/imageView?type=tool&filename=${review.toolThumbnail}`} width="48px" height="48px" />
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "10px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    <p style={{ fontWeight: "600" }}>{review.toolName}</p>
                                                    <p style={{ fontWeight: "500" }}>{review.ownerNickname}</p>
                                                </div>
                                            </div>
                                            <div className="review-star">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <i
                                                        key={num}
                                                        class={`bi ${review.score >= num ? "bi-star-fill" : "bi-star"}`}
                                                        style={{
                                                            fontSize: "18px",
                                                            color: "rgba(247, 196, 68, 1)",
                                                        }}
                                                    ></i>
                                                ))}
                                            </div>
                                            {review.img1 !== null && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    {[review.img1, review.img2, review.img3].filter(Boolean).map((img, idx) => (
                                                        <img key={idx} src={`http://localhost:8080/imageView?type=review&filename=${img}`} width="80px" height="80px" />
                                                    ))}
                                                </div>
                                            )}
                                            <p
                                                style={{
                                                    color: "#303441",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                    lineHeight: "22px",
                                                }}
                                            >
                                                {review.content}
                                            </p>
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            width: "150px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#303441",
                                                textAlign: "center",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            {review.createdate}
                                        </p>
                                    </td>
                                    <td
                                        style={{
                                            width: "118px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <button
                                                className="secondary-button"
                                                style={{ width: "66px", height: "33px" }}
                                                onClick={() => {
                                                    setModalType("수정");
                                                    setTargetReview({
                                                        ...review,
                                                        title: review.toolName,
                                                        subTitle: review.ownerNickname,
                                                        thumbnail: review.toolThumbnail,
                                                    });
                                                    setRating(review.score);
                                                    setImages(
                                                        [
                                                            review.img1
                                                                ? {
                                                                      url: review.img1,
                                                                      idx: review.img1Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                            review.img2
                                                                ? {
                                                                      url: review.img2,
                                                                      idx: review.img2Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                            review.img3
                                                                ? {
                                                                      url: review.img3,
                                                                      idx: review.img3Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                        ].filter(Boolean)
                                                    );
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                수정
                                            </button>
                                            <button
                                                className="secondary-button"
                                                style={{ width: "66px", height: "33px" }}
                                                onClick={() => {
                                                    setModalType("삭제");
                                                    setTargetReview({
                                                        ...review,
                                                        title: review.toolName,
                                                        subTitle: review.ownerNickname,
                                                        thumbnail: review.toolThumbnail,
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        ))}
                    </>
                )}
                {tab === "작성한 후기" && chip === "PRODUCT" && myReviews.length !== 0 && (
                    <>
                        {myReviews.map((review) => (
                            <table style={{ width: "100%" }}>
                                <tr style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.10)" }}>
                                    <td>
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                padding: "30px 0",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <img src={`http://localhost:8080/imageView?type=product&filename=${review.productThumbnail}`} width="48px" height="48px" />
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "10px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    <p style={{ fontWeight: "600" }}>{review.productName}</p>
                                                    <p style={{ fontWeight: "500" }}>{review.brandName}</p>
                                                </div>
                                            </div>
                                            <div className="review-star">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <i
                                                        key={num}
                                                        class={`bi ${review.score >= num ? "bi-star-fill" : "bi-star"}`}
                                                        style={{
                                                            fontSize: "18px",
                                                            color: "rgba(247, 196, 68, 1)",
                                                        }}
                                                    ></i>
                                                ))}
                                            </div>
                                            {review.img1 !== null && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    {[review.img1, review.img2, review.img3].filter(Boolean).map((img, idx) => (
                                                        <img key={idx} src={`http://localhost:8080/imageView?type=review&filename=${img}`} width="80px" height="80px" />
                                                    ))}
                                                </div>
                                            )}
                                            <p
                                                style={{
                                                    color: "#303441",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                    lineHeight: "22px",
                                                }}
                                            >
                                                {review.content}
                                            </p>
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            width: "150px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#303441",
                                                textAlign: "center",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            {review.createdate}
                                        </p>
                                    </td>
                                    <td
                                        style={{
                                            width: "118px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <button
                                                className="secondary-button"
                                                style={{ width: "66px", height: "33px" }}
                                                onClick={() => {
                                                    setModalType("수정");
                                                    setTargetReview({
                                                        ...review,
                                                        title: review.productName,
                                                        subTitle: review.brandName,
                                                        thumbnail: review.productThumbnail,
                                                    });
                                                    setRating(review.score);
                                                    setImages(
                                                        [
                                                            review.img1
                                                                ? {
                                                                      url: review.img1,
                                                                      idx: review.img1Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                            review.img2
                                                                ? {
                                                                      url: review.img2,
                                                                      idx: review.img2Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                            review.img3
                                                                ? {
                                                                      url: review.img3,
                                                                      idx: review.img3Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                        ].filter(Boolean)
                                                    );
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                수정
                                            </button>
                                            <button
                                                className="secondary-button"
                                                style={{ width: "66px", height: "33px" }}
                                                onClick={() => {
                                                    setModalType("삭제");
                                                    setTargetReview({
                                                        ...review,
                                                        reviewIdx: review.reviewProductIdx,
                                                        title: review.productName,
                                                        subTitle: review.brandName,
                                                        thumbnail: review.productThumbnail,
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        ))}
                    </>
                )}
                {tab === "작성한 후기" && chip === "EXPERT" && myReviews.length !== 0 && (
                    <>
                        {myReviews.map((review) => (
                            <table style={{ width: "100%" }}>
                                <tr style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.10)" }}>
                                    <td>
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                padding: "30px 0",
                                                flexDirection: "column",
                                                gap: "20px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                }}
                                            >
                                                <img src={`http://localhost:8080/imageView?type=expert&filename=${review.expertThumbnail}`} width="48px" height="48px" />
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "10px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    <p style={{ fontWeight: "600" }}>{review.activityName}</p>
                                                    <p style={{ fontWeight: "500" }}>{review.matchingServiceName}</p>
                                                </div>
                                            </div>
                                            <div className="review-star">
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <i
                                                        key={num}
                                                        class={`bi ${review.score >= num ? "bi-star-fill" : "bi-star"}`}
                                                        style={{
                                                            fontSize: "18px",
                                                            color: "rgba(247, 196, 68, 1)",
                                                        }}
                                                    ></i>
                                                ))}
                                            </div>
                                            {review.img1 !== null && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    {[review.img1, review.img2, review.img3].filter(Boolean).map((img, idx) => (
                                                        <img key={idx} src={`http://localhost:8080/imageView?type=review&filename=${img}`} width="80px" height="80px" />
                                                    ))}
                                                </div>
                                            )}
                                            <p
                                                style={{
                                                    color: "#303441",
                                                    fontSize: "14px",
                                                    fontWeight: "400",
                                                    lineHeight: "22px",
                                                }}
                                            >
                                                {review.content}
                                            </p>
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            width: "150px",
                                        }}
                                    >
                                        <p
                                            style={{
                                                color: "#303441",
                                                textAlign: "center",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            {review.createdate}
                                        </p>
                                    </td>
                                    <td
                                        style={{
                                            width: "118px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            <button
                                                className="secondary-button"
                                                style={{ width: "66px", height: "33px" }}
                                                onClick={() => {
                                                    setModalType("수정");
                                                    setTargetReview({
                                                        ...review,
                                                        reviewIdx: review.reviewExpertIdx,
                                                        title: review.activityName,
                                                        subTitle: review.matchingServiceName,
                                                        thumbnail: review.expertThumbnail,
                                                    });
                                                    setRating(review.score);
                                                    setImages(
                                                        [
                                                            review.img1
                                                                ? {
                                                                      url: review.img1,
                                                                      idx: review.img1Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                            review.img2
                                                                ? {
                                                                      url: review.img2,
                                                                      idx: review.img2Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                            review.img3
                                                                ? {
                                                                      url: review.img3,
                                                                      idx: review.img3Idx,
                                                                      isLocal: false,
                                                                  }
                                                                : null,
                                                        ].filter(Boolean)
                                                    );
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                수정
                                            </button>
                                            <button
                                                className="secondary-button"
                                                style={{ width: "66px", height: "33px" }}
                                                onClick={() => {
                                                    setModalType("삭제");
                                                    setTargetReview({
                                                        ...review,
                                                        reviewIdx: review.reviewExpertIdx,
                                                        title: review.activityName,
                                                        subTitle: review.matchingServiceName,
                                                        thumbnail: review.expertThumbnail,
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        ))}
                    </>
                )}

                {tab === "받은 후기" &&
                    receivedReviews.map((review) => (
                        <table style={{ width: "100%" }}>
                            <tr style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.10)" }}>
                                <td>
                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            padding: "30px 0",
                                            flexDirection: "column",
                                            gap: "20px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <img src={`http://localhost:8080/imageView?type=tool&filename=${review.toolThumbnail}`} width="48px" height="48px" />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "10px",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                <p style={{ fontWeight: "600" }}>{review.toolName}</p>
                                                <p style={{ fontWeight: "500" }}>{review.ownerNickname}</p>
                                            </div>
                                        </div>
                                        <div className="review-star">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <i
                                                    key={num}
                                                    class={`bi ${review.score >= num ? "bi-star-fill" : "bi-star"}`}
                                                    style={{
                                                        fontSize: "18px",
                                                        color: "rgba(247, 196, 68, 1)",
                                                    }}
                                                ></i>
                                            ))}
                                        </div>
                                        {review.img1 !== null && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                }}
                                            >
                                                {[review.img1, review.img2, review.img3].filter(Boolean).map((img, idx) => (
                                                    <img key={idx} src={`http://localhost:8080/imageView?type=review&filename=${img}`} width="80px" height="80px" />
                                                ))}
                                            </div>
                                        )}
                                        <p
                                            style={{
                                                color: "#303441",
                                                fontSize: "14px",
                                                fontWeight: "400",
                                                lineHeight: "22px",
                                            }}
                                        >
                                            {review.content}
                                        </p>
                                    </div>
                                </td>
                                <td
                                    style={{
                                        width: "150px",
                                    }}
                                >
                                    <p
                                        style={{
                                            color: "#303441",
                                            textAlign: "center",
                                            fontSize: "14px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        {review.createdate}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    ))}
            </div>

            {modalType == "삭제" ? (
                // 후기 삭제 모달
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "380px" }}>
                    <ModalHeader toggle={() => setIsModalOpen(false)}></ModalHeader>
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
                            <p>작성한 후기를 삭제할 경우 재작성이 불가합니다.</p>
                            <p>삭제하시겠습니까?</p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}
                        >
                            <button className="secondary-button" style={{ width: "100%", height: "33px" }} onClick={() => setIsModalOpen(false)}>
                                취소
                            </button>
                            <button
                                className="primary-button"
                                style={{ width: "100%", height: "33px" }}
                                onClick={() => {
                                    if (chip === "TOOL") deleteToolReview();
                                    else if (chip === "PRODUCT") deleteProductReview();
                                    else if (chip === "EXPERT") deleteExpertReview();
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </ModalFooter>
                </Modal>
            ) : (
                // 후기 등록/수정 모달
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "460px" }}>
                    <ModalHeader toggle={() => setIsModalOpen(false)}>{modalType === "등록" ? "후기 작성" : "후기 수정"}</ModalHeader>
                    <ModalBody>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <img
                                src={
                                    chip === "TOOL"
                                        ? `http://localhost:8080/imageView?type=tool&filename=${targetReview.thumbnail}`
                                        : chip === "PRODUCT"
                                        ? `http://localhost:8080/imageView?type=product&filename=${targetReview.thumbnail}`
                                        : `http://localhost:8080/imageView?type=expert&filename=${targetReview.thumbnail}`
                                }
                                width="80px"
                                height="80px"
                            />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px",
                                    fontSize: "14px",
                                }}
                            >
                                <p style={{ fontWeight: "600" }}>{targetReview.title}</p>
                                <p style={{ fontWeight: "500" }}>{targetReview.subTitle}</p>
                            </div>
                        </div>
                        <div className="label-wrapper">
                            <label>작업은 어떠셨나요?</label>
                            <div className="review-star">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <i
                                        key={num}
                                        class={`bi ${rating >= num ? "bi-star-fill" : "bi-star"}`}
                                        style={{
                                            fontSize: "20px",
                                            cursor: "pointer",
                                            color: "rgba(247, 196, 68, 1)",
                                        }}
                                        onClick={() => setRating(num)}
                                    ></i>
                                ))}
                            </div>
                        </div>

                        <div className="label-wrapper">
                            <label>작업 후기를 적어주세요</label>
                            <Input
                                type="textarea"
                                placeholder="작업에 대해 만족스러웠던 점이나, 팁 등을 남겨주세요"
                                value={targetReview.content}
                                onChange={(e) => setTargetReview({ ...targetReview, content: e.target.value })}
                            ></Input>
                        </div>

                        <div className="label-wrapper">
                            <label>사진 첨부</label>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                }}
                            >
                                {images.map((img, idx) => (
                                    <div style={{ position: "relative" }}>
                                        <img
                                            key={idx}
                                            src={
                                                img.isLocal
                                                    ? img.url // 로컬 blob URL
                                                    : `http://localhost:8080/imageView?type=review&filename=${img.url}` // 서버 이미지
                                            }
                                            width="60px"
                                            height="60px"
                                        />
                                        <i
                                            class="bi bi-x-circle-fill"
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                position: "absolute",
                                                top: "-4px",
                                                right: "-4px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setImages((prev) => {
                                                    const newArr = prev.filter((_, i) => i !== idx); // idx 삭제
                                                    return [...newArr]; // 자동으로 앞으로 땡겨짐
                                                });

                                                setFiles((prev) => {
                                                    const newArr = prev.filter((_, i) => i !== idx); // 같은 idx 삭제
                                                    return [...newArr];
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                                {images.length < 3 && (
                                    <div
                                        onClick={() => imgRef.current.click()}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            background: "#000",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <i
                                            class="bi bi-plus-lg"
                                            style={{
                                                fontSize: "30px",
                                                color: "#fff",
                                            }}
                                        ></i>
                                        <input type="file" hidden ref={imgRef} onChange={handleImageUpload} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="primary-button"
                            style={{ width: "100%", height: "40px", fontSize: "14px" }}
                            onClick={() => {
                                if (modalType === "등록") {
                                    if (chip === "TOOL") submitToolReview();
                                    else if (chip === "PRODUCT") submitProductReview();
                                    else if (chip === "EXPERT") submitExpertReview();
                                } else if (modalType === "수정") {
                                    if (chip === "TOOL") modifyToolReview();
                                    else if (chip === "PRODUCT") modifyProductReview();
                                    else if (chip === "EXPERT") modifyExpertReview();
                                }
                            }}
                        >
                            {modalType === "등록" ? "후기 등록하기" : "후기 수정하기"}
                        </button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
}
