import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function UserLayout() {
    return (
        <>
            {/* 공통 헤더 */}
            <Header />

            {/* 중첩 라우트가 이곳에 렌더링 */}
            <div style={{ minHeight: "500px" }}>
                <Outlet />
            </div>

            {/* 공통 푸터 */}
            <div style={{ marginTop: "150px" }}>
                <Footer />
            </div>
        </>
    );
}
