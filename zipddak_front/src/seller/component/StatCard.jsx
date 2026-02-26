//css
import home from "../css/mainHome.module.css";

export default function StatCard() {
    return (
        <>
            <div className={home.stat_card}>
                <div className={home.card_main}>
                    <div className={home.stat_change}>
                        <i className="bi bi-three-dots"></i>
                    </div>

                    <div className={home.card_body}>
                        <div className="icon_part">
                            <img src="/orderBasket_icon.svg" />
                        </div>
                        <div>
                            <div className={home.card_title}>
                                <span>오늘 주문건</span>
                            </div>
                            <div className={home.card_count}>
                                <span>80</span>건
                            </div>
                        </div>
                    </div>
                </div>

                <div className={home.card_footer}>
                    <span>어제보다</span>
                    <span>+ 11</span>건<span> &nbsp; ( 6.8% ↑)</span>
                </div>
            </div>
        </>
    );
}
