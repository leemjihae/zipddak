import { menu_data, NAV_MENUS } from "../js/menu_data.jsx";
import { useState, useRef, useEffect } from "react";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom } from "jotai";

import UserInfoBox from "../component/UserInfoBox.jsx";

const Header = () => {
    const [user] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [openMenu, setOpenMenu] = useState(null);
    const [hoverMenu, setHoverMenu] = useState(null);
    const [openUserInfo, setOpenUserInfo] = useState(false);
    const [userinfoPos, setUserinfoPos] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);

    //메뉴 토글 로직
    const toggleMenu = (key) => {
        setOpenMenu((prev) => (prev === key ? null : key));
        setHoverMenu(null); // 클릭 시 hover 상태는 무시
    };

    // 클릭 위치 기준으로 UserInfoBox 좌표 계산
    const handleUserInfoClick = (e) => {
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();

        setUserinfoPos({
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 4,
        });

        setOpenUserInfo((prev) => !prev); // 박스 오픈 토글
    };

    // Hover 상태
    // const handleMouseEnter = (key) => {
    //     if (!openMenu) setHoverMenu(key); // 클릭으로 고정된 상태가 아니면 hover 작동
    // };
    // const handleMouseLeave = () => {
    //     if (!openMenu) setHoverMenu(null);
    // };

    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(null);
                setHoverMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header className="header">
                <div className="header_logo">
                    <img src="/zipddak_smile.png" style={{ width: "150px" }} />
                </div>

                <nav className="nav_menu" ref={menuRef}>
                    <ul className="large_menu">
                        <li className="large_menu1">
                            <a href="/seller/mainhome">
                                <i className="bi bi-house-door"></i>Home
                            </a>
                        </li>
                        {NAV_MENUS.map((menu) => menu_data(menu, openMenu, toggleMenu, setOpenMenu))}
                    </ul>
                </nav>

                <div className="user_info" style={{ width: "150px" }}>
                    {/* <div className="alarm_icon">
                        <i className="bi bi-bell pointer"></i>
                    </div> */}
                    <div className="user_icon pointer" onClick={handleUserInfoClick}>
                        <img src="/userIcon.svg" />
                        <i className="bi bi-chevron-down"></i>
                    </div>
                </div>

                {user?.username && openUserInfo && <UserInfoBox pos={userinfoPos} userId={user.username} onClose={() => setOpenUserInfo(false)} />}
            </header>
        </>
    );
};

export default Header;
