import { Outlet } from "react-router-dom";
import AdminNav from "../../admin/pages/AdminNav";

export default function SellerLayout() {
    return (
        <div style={{ display: "flex" }}>
            {/* 공통 헤더 */}
            <AdminNav />

            {/* 중첩 라우트가 이곳에 렌더링 */}
            <Outlet />
        </div>
    );
}
