//css
import login from "../css/login.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";

import { Form, FormGroup, Label, Input, Col, Button } from "reactstrap";
import { baseUrl, myAxios } from "../../config";
import { useNavigate } from "react-router";
import { useState } from "react";
import { userAtom, tokenAtom, alarmsAtom, fcmTokenAtom } from "../../atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export default function SellerLogin() {
    const pageTitle = usePageTitle("마켓 판매자 로그인");

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
                    setToken(res.headers.authorization);

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
            {pageTitle}
            <main className="main">
                <div className={login.signUp_box}>
                    <div className={login.login}>
                        <a href="/zipddak/main">
                            <img src="/logo.png" style={{ width: "150px", marginBottom: "20px" }} />
                        </a>
                        <div className={login.title}>마켓 판매자 로그인</div>

                        {/* <form className="input_form"> */}
                        <div className="input_form">
                            <div className="input_parts">
                                <div className="input_label">이메일</div>
                                <Input name="username" placeholder="이메일을 입력해주세요." type="email" onChange={(e) => setUsername(e.target.value)} />
                            </div>

                            <div className="input_parts">
                                <div className="input_label">비밀번호</div>
                                <Input name="password" placeholder="비밀번호를 입력해주세요." type="password" onChange={(e) => setPassword(e.target.value)} />
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
                                    <Button className="primary-button long-button" onClick={submit} type="submit">
                                        로그인
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
