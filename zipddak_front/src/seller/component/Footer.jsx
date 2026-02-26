export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="header_logo">
                    <img src="/zipddak_smile.png" style={{ width: "150px" }} />
                </div>
                <div className="copyRight"> Copyright © 2025 | All Rights Reserved</div>

                <div className="etc_menu">
                    <div className="other_menu">
                        <span className="pointer ">
                            <a href="#" className="readonlyText">
                                공지사항
                            </a>
                        </span>
                        <span className="pointer">
                            <a href="/seller/ask">일대일 문의</a>
                        </span>
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
