import "../css/CommunityDetail.css";
import { Eye, Dot, Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, myAxios } from "../../config";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";

export default function Comdetail() {
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const { communityId } = useParams();

    const [communityDetail, setCommunityDetail] = useState({});
    const [favorite, setFavorite] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [replyCount, setReplyCount] = useState(0);
    const [replyList, setReplyList] = useState([]);
    const [isWrite, setIsWrite] = useState(false);
    const [hasMoreReply, setHasMoreReply] = useState(false);

    const [reportReason, setReportReason] = useState("");

    const [writeReply, setWriteReply] = useState("");

    const [replyPage, setReplyPage] = useState(2);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteToggle = () => setDeleteModal(!deleteModal);
    const [writeModal, setWriteModal] = useState(false);
    const writeToggle = () => setWriteModal(!writeModal);

    const moreReply = () => {
        myAxios()
            .get(`${baseUrl}/communityDetail/replyMore?communityId=${communityId}&page=${replyPage}`)
            .then((res) => {
                setHasMoreReply(res.data.hasNext);
                setReplyList([...replyList, ...res.data.replyList]);
            });
    };

    const fetchDetail = () => {
        myAxios()
            .get(`${baseUrl}/communityDetail?communityId=${communityId}&username=${user.username}`)
            .then((res) => {
                console.log(res.data);

                setCommunityDetail(res.data.communityDetail);
                setFavorite(res.data.favorite);
                setReplyCount(res.data.replyCount);
                setReplyList(res.data.replyList.replyList);
                setIsWrite(res.data.checkWrite);
                setHasMoreReply(res.data.replyList.hasNext);
                setIsFavorite(res.data.checkFavorite);
            });
    };

    const deleteReply = (value) => {
        console.log(value);
        myAxios(token, setToken)
            .post(`${baseUrl}/user/deleteReply`, {
                replyId: value,
            })
            .then((res) => {
                if (res.data) {
                    fetchDetail();
                }
            });
    };

    useEffect(() => {
        if (!communityId || !user) return;
        fetchDetail();
    }, [communityId, user]);

    const favoriteCommunity = (communityId) => {
        myAxios(token, setToken)
            .post(`${baseUrl}/user/favoriteCommunity`, {
                username: user.username,
                communityId: communityId,
            })
            .then((res) => {
                if (res.data) {
                    setIsFavorite(!isFavorite);
                    setFavorite(isFavorite ? favorite - 1 : favorite + 1);
                }
            });
    };

    const postWriteReply = () => {
        if (writeReply === "") {
            writeToggle();
            return;
        }

        myAxios(token, setToken)
            .post(`${baseUrl}/user/writeReply`, {
                username: user.username,
                content: writeReply,
                communityID: communityDetail.communityId,
            })
            .then((res) => {
                if (res.data) {
                    setWriteReply("");
                    fetchDetail();
                }
            });
    };

    const reportCommunity = () => {
        myAxios(token, setToken).post(`${baseUrl}/user/reportCommunity`, {
            username: user.username,
            communityId: communityDetail.communityId,
            reason: reportReason,
        });
    };

    const deleteCommunity = () => {
        myAxios(token, setToken).post(`${baseUrl}/user/deleteCommunity`, {
            username: user.username,
            communityId: communityDetail.communityId,
        });
    };

    return (
        <>
            <div className="ComDetail-container">
                <div className="col-cm">
                    <div className="col-cm comTop">
                        <div className="category">{communityDetail.cateName}</div>
                        <div className="title">{communityDetail.title}</div>
                        <div className="row-cm ects">
                            <div className="row-cm ectInfo">
                                <div>{communityDetail.createdAt}</div>
                                <Dot size={18} />
                                <span>조회</span>
                                <div>{communityDetail.viewCount}</div>
                            </div>
                            <div className="row-cm ectInfo">
                                {isWrite ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                if (user.username !== "") {
                                                    navigate(`/zipddak/community/modify/${communityDetail.communityId}`);
                                                }
                                            }}
                                            style={{ backgroundColor: "transparent", border: "none" }}
                                        >
                                            <span>수정</span>
                                        </button>
                                        <Dot size={18} />
                                        <button onClick={deleteToggle} style={{ backgroundColor: "transparent", border: "none" }}>
                                            <span>삭제</span>
                                        </button>
                                        <Dot size={18} />
                                    </>
                                ) : (
                                    <></>
                                )}

                                <Modal className="ask-modal-box" isOpen={deleteModal} toggle={deleteToggle}>
                                    <ModalHeader style={{ border: "none", paddingBottom: "0" }} toggle={deleteToggle}>
                                        <span className="ask-title">삭제하기</span>
                                    </ModalHeader>
                                    <div className="ask-modal-body">
                                        <div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "20px" }}>해당 게시글을 삭제하시겠습니까?</div>
                                            <div className="ask-modal-body-button-div">
                                                <button className="ask-modal-back ask-modal-button" type="button" onClick={deleteToggle}>
                                                    취소
                                                </button>
                                                <button
                                                    className="ask-modal-write ask-modal-button"
                                                    type="button"
                                                    onClick={() => {
                                                        deleteCommunity();
                                                        deleteToggle();
                                                        navigate("/zipddak/community");
                                                    }}
                                                >
                                                    삭제하기
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>

                                <button onClick={toggle} style={{ backgroundColor: "transparent", border: "none" }}>
                                    <span>신고</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row-cm UserInfo">
                        <img src={communityDetail.imgFile ? `http://localhost:8080/imageView?type=user&filename=${communityDetail.imgFile}` : "/default-profile.png"} className="profileImg"></img>
                        <span className="nick">{communityDetail.nickname}</span>
                    </div>

                    <div className="col-cm ComBody">
                        <div className="ComContext" style={{ whiteSpace: "pre-wrap" }}>
                            {communityDetail.content}
                        </div>
                        <div className="col-cm contextImgs">
                            {[communityDetail.img1, communityDetail.img2, communityDetail.img3, communityDetail.img4, communityDetail.img5]
                                .filter((img) => img) // img가 null 또는 undefined가 아닌 경우만
                                .map((img, idx) => (
                                    <img key={idx} src={`http://localhost:8080/imageView?type=community&filename=${img}`} className="c-img" alt={`community-img-${idx}`} />
                                ))}
                        </div>

                        <div className="row-cm favdiv">
                            <div
                                onClick={() => {
                                    favoriteCommunity(communityDetail.communityId);
                                }}
                                className="col-cm favBtn"
                                style={{ cursor: "pointer" }}
                            >
                                <Heart
                                    size={26}
                                    className="htn"
                                    color={isFavorite ? "#FF5833" : "gray"} // 색상 조건부
                                    fill={isFavorite ? "#FF5833" : "none"}
                                />
                                <span>{favorite}</span>
                            </div>
                        </div>
                    </div>

                    <div className="row-cm comment">
                        <span className="cms">댓글</span>
                        <span className="cmsCnt">{replyCount}</span>
                    </div>

                    <div className="col-cm write-box">
                        <div className="row-cm writer-user">
                            {user.username === "" ? (
                                <></>
                            ) : (
                                <>
                                    <img src={user.profile ? `http://localhost:8080/imageView?type=profile&filename=${user.profile}` : "/default-profile.png"} className="profileImg small"></img>
                                    <span className="cnick">{user.nickname}</span>
                                </>
                            )}
                        </div>
                        <div className="row-cm textInput">
                            <textarea value={writeReply} className="texta" onChange={(e) => setWriteReply(e.target.value)} />
                            <Button onClick={postWriteReply}>작성</Button>
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
                                            reportCommunity();
                                            toggle();
                                        }}
                                    >
                                        신고하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal>

                    <Modal className="ask-modal-box" isOpen={writeModal} toggle={writeToggle}>
                        <div className="ask-modal-body">
                            <div>텍스트를 입력해주세요.</div>
                            <div className="ask-modal-body-button-div">
                                <button
                                    onClick={() => {
                                        onclick = { writeToggle };
                                    }}
                                    className="ask-modal-back ask-modal-button"
                                    type="button"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {/* 댓글 리스트 */}
                    <div className="col-cm commentList">
                        {replyList.map((reply) => (
                            <div key={reply.replyId} className="col-cm ">
                                <div className="row-cm writer-user">
                                    <img
                                        src={reply.replyUserImg ? `http://localhost:8080/imageView?type=profile&filename=${reply.replyUserImg}` : "/default-profile.png"}
                                        className="profileImg small"
                                    ></img>
                                    <span className="cnick">{reply.replyUserNickname}</span>
                                </div>
                                <div className="comms">{reply.replyContent}</div>
                                <div className="row-cm ectInfo reply">
                                    <div>{reply.createdAt}</div>
                                    {user.username === reply.replyUsername ? (
                                        <>
                                            <Dot size={18} />
                                            <button
                                                onClick={() => {
                                                    deleteReply(reply.replyId);
                                                }}
                                                style={{ backgroundColor: "transparent", border: "none" }}
                                            >
                                                <span>삭제</span>
                                            </button>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {/* <Dot size={18} />
                                    <span>신고</span> */}
                                </div>
                            </div>
                        ))}
                        <div className="expertProfile-review-more-button-div">
                            {hasMoreReply && (
                                <button
                                    onClick={() => {
                                        moreReply();
                                    }}
                                    className="expertProfile-review-more-button font-14"
                                >
                                    댓글 더보기 <i className="bi bi-chevron-down more-icon"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
