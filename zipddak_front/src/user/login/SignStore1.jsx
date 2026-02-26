import { Button } from "reactstrap";
import "../css/Signup.css";

export default function SignStore1() {
    return (
        <>
            <div className="signUp-box">
                <div className="signStore1">
                    <div className="signStoreHeader">
                        <div className="s_headerItem">
                            <a href="/zipddak/main">
                                <img src="/zipddak_smile.png" style={{ width: "120px" }} />
                            </a>
                            <div className="headerTitle">입점신청</div>
                        </div>
                    </div>

                    <div className="signStorebody">
                        <div className="title">입점신청</div>
                        <div className="s_bigInfo">
                            <div className="input_detail">대표 계정 정보는 정확하게 입력해 주세요. 1개월 내 입점 결과를 이메일과 휴대전화로 안내 드립니다.</div>
                        </div>

                        <div className="s_bodybox">
                            <div className="info">작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</div>
                            <div className="info">작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</div>
                            <div className="info">작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</div>
                            <div className="info">작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</div>
                        </div>
                    </div>
                    <a href="/signUp/store2" className="mainButton">
                        <Button className="primary-button signStroeMainBottom">입점 신청 하기</Button>
                    </a>
                    <div className="signStoreFooter"></div>
                </div>
            </div>
        </>
    );
}
