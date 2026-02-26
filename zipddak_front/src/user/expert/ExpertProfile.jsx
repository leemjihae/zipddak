import React, { useState, useRef, useEffect } from "react";
import "../css/ExpertProfile.css";
import ExpertReviewCard from "./ExpertReviewCard";
import ExpertQuestion from "./ExpertQuestion";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl, myAxios } from "../../config";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { expertIdxAtom } from "./expertAtom";
import { useNavigate } from "react-router-dom";

export default function ExpertProfile() {
    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [expertAtom, setExpertAtom] = useAtom(expertIdxAtom);
    const [selectInfoCateNo, setSelectInfoCateNo] = useState(1);

    const navigate = useNavigate();

    const [reportReason, setReportReason] = useState("");
    const { expertIdx } = useParams();

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [career, setCareer] = useState({});
    const [categoryList, setCategoryList] = useState([]);
    const [expertProfile, setExpertProfile] = useState({});
    const [portfolio, setportfolio] = useState([]);
    const [reviewScore, setReviewScore] = useState({});
    const [reviewList, setReviewList] = useState([]);
    const [hasMoreReview, setHasMoreReview] = useState(true);

    const [favoriteIcon, setFavoriteIcon] = useState(false);

    const [reviewPage, setReviewPage] = useState(2);

    const expert = {
        nickname: "전문가 활동명",
        major: "도어 시공",
        intro: "전문가의 간단한 소개가 들어갑니다.",
        address: "서울시 금천구 가산동",
    };

    const infoRef = useRef(null);
    const portfolioRef = useRef(null);
    const reviewRef = useRef(null);
    const questionRef = useRef(null);

    const expertDetail = [
        { detailNo: 1, name: "전문가 정보", ref: infoRef },
        { detailNo: 2, name: "포트폴리오", ref: portfolioRef },
        { detailNo: 3, name: "리뷰", ref: reviewRef },
        { detailNo: 4, name: "질문답변", ref: questionRef },
    ];

    const handleNavClick = (item) => {
        setSelectInfoCateNo(item.detailNo);

        const top = item.ref.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top, behavior: "instant" });
    };

    function formatTimeToAmPm(timeStr) {
        if (!timeStr) return ""; // null/undefined 안전 처리

        const [hours, minutes] = timeStr.split(":");
        let h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);

        const ampm = h >= 12 ? "오후" : "오전";
        if (h === 0) h = 12; // 0시는 12시 오전
        else if (h > 12) h -= 12; // 13~23시는 1~11시 오후

        return m === 0 ? `${ampm} ${h}시` : `${ampm} ${h}시 ${m}분`;
    }

    const reviewMore = () => {
        if (!hasMoreReview) return; // 더 없으면 요청 안 함

        axios.get(`${baseUrl}/expertProfile/moreReview?expertIdx=${expertIdx}&page=${reviewPage}`).then((res) => {
            const newReviews = res.data.reviewList;

            console.log(newReviews);
            // 1️⃣ 리뷰 누적
            setReviewList((prev) => [...prev, ...newReviews]);

            // 2️⃣ 페이지 증가
            setReviewPage((prev) => prev + 1);

            setHasMoreReview(res.data.hasNext);
        });
    };

    useEffect(() => {
        if (user.username === null) {
            return;
        }

        axios.get(`${baseUrl}/expertProfile?expertIdx=${expertIdx}&username=${user.username}`).then((res) => {
            console.log(res.data);
            setCareer(res.data.careerDto);
            setCategoryList(res.data.categoryList);
            setExpertProfile(res.data.expertProfile);
            setportfolio(res.data.portFolioDtoList);
            setReviewList(res.data.expertReviewDto.reviewList.reviewList);
            setReviewScore(res.data.expertReviewDto.expertReviewScoreDto);
            setHasMoreReview(res.data.expertReviewDto.reviewList.hasNext);
            setFavoriteIcon(res.data.favorite);

            setQuestions((prev) => [
                {
                    ...prev[0],
                    answer: res.data.expertProfile?.questionAnswer1 || "",
                },
                {
                    ...prev[1],
                    answer: res.data.expertProfile?.questionAnswer2 || "",
                },
                {
                    ...prev[2],
                    answer: res.data.expertProfile?.questionAnswer3 || "",
                },
            ]);

            setReviewPage(2);
        });
    }, [user]);

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
                    const visibleSection = expertDetail.find((item) => item.ref.current === entry.target);
                    if (visibleSection) {
                        setSelectInfoCateNo(visibleSection.detailNo);
                    }
                }
            });
        }, options);

        // 모든 섹션 observer에 등록
        expertDetail.forEach((item) => {
            if (item.ref?.current) observer.observe(item.ref.current);
        });

        return () => {
            expertDetail.forEach((item) => {
                if (item.ref?.current) observer.unobserve(item.ref.current);
            });
        };
    }, []);

    const reportExpert = () => {
        if (user.username === "") {
            navigate("/zipddak/login");
            return;
        }

        myAxios(token, setToken)
            .post(`${baseUrl}/user/reportExpert`, { username: user.username, reason: reportReason, expertIdx: expertIdx })
            .then((res) => {
                console.log(res.data);
            });
    };

    const favoriteToggle = () => {
        if (user.username === "") {
            navigate("/zipddak/login");
            return;
        }

        myAxios(token, setToken)
            .post(`${baseUrl}/user/favoriteExpert`, {
                username: user.username,
                expertIdx: expertIdx,
            })
            .then((res) => {
                if (res.data) {
                    setFavoriteIcon(!favoriteIcon);
                }
            });
    };

    const expertRequest = () => {
        if (user.username === "") {
            navigate("/zipddak/login");
            return;
        }

        setExpertAtom(Number(expertIdx));
        navigate("/zipddak/findExpert");
    };

    const [questions, setQuestions] = useState([
        {
            id: 1,
            question: "서비스가 시작되기전 어떤 절차로 진행하나요?",
            answer: "",
        },
        {
            id: 2,
            question: "어떤 서비스를 전문적으로 제공하나요?",
            answer: "",
        },
        {
            id: 3,
            question: "서비스의 견적은 어떤 방식으로 산정 되나요?",
            answer: "",
        },
    ]);

    return (
        <div className="body-div">
            <div className="expertProfile-main-div">
                {/* 이미지 ~ 활동 지역 */}
                <div className="expertProfile-detail-info-div">
                    <div className="expertProfile-img-div">
                        {/* 이미지 */}
                        <img className="expertProfile-img" src={expertProfile.imgFileRename ? `${baseUrl}/imageView?type=expert&filename=${expertProfile.imgFileRename}` : `/default-profile.png`} />

                        {/* 견적요청 버튼, 관심, 신고 */}
                        <div className="expertProfile-request-div">
                            <button onClick={expertRequest} className="expertProfile-request-button">
                                견적 요청하기
                            </button>
                            <div>
                                <button onClick={favoriteToggle} style={{ border: "none", backgroundColor: "transparent" }}>
                                    {favoriteIcon ? <i className="bi bi-heart-fill expertProfile-heart"></i> : <i className="bi bi-heart expertProfile-heart"></i>}
                                </button>

                                <button onClick={toggle} style={{ border: "none", backgroundColor: "transparent" }}>
                                    <i className="bi bi-exclamation-triangle expertProfile-report"></i>
                                </button>
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
                                                    <Input
                                                        value="PRICE_MISMATCH"
                                                        onChange={(e) => setReportReason(e.target.value)}
                                                        type="radio"
                                                        name="reason"
                                                        id="PRICE_MISMATCH"
                                                        style={{ marginRight: "20px" }}
                                                    />{" "}
                                                    <label htmlFor="PRICE_MISMATCH" className="font-14">
                                                        견적 금액과 실제 비용 불일치
                                                    </label>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Input
                                                        value="UNPROFESSIONAL_RESPONSE"
                                                        onChange={(e) => setReportReason(e.target.value)}
                                                        type="radio"
                                                        name="reason"
                                                        id="UNPROFESSIONAL_RESPONSE"
                                                        style={{ marginRight: "20px" }}
                                                    />{" "}
                                                    <label htmlFor="UNPROFESSIONAL_RESPONSE" className="font-14">
                                                        비전문적이거나 불성실한 응대
                                                    </label>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Input
                                                        value="INAPPROPRIATE_BEHAVIOR"
                                                        onChange={(e) => setReportReason(e.target.value)}
                                                        type="radio"
                                                        name="reason"
                                                        id="INAPPROPRIATE_BEHAVIOR"
                                                        style={{ marginRight: "20px" }}
                                                    />{" "}
                                                    <label htmlFor="INAPPROPRIATE_BEHAVIOR" className="font-14">
                                                        부적절한 언행 또는 불쾌감을 주는 태도
                                                    </label>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Input
                                                        value="SERVICE_NOT_PROVIDED"
                                                        onChange={(e) => setReportReason(e.target.value)}
                                                        type="radio"
                                                        name="reason"
                                                        id="SERVICE_NOT_PROVIDED"
                                                        style={{ marginRight: "20px" }}
                                                    />{" "}
                                                    <label htmlFor="SERVICE_NOT_PROVIDED" className="font-14">
                                                        서비스 미이행 또는 일방적인 계약 파기
                                                    </label>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Input
                                                        value="POLICY_VIOLATION"
                                                        onChange={(e) => setReportReason(e.target.value)}
                                                        type="radio"
                                                        name="reason"
                                                        id="POLICY_VIOLATION"
                                                        style={{ marginRight: "20px" }}
                                                    />{" "}
                                                    <label htmlFor="POLICY_VIOLATION" className="font-14">
                                                        플랫폼 정책 위반 행위
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
                                                        reportExpert();
                                                        toggle();
                                                    }}
                                                >
                                                    신고하기
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <div>
                        {/* 전문가 활동명 */}
                        <span className="font-22 semibold">{expertProfile.activityName}</span>
                    </div>
                    <div>
                        {/* 전문 분야 */}
                        <span className="font-15 semibold">{expertProfile.mainServiceName}</span>
                        {/* 소개글 */}
                        <div className="font-15">{expertProfile.introduction}</div>
                        <span className="font-14">
                            <i className="bi bi-geo-alt font-15"></i>
                            {expertProfile.addr1 + " " + expertProfile.addr2}
                        </span>
                    </div>
                </div>
                <div className="expertProfile-info-category">
                    <div className="expertProfile-info-category-button-bar">
                        {expertDetail.map((detail) => (
                            <button
                                onClick={() => handleNavClick(detail)}
                                className={selectInfoCateNo === detail.detailNo ? "expertProfile-select-info-cate" : "expertProfile-default-info-cate"}
                                key={detail.detailNo}
                            >
                                {detail.name}
                            </button>
                        ))}
                    </div>
                    {/* 빈처리 */}
                    <div className="expertProfile-empty-bar"></div>
                </div>

                <div>
                    {/* 전문가 정보 */}
                    <div className="expertProfile-under-info-div" ref={infoRef}>
                        {/* 전문가 정보 div */}
                        <div className="expertProfile-expert-info">
                            <span className="font-18 semibold">전문가 정보</span>
                            <div>
                                <i className="bi bi-building font-15"></i>
                                <span className="font-14 margin-left-5">직원수</span>
                                {/* 직원수 */}
                                <span className="font-14 margin-left-5">{expertProfile.employeeCount} 명</span>
                            </div>
                            <div>
                                <i className="bi bi-clock font-15"></i>
                                <span className="font-14 margin-left-5">연락 가능 시간:</span>
                                {/* 연락 가능 시간 */}
                                <span className="font-14 margin-left-5">
                                    {/* 오전 시간 */}
                                    {formatTimeToAmPm(expertProfile.contactStartTime)} ~ {/* 오흐 시간 */}
                                    {formatTimeToAmPm(expertProfile.contactEndTime)}
                                </span>
                            </div>
                            {expertProfile.externalLink1 && (
                                <div className="expertProfile-links">
                                    <div>
                                        <i className="bi bi-globe font-15"></i>
                                        <a className="expertProfile-homepage-link margin-left-5 font-14 medium" href={expertProfile.externalLink1} target="_blank" rel="noopener noreferrer">
                                            {expertProfile.externalLink1}
                                        </a>
                                    </div>

                                    {expertProfile.externalLink2 && (
                                        <div>
                                            <i className="bi bi-globe font-15"></i>
                                            <a className="expertProfile-homepage-link margin-left-5 font-14 medium" href={expertProfile.externalLink2} target="_blank" rel="noopener noreferrer">
                                                {expertProfile.externalLink2}
                                            </a>
                                        </div>
                                    )}

                                    {expertProfile.externalLink3 && (
                                        <div>
                                            <i className="bi bi-globe font-15"></i>
                                            <a className="expertProfile-homepage-link margin-left-5 font-14 medium" href={expertProfile.externalLink3} target="_blank" rel="noopener noreferrer">
                                                {expertProfile.externalLink3}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 제공 서비스div */}
                        <div className="expertProfile-provide-service">
                            <span className="font-18 semibold">제공 서비스</span>
                            {/* 제공 서비스 뱃지 */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {categoryList.map((category) => (
                                    <div
                                        key={category.categoryIdx}
                                        style={{
                                            padding: "0 20px",
                                            border: "1px solid #e0e5eb",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "content",
                                            alignItems: "center",
                                            borderRadius: "15px",
                                        }}
                                    >
                                        <span className="font-14 medium">{category.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 경력div */}
                        <div className="expertProfile-info-career-div">
                            {/* 경력 */}
                            <div className="expertProfile-info-career">
                                <span className="font-18 semibold">경력</span>
                                <span className="font-15 medium mainColor">
                                    <span className="font-15 medium mainColor">
                                        총 경력{" "}
                                        {career.career <= 0
                                            ? "경력 없음"
                                            : career.career < 1
                                            ? "1개월 미만"
                                            : career.career < 12
                                            ? `${career.career}개월`
                                            : `${Math.floor(career.career / 12)}년 ${career.career % 12 > 0 ? (career.career % 12) + "개월" : ""}`}
                                    </span>
                                </span>
                            </div>

                            {/* 경력 타이틀 div */}
                            <div>
                                {career.career !== 0 ? (
                                    career.careerList?.map((c) => (
                                        <div key={c.careerIdx}>
                                            {/* 경력 타이틀 */}
                                            <span className="font-15 medium">{c.title}</span>
                                            <div className="expertProfile-info-career-content">
                                                {/* 경력 기간 */}
                                                <span className="font-14">
                                                    {c.startDate.replaceAll("-", ".")} ~ {c.endDate.replaceAll("-", ".")}
                                                </span>
                                                {/* 경력 내용 */}
                                                <span className="font-14">{c.description}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>

                        {/* 서비스 상세 설명 div */}
                        <div className="expertProfile-service-detail">
                            <span className="font-18 semibold">서비스 상세 설명</span>
                            {/* 상세 설명 내용 */}
                            <div className="font-15">{expertProfile.providedServiceDesc}</div>
                        </div>

                        {/* 자격증 및 기타 서류 div */}
                        <div className="expertProfile-auth-img-div">
                            <span className="font-18 semibold">자격증 및 기타 서류</span>
                            {/* 자격증 */}
                            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                {expertProfile.certImage1 && (
                                    <img style={{ border: "none" }} className="expertProfile-auth-img" src={`${baseUrl}/imageView?type=expert&filename=${expertProfile.certImage1}`} alt="cert1" />
                                )}

                                {expertProfile.certImage2 && (
                                    <img style={{ border: "none" }} className="expertProfile-auth-img" src={`${baseUrl}/imageView?type=expert&filename=${expertProfile.certImage2}`} alt="cert2" />
                                )}

                                {expertProfile.certImage3 && (
                                    <img style={{ border: "none" }} className="expertProfile-auth-img" src={`${baseUrl}/imageView?type=expert&filename=${expertProfile.certImage3}`} alt="cert3" />
                                )}

                                {!expertProfile.certImage1 && !expertProfile.certImage2 && !expertProfile.certImage3 && <span style={{ color: "#999", fontSize: "14px" }}>자격증 없음</span>}
                            </div>
                        </div>
                    </div>

                    <hr className="expertProfile-hr" />

                    {/* 포트폴리오 */}
                    <div className="expertProfile-portfolio-div" ref={portfolioRef}>
                        <span className="font-18 semibold">포트폴리오</span>
                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                            {!portfolio || portfolio.length === 0 ? (
                                <span style={{ color: "#999", fontSize: "14px" }}>포트폴리오 없음</span>
                            ) : (
                                portfolio.map((port, idx) => {
                                    const images = [port.image1, port.image2, port.image3].filter(Boolean);

                                    return (
                                        <React.Fragment key={idx}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                                <h3>{port.title}</h3>
                                                <span>{port.description}</span>
                                                <div style={{ display: "flex", gap: "20px" }}>
                                                    {images.map((img, i) => (
                                                        <img
                                                            key={i}
                                                            style={{ border: "none" }}
                                                            className="expertProfile-portfolio"
                                                            src={`${baseUrl}/imageView?type=expert&filename=${img}`}
                                                            alt={`portfolio-${i}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <hr className="expertProfile-hr" />

                    {/* 리뷰 */}
                    <div ref={reviewRef}>
                        <div className="expertProfile-review-score-div">
                            <span className="font-18 semibold">리뷰</span>
                            <div className="expertProfile-review-score">
                                <i className="bi bi-star-fill" style={{ fontSize: "28px", color: "#F7C444" }}></i>
                                {/* 리뷰 평점 */}
                                <span className="font-24 semibold margin-left-5">{reviewScore.score}</span>

                                {/* 리뷰 수 */}
                                <span>({reviewScore.reviewCount})</span>
                            </div>
                        </div>
                        {/* 리뷰 반복 */}
                        <div>
                            {reviewList.map((review) => (
                                <ExpertReviewCard key={review.reviewIdx} expertReview={review} />
                            ))}
                        </div>
                        <div className="expertProfile-review-more-button-div">
                            {hasMoreReview && (
                                <button onClick={reviewMore} className="expertProfile-review-more-button font-14">
                                    리뷰 더보기 <i className="bi bi-chevron-down more-icon"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 질문 답변 */}
                    <div className="expertProfile-question-answer-div" ref={questionRef}>
                        <span className="font-18 semibold">질문 답변</span>

                        {questions.map((question) => (
                            <ExpertQuestion key={question.id} question={question} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
