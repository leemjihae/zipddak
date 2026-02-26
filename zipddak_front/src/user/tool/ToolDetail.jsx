import "../css/ToolDetail.css";
import { Heart, Share2, CircleAlert, MessageCircle, Dot, ArrowRight, ArrowLeft, Package, Rocket, UserRound } from "lucide-react";
import { Button, Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, Input } from "reactstrap";
import { Tool } from "../../main/component/Tool";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { useEffect, useState, useRef } from "react";
import { myAxios, baseUrl } from "../../config";
import { useNavigate, useParams } from "react-router-dom";

export default function ToolDetail() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const { toolIdx } = useParams();

    const [tool, setTool] = useState(null);
    const navigate = useNavigate();

    const [ownerTool, setOwnerTool] = useState();
    const [ownerCnt, setOwnerCnt] = useState();

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    // const [deleteModal, setDeleteModal] = useState(false);
    // const deleteToggle = () => setDeleteModal(!deleteModal);

    const mapContainer = useRef(null);
    const map = useRef(null);

    //스크롤 탑
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    //공구 상세
    const getTool = () => {
        const params = {
            toolIdx: toolIdx,
            username: user.username,
        };

        token &&
            myAxios(token, setToken)
                .get(`/tool/detail`, { params })
                .then((res) => {
                    console.log(res.data);
                    setTool(res.data);

                    const ownerParam = {
                        username: user.username,
                        owner: res.data.owner,
                        toolIdx: toolIdx,
                    };

                    return myAxios(token, setToken).get(`/tool/owner`, {
                        params: ownerParam,
                    });
                })
                .then((res) => {
                    console.log(res.data);
                    setOwnerTool(res.data.cards);
                    setOwnerCnt(res.data.totalCount);
                })
                .catch((err) => {
                    console.log(err);
                });
    };

    useEffect(() => {
        if (toolIdx && token) {
            getTool();
            favoriteTool(toolIdx);
        }
    }, [toolIdx, token, user]);


    //유저 프로필
    const ownerAddress = tool?.ownerAddr ? tool.ownerAddr.split(' ').slice(0, 2).join(' ') : '';

    //바로 대여
    const directApply = () => {
        console.log("toolIdx:", toolIdx);
        navigate(`/zipddak/tool/apply/${toolIdx}`);
    };

    //이미지
    const images = [tool?.img0, tool?.img1, tool?.img2, tool?.img3, tool?.img4].filter(Boolean);

    //탭
    const tab1 = "tab1";
    const tab2 = "tab2";
    const [activeTab, setActiveTab] = useState(tab1);
    const tabHandler = (tab) => {
        console.log(tab);
        setActiveTab(tab);
    };

    //리뷰
    const [reviews, setReviews] = useState([]);
    const [reviewPage, setReviewPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({
        curPage: 1,
        allPage: 0,
    });

    const [activeOrder, setActiveOrder] = useState(0);

    const toolReview = (page = 1) => {
        const tokenParam = token ? token : null;
        console.log(activeOrder);

        myAxios(tokenParam, setToken)
            .get(`/tool/review?toolIdx=${toolIdx}&page=${page}&orderNo=${activeOrder}`)

            .then((res) => {
                console.log(res.data);
                setReviews(res.data.reviews); // 해당 페이지 리뷰만 저장
                setReviewPage(page);
                setPageInfo({
                    curPage: page,
                    allPage: Math.ceil(res.data.totalCount / 5), // 5 = 한 페이지 리뷰 수
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (activeTab === tab2) {
            toolReview(1);
        }
    }, [activeOrder, activeTab]);

    // 관심 표시
    const [toolFavorite, setToolFavorite] = useState(false);

    const favoriteTool = (idx) => {
        token &&
            myAxios(token, setToken)
                .get(`${baseUrl}/main/heartTool`, {
                    params: {
                        toolIdx: idx,
                        username: user.username,
                    },
                })
                .then((res) => {
                    console.log("favorite", res.data);
                    setToolFavorite(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
    };

    // 관심 토글
    const toggleFavoriteTool = async (toolIdx) => {
        if (user.username === "") {
            navigate("/zipddak/login");
            return;
        }
        await myAxios(token, setToken).post(`${baseUrl}/user/favoriteToggle/tool`, {
            toolIdx,
            username: user.username,
        });

        setToolFavorite((prev) => !prev);
    };

    //tool삭제
    const deleteTool = async () => {
        myAxios(token, setToken).post(`/tool/delete`, {
            toolIdx: tool.toolIdx,
            username: user.username,
        });

    };

    //tool신고
    const reportTool = () => {
        myAxios(token, setToken).post(`${baseUrl}/user/reportTool`, {
            username: user.username,
            toolIdx: tool.toolIdx,
            reason: reportReason,
        });
    };

    //tool공유
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const url = window.location.href; // 현재 페이지 URL
        navigator.clipboard.writeText(url)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // 2초 후 상태 초기화
            })
            .catch(err => {
                console.error("복사 실패:", err);
            });
    };

    //tool지도
    useEffect(() => {
        if (!window.kakao || !tool || !tool.tradeAddr1) return;

        const geocoder = new window.kakao.maps.services.Geocoder();

        // 주소 → 좌표 변환
        geocoder.addressSearch(tool.tradeAddr1, (result, status) => {
            if (status !== window.kakao.maps.services.Status.OK) return;

            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            // 지도 생성
            map.current = new window.kakao.maps.Map(mapContainer.current, {
                center: coords,
                level: 1,
            });

            // 마커 이미지 설정
            const imageSrc =
                // "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                "/zipddak_pin.png",
                imageSize = new window.kakao.maps.Size(64, 69),
                imageOption = { offset: new window.kakao.maps.Point(27, 69) };

            const markerImage = new window.kakao.maps.MarkerImage(
                imageSrc,
                imageSize,
                imageOption
            );

            const marker = new window.kakao.maps.Marker({
                position: coords,
                image: markerImage,
            });
            marker.setMap(map.current);

            // 커스텀 오버레이
            const content = `<div class="customoverlay">
        <a href="https://map.kakao.com/link/map/${result[0].y},${result[0].x}" target="_blank">
          <span class="title"></span>
        </a>
      </div>`;

            const customOverlay = new window.kakao.maps.CustomOverlay({
                map: map.current,
                position: coords,
                content,
                yAnchor: 1,
            });
        });
    }, [tool]);



    if (!tool) {
        return <div>로딩중...</div>;
    }

    return (
        <>
            <div className="detail-container">
                <div className="d-info">
                    <div className="d-top">
                        <div className="top-icons">
                            {copied && <div style={{ marginTop: "8px", color: "gray", fontFamily:"Pretendard Variable", fontWeight:"500"}}>URL 복사됨!</div>}
                            <Share2 onClick={handleCopy} style={{ cursor: "pointer" }} />
                            
                            <button onClick={() => toggleFavoriteTool(tool.toolIdx)} style={{ cursor: "pointer", backgroundColor: "transparent", border: "none" }}>
                                {toolFavorite ? <Heart fill="#ff5833" stroke="#ff5833" /> : <Heart stroke="#999" />}
                            </button>
                            
                            <CircleAlert onClick={toggle} style={{ cursor: "pointer" }} />
                        </div>
                    </div>

                    <div className="d-info-box">
                        <div className="d-tool-image">
                             {tool.thunbnail?
                <img src={`http://localhost:8080/imageView?type=tool&filename=${tool.thunbnail}`} alt="공구" />
                :
                <img src="/zipddak_no_img.png"/>
                }
                        </div>
                        <div className="d-infos">
                            <div className="infomation">
                                <div className="d-point">
                                    <div className="d-points">
                                        {/* <div className="points">{tool.categoryName}</div> */}
                                        {tool.quickRental && <div className="points">바로대여</div>}
                                        {tool.postRental && <div className="points">택배거래</div>}
                                        {tool.directRental && <div className="points">직거래</div>}
                                    </div>
                                    <span className="createdate">{tool.createdate}</span>
                                </div>

                                <div className="d-option">
                                    <span className="ca">{tool.categoryName}</span>
                                    <span className="na">{tool.name}</span>


                                    <div className="d-price">
                                        {tool.freeRental? (
                                            <span className="dt orange">무료대여</span>
                                        ) : (
                                            <>
                                                <span className="od">1일</span>
                                                <span className="tp">{tool.rentalPrice.toLocaleString()}</span>
                                                <span className="tp">원</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="d-price">
                                        {tool.postCharge == null || tool.postCharge == 0 ? (
                                            <>
                                                <Package />
                                                <span className="dt orange">무료배송</span>
                                            </>
                                        ) : (
                                            <>
                                                <Package />
                                                <span className="dt">배송비</span>
                                                <span className="dt">{tool.postCharge.toLocaleString()}</span>
                                                <span className="dt">원</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="short-info">

                                    <div className="d-ectInfo" style={{ justifyContent: "flex-start" }}>
                                        {/* <div className="ic">
                                            <Heart size={18} />
                                            {tool.favoriteCount}
                                        </div> */}
                                        <Dot />
                                        <div className="ic">
                                            {/* <MessageCircle size={18} /> */}
                                            <span>이 공구의 대여 횟수</span>
                                            {tool.rentalCount}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {user.username != tool.owner &&
                            <div className="rentalBtn">
                                {tool.quickRental && (
                                    <Button className="tertiary-button long-button" onClick={directApply}>
                                        <Rocket size={18} />
                                        <span>바로대여</span>
                                    </Button>
                                )}
                                <Button className="primary-button long-button">
                                    <MessageCircle size={18} />
                                    <span>대여문의</span>
                                </Button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="row-cm ownerOnly">
                    <div className="d-user">
                        {tool.ownerProfile != null ? (
                            <div className="profileImage">
                                <img src={`http://localhost:8080/imageView?type=profile&filename=${tool.ownerProfile}`} alt="유저" />
                            </div>
                        ) : (
                            <div className="profile-img">
                                <UserRound color="#303441" />
                            </div>
                        )}

                        <div className="userInfo">
                            <span className="nick">{tool.nickname}</span>
                            <span className="loca">{ownerAddress}</span>
                        </div>
                    </div>
                </div>

                <div className="d-tab-nav">
                    <div className={activeTab === tab1 ? "d-nav active" : "d-nav"} onClick={() => tabHandler(tab1)}>
                        공구상세
                    </div>
                    <div
                        className={activeTab === tab2 ? "d-nav active" : "d-nav"}
                        onClick={() => {
                            tabHandler(tab2);
                            toolReview();
                        }}
                    >
                        리뷰
                    </div>

                    {user.username == tool.owner && (
                        <div className="row-cm editTool">
                            <div className="createdate" onClick={() => navigate(`/zipddak/tool/modify/${toolIdx}`)}>수정</div>
                            <div className="createdate" onClick={deleteTool}>
                                삭제
                            </div>
                        </div>
                    )}
                </div>

                {activeTab == tab1 && (
                    <div className="d-tab">
                        {images.length > 0 &&
                            <>
                                <div className="de-label">상세이미지</div>

                                <div className="detailImage">
                                    {images.length > 0 &&
                                        images.map((imgFile, index) => (
                                            <div className="dimgs" key={index}>
                                                <img src={`http://localhost:8080/imageView?type=tool&filename=${imgFile}`} alt={`공구`} />
                                            </div>
                                        ))}
                                </div>

                                <div className="line"></div>
                            </>
                        }
                        <div className="de-two">
                            <div className="de-three">
                                <div className="de-label">상세설명</div>
                                <div className="de-content-box" style={{ whiteSpace: "pre-wrap" }}>
                                    {tool.content}</div>
                            </div>
                            {tool.tradeAddr1 &&
                                <div className="de-favlocation">
                                    <div className="de-map">
                                        <div
                                            ref={mapContainer}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </div>

                                    <div className="mapinfo">
                                        <span className="map-label">거래 희망장소</span>
                                        <span>{tool.tradeAddr1}</span>
                                        <div>{tool.tradeAddr2}</div>
                                    </div>

                                </div>
                            }
                        </div>

                        {Array.isArray(ownerTool) && ownerTool.length > 0 &&
                        <>
                        <div className="line"></div>
                        <div className="moreTool">
                            <span className="de-label">'{tool.nickname}' 의 다른 공구</span>
                            <div className="morecards">{Array.isArray(ownerTool) && ownerTool.slice(0, 6).map((toolCard) => <Tool key={toolCard.toolIdx} tool={toolCard} />)}</div>
                        </div>
                        </>}
                    </div>
                )}

                <Modal className="ask-modal-box" isOpen={modal} toggle={toggle}>
                    <ModalHeader style={{ border: "none", paddingBottom: "0" }} toggle={toggle}>
                        <span className="ask-title">신고하기</span>
                    </ModalHeader>
                    <div className="ask-modal-body">
                        <div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "20px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Input
                                        value="COMMENT_REPORT_ABUSE "
                                        onChange={(e) => setReportReason(e.target.value)}
                                        type="radio"
                                        name="reason"
                                        id="COMMENT_REPORT_ABUSE "
                                        style={{ marginRight: "20px" }}
                                    />{" "}
                                    <label htmlFor="COMMENT_REPORT_ABUSE " className="font-14">
                                        욕설 / 비하
                                    </label>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Input
                                        value="COMMENT_REPORT_AD "
                                        onChange={(e) => setReportReason(e.target.value)}
                                        type="radio"
                                        name="reason"
                                        id="COMMENT_REPORT_AD "
                                        style={{ marginRight: "20px" }}
                                    />{" "}
                                    <label htmlFor="COMMENT_REPORT_AD " className="font-14">
                                        광고 / 홍보
                                    </label>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Input
                                        value="COMMENT_REPORT_ILLEGAL "
                                        onChange={(e) => setReportReason(e.target.value)}
                                        type="radio"
                                        name="reason"
                                        id="COMMENT_REPORT_ILLEGAL "
                                        style={{ marginRight: "20px" }}
                                    />{" "}
                                    <label htmlFor="COMMENT_REPORT_ILLEGAL " className="font-14">
                                        음란 / 불법 콘텐츠
                                    </label>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Input
                                        value="COMMENT_REPORT_POLITICAL "
                                        onChange={(e) => setReportReason(e.target.value)}
                                        type="radio"
                                        name="reason"
                                        id="COMMENT_REPORT_POLITICAL "
                                        style={{ marginRight: "20px" }}
                                    />{" "}
                                    <label htmlFor="COMMENT_REPORT_POLITICAL " className="font-14">
                                        정치적 / 사회적 논쟁 유도
                                    </label>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Input
                                        value="COMMENT_REPORT_PRIVACY "
                                        onChange={(e) => setReportReason(e.target.value)}
                                        type="radio"
                                        name="reason"
                                        id="COMMENT_REPORT_PRIVACY "
                                        style={{ marginRight: "20px" }}
                                    />{" "}
                                    <label htmlFor="COMMENT_REPORT_PRIVACY " className="font-14">
                                        개인정보 유출
                                    </label>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Input
                                        value="COMMENT_REPORT_OTHER "
                                        onChange={(e) => setReportReason(e.target.value)}
                                        type="radio"
                                        name="reason"
                                        id="COMMENT_REPORT_OTHER "
                                        style={{ marginRight: "20px" }}
                                    />{" "}
                                    <label htmlFor="COMMENT_REPORT_OTHER " className="font-14">
                                        기타 부적절한 내용
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
                                        toggle();
                                    }}
                                >
                                    신고하기
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* ------------------------------------------------- */}

                {activeTab == tab2 && (
                    <div className="d-tab review">
                        <div className="de-label">이 공구의 리뷰</div>

                        <div className="mypage-chipList">
                            <div className={activeOrder === 0 ? "mypage-chipList isActive" : "mypage-chipList"} onClick={() => setActiveOrder(0)}>
                                최신순
                            </div>

                            <div className={activeOrder === 1 ? "mypage-chipList isActive" : "mypage-chipList"} onClick={() => setActiveOrder(1)}>
                                별점 높은 순
                            </div>

                            <div className={activeOrder === 2 ? "mypage-chipList isActive" : "mypage-chipList"} onClick={() => setActiveOrder(2)}>
                                별점 낮은 순
                            </div>
                        </div>

                        {reviews.map((review) => (
                            <table style={{ width: "100%" }} key={review.reviewToolIdx}>
                                <tbody>
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
                                                    <div
                                                        style={{
                                                            width: "48px",
                                                            height: "48px",
                                                            borderRadius: "50%",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <img
                                                            src={`http://localhost:8080/imageView?type=tool&filename=${review.writerImg}`}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="">{review.writer}</div>
                                                </div>
                                                <div className="review-star">
                                                    {[1, 2, 3, 4, 5].map((num) => (
                                                        <i
                                                            key={num}
                                                            className={`bi ${review.score >= num ? "bi-star-fill" : "bi-star"}`}
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
                                            ></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ))}

                        <div className="toolDetailPage">
                            <Pagination className="my-pagination">
                                {Array.from({ length: pageInfo.allPage }, (_, i) => (
                                    <PaginationItem key={i} active={i + 1 === pageInfo.curPage}>
                                        <PaginationLink onClick={() => toolReview(i + 1)}>{i + 1}</PaginationLink>
                                    </PaginationItem>
                                ))}
                            </Pagination>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
