import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState, useRef } from "react";
import { Pagination, PaginationItem, PaginationLink, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";
import { useNavigate, useSearchParams } from "react-router";

export default function MyWorks() {
    const [works, setWorks] = useState([]);
    const [selectDate, setSelectDate] = useState({
        startDate: null,
        endDate: null,
    });

    const [selectMatchingIdx, setSelectMatchingIdx] = useState(0);

    const [targetReview, setTargetReview] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageBtn, setPageBtn] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        allPage: 0,
        curPage: 1,
        endPage: 0,
        startPage: 1,
    });

    const imgRef = useRef(null);

    const [images, setImages] = useState([]); // 이미지 미리보기 URL 배열
    const [files, setFiles] = useState([]); // 실제 업로드용 이미지 File 배열
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [flag, setFlag] = useState(false);

    // 작업 목록 조회
    const getWorks = (page, startDate, endDate) => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/matching/userList?username=${user.username}&page=${page}&startDate=${startDate}&endDate=${endDate}`)
            .then((res) => {
                console.log(res.data.matchingList);
                setWorks(res.data.matchingList);
                return res.data.pageInfo;
            })
            .then((pageData) => {
                setPageInfo(pageData);
                let pageBtns = [];
                for (let i = pageData.startPage; i <= pageData.endPage; i++) {
                    pageBtns.push(i);
                }
                setPageBtn([...pageBtns]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 작업상태 매핑
    const WORK_STATUS_LABEL = {
        PAYMENT_COMPLETED: "결제 완료",
        IN_PROGRESS: "작업 중",
        COMPLETED: "작업 완료",
        CANCELLED: "취소",
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);

        setImages((prev) => [...prev, { url: localUrl, idx: null, isLocal: true }]);

        setFiles((prev) => [...prev, file]);
    };

    const [selectExpertIdx, setSelectExpertIdx] = useState(0);
    const [selectExpertProfile, setSelectExpertProfile] = useState("");

    const submitExpertReview = () => {
        const formData = new FormData();

        formData.append("score", rating);
        formData.append("content", targetReview.content);
        formData.append("writer", user.username);
        formData.append("matchingIdx", selectMatchingIdx);
        formData.append("expertIdx", selectExpertIdx);

        // 파일 업로드
        files.forEach((file) => {
            formData.append("reviewImages", file);
        });

        myAxios(token, setToken)
            .post(`${baseUrl}/review/write/expert`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setRating(0);
                    setImages([]);
                    setFiles([]);
                    setIsModalOpen(false);
                    setFlag(!flag);
                }
            });
    };

    useEffect(() => {
        if (!user) return;

        getWorks(pageFromUrl, selectDate.startDate, selectDate.endDate);
    }, [pageFromUrl, user, flag]);

    return (
        <div className="mypage-layout">
            <h1 className="mypage-title">시공 · 수리 내역</h1>
            <div>
                {/* 날짜 선택 */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        margin: "0 0 14px 0",
                    }}
                >
                    <Input
                        type="date"
                        bsSize="sm"
                        style={{ width: "140px", height: "32px" }}
                        onChange={(e) => {
                            setSelectDate({ ...selectDate, startDate: e.target.value });
                            setWorks([]);
                            getWorks(pageInfo.curPage, "", e.target.value, selectDate.endDate);
                        }}
                    ></Input>{" "}
                    -{" "}
                    <Input
                        type="date"
                        bsSize="sm"
                        style={{ width: "140px", height: "32px" }}
                        onChange={(e) => {
                            setSelectDate({ ...selectDate, endDate: e.target.value });
                            setWorks([]);
                            getWorks(pageInfo.curPage, "", selectDate.startDate, e.target.value);
                        }}
                    ></Input>
                </div>

                <table className="mypage-table">
                    <thead>
                        <tr>
                            <td>작업정보</td>
                            <td width="120px">전문가명</td>
                            <td width="140px">계약일자</td>
                            <td width="140px">작업일자</td>
                            <td width="140px">결제금액</td>
                            <td width="130px">작업상태</td>
                        </tr>
                    </thead>
                    <tbody>
                        {works.map((work) =>
                            work.status != "PAYMENT_CANCELLED" ? (
                                <tr
                                    key={work.matchingIdx}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        navigate(`/zipddak/mypage/expert/works/detail/${work.matchingIdx}?page=${pageInfo.curPage}`);
                                    }}
                                >
                                    <td style={{ textAlign: "left", fontSize: "13px" }}>
                                        <p style={{ fontWeight: "600", fontSize: "14px" }}>{work.categoryName ? work.categoryName : "시공견적컨설팅"}</p>
                                        <p style={{ margin: "6px 0" }}>{work.location}</p>
                                        <p>
                                            {work.budget?.toLocaleString()}원 · {work.preferredDate}
                                        </p>
                                    </td>
                                    <td>{work.activityName}</td>
                                    <td
                                        style={{
                                            fontWeight: "500",
                                        }}
                                    >
                                        {work.createdAt}
                                    </td>
                                    <td
                                        style={{
                                            fontWeight: "500",
                                        }}
                                    >
                                        <p>{work.workStartDate}</p>-<p>{work.workEndDate}</p>
                                    </td>
                                    <td
                                        style={{
                                            fontWeight: "500",
                                        }}
                                    >
                                        {Number(work.totalAmount).toLocaleString()}원
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
                                            <span style={{ fontSize: "16px", fontWeight: "700" }}>{WORK_STATUS_LABEL[work.status]}</span>
                                            {work.status === "COMPLETED" && work.writeReview === false && (
                                                <button
                                                    className="primary-button"
                                                    style={{
                                                        width: "68px",
                                                        height: "33px",
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsModalOpen(true);
                                                        setSelectMatchingIdx(work.matchingIdx);
                                                        setSelectExpertIdx(work.expertIdx);
                                                        setSelectExpertProfile(work.expertThumbnail);
                                                    }}
                                                >
                                                    후기작성
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <></>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "460px" }}>
                <ModalHeader toggle={() => setIsModalOpen(false)}>후기 작성</ModalHeader>
                <ModalBody>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <img src={`http://localhost:8080/imageView?type=expert&filename=${selectExpertProfile}`} width="80px" height="80px" />
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
                    <button className="primary-button" style={{ width: "100%", height: "40px", fontSize: "14px" }} onClick={() => submitExpertReview()}>
                        후기 등록하기
                    </button>
                </ModalFooter>
            </Modal>

            <Pagination className="my-pagination">
                {pageBtn.map((b) => (
                    <PaginationItem key={b} active={b === pageInfo.curPage}>
                        <PaginationLink
                            onClick={() => {
                                setWorks([]);
                                getWorks(b, selectDate.startDate, selectDate.endDate);
                            }}
                        >
                            {b}
                        </PaginationLink>
                    </PaginationItem>
                ))}
            </Pagination>
        </div>
    );
}
