import "../css/AdminNav.css";
import { useNavigate } from "react-router";
import { alarmsAtom, initUser, tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai/react";

export default function AdminNav() {
    const navigate = useNavigate();
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [alarms, setAlarms] = useAtom(alarmsAtom);

    // 로그아웃
    const logout = () => {
        setUser(initUser);
        setToken(null);
        setAlarms([]);
        navigate("/login");
    };

    return (
        <aside className="admin-sidebar">
            {/* Top */}
            <div className="admin-sidebar-inner-div">
                <div className="sidebar-top">
                    <div className="logo-box" style={{ display: "flex", alignItems: "center" }}>
                        <img style={{ width: "110px" }} src="/zipddak_smile.png" />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <span className="font-18 semibold">집딱</span>
                            <span className="font-14">관리자 시스템</span>
                        </div>
                    </div>

                    <div className="admin-info">
                        <span className="font-16 semibold">관리자 : {user.name}</span>
                        <span className="font-14">관리자ID : {user.username}</span>
                    </div>

                    {/* Menu */}
                    <ul className="sidebar-menu">
                        {/* 회원 관리 */}
                        <li className="menu-item">
                            <div className="admin-sidebar-menu-li">
                                <i className="bi bi-person admin-sidebar-icon"></i>
                                <span className="font-18 semibold">회원 관리</span>
                            </div>

                            <ul className="sub-menu">
                                <li>
                                    <button onClick={() => navigate("/admin/users")}>일반 회원</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/admin/experts")}>전문가</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/admin/sellers")}>판매업체</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/admin/switchRequest")}>전환신청 / 입점신청</button>
                                </li>
                            </ul>
                        </li>

                        {/* 이용 내역 */}
                        <li className="menu-item">
                            <div className="admin-sidebar-menu-li">
                                <i className="bi bi-clipboard-check admin-sidebar-icon"></i>
                                <span className="font-18 semibold">이용 내역</span>
                            </div>

                            <ul className="sub-menu">
                                <li>
                                    <button onClick={() => navigate("/admin/rentals")}>대여 내역</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/admin/salesHistory")}>판매 내역</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/admin/payment")}>결제 내역</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/admin/membership")}>멤버십 내역</button>
                                </li>
                                {/* <li>
                                    <button onClick={() => navigate("/admin/reports")}>신고 내역</button>
                                </li> */}
                            </ul>
                        </li>

                        {/* 정산 */}
                        <li className="menu-item single">
                            <button onClick={() => navigate("/admin/settlements")}>
                                <i className="bi bi-currency-dollar admin-sidebar-icon"></i>
                                <span className="font-18 semibold">정산</span>
                            </button>
                        </li>

                        {/* 1:1 문의 */}
                        {/* <li className="menu-item single">
                            <button onClick={() => navigate("/admin/inquirys")}>
                                <i className="bi bi-chat-dots admin-sidebar-icon"></i>
                                <span className="font-18 semibold">1 : 1 문의</span>
                            </button>
                        </li> */}

                        {/* 통계 */}
                        <li className="menu-item single">
                            <button onClick={() => navigate("/admin/dashbord")}>
                                <i className="bi bi-graph-up admin-sidebar-icon"></i>
                                <span className="font-18 semibold">통계</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Logout */}
                <div className="sidebar-bottom">
                    <button onClick={logout} className="logout-btn">
                        로그아웃
                    </button>
                </div>
            </div>
        </aside>
    );
}
