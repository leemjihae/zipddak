//메뉴 리스트
export const NAV_MENUS = [
    {
        key: "product",
        label: "상품관리",
        items: [
            { label: "상품 등록", icon: "bi bi-plus-square", href: "/seller/productRegist" },
            { label: "상품 조회", icon: "bi bi-box2", href: "/seller/productList" },
        ],
    },
    {
        key: "order",
        label: "주문관리",
        items: [
            { label: "주문 내역", icon: "bi bi-basket3", href: "/seller/orderList" },
            { label: "배송 관리", icon: "bi bi-truck", href: "/seller/shippingList" },
            { label: "반품 관리", icon: "bi bi-reply", href: "/seller/returnList" },
            { label: "교환 관리", icon: "bi bi-repeat", href: "/seller/exchangeList" },
        ],
    },
    {
        key: "settle",
        label: "정산관리",
        items: [
            { label: "매출 통계", icon: "bi bi-graph-up-arrow", href: "/seller/salesStatistics" },
            { label: "정산 내역", icon: "bi bi-piggy-bank", href: "/seller/settleList" },
        ],
    },
    {
        key: "consumer",
        label: "고객관리",
        items: [
            { label: "상품 문의", icon: "bi bi-chat-square-dots", href: "/seller/pdInquireList" },
            { label: "일반 문의", icon: "bi bi-envelope-open", href: "/seller/gnrInquireList" },
        ],
    },
    {
        key: "setting",
        label: "설정",
        items: [
            { label: "프로필 관리", icon: "bi bi-person-circle", href: "/seller/myProfile" },
            { label: "내 정보 관리", icon: "bi bi-gear", href: "/seller/myInfo" },
        ],
    },
];

//
export function menu_data(menu, openMenu, toggleMenu, setOpenMenu) {
    const isOpen = openMenu === menu.key;
    // const isHover = hoverMenu === menu.key;

    return (
        <li
            key={menu.key}
            className={`dropdown ${openMenu === menu.key ? "open" : ""}`}
            onClick={(e) => {
                e.stopPropagation();
                toggleMenu(menu.key);
            }}
            onMouseEnter={() => {
                if (openMenu !== menu.key && openMenu !== null) {
                    setOpenMenu(null); // 다른 메뉴 hover하면 기존 open 닫힘
                }
            }}
        >
            <span className="menu_label">
                {menu.label}
                <i className={`bi bi-chevron-down dropdown_icon ${isOpen ? "rotate" : ""}`}></i>
            </span>

            <ul className="dropdown_menu" onClick={(e) => e.stopPropagation()}>
                {menu.items.map((item, idx) => (
                    <li
                        className="dropdown_menu1"
                        key={item.label}
                        onClick={() => setOpenMenu(null)} // 소메뉴 클릭하면 닫힘
                    >
                        <a href={item.href}>
                            <i className={item.icon}></i> {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </li>
    );
}
