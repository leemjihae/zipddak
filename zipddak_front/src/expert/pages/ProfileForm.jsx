import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import DaumPostcode from "react-daum-postcode";
import { useEffect, useRef, useState } from "react";
import "../css/expertProfile.css";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";

export default function ProfileForm() {
    const [expert, setExpert] = useState({}); // 전문가 상세 정보
    const [address, setAddress] = useState({ zonecode: "", addr1: "" }); // 우편번호 및 도로명주소
    const [externalLinkInput, setExternalLinkInput] = useState(""); // 외부링크 입력값
    const [externalLinks, setExternalLinks] = useState([]); // 외부링크 목록
    const [serviceSelect, setServiceSelect] = useState(""); // 현재 선택된 제공서비스 옵션값
    const [providedServices, setProvidedServices] = useState([]); // 제공서비스 목록
    const [career, setCareer] = useState({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false,
    }); // 경력 입력값
    const [careerList, setCareerList] = useState([]); // 경력 목록
    const [portfolio, setPortfolio] = useState({
        title: "",
        serviceIdx: null,
        region: "",
        price: "",
        workTimeType: "",
        workTimeValue: "",
        description: "",
    }); // 포트폴리오 입력값
    const [portfolioThumbnails, setPortfolioThumbnails] = useState([]); // 포트폴리오 썸네일 목록
    const [questionAnswers, setQuestionAnswers] = useState([]); // 질문답변 목록
    const [startTime, setStartTime] = useState(""); // 연락가능 시작시간
    const [endTime, setEndTime] = useState(""); // 연락가능 종료시간

    const [step, setStep] = useState({ 1: true, 2: false, 3: false, 4: false }); // 좌측 step

    // 모달 안에 들어갈 메세지
    const [modalMessage, setModalMessage] = useState("");

    const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 미리보기
    const [profileFile, setProfileFile] = useState(null); // 프로필 이미지 파일
    const [certificateImages, setCertificateImages] = useState([]); // 자격증 및 기타서류 이미지 미리보기
    const [certificateFiles, setCertificateFiles] = useState([]); // 자격증 및 기타서류 이미지 파일
    const [portfolioImages, setPortfolioImages] = useState([]); // 포트폴리오 이미지 미리보기
    const [portfolioFiles, setPortfolioFiles] = useState([]); // 포트폴리오 이미지 파일
    const [businessImage, setBusinessImage] = useState(null); // 사업자등록증 이미지 미리보기
    const [businessFile, setBusinessFile] = useState(null); // 사업자등록증 이미지 파일

    const [isModalOpen, setIsModalOpen] = useState(false);
    // 알림 모달
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); // 경력 | 포트폴리오 | 질문 | 주소
    const [durationUnitChip, setDurationUnitChip] = useState(""); // HOUR | DAY | WEEK | MONTH

    const profileImgRef = useRef(null); // 프로필 input 클릭
    const certificateImgRef = useRef(null); // 자격증 및 기타서류 input 클릭
    const portfolioImgRef = useRef(null); // 포트폴리오 input 클릭
    const businessFileRef = useRef(null); // 사업자등록증 input 클릭

    // 시점 이동을 위한 ref
    const basicRef = useRef(null);
    const infoRef = useRef(null);
    const portfolioRef = useRef(null);
    const qaRef = useRef(null);

    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 전문가 카테고리 목록
    const expertCategoryList = [
        { categoryIdx: 25, name: "냉장고 수리" },
        { categoryIdx: 26, name: "식기세척기 수리" },
        { categoryIdx: 27, name: "인덕션 수리" },
        { categoryIdx: 28, name: "세탁기 수리" },
        { categoryIdx: 29, name: "에어컨 수리" },
        { categoryIdx: 30, name: "기타 전자제품 수리" },
        { categoryIdx: 32, name: "도어락 수리" },
        { categoryIdx: 33, name: "도어 수리" },
        { categoryIdx: 34, name: "방범창 수리" },
        { categoryIdx: 35, name: "방충망 수리" },
        { categoryIdx: 36, name: "샷시 수리" },
        { categoryIdx: 38, name: "싱크대 수리" },
        { categoryIdx: 39, name: "보일러 수리" },
        { categoryIdx: 40, name: "온수기 수리" },
        { categoryIdx: 41, name: "수도 관련 수리" },
        { categoryIdx: 42, name: "화장실 누수 수리" },
        { categoryIdx: 43, name: "전기배선 수리" },

        { categoryIdx: 46, name: "도어 시공" },
        { categoryIdx: 47, name: "중문 시공" },
        { categoryIdx: 48, name: "샷시 설치" },
        { categoryIdx: 49, name: "신발장 시공" },
        { categoryIdx: 50, name: "싱크대 교체" },
        { categoryIdx: 51, name: "욕실/화장실 리모델링" },
        { categoryIdx: 52, name: "주방 리모델링" },
        { categoryIdx: 53, name: "블라인드/커튼 시공" },
        { categoryIdx: 54, name: "줄눈 시공" },

        { categoryIdx: 56, name: "단열필름 시공" },
        { categoryIdx: 57, name: "도배 시공" },
        { categoryIdx: 58, name: "몰딩 시공" },
        { categoryIdx: 59, name: "방음 시공" },
        { categoryIdx: 60, name: "아트월 시공" },
        { categoryIdx: 61, name: "외풍차단/틈막이 시공" },
        { categoryIdx: 62, name: "유리필름/시트 시공" },
        { categoryIdx: 63, name: "인테리어필름 시공" },
        { categoryIdx: 64, name: "페인트 시공" },

        { categoryIdx: 66, name: "마루 보수" },
        { categoryIdx: 67, name: "마루 시공" },
        { categoryIdx: 68, name: "바닥재 시공" },
        { categoryIdx: 69, name: "에폭시바닥 시공" },
        { categoryIdx: 70, name: "장판 시공" },
        { categoryIdx: 71, name: "층간소음매트 시공" },
        { categoryIdx: 72, name: "카페트 시공" },
        { categoryIdx: 73, name: "타일 시공" },

        // depth 2
        { categoryIdx: 75, name: "컨설팅 전문가" },
    ];

    // 서비스 문자열 -> idx
    const convertServicesToIdxList = (services) => {
        return services
            .map((serviceName) => {
                const found = expertCategoryList.find((c) => c.name === serviceName);
                return found ? found.categoryIdx : null;
            })
            .filter(Boolean);
    };

    // Time 포멧팅
    const formatTimeForServer = (time) => {
        if (!time) return "";
        return time.length === 5 ? `${time}:00` : time; // HH:mm → HH:mm:00
    };

    // 전문가 상세 조회
    const getExpert = () => {
        console.log("실행");
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/profile/detail?username=${user.username}`)
            .then((res) => {
                console.log(res.data);
                setUser((prev) => {
                    if (!prev) return prev;
                    // 이미 같은 값이면 다시 세팅 안하도록 방지
                    if (prev.profile === res.data.profileImage) return prev;
                    return { ...prev, profile: res.data.profileImage };
                });
                setExpert(res.data);

                // 지역 세팅
                setAddress({ zonecode: res.data.zonecode, addr1: res.data.addr1 });

                // 외부링크 세팅
                const links = [res.data.externalLink1, res.data.externalLink2, res.data.externalLink3].filter(Boolean);
                setExternalLinks(links);

                // 제공서비스 세팅
                if (res.data.providedService) {
                    setProvidedServices(res.data.providedService);
                }

                // 경력 세팅
                if (res.data.careerList) {
                    setCareerList(res.data.careerList);
                }

                // 자격증및기타서류 이미지 세팅
                setCertificateImages(
                    [
                        res.data.certImage1
                            ? {
                                  url: res.data.certImage1,
                                  idx: res.data.certImageIdx1,
                                  isLocal: false,
                              }
                            : null,
                        res.data.certImage2
                            ? {
                                  url: res.data.certImage2,
                                  idx: res.data.certImageIdx2,
                                  isLocal: false,
                              }
                            : null,
                        res.data.certImage3
                            ? {
                                  url: res.data.certImage3,
                                  idx: res.data.certImageIdx3,
                                  isLocal: false,
                              }
                            : null,
                    ].filter(Boolean)
                );

                // 질문답변 세팅
                setQuestionAnswers([
                    res.data.questionAnswer1 ? res.data.questionAnswer1 : null,
                    res.data.questionAnswer2 ? res.data.questionAnswer2 : null,
                    res.data.questionAnswer3 ? res.data.questionAnswer3 : null,
                ]);

                // 포트폴리오 썸네일 세팅
                setPortfolioThumbnails(res.data.portfolioList?.map((p) => p.image1) || []);

                // 연락가능시간 세팅
                setStartTime(res.data.contactStartTime ? res.data.contactStartTime : "00:00:00");
                setEndTime(res.data.contactEndTime ? res.data.contactEndTime : "00:00:00");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 전문가 수정
    const modifyExpert = () => {
        const formData = new FormData();

        if (expert.introduction === "null" || expert.introduction === null) {
            alert("한 줄 소개를 입력해주세요");
            return;
        }

        if (expert.mainServiceIdx === null || expert.mainServiceIdx === 0) {
            alert("대표 서비스를 선택해주세요");
            return;
        }

        if (providedServices.length === 0) {
            alert("제공 서비스를 선택해주세요");
            return;
        }

        if (expert.providedServiceDesc === "null" || expert.providedServiceDesc === null) {
            alert("서비스 상세설명을 입력해주세요");
            return;
        }

        formData.append("expertIdx", expert.expertIdx);
        formData.append("activityName", expert.activityName);
        formData.append("introduction", expert.introduction);
        formData.append("mainServiceIdx", expert.mainServiceIdx);
        formData.append("zonecode", address.zonecode);
        formData.append("addr1", address.addr1);
        formData.append("addr2", expert.addr2);
        formData.append("employeeCount", expert.employeeCount);
        formData.append("contactStartTime", formatTimeForServer(startTime));
        formData.append("contactEndTime", formatTimeForServer(endTime));
        if (externalLinks[0] !== undefined) formData.append("externalLink1", externalLinks[0]);
        if (externalLinks[1] !== undefined) formData.append("externalLink2", externalLinks[1]);
        if (externalLinks[2] !== undefined) formData.append("externalLink3", externalLinks[2]);
        const serviceIdxString = convertServicesToIdxList(providedServices).join(",");
        formData.append("providedServiceIdx", serviceIdxString);
        formData.append("providedServiceDesc", expert.providedServiceDesc);
        if (questionAnswers[0] !== null) formData.append("questionAnswer1", questionAnswers[0]);
        if (questionAnswers[1] !== null) formData.append("questionAnswer2", questionAnswers[1]);
        if (questionAnswers[2] !== null) formData.append("questionAnswer3", questionAnswers[2]);

        // 이미지 - 프로필
        if (profileFile) {
            formData.append("profileImage", profileFile);
        }

        // 이미지 - 사업자등록증
        if (businessFile) {
            formData.append("businessImage", businessFile);
        }

        // 이미지 - 자격증 배열
        certificateFiles.forEach((file) => {
            formData.append("certificateImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/profile/modify", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    getExpert();
                    setModalMessage("수정되었습니다.");
                    setMessageModalOpen(true);
                    setTimeout(() => {
                        setMessageModalOpen(false);
                    }, 1500);
                }
            })
            .catch((err) => console.error(err));
    };

    // 포트폴리오 추가
    const submitPortfolio = () => {
        const formData = new FormData();

        formData.append("expertIdx", expert.expertIdx);
        formData.append("title", portfolio.title);
        formData.append("serviceIdx", portfolio.serviceIdx);
        formData.append("region", portfolio.region);
        formData.append("price", portfolio.price);
        formData.append("workTimeType", portfolio.workTimeType);
        formData.append("workTimeValue", portfolio.workTimeValue);
        formData.append("description", portfolio.description);

        // 파일 업로드
        portfolioFiles.forEach((file) => {
            formData.append("portfolioImages", file);
        });

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/portfolio/write", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setPortfolioThumbnails((prev) => [...prev, res.data]);
                    setIsModalOpen(false);
                }
            })
            .catch((err) => console.error(err));
    };

    // 포트폴리오 삭제
    const deletePortfolio = (portfolioIdx) => {
        myAxios(token, setToken)
            .post("http://localhost:8080" + "/portfolio/delete", {
                portfolioIdx: portfolioIdx,
            })
            .then(() => {})
            .catch((err) => console.error(err));
    };

    // 질문 답변 수정
    const modifyExpertQuestion = () => {
        myAxios(token, setToken).post(`${baseUrl}/expert/modifyQuestion`, {
            username: user.username,
            questionAnswers: questionAnswers,
        });
    };

    // 경력 추가
    const submitCareer = () => {
        const formData = new FormData();

        formData.append("expertIdx", expert.expertIdx);
        formData.append("title", career.title);
        formData.append("startDate", `${career.startDate}-01`);
        formData.append("endDate", `${career.endDate}-01`);
        formData.append("description", career.description);
        formData.append("months", diffInMonths(career.startDate, career.endDate));

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/career/write", formData)
            .then((res) => {
                if (res.data) {
                    setCareerList([...careerList, career]);
                    setIsModalOpen(false);
                }
            })
            .catch((err) => console.error(err));
    };

    // 경력 삭제
    const deleteCareer = (careerIdx) => {
        myAxios(token, setToken)
            .post("http://localhost:8080" + "/career/delete", {
                careerIdx: careerIdx,
            })
            .then(() => {})
            .catch((err) => console.error(err));
    };

    // 지역 목록
    const regions = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

    // 주소 이벤트
    const handleComplate = (data) => {
        let { zonecode, address } = data;
        setAddress({ zonecode: zonecode, addr1: address });
    };
    const handleClose = (state) => {
        if (state == "COMPLETE_CLOSE") setIsModalOpen(false);
    };

    // 현재 연도-월 구하기
    const getCurrentYearMonth = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`;
    };

    // 개월 수 차이 계산
    const diffInMonths = (start, end) => {
        const [sy, sm] = start.split("-").map(Number);
        const [ey, em] = end.split("-").map(Number);

        return (ey - sy) * 12 + (em - sm);
    };

    // 총 경력 계산
    const calcTotalCareer = (careerList) => {
        let totalMonths = 0;

        careerList.forEach((c) => {
            const start = c.startDate;
            const end = c.isCurrent ? getCurrentYearMonth() : c.endDate;

            if (!start || !end) return;

            totalMonths += diffInMonths(start, end);
        });

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        return { years, months };
    };
    const { years, months } = calcTotalCareer(careerList);

    useEffect(() => {
        if (!user) return;
        console.log("테스트");
        getExpert();
    }, [user?.username]);

    // 모달 안 데이터 초기화
    useEffect(() => {
        if (modalType === "포트폴리오") {
            setPortfolio({
                title: "",
                serviceIdx: expertCategoryList[0]?.categoryIdx || null,
                region: regions[0],
                price: "",
                workTimeType: "DAY",
                workTimeValue: "",
                description: "",
            });
            setPortfolioImages([]);
            setPortfolioFiles([]);
        } else if (modalType === "경력") {
            setCareer({
                title: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
                description: "",
            });
        }
    }, [modalType]);

    // 현재 위치에 따라 step 색상 변경
    useEffect(() => {
        const handleScroll = () => {
            const basicTop = basicRef.current?.offsetTop || 0;
            const infoTop = infoRef.current?.offsetTop || 0;
            const portfolioTop = portfolioRef.current?.offsetTop || 0;
            const qaTop = qaRef.current?.offsetTop || 0;

            const scrollY = window.scrollY + 200;
            const offset = 300;

            if (scrollY >= qaTop - offset) {
                setStep({ 1: false, 2: false, 3: false, 4: true });
            } else if (scrollY >= portfolioTop - offset) {
                setStep({ 1: false, 2: false, 3: true, 4: false });
            } else if (scrollY >= infoTop - offset) {
                setStep({ 1: false, 2: true, 3: false, 4: false });
            } else {
                setStep({ 1: true, 2: false, 3: false, 4: false });
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="expert-profile-wrapper">
            <h1 className="mypage-title">프로필 수정</h1>

            <div
                style={{
                    display: "flex",
                    gap: "100px",
                }}
            >
                <div className="step-icon-wrapper">
                    <p className={step[1] ? "step-icon-active" : "step-icon"} onClick={() => basicRef.current?.scrollIntoView({ behavior: "smooth" })}>
                        <span>1</span>
                        기본 정보
                    </p>
                    <p className={step[2] ? "step-icon-active" : "step-icon"} onClick={() => infoRef.current?.scrollIntoView({ behavior: "smooth" })}>
                        <span>2</span>
                        전문가 정보
                    </p>
                    <p className={step[3] ? "step-icon-active" : "step-icon"} onClick={() => portfolioRef.current?.scrollIntoView({ behavior: "smooth" })}>
                        <span>3</span>
                        포트폴리오
                    </p>
                    <p className={step[4] ? "step-icon-active" : "step-icon"} onClick={() => qaRef.current?.scrollIntoView({ behavior: "smooth" })}>
                        <span>4</span>
                        질문답변
                    </p>
                </div>

                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "44px",
                    }}
                >
                    <div ref={basicRef}>
                        <h3 className="mypage-sectionTitle">기본 정보</h3>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>프로필 이미지</label>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <img
                                    src={profileImage ? profileImage : expert.profileImage ? `http://localhost:8080/imageView?type=expert&filename=${expert.profileImage}` : "/default-profile.png"}
                                    width="72px"
                                    height="72px"
                                    style={{ borderRadius: "12px" }}
                                />
                                <input
                                    type="file"
                                    hidden
                                    ref={profileImgRef}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setProfileFile(file);
                                        setProfileImage(URL.createObjectURL(file));
                                    }}
                                />
                                <div style={{ display: "flex", gap: "4px" }}>
                                    <button className="secondary-button" style={{ width: "66px", height: "33px" }} onClick={() => profileImgRef.current.click()}>
                                        변경
                                    </button>
                                    <button
                                        className="secondary-button"
                                        style={{ width: "66px", height: "33px" }}
                                        onClick={() => {
                                            setProfileImage(null); // 미리보기 제거
                                            setExpert((prev) => ({ ...prev, profileImage: null })); // 서버 이미지 삭제
                                            setProfileFile(null); // 신규 업로드 파일 제거
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>전문가 활동명</label>
                            <Input value={expert.activityName} onChange={(e) => setExpert({ ...expert, activityName: e.target.value })} />
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>한 줄 소개</label>
                            <Input
                                value={expert.introduction === "null" || expert.introduction === null ? "" : expert.introduction}
                                type="textarea"
                                style={{ height: "72px" }}
                                onChange={(e) => setExpert({ ...expert, introduction: e.target.value })}
                            />
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>대표 서비스</label>
                            <Input
                                type="select"
                                style={{ width: "200px", height: "37px" }}
                                value={expert.mainServiceIdx || ""}
                                onChange={(e) =>
                                    setExpert((prev) => ({
                                        ...prev,
                                        mainServiceIdx: Number(e.target.value),
                                    }))
                                }
                            >
                                <option value={0}>서비스 선택</option>
                                {expertCategoryList.map((c) => (
                                    <option key={c.categoryIdx} value={c.categoryIdx}>
                                        {c.name}
                                    </option>
                                ))}
                            </Input>
                        </div>
                        <div className="labelInput-wrapper" style={{ padding: "8px 0", borderBottom: "none" }}>
                            <label style={{ width: "160px" }}>우편번호</label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "40px",
                                }}
                            >
                                <p>{address.zonecode}</p>
                                <button
                                    className="secondary-button"
                                    style={{ width: "100px", height: "33px" }}
                                    onClick={() => {
                                        setModalType("주소");
                                        setIsModalOpen(true);
                                    }}
                                >
                                    우편번호 검색
                                </button>
                            </div>
                        </div>
                        <div className="labelInput-wrapper" style={{ borderBottom: "none" }}>
                            <label style={{ width: "160px" }}>도로명 주소</label>
                            <p>{address.addr1}</p>
                        </div>
                        <div className="labelInput-wrapper" style={{ padding: "8px 0 16px 0" }}>
                            <label style={{ width: "160px" }}>상세 주소</label>
                            <Input value={expert.addr2} onChange={(e) => setExpert({ ...expert, addr2: e.target.value })} />
                            <span
                                style={{
                                    color: "#A0A0A0",
                                    fontSize: "12px",
                                    fontWeight: "400",
                                    marginLeft: "10px",
                                }}
                            >
                                {" "}
                                입력하신 주소는 시/구 단위까지만 공개됩니다.
                            </span>
                        </div>
                    </div>

                    <div ref={infoRef}>
                        <h3 className="mypage-sectionTitle">전문가 정보</h3>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>직원수</label>
                            <Input type="number" value={expert.employeeCount} onChange={(e) => setExpert({ ...expert, employeeCount: e.target.value })} />
                        </div>
                        <div className="labelInput-wrapper time">
                            <label style={{ width: "160px" }}>연락가능시간</label>
                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                            <span>~</span>
                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>외부링크</label>
                            <div className="add">
                                <div className="expert-profile-add-input">
                                    <Input value={externalLinkInput} onChange={(e) => setExternalLinkInput(e.target.value)} />
                                    <button
                                        className="secondary-button"
                                        style={{ width: "66px", height: "37px" }}
                                        onClick={() => {
                                            if (!externalLinkInput.trim()) return;

                                            setExternalLinks((prev) => [...prev, externalLinkInput.trim()]);
                                            setExternalLinkInput("");
                                        }}
                                        disabled={externalLinks.length >= 3}
                                    >
                                        추가
                                    </button>
                                </div>
                                <div className="expert-profile-add-wrapper">
                                    {externalLinks.map((link) => (
                                        <div key={link}>
                                            <p>{link}</p>
                                            <button
                                                className="secondary-button"
                                                style={{ width: "66px", height: "33px" }}
                                                onClick={() => {
                                                    setExternalLinks((prev) => prev.filter((l) => l !== link));
                                                }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ minWidth: "160px" }}>제공 서비스</label>
                            <div className="add">
                                <div className="expert-profile-add-input">
                                    <Input
                                        type="select"
                                        style={{ width: "348px", height: "37px" }}
                                        value={serviceSelect}
                                        onChange={(e) => {
                                            console.log(e);
                                            setServiceSelect(e.target.value);
                                        }}
                                        required
                                    >
                                        <option value="">서비스 선택</option>
                                        {expertCategoryList.map((c) => (
                                            <option key={c.categoryIdx} value={c.name}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </Input>
                                    <button
                                        className="secondary-button"
                                        style={{ width: "66px", height: "37px" }}
                                        onClick={() => {
                                            if (!serviceSelect) return;

                                            // 중복 방지
                                            if (providedServices.includes(serviceSelect)) return;

                                            setProvidedServices((prev) => [...prev, serviceSelect]);
                                            setServiceSelect("");
                                        }}
                                    >
                                        추가
                                    </button>
                                </div>
                                <div className="expert-profile-chip-wrapper">
                                    {providedServices?.map((service) => (
                                        <span className="expert-profile-chip" key={service}>
                                            {service}
                                            <i class="bi bi-x-circle" onClick={() => setProvidedServices((prev) => prev.filter((item) => item !== service))}></i>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>경력</label>
                            <div className="add">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "20px",
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "#FF5833",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {years === 0 ? (months === 0 ? "경력 없음" : `총 경력 ${months}개월`) : `총 경력 ${years}년 ${months}개월`}
                                    </span>
                                    <button
                                        className="secondary-button"
                                        style={{ width: "66px", height: "37px" }}
                                        onClick={() => {
                                            setModalType("경력");
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        추가
                                    </button>
                                </div>
                                <div className="expert-profile-card-wrapper">
                                    {careerList?.map((career) => (
                                        <div className="expert-profile-careerCard" key={career.careerIdx}>
                                            <div>
                                                <span
                                                    style={{
                                                        fontWeight: "500",
                                                        marginBottom: "6px",
                                                        color: "#303441",
                                                    }}
                                                >
                                                    {career.title}
                                                </span>
                                                <span>
                                                    {career.startDate} - {career.endDate}
                                                </span>
                                                <span>{career.description}</span>
                                            </div>
                                            <button
                                                className="secondary-button"
                                                style={{ width: "66px", height: "33px" }}
                                                onClick={() => {
                                                    deleteCareer(career.careerIdx);
                                                    setCareerList((prev) => prev.filter((c) => c.careerIdx !== career.careerIdx));
                                                }}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>서비스 상세설명</label>
                            <Input
                                value={expert.providedServiceDesc === "null" || expert.providedServiceDesc === null ? "" : expert.providedServiceDesc}
                                type="textarea"
                                style={{ height: "158px" }}
                                onChange={(e) => setExpert({ ...expert, providedServiceDesc: e.target.value })}
                            />
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>자격증 및 기타서류</label>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
                                <button
                                    className="secondary-button"
                                    style={{ width: "66px", height: "37px" }}
                                    onClick={() => {
                                        certificateImgRef.current.click();
                                    }}
                                >
                                    추가
                                </button>
                                <input
                                    type="file"
                                    hidden
                                    ref={certificateImgRef}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const localUrl = URL.createObjectURL(file);

                                        setCertificateImages((prev) => [...prev, { url: localUrl, idx: null, isLocal: true }]);

                                        setCertificateFiles((prev) => [...prev, file]);
                                    }}
                                />
                                {certificateImages.length !== 0 && (
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        {certificateImages?.map((certificate, idx) => (
                                            <div style={{ position: "relative" }}>
                                                <img
                                                    key={idx}
                                                    src={certificate.isLocal ? certificate.url : `http://localhost:8080/imageView?type=expert&filename=${certificate.url}`}
                                                    width="120px"
                                                    height="175px"
                                                    style={{ borderRadius: "8px" }}
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
                                                        setCertificateImages((prev) => {
                                                            const newArr = prev.filter((_, i) => i !== idx); // idx 삭제
                                                            return [...newArr]; // 자동으로 앞으로 땡겨짐
                                                        });
                                                        setCertificateFiles((prev) => {
                                                            const newArr = prev.filter((_, i) => i !== idx); // 같은 idx 삭제
                                                            return [...newArr];
                                                        });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="labelInput-wrapper">
                            <label style={{ width: "160px" }}>사업자등록증</label>
                            <div style={{ position: "relative" }}>
                                <img
                                    src={
                                        businessImage
                                            ? businessImage
                                            : expert.businessLicensePdf
                                            ? `http://localhost:8080/imageView?type=expert&filename=${expert.businessLicensePdf}`
                                            : "/default-businessFile.png"
                                    }
                                    width="120px"
                                    height="175px"
                                    style={{ borderRadius: "8px" }}
                                    onClick={() => businessFileRef.current.click()}
                                />
                                {(businessImage || expert.businessLicensePdf) && (
                                    <i
                                        class="bi bi-x-circle-fill"
                                        style={{
                                            fontSize: "20px",
                                            width: "20px",
                                            height: "16px",
                                            position: "absolute",
                                            top: "-4px",
                                            right: "-4px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setBusinessImage(null); // 미리보기 제거
                                            setExpert((prev) => ({
                                                ...prev,
                                                businessLicensePdf: null,
                                            })); // 서버 이미지 삭제
                                            setBusinessFile(null);
                                        }}
                                    />
                                )}
                            </div>
                            <input
                                type="file"
                                hidden
                                ref={businessFileRef}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setBusinessFile(file);
                                    setBusinessImage(URL.createObjectURL(file));
                                }}
                            />
                        </div>
                    </div>
                    <div ref={portfolioRef}>
                        <h3 className="mypage-sectionTitle">포트폴리오</h3>
                        <div className="labelInput-wrapper">
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
                                <button
                                    className="secondary-button"
                                    style={{ width: "66px", height: "37px" }}
                                    onClick={() => {
                                        setModalType("포트폴리오");
                                        setIsModalOpen(true);
                                    }}
                                >
                                    추가
                                </button>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    {portfolioThumbnails?.map((thumb, idx) => (
                                        <img key={idx} src={`http://localhost:8080/imageView?type=expert&filename=${thumb}`} width="150px" height="150px" style={{ borderRadius: "8px" }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={qaRef}>
                        <h3 className="mypage-sectionTitle">질문답변</h3>
                        <div className="labelInput-wrapper">
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                }}
                            >
                                <button
                                    className="secondary-button"
                                    style={{ width: "66px", height: "37px" }}
                                    onClick={() => {
                                        setModalType("질문");
                                        setIsModalOpen(true);
                                    }}
                                >
                                    수정
                                </button>
                                {(questionAnswers[0] || questionAnswers[1] || questionAnswers[2]) && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "30px",
                                        }}
                                    >
                                        {questionAnswers[0] && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "10px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: "0",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    서비스가 시작되기 전 어떤 절차로 진행하나요?
                                                </p>
                                                <p
                                                    style={{
                                                        margin: "0",
                                                        color: "#6A7685",
                                                        lineHeight: "22px",
                                                        width: "424px",
                                                    }}
                                                >
                                                    {questionAnswers[0]}
                                                </p>
                                            </div>
                                        )}
                                        {questionAnswers[1] && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "10px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: "0",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    서비스의 견적은 어떤 방식으로 산정 되나요?
                                                </p>
                                                <p
                                                    style={{
                                                        margin: "0",
                                                        color: "#6A7685",
                                                        lineHeight: "22px",
                                                        width: "424px",
                                                    }}
                                                >
                                                    {questionAnswers[1]}
                                                </p>
                                            </div>
                                        )}
                                        {questionAnswers[2] && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "10px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: "0",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    A/S 또는 환불 규정은 어떻게 되나요?
                                                </p>
                                                <p
                                                    style={{
                                                        margin: "0",
                                                        color: "#6A7685",
                                                        lineHeight: "22px",
                                                        width: "424px",
                                                    }}
                                                >
                                                    {questionAnswers[2]}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <button className="primary-button" style={{ width: "200px", height: "40px", fontSize: "14px" }} onClick={() => modifyExpert()}>
                            완료
                        </button>
                    </div>
                </div>
            </div>

            {modalType === "주소" && (
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
                    <ModalBody>
                        <DaumPostcode onComplete={handleComplate} onClose={handleClose} />
                    </ModalBody>
                </Modal>
            )}

            {modalType === "경력" && (
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "460px" }}>
                    <ModalHeader toggle={() => setIsModalOpen(false)}>경력 추가</ModalHeader>
                    <ModalBody>
                        <div className="label-wrapper">
                            <label>
                                경력 타이틀
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <Input placeholder="ex) 회사명" onChange={(e) => setCareer({ ...career, title: e.target.value })} />
                        </div>
                        <div className="label-wrapper">
                            <label>
                                시작 연월
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <Input type="month" onChange={(e) => setCareer({ ...career, startDate: e.target.value })} />
                        </div>
                        <div className="label-wrapper">
                            <label>
                                종료 연월
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                <Input
                                    type="checkbox"
                                    style={{ width: "18px", height: "18px" }}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setCareer((prev) => ({
                                                ...prev,
                                                isCurrent: true,
                                                endDate: getCurrentYearMonth(),
                                            }));
                                        } else {
                                            setCareer((prev) => ({
                                                ...prev,
                                                isCurrent: false,
                                                endDate: "",
                                            }));
                                        }
                                    }}
                                />
                                <span
                                    style={{
                                        color: "#6D758F",
                                        fontSize: "13px",
                                        fontWeight: "400",
                                    }}
                                >
                                    현재 진행 중
                                </span>
                            </div>
                            <Input type="month" disabled={career.isCurrent} value={career.endDate} onChange={(e) => setCareer({ ...career, endDate: e.target.value })} />
                        </div>
                        <div className="label-wrapper">
                            <label>상세 설명</label>
                            <Input type="textarea" placeholder="해당 경력에 대한 상세한 설명을 작성해주세요." onChange={(e) => setCareer({ ...career, description: e.target.value })} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="primary-button" style={{ width: "100%", height: "40px", fontSize: "14px" }} onClick={() => submitCareer()}>
                            경력 추가하기
                        </button>
                    </ModalFooter>
                </Modal>
            )}
            {modalType === "포트폴리오" && (
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "460px" }}>
                    <ModalHeader toggle={() => setIsModalOpen(false)}>포트폴리오 작성</ModalHeader>
                    <ModalBody>
                        <div className="label-wrapper">
                            <label>
                                제목
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <Input placeholder="포트폴리오 제목을 작성해주세요" onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })} />
                        </div>
                        <div className="label-wrapper">
                            <label>
                                서비스 종류
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <Input
                                type="select"
                                style={{ height: "37px", fontSize: "14px" }}
                                onChange={(e) =>
                                    setPortfolio((prev) => ({
                                        ...prev,
                                        serviceIdx: Number(e.target.value),
                                    }))
                                }
                            >
                                {expertCategoryList.map((c) => (
                                    <option key={c.categoryIdx} value={c.categoryIdx}>
                                        {c.name}
                                    </option>
                                ))}
                            </Input>
                        </div>
                        <div className="label-wrapper">
                            <label>
                                지역
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <Input type="select" style={{ height: "37px", fontSize: "14px" }} onChange={(e) => setPortfolio((prev) => ({ ...prev, region: e.target.value }))}>
                                {regions.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </Input>
                        </div>
                        <div className="label-wrapper">
                            <label>
                                서비스 금액
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <Input
                                placeholder="서비스 금액을 입력해 주세요"
                                onChange={(e) =>
                                    setPortfolio((prev) => ({
                                        ...prev,
                                        price: Number(e.target.value),
                                    }))
                                }
                            />
                        </div>
                        <div className="label-wrapper">
                            <label>
                                작업 기간
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <div>
                                <div className="mypage-chipList" style={{ paddingTop: "8px" }}>
                                    <div
                                        className={durationUnitChip === "HOUR" ? "isActive" : ""}
                                        onClick={() => {
                                            setDurationUnitChip("HOUR");
                                            setPortfolio((prev) => ({
                                                ...prev,
                                                workTimeType: "HOUR",
                                            }));
                                        }}
                                    >
                                        시간
                                    </div>
                                    <div
                                        className={durationUnitChip === "DAY" ? "isActive" : ""}
                                        onClick={() => {
                                            setDurationUnitChip("DAY");
                                            setPortfolio((prev) => ({
                                                ...prev,
                                                workTimeType: "DAY",
                                            }));
                                        }}
                                    >
                                        일
                                    </div>
                                    <div
                                        className={durationUnitChip === "WEEK" ? "isActive" : ""}
                                        onClick={() => {
                                            setDurationUnitChip("WEEK");
                                            setPortfolio((prev) => ({
                                                ...prev,
                                                workTimeType: "WEEK",
                                            }));
                                        }}
                                    >
                                        주
                                    </div>
                                    <div
                                        className={durationUnitChip === "MONTH" ? "isActive" : ""}
                                        onClick={() => {
                                            setDurationUnitChip("MONTH");
                                            setPortfolio((prev) => ({
                                                ...prev,
                                                workTimeType: "MONTH",
                                            }));
                                        }}
                                    >
                                        개월
                                    </div>
                                </div>
                                <Input
                                    placeholder="작업기간을 입력해주세요"
                                    onChange={(e) =>
                                        setPortfolio((prev) => ({
                                            ...prev,
                                            workTimeValue: Number(e.target.value),
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="label-wrapper">
                            <label>상세 설명</label>
                            <Input type="textarea" placeholder="해당 작업에 대한 상세한 설명을 작성해주세요." onChange={(e) => setPortfolio({ ...portfolio, description: e.target.value })} />
                        </div>
                        <div className="label-wrapper">
                            <label>
                                사진 첨부
                                <span
                                    style={{
                                        color: "#F21724",
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        marginLeft: "2px",
                                    }}
                                >
                                    *
                                </span>
                            </label>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                }}
                            >
                                {portfolioImages.map((portfolioImage, idx) => (
                                    <div style={{ position: "relative" }}>
                                        <img key={idx} src={portfolioImage} width="60px" height="60px" />
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
                                                setPortfolioImages((prev) => prev.filter((_, i) => i !== idx));
                                                setPortfolioFiles((prev) => prev.filter((_, i) => i !== idx));
                                            }}
                                        />
                                    </div>
                                ))}
                                {portfolioImages.length < 3 && (
                                    <div
                                        onClick={() => portfolioImgRef.current.click()}
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
                                        <input
                                            type="file"
                                            hidden
                                            ref={portfolioImgRef}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                setPortfolioImages((prev) => [...prev, URL.createObjectURL(file)]);
                                                setPortfolioFiles((prev) => [...prev, file]);
                                            }}
                                        />
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
                                submitPortfolio();
                            }}
                        >
                            포트폴리오 등록하기
                        </button>
                    </ModalFooter>
                </Modal>
            )}
            {modalType === "질문" && (
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)} className="mypage-modal" style={{ width: "460px" }}>
                    <ModalHeader toggle={() => setIsModalOpen(false)}>질문답변 등록</ModalHeader>
                    <ModalBody>
                        <div className="label-wrapper">
                            <label>서비스가 시작되기 전 어떤 절차로 진행하나요?</label>
                            <Input
                                type="textarea"
                                placeholder="상담,예약, 서비스 진행, 대금 납부까지 어떻게 진행하는지 자세히 적어주세요."
                                style={{ height: "100px" }}
                                value={questionAnswers[0]}
                                onChange={(e) =>
                                    setQuestionAnswers((prev) => {
                                        const copy = [...prev];
                                        copy[0] = e.target.value;
                                        return copy;
                                    })
                                }
                            />
                        </div>
                        <div className="label-wrapper">
                            <label>서비스의 견적은 어떤 방식으로 산정 되나요?</label>
                            <Input
                                type="textarea"
                                placeholder="답변을 추가해주세요."
                                style={{ height: "100px" }}
                                value={questionAnswers[1]}
                                onChange={(e) =>
                                    setQuestionAnswers((prev) => {
                                        const copy = [...prev];
                                        copy[1] = e.target.value;
                                        return copy;
                                    })
                                }
                            />
                        </div>
                        <div className="label-wrapper">
                            <label>A/S 또는 환불 규정은 어떻게 되나요?</label>
                            <Input
                                type="textarea"
                                placeholder="답변을 추가해주세요."
                                style={{ height: "100px" }}
                                value={questionAnswers[2]}
                                onChange={(e) =>
                                    setQuestionAnswers((prev) => {
                                        const copy = [...prev];
                                        copy[2] = e.target.value;
                                        return copy;
                                    })
                                }
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="primary-button"
                            style={{ width: "100%", height: "40px", fontSize: "14px" }}
                            onClick={() => {
                                setIsModalOpen(false);
                                modifyExpertQuestion();
                            }}
                        >
                            질문답변 등록하기
                        </button>
                    </ModalFooter>
                </Modal>
            )}

            {/* 알림 모달창 */}
            <Modal isOpen={messageModalOpen} className="mypage-modal" style={{ width: "380px" }}>
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
    );
}
