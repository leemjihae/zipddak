import { Button } from "reactstrap";
import "../css/Signup.css";
import { CircleCheckBig } from 'lucide-react';

export default function SignStore3() {
    return (
        <>
            <div className="signUp-box">
                <div className="signStore1">
                    <div className="signStoreHeader">
                        <a href="/zipddak/main" >
                            <img src="/zipddak_smile.png" style={{width:"120px"}}/>
                            </a>
                        <div className="headerTitle">입점신청</div>
                    </div>
                    <div className="signStorebody">
                        <div className="s_bigInfo completeStore3">
                            <div className="checkIcon"><CircleCheckBig color="#ff5833" /></div>
                            <span className="title">입점신청이 완료되었습니다!</span>
                        </div>
                        <div className="s_bodybox">
                            <span className="info">작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</span>
                            <span className="info">작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</span>
                            <span className="info">작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</span>
                            <span className="info">작성해주신 정보를 바탕으로 카테고리별 담당 MD가 입점을 검토하여 이메일을 드립니다.</span>
                        </div>
                    </div>
                    <a href="/zipddak/main" className="mainButton">
                        <Button className="tertiary-button signStroeMainBottom">집딱 메인으로</Button>
                    </a>
                    <div className="signStoreFooter"></div>
                </div>
            </div>
        </>
    );
}
