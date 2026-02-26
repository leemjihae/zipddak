import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";
import "../css/Signup.css";
import { baseUrl, myAxios } from "../../config";
import { useNavigate } from "react-router";
import { useState } from "react";
import { userAtom, tokenAtom, alarmsAtom, fcmTokenAtom } from "../../atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export default function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [token, setToken] = useAtom(tokenAtom);
    const fcmToken = useAtomValue(fcmTokenAtom);
    const setUser = useSetAtom(userAtom);
    const setAlarms = useSetAtom(alarmsAtom);

    const navigate = useNavigate();

    const submit = () => {
        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("fcmToken", fcmToken);

        myAxios(null, setToken)
            .post(`/login`, formData)
            .then((res) => {
                console.log(res.headers.authorization); //token
                console.log(res);

                if (res) {
                    setUser(res.data);
                    //setToken(res.headers.authorization);

                    myAxios(res.headers.authorization, setToken)
                        .get(`/notificationList?username=${res.data.username}`)
                        .then((res) => {
                            setAlarms(res.data);
                        });
                }
                if (res.data.role == "USER" || res.data.role == "EXPERT") {
                    navigate("/zipddak/main");
                } else if (res.data.role == "APPROVAL_SELLER") {
                    navigate("/seller/mainhome");
                } else if (res.data.role == "ADMIN") {
                    navigate("/admin/dashbord");
                }
            })
            .catch((err) => {
                console.log(err);
                alert(err.response.data.message);
            });
    };

    return (
        <>
            <div className="signUp-box">
                <div className="login">
                    {/* <div className="logo"></div> */}
                    <a href="/zipddak/main">
                        <img src="/zipddak_smile.png" style={{ width: "150px" }} />
                    </a>
                    {/* <div className="title">로그인</div> */}

                    <div className="sns_login">
                        <div className="sns_top"></div>
                        <div className="sns_icons">
                            <a href={`${baseUrl}/oauth2/authorization/naver`}>
                                <img src="/naver_r.png" alt="naver" style={{ width: 56, height: 56 }} />
                            </a>
                            <a href={`${baseUrl}/oauth2/authorization/kakao`}>
                                <img src="/kakao_r.png" alt="kakao" style={{ width: 56, height: 56 }} />
                            </a>
                            <a href={`${baseUrl}/oauth2/authorization/google`}>
                                <img src="/google_r.png" alt="google" style={{ width: 56, height: 56 }} />
                            </a>
                        </div>
                    </div>

                    <div className="line1"></div>

                    {/* <form className="input_form"> */}
                    <form className="input_form">
                        <div className="input_parts">
                            <div className="input_label">이메일</div>
                            <Input name="username" placeholder="이메일을 입력해주세요." type="email" onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="input_parts">
                            <div className="input_label">비밀번호</div>
                            <Input name="password" placeholder="비밀번호를 입력해주세요." type="password" onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        submit();
                                    }
                                }}
                            />
                        </div>

                        <div className="col-cm">
                            <div className="login_options">
                                {/* <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" />
                                        로그인 유지
                                    </Label>
                                </FormGroup> */}
                                <a href="">
                                    <span>아이디/비밀번호 찾기</span>
                                </a>
                            </div>

                            <div className="mainButton loginStep">
                                <Button className="primary-button long-button" onClick={submit}
                                    type="button">
                                    로그인
                                </Button>
                            </div>
                        </div>
                    </form>

                    <div className="loginFooter">
                        <div className="input_detail">아직 회원이 아니신가요?</div>
                        <a href="/signUp/user">
                            <div className="input_detail2">회원가입</div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
