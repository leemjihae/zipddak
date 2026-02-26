//css
import home from "../css/mainHome.module.css";

export default function StatCard2() {
    return (
        <>
            <div className={home.stat_card2}>
                <div className={home.stat_body}>
                    <div className="icon_part">
                        <img src="/return_icon.svg" />
                    </div>
                    <div className="info_part">
                        <div>
                            <div className={home.card2}>
                                <span>97</span>%
                            </div>
                            <div className={home.card2_title}>
                                <span>환불 / 취소율</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={home.divider}>|</div>

                <div className={home.stat_body}>
                    <div className="icon_part">
                        <img src="/return_icon.svg" />
                    </div>
                    <div className="info_part">
                        <div>
                            <div className={home.card2}>
                                <span>97</span>%
                            </div>
                            <div className={home.card2_title}>
                                <span>환불 / 취소율</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={home.divider}>|</div>

                <div className={home.stat_body}>
                    <div className="icon_part">
                        <img src="/return_icon.svg" />
                    </div>
                    <div className="info_part">
                        <div>
                            <div className={home.card2}>
                                <span>97</span>%
                            </div>
                            <div className={home.card2_title}>
                                <span>환불 / 취소율</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
