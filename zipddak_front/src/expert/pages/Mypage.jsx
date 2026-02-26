import { Outlet, useLocation, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import "../../user/css/mypage.css";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { baseUrl, myAxios } from "../../config";

export function Mypage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    // 전문가 <-> 고객 전환
    const expertToggle = () => {
        myAxios(token, setToken)
            .get(`/expertYn?isExpert=${!user.expert}&username=${user.username}`)
            .then((res) => {
                setUser(res.data);
                navigate("/zipddak/mypage");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const isReceiveActive = location.pathname.startsWith("/expert/mypage/receive");
    const isSentActive = location.pathname.startsWith("/expert/mypage/sent");
    const isWorksActive = location.pathname.startsWith("/expert/mypage/works");

    const navTitleStyle = {
        display: "flex",
        padding: "6px 10px",
        alignItems: "center",
        gap: "10px",
        color: "#303441",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: "600",
        lineHeight: "18px",
    };
    const navStyle = {
        display: "flex",
        padding: "12px 10px",
        alignItems: "center",
        gap: "10px",
        color: "#303441",
        fontSize: "15px",
        fontStyle: "normal",
        fontWeight: "500",
        lineHeight: "18px",
        textDecoration: "none",
    };

    return (
        <div
            style={{
                display: "flex",
                width: "1200px",
                margin: "0 auto",
                padding: "72px 16px",
                alignItems: "flex-start",
                gap: "70px",
            }}
        >
            {/* 좌측 네비게이션 바 */}
            <div
                style={{
                    display: "flex",
                    minWidth: "180px",
                    flexDirection: "column",
                }}
            >
                <h1
                    style={{
                        color: "#303441",
                        fontSize: "22px",
                        fontWeight: "700",
                        lineHeight: "18px",
                        padding: "0 10px 30px 10px",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        // window.scrollTo(0, 0);
                        navigate("/expert/mypage");
                    }}
                >
                    마이페이지
                </h1>
                <div
                    style={{
                        display: "flex",
                        padding: "0 10px 24px 10px",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >
                    <img src={user.profile ? `${baseUrl}/imageView?type=expert&filename=${user.profile}` : "/default-profile.png"} width="96px" height="96px" style={{ borderRadius: "12px" }} />
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                        }}
                    >
                        <button
                            className="secondary-button"
                            style={{
                                width: "100%",
                                height: "33px",
                                fontSize: "12px",
                            }}
                            onClick={() => {
                                // window.scrollTo(0, 0);
                                navigate("/expert/profile/edit");
                            }}
                        >
                            프로필 수정
                        </button>

                        <button
                            className="secondary-button"
                            style={{
                                width: "100%",
                                height: "33px",
                                fontSize: "12px",
                                backgroundColor: "#293341",
                                color: "#fff",
                            }}
                            onClick={() => {
                                expertToggle();
                            }}
                        >
                            일반 사용자로 전환
                        </button>
                    </div>
                </div>
                <nav>
                    <div style={{ padding: " 10px 0 14px 0" }}>
                        <p style={navTitleStyle}>전문가 활동</p>
                        <NavLink
                            // onClick={() => window.scrollTo(0, 0)}
                            to="/expert/mypage/works"
                            style={{
                                ...navStyle,
                                backgroundColor: isWorksActive ? "rgba(179, 235, 255, 0.30)" : "white",
                            }}
                        >
                            작업내역
                        </NavLink>
                        <NavLink
                            // onClick={() => window.scrollTo(0, 0)}
                            to="/expert/mypage/receive/requests"
                            style={{
                                ...navStyle,
                                backgroundColor: isReceiveActive ? "rgba(179, 235, 255, 0.30)" : "white",
                            }}
                        >
                            받은 요청서
                        </NavLink>
                        <NavLink
                            // onClick={() => window.scrollTo(0, 0)}
                            to="/expert/mypage/sent/estimates"
                            style={{
                                ...navStyle,
                                backgroundColor: isSentActive ? "rgba(179, 235, 255, 0.30)" : "white",
                            }}
                        >
                            보낸 견적서
                        </NavLink>
                    </div>

                    <div style={{ padding: " 10px 0 14px 0" }}>
                        <NavLink
                            // onClick={() => window.scrollTo(0, 0)}
                            to="/expert/mypage/settlement"
                            style={({ isActive }) => ({
                                ...navStyle,
                                backgroundColor: isActive ? "rgba(179, 235, 255, 0.30)" : "white",
                            })}
                        >
                            매출정산 관리
                        </NavLink>
                        <NavLink
                            // onClick={() => window.scrollTo(0, 0)}
                            to="/expert/mypage/membership"
                            style={({ isActive }) => ({
                                ...navStyle,
                                backgroundColor: isActive ? "rgba(179, 235, 255, 0.30)" : "white",
                            })}
                        >
                            내 멤버십
                        </NavLink>
                        <NavLink
                            // onClick={() => window.scrollTo(0, 0)}
                            to="/expert/mypage/community"
                            style={({ isActive }) => ({
                                ...navStyle,
                                backgroundColor: isActive ? "rgba(179, 235, 255, 0.30)" : "white",
                            })}
                        >
                            내 게시글
                        </NavLink>
                        {/* <NavLink
                            // onClick={() => window.scrollTo(0, 0)}
                            to="/expert/mypage/inquiries"
                            style={({ isActive }) => ({
                                ...navStyle,
                                backgroundColor: isActive ? "rgba(179, 235, 255, 0.30)" : "white",
                            })}
                        >
                            1:1 문의내역
                        </NavLink> */}
                        <NavLink
                            // onClick={() => window.scrollTo(0, 0)}
                            to="/expert/mypage/account"
                            style={({ isActive }) => ({
                                ...navStyle,
                                backgroundColor: isActive ? "rgba(179, 235, 255, 0.30)" : "white",
                            })}
                        >
                            정산계좌 관리
                        </NavLink>
                    </div>
                </nav>
            </div>
            <Outlet />
        </div>
    );
}
