import { Outlet } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";

export default function SellerLayout() {
    return (
        <>
            {/* 공통 헤더 */}
            <Header />

            {/* 중첩 라우트가 이곳에 렌더링 */}
            <Outlet />

            {/* 공통 푸터 */}
            <Footer />
        </>
    );
}
