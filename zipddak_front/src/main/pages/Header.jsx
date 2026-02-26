import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/Header.css";
import "../../css/common.css";
import { ChevronDown, Rocket, CircleUserRound, MessageCircleMore, Bell, ShoppingCart, Archive, UserRound } from "lucide-react";
import { Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useState } from "react";
import { useAtom } from "jotai/react";
import { alarmsAtom, initUser, tokenAtom, userAtom } from "../../atoms";
import { useNavigate } from "react-router";
import { baseUrl, myAxios } from "../../config";
import { NavLink } from "react-router-dom";

export default function Header({ direction, ...args }) {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [alarms, setAlarms] = useAtom(alarmsAtom);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [alarmOpen, setAlarmOpen] = useState(false);
    const [modal, setModal] = useState();

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const navigate = useNavigate();

    // 로그아웃
    const logout = () => {
        setUser(initUser);
        setToken(null);
        setAlarms([]);
        navigate("/login");
    };

    // 알림 확인
    const alarmConfirm = (notificationIdx) => {
        myAxios(token, setToken)
            .get(`/confirm/${notificationIdx}`)
            .then((res) => {
                if (res.data == true) {
                    setAlarms(alarms.filter((alarm) => alarm.notificationIdx !== notificationIdx));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 전문가 <-> 고객 전환
    const expertToggle = () => {
        myAxios(token, setToken)
            .get(`/expertYn?isExpert=${!user.expert}&username=${user.username}`)
            .then((res) => {
                setUser(res.data);
                navigate("/zipddak/main");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 전문가 가입
    const goToExpertmodal = () => {
        setModal(false);
        navigate("/signUp/expert");
    };

    return (
        <>
            <div className="Userheader">
                <>
                    {/* 로고 */}
                    <a href="/zipddak/main">
                        <img src="/zipddak_smile.png" style={{ width: "150px" }} />
                    </a>

                    <div className="userBox">
                        {user.username ? (
                            <>
                                {/* 견적요청 or 받은견적 */}
                                {user.expert ? (
                                    <a href="/expert/requests" className="estimate">
                                        <Archive size={20} />
                                        <span className="te">공개요청</span>
                                    </a>
                                ) : (
                                    <a href="/zipddak/mypage/expert/requests/active" className="estimate">
                                        <Archive size={20} />
                                        <span className="te">받은견적</span>
                                    </a>
                                )}
                                {/* 멤버십 or 장바구니 */}
                                {user.expert ? (
                                    <a href="/expert/mypage/membership" className="icon">
                                        <Rocket size={20} />
                                    </a>
                                ) : (
                                    <a href="/zipddak/cart" className="icon">
                                        <ShoppingCart size={20} />
                                    </a>
                                )}
                                {/* 채팅 */}
                                <a href="/zipddak/message" className="icon">
                                    <MessageCircleMore size={20} />
                                </a>
                                {/* 알림 */}
                                <Dropdown isOpen={alarmOpen} toggle={() => setAlarmOpen(!alarmOpen)}>
                                    <DropdownToggle className="alarm-toggle" caret={false}>
                                        <Bell size={20} />
                                        {alarms.length !== 0 && <span className="alarm-badge">{alarms.length}</span>}
                                    </DropdownToggle>
                                    <DropdownMenu {...args} className="alarm-menu">
                                        <DropdownItem header>알림</DropdownItem>

                                        {alarms.length === 0 && <DropdownItem disabled>알림이 없습니다</DropdownItem>}

                                        {alarms.map((alarm) => (
                                            <DropdownItem key={alarm.notificationIdx} className="alarm-item">
                                                {alarm.type === "REQUEST" && (
                                                    <div
                                                        onClick={() => {
                                                            alarmConfirm(alarm.notificationIdx);
                                                            navigate("/expert/mypage/receive/requests");
                                                        }}
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: "20px",
                                                        }}
                                                    >
                                                        <img src="/fi-rs-document.svg" />
                                                        <div>
                                                            <p className="alarm-title">{alarm.title}</p>
                                                            <p className="alarm-body">{alarm.content}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {alarm.type === "ESTIMATE" && (
                                                    <div
                                                        onClick={() => {
                                                            alarmConfirm(alarm.notificationIdx);
                                                            navigate("/zipddak/mypage/expert/requests/active");
                                                        }}
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: "20px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <img src="/fi-rs-woman-head.svg" />
                                                        <div>
                                                            <p className="alarm-title">{alarm.title}</p>
                                                            <p className="alarm-body">{alarm.content}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {alarm.type === "REVIEW" && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: "20px",
                                                        }}
                                                    >
                                                        <img src="/fi-rs-confetti.svg" />
                                                        <div>
                                                            <p className="alarm-title">{alarm.title}</p>
                                                            <p className="alarm-body">{alarm.content}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {alarm.type === "COMMUNITY" && (
                                                    <div
                                                        onClick={() => {
                                                            alarmConfirm(alarm.notificationIdx);
                                                            navigate(`/zipddak/community/${alarm.communityIdx}`);
                                                        }}
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: "20px",
                                                        }}
                                                    >
                                                        <img src="/fi-rs-document.svg" />
                                                        <div>
                                                            <p className="alarm-title">{alarm.title}</p>
                                                            <p className="alarm-body">{alarm.content}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {alarm.type === "RENTAL" && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: "20px",
                                                        }}
                                                    >
                                                        <img src="/fi-rs-document.svg" />
                                                        <div>
                                                            <p className="alarm-title">{alarm.title}</p>
                                                            <p className="alarm-body">{alarm.content}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <i
                                                    class="bi bi-x-lg"
                                                    o
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alarmConfirm(alarm.notificationIdx);
                                                    }}
                                                ></i>
                                            </DropdownItem>
                                        ))}
                                        <DropdownItem divider />
                                    </DropdownMenu>
                                </Dropdown>

                                {/* 프로필 이미지 */}
                                <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={direction} className="profileDropDown">
                                    {user.expert ? (
                                        <a href="/expert/mypage">
                                            <div className="profile-img">
                                                {user.profile != null && user.profile != "" ? (
                                                    <img
                                                        src={`${baseUrl}/imageView?type=expert&filename=${user.profile}`}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <UserRound color="#303441" />
                                                )}
                                            </div>
                                        </a>
                                    ) : (
                                        <a href="/zipddak/mypage/account">
                                            <div className="profile-img">
                                                {user.profile != null && user.profile != "" ? (
                                                    <img
                                                        src={`${baseUrl}/imageView?type=profile&filename=${user.profile}`}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <UserRound color="#303441" />
                                                )}
                                            </div>
                                        </a>
                                    )}
                                    <DropdownToggle className="myDropDown">
                                        <ChevronDown size={20} color="#303441" />
                                    </DropdownToggle>
                                    <DropdownMenu {...args}>
                                        <DropdownItem header className="myDropDown-item">
                                            <div className="Header-nickname">
                                                <span>{user.nickname}</span>
                                                <span className="te">님</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem>{user.expert ? <a href="/expert/profile/edit">프로필 관리</a> : <a href="/zipddak/mypage/account">프로필 관리</a>}</DropdownItem>

                                        <DropdownItem>{user.expert ? <a href="/expert/mypage">마이페이지</a> : <a href="/zipddak/mypage">마이페이지</a>}</DropdownItem>

                                        <DropdownItem divider />
                                        {
                                            // 1. user.role이 "USER"인 경우
                                            user.role === "USER" ? (
                                                <DropdownItem onClick={() => setModal(true)}>전문가 가입</DropdownItem>
                                            ) : user.expert ? (
                                                <DropdownItem onClick={expertToggle}>고객전환</DropdownItem>
                                            ) : (
                                                <DropdownItem onClick={expertToggle}>전문가전환</DropdownItem>
                                            )
                                        }

                                        <DropdownItem divider />

                                        <DropdownItem onClick={logout}>
                                            <span className="dropmenu-center">로그아웃</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </>
                        ) : (
                            // 로그인 안 한 경우
                            <a href="/login" className="loginSign">
                                <CircleUserRound size={20} />
                                <span className="te">로그인/회원가입</span>
                            </a>
                        )}
                    </div>
                </>
            </div>
            <div className="divider-line" />
            <div className="navigation">
                <NavLink to="/zipddak/main" end className={({ isActive }) => `navitem ${isActive ? "active" : ""}`}>
                    홈
                </NavLink>
                <NavLink to="/zipddak/findExpert" className={({ isActive }) => `navitem ${isActive ? "active" : ""}`}>
                    견적요청
                </NavLink>

                <NavLink to="/zipddak/experts" className={({ isActive }) => `navitem ${isActive ? "active" : ""}`}>
                    전문가찾기
                </NavLink>

                <NavLink to="/zipddak/tool" className={({ isActive }) => `navitem ${isActive ? "active" : ""}`}>
                    공구대여
                </NavLink>

                <NavLink to="/zipddak/productList" className={({ isActive }) => `navitem ${isActive ? "active" : ""}`}>
                    자재마켓
                </NavLink>

                <NavLink to="/zipddak/main/best" className={({ isActive }) => `navitem ${isActive ? "active" : ""}`}>
                    자재 100
                </NavLink>

                <NavLink to="/zipddak/community" className={({ isActive }) => `navitem ${isActive ? "active" : ""}`}>
                    커뮤니티
                </NavLink>
            </div>
            <div className="divider-line" />
            <Modal isOpen={modal}>
                <ModalHeader>전문가 가입</ModalHeader>
                <ModalBody>
                    <div>전문가 회원가입을 진행하시겠습니까?</div>
                    <div className="space-px"> </div>
                    <div>사업자등록증이 요구되며, 승인까지 최대 일주일이 소요됩니다.</div>
                </ModalBody>
                <div className="row-cm header-modal-button">
                    <Button className="secondary-button" onClick={() => setModal(false)}>
                        취소
                    </Button>
                    <Button className="primary-button" onClick={goToExpertmodal}>
                        확인
                    </Button>
                </div>
            </Modal>
        </>
    );
}
