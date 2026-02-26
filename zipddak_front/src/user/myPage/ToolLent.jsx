import { use, useState, useEffect, useRef } from "react";
import { Input, Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";

export default function ToolLent() {
    const [status, setStatus] = useState(1);
    const navigate = useNavigate();
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [flag, setFlag] = useState(false);
    const imgRef = useRef(null);

    const [rentalCate, setRentalCate] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);

    const [rentalList, setRentalList] = useState([]);
    const [pageInfo, setPageInfo] = useState({});

    const [selectRentalOptionBtn, setSelectRentalOptionBtn] = useState(0);

    // 리뷰 이미지
    const [reviewRentalIdx, setReviewRentalIdx] = useState(0);
    const [reviewToolIdx, setReviewToolIdx] = useState(0);
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [rating, setRating] = useState(0);

    // 후기 이미지 업로드
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);

        setImages((prev) => [...prev, { url: localUrl, idx: null, isLocal: true }]);

        setFiles((prev) => [...prev, file]);
    };

    // 모달 컨트롤

    // 운송장 모달
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
    };
    const [selectInvoice, setSelectInvoice] = useState("");
    const [tCode, setTCode] = useState("");
    // 알림 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 모달 안에 들어갈 메세지
    const [modalMessage, setModalMessage] = useState("");
    // 리뷰 모달
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [content, setContent] = useState("");

    // 배송조회 모달
    const [deliveryModal, setDeliveryModal] = useState(false);

    const [postComp, setPostComp] = useState("none");

    const { curPage, startPage, endPage, allPage } = pageInfo;

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);
    // 작업상태 매핑
    const WORK_STATUS_LABEL = {
        PAYMENT_COMPLETED: "결제 완료",
        IN_PROGRESS: "작업 중",
        COMPLETED: "작업 완료",
        CANCELLED: "취소",
    };

    const handlePageClick = (pageNum) => {
        if (pageNum < 1 || pageNum > pageInfo.allPage) return;
        setPage(pageNum);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const [postCode, setPostCode] = useState("");

    // 운송장 번호 저장
    const savePostCode = () => {
        if (postComp === "none") {
            alert("택배사를 선택해주세요");
            return;
        }

        const isValid = /^[0-9]{8,16}$/.test(postCode);

        if (!isValid) {
            alert("송장번호는 숫자 8자리 이상 16자리 이하로 입력해주세요.");
            return;
        }

        // 송장번호 저장하는 로직
        myAxios(token, setToken)
            .post(`${baseUrl}/user/rental/postCode`, {
                rentalIdx: selectRentalOptionBtn,
                postComp: postComp,
                postCode: postCode,
            })
            .then((res) => {
                setIsModalOpen(true);
                toggle();
                setModalMessage("운송장번호가 등록되었습니다.");
                setTimeout(() => {
                    setIsModalOpen(false);
                    setFlag(!flag);
                }, 1500);
            });
    };

    // 대여 상태로 전환
    const rentalState = (rentalStateIdx) => {
        myAxios(token, setToken)
            .post(`${baseUrl}/user/rental/stateRental`, {
                rentalIdx: rentalStateIdx,
            })
            .then((res) => {
                if (res.data) {
                    setModalMessage("대여중 상태로 변경되었습니다.");
                    setIsModalOpen(true);
                    setTimeout(() => {
                        setIsModalOpen(false);
                        setFlag(!flag);
                    }, 1500);
                }
            });
    };

    // 반납완료 상태로 전환
    const returnState = (returnStateIdx, toolIdx) => {
        myAxios(token, setToken)
            .post(`${baseUrl}/user/rental/stateReturn`, {
                rentalIdx: returnStateIdx,
                toolIdx: toolIdx,
            })
            .then((res) => {
                if (res.data) {
                    setModalMessage("반납완료 상태로 변경되었습니다.");
                    setIsModalOpen(true);
                    setTimeout(() => {
                        setIsModalOpen(false);
                        setFlag(!flag);
                    }, 1500);
                }
            });
    };

    // 공구 리뷰
    const submitToolReview = () => {
        if (content.trim() === "") {
            setModalMessage("공구 후기를 작성해주세요.");
            setIsModalOpen(true);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 1500);
        }

        const formData = new FormData();

        formData.append("score", rating);
        formData.append("content", content);
        formData.append("writer", user.username);
        formData.append("rentalIdx", reviewRentalIdx);
        formData.append("toolIdx", reviewToolIdx);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("reviewImages", file);
        });

        myAxios(token, setToken)
            .post(`${baseUrl}/user/rental/rentalReview`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setModalMessage("공구 후기가 작성되었습니다.");
                    setReviewModalOpen(false);
                    setIsModalOpen(true);
                    setRating(0);
                    setImages([]);
                    setFiles([]);
                    setTimeout(() => {
                        setIsModalOpen(false);
                        setFlag(!flag);
                    }, 1500);
                }
            });
    };

    useEffect(() => {
        if (!token || !user) return;

        myAxios(token, setToken)
            .get(`${baseUrl}/user/mypage/rental?username=${user.username}&rentalCate=${rentalCate}&startDate=${startDate}&endDate=${endDate}&state=${status}&page=${page}`)
            .then((res) => {
                console.log(res.data);
                setRentalList(res.data.list);
                setPageInfo(res.data.pageInfo);
            });
    }, [token, user, rentalCate, startDate, endDate, status, flag, page]);

    return (
        <>
            <div className="myPage-tool-container">
                {/* <Header1 /> */}

                <div className="mypage-layout">
                    <h1 className="mypage-title">공구대여 내역</h1>
                    <div className="tabs">
                        <div
                            style={rentalCate === 1 ? { color: "black", borderBottom: "2px solid black" } : {}}
                            onClick={() => {
                                setRentalCate(1);
                                setPage(1);
                            }}
                            className="tab_nav"
                        >
                            빌린 공구
                        </div>
                        <div
                            style={rentalCate === 2 ? { color: "black", borderBottom: "2px solid black" } : {}}
                            onClick={() => {
                                setRentalCate(2);
                                setPage(1);
                            }}
                            className="tab_nav"
                        >
                            빌려준 공구
                        </div>
                    </div>

                    <div>
                        {/* 날짜 선택 */}
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    margin: "0 0 14px 0",
                                }}
                            >
                                <Input onChange={(e) => setStartDate(e.target.value)} type="date" bsSize="sm" style={{ width: "140px" }}></Input> -{" "}
                                <Input onChange={(e) => setEndDate(e.target.value)} type="date" bsSize="sm" style={{ width: "140px" }}></Input>
                            </div>
                            <Input type="select" style={{ width: "200px" }} onChange={(e) => setStatus(e.target.value)}>
                                <option value={1}>전체</option>
                                <option value={2}>결제완료</option>
                                <option value={3}>배송중</option>
                                <option value={4}>대여중</option>
                                <option value={5}>반납완료</option>
                            </Input>
                        </div>

                        <table className="mypage-table" style={{ width: "918px" }}>
                            <thead>
                                <tr>
                                    <td style={{ width: "200px", maxWidth: "200px" }}>공구정보</td>
                                    {rentalCate === 2 && <td style={{ width: "120px" }}>신청자</td>}
                                    <td width="140px">대여기간</td>
                                    <td width="140px">결제금액</td>
                                    <td width="130px">공구상태</td>
                                </tr>
                            </thead>
                            <tbody>
                                {rentalList.map((rental) => (
                                    <tr
                                        key={rental.rentalIdx}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            if (rentalCate === 1) {
                                                navigate(`/zipddak/mypage/tools/rentals/borrowed/${rental.rentalIdx}`);
                                            } else {
                                                navigate(`/zipddak/mypage/tools/rentals/lent/${rental.rentalIdx}`);
                                            }
                                        }}
                                    >
                                        <td style={{ textAlign: "left", fontSize: "13px" }}>
                                            <img style={{ width: "80px", height: "80px", marginRight: "15px" }} src={`${baseUrl}/imageView?type=tool&filename=${rental.toolImg}`} alt="" />
                                            <span>{rental.toolName}</span>
                                        </td>
                                        {rentalCate === 2 && <td>{rental.borrowName}</td>}

                                        <td
                                            style={{
                                                fontWeight: "500",
                                            }}
                                        >
                                            <p>{rental.startDate}</p>-<p>{rental.endDate}</p>
                                        </td>
                                        <td
                                            style={{
                                                fontWeight: "500",
                                            }}
                                        >
                                            {rental.amount?.toLocaleString()}원
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                }}
                                            >
                                                <span style={rental.state === "RENTAL" ? { color: "#FF5833", fontSize: "16px", fontWeight: "700" } : { fontSize: "16px", fontWeight: "700" }}>
                                                    {rental.state === "PAYED" ? "결제완료" : rental.state === "DELIVERY" ? "배송중" : rental.state === "RENTAL" ? "대여중" : "반납완료"}
                                                </span>
                                                {rental.reviewCheck === false && rentalCate === 1 && rental.state === "RETURN" ? (
                                                    <button
                                                        className="primary-button"
                                                        style={{ width: "60px", height: "33px" }}
                                                        onClick={(e) => {
                                                            setReviewRentalIdx(rental.rentalIdx);
                                                            setReviewToolIdx(rental.toolIdx);
                                                            e.stopPropagation();
                                                            setReviewModalOpen(true);
                                                        }}
                                                    >
                                                        리뷰작성
                                                    </button>
                                                ) : rentalCate === 1 && rental.state === "DELIVERY" ? (
                                                    <button
                                                        className="primary-button"
                                                        style={{
                                                            width: "60px",
                                                            height: "33px",
                                                            border: "1px solid #E1E4ED",
                                                            padding: "12px",
                                                            display: "flex",
                                                            gap: "3px",
                                                            whiteSpace: "nowrap",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            textAlign: "center",
                                                            fontSize: "13px",
                                                            fontStyle: "normal",
                                                            fontWeight: "600",
                                                            lineHeight: "18px",
                                                            borderRadius: "4px",
                                                            backgroundColor: "#FFFFFF",
                                                            color: "#303441",
                                                        }}
                                                        onClick={(e) => {
                                                            const tCodeMap = {
                                                                CJ대한통운: "04",
                                                                롯데택배: "08",
                                                                한진택배: "05",
                                                                로젠택배: "06",
                                                                우체국택배: "01",
                                                            };

                                                            e.stopPropagation();
                                                            setSelectInvoice(rental.invoice);
                                                            setTCode(tCodeMap[rental.postComp] || "");
                                                            setDeliveryModal(true); // modal 먼저 열기
                                                        }}
                                                    >
                                                        배송조회
                                                    </button>
                                                ) : rentalCate === 2 && rental.state === "PAYED" ? (
                                                    <button
                                                        onClick={(e) => {
                                                            setSelectRentalOptionBtn(rental.rentalIdx);
                                                            e.stopPropagation();
                                                            toggle();
                                                        }}
                                                        className="primary-button"
                                                        style={{ width: "60px", height: "33px" }}
                                                    >
                                                        송장등록
                                                    </button>
                                                ) : rentalCate === 2 && rental.state === "DELIVERY" ? (
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <button
                                                            style={{
                                                                width: "60px",
                                                                height: "33px",
                                                                border: "1px solid #E1E4ED",
                                                                padding: "12px",
                                                                display: "flex",
                                                                gap: "3px",
                                                                whiteSpace: "nowrap",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                textAlign: "center",
                                                                fontSize: "13px",
                                                                fontStyle: "normal",
                                                                fontWeight: "600",
                                                                lineHeight: "18px",
                                                                borderRadius: "4px",
                                                                backgroundColor: "#FFFFFF",
                                                                color: "#303441",
                                                            }}
                                                            onClick={(e) => {
                                                                const tCodeMap = {
                                                                    CJ대한통운: "04",
                                                                    롯데택배: "08",
                                                                    한진택배: "05",
                                                                    로젠택배: "06",
                                                                    우체국택배: "01",
                                                                };

                                                                e.stopPropagation();
                                                                setSelectInvoice(rental.invoice);
                                                                setTCode(tCodeMap[rental.postComp] || "");
                                                                setDeliveryModal(true); // modal 먼저 열기
                                                            }}
                                                        >
                                                            배송조회
                                                        </button>
                                                        <button
                                                            style={{
                                                                width: "60px",
                                                                height: "33px",
                                                                border: "1px solid #FF5833",
                                                                padding: "12px",
                                                                display: "flex",
                                                                gap: "3px",
                                                                whiteSpace: "nowrap",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                textAlign: "center",
                                                                fontSize: "13px",
                                                                fontStyle: "normal",
                                                                fontWeight: "600",
                                                                lineHeight: "18px",
                                                                borderRadius: "4px",
                                                                backgroundColor: "#FFFFFF",
                                                                color: "#FF5833",
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                rentalState(rental.rentalIdx);
                                                            }}
                                                        >
                                                            배송완료
                                                        </button>
                                                    </div>
                                                ) : rentalCate === 2 && rental.state === "RENTAL" ? (
                                                    <button
                                                        style={{
                                                            width: "60px",
                                                            height: "33px",
                                                            padding: "12px",
                                                            display: "flex",
                                                            gap: "3px",
                                                            whiteSpace: "nowrap",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            textAlign: "center",
                                                            fontSize: "13px",
                                                            fontStyle: "normal",
                                                            fontWeight: "600",
                                                            lineHeight: "18px",
                                                            borderRadius: "4px",
                                                            backgroundColor: "#303441",
                                                            color: "#FFFFFF",
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            returnState(rental.rentalIdx, rental.toolIdx);
                                                        }}
                                                    >
                                                        반납완료
                                                    </button>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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

                    {/* 운송장 번호 등록 모달 */}
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader>운송장 번호 등록</ModalHeader>
                        <ModalBody>
                            <div>
                                <div>
                                    <p>상품 발송 시 운송장번호를 등록해주세요.</p>
                                    <p>
                                        등록하면 공구 상태가 <span style={{ fontWeight: "600" }}>배송중</span>으로 변경됩니다.
                                    </p>
                                </div>
                                <p style={{ color: "red" }}>처리 후 취소할 수 없습니다.</p>

                                <div style={{ marginTop: "10px" }}>
                                    <span className="sub_title">운송장 번호 </span>
                                    <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                                        <Input value={postComp} onChange={(e) => setPostComp(e.target.value)} type="select" style={{ width: "30%", height: "33px" }}>
                                            <option value="none" disabled>
                                                택배사
                                            </option>
                                            <option value="CJ대한통운">CJ대한통운</option>
                                            <option value="롯데택배">롯데택배</option>
                                            <option value="한진택배">한진택배</option>
                                            <option value="로젠택배">로젠택배</option>
                                            <option value="우체국택배">우체국택배</option>
                                        </Input>
                                        <Input onChange={(e) => setPostCode(e.target.value)} type="text" style={{ width: "70%", height: "33px" }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "10px" }} className="btn_part">
                                <button onClick={toggle} className="sub-button" style={{ width: "100%", height: "33px" }}>
                                    취소
                                </button>
                                <button onClick={savePostCode} className="primary-button" style={{ width: "100%", height: "33px" }}>
                                    저장
                                </button>
                            </div>
                        </ModalBody>
                    </Modal>

                    {/* 배송조회 모달 */}
                    <Modal
                        isOpen={deliveryModal}
                        toggle={() => setDeliveryModal(false)}
                        className="mypage-modal"
                        onOpened={() => {
                            if (selectInvoice && tCode) {
                                const form = document.getElementById(`delivery-form-${selectInvoice}`);
                                if (form) form.submit();
                            }
                        }}
                    >
                        <ModalHeader toggle={() => setDeliveryModal(false)}></ModalHeader>
                        <ModalBody style={{ height: "80vh" }}>
                            <iframe name="delivery-iframe" style={{ width: "100%", height: "100%", border: "none" }}></iframe>

                            {/* 숨겨진 폼 */}

                            <form id={`delivery-form-${selectInvoice}`} action="https://info.sweettracker.co.kr/tracking/1" method="post" target="delivery-iframe" style={{ display: "none" }}>
                                <input type="hidden" name="t_key" value="PodOAv532aYpNS6tB35tig" />
                                <input type="hidden" name="t_code" value={tCode} />
                                <input type="hidden" name="t_invoice" value={selectInvoice} />
                            </form>
                        </ModalBody>
                    </Modal>

                    {/* 공구 리뷰 모달 */}
                    <Modal
                        isOpen={reviewModalOpen}
                        toggle={() => {
                            setReviewModalOpen(false);
                            setRating(0);
                            setImages([]);
                            setFiles([]);
                        }}
                        className="mypage-modal"
                        style={{ width: "460px" }}
                    >
                        <ModalHeader
                            toggle={() => {
                                setReviewModalOpen(false);
                                setRating(0);
                                setImages([]);
                                setFiles([]);
                            }}
                        >
                            후기 작성
                        </ModalHeader>
                        <ModalBody>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                        fontSize: "14px",
                                    }}
                                >
                                    <p style={{ fontWeight: "600" }}></p>
                                    <p style={{ fontWeight: "500" }}>공구이름</p>
                                </div>
                            </div>
                            <div className="label-wrapper">
                                <label>대여한 상품은 어떠셨나요?</label>
                                <div className="review-star">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <i
                                            key={num}
                                            className={`bi ${rating >= num ? "bi-star-fill" : "bi-star"}`}
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
                                <label>공구 후기를 적어주세요</label>
                                <Input type="textarea" placeholder="공구에 대해 만족스러웠던 점을 남겨주세요" onChange={(e) => setContent(e.target.value)}></Input>
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
                                            <img key={idx} src={img.url} width="60px" height="60px" />
                                            <i
                                                className="bi bi-x-circle-fill"
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
                                                className="bi bi-plus-lg"
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
                            <button className="primary-button" style={{ width: "100%", height: "40px", fontSize: "14px" }} onClick={() => submitToolReview()}>
                                후기 등록하기
                            </button>
                        </ModalFooter>
                    </Modal>

                    {/* <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                        <Pagination className="my-pagination">

                            <PaginationItem disabled={curPage === 1}>
                                <PaginationLink previous onClick={() => handlePageClick(curPage - 1)} />
                            </PaginationItem>


                            {pages.map((page) => (
                                <PaginationItem key={page} active={curPage === page}>
                                    <PaginationLink onClick={() => handlePageClick(page)}>{page}</PaginationLink>
                                </PaginationItem>
                            ))}


                            <PaginationItem disabled={curPage === allPage}>
                                <PaginationLink next onClick={() => handlePageClick(curPage + 1)} />
                            </PaginationItem>
                        </Pagination>
                    </div> */}
                </div>
            </div>
        </>
    );
}
