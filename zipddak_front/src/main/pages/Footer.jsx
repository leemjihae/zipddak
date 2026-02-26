export default function Footer() {
    return (
        <>
            <footer className="footer" style={{ backgroundColor: "#F2F2F7" }}>
                <div className="header_logo">
                    <img style={{ width: "150px" }} src="/zipddak_smile.png" />
                </div>
                <div className="copyRight"> Copyright © 2025 | All Rights Reserved</div>

                <div className="etc_menu">
                    <div className="other_menu">
                        <span className="pointer">
                            <a href="/signUp/store1">입점 신청</a>
                        </span>
                        {/* <span className="pointer">
                            <a href="/seller/ask">일대일 문의</a>
                        </span> */}
                    </div>
                    <div className="sns_icon">
                        <i className="bi bi-facebook"></i>
                        <i className="bi bi-twitter-x"></i>
                        <i className="bi bi-instagram"></i>
                        <i className="bi bi-threads"></i>
                        <i className="bi bi-youtube"></i>
                    </div>
                </div>
            </footer>
        </>
    );
}
