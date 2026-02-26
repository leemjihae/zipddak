import { Form, FormGroup, Label, Input, Button, Col, FormFeedback, Modal, ModalHeader, ModalBody } from "reactstrap";
import "../css/Signup.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import { Modal as AddrModal } from 'antd'
import { myAxios } from "../../config.jsx";
import axios from 'axios';

export default function SignUser() {

    const [user, setUser] = useState({
        username: '', nickname: '', password: '', checkPassword: '', name: '', phone: '',
        auth_num: '', zonecode: '', addr1: '', addr2: '', settleBank: '', settleAccount: '', settleHost: '',
        provider: '', providerId: '', fcmToken: '', role: 'USER', expert: false, createdate: '', profileImg: '',
        state:'ACTIVE'
    })

    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    //최초회원가입 axios
    const signUpapi = myAxios(null, null);

    const changeInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    //중복 아이디 체크
    const [idValid, setIdValid] = useState(null);

    useEffect(() => {
        console.log("api:", signUpapi)
        if (!user.username) {
            setIdValid(null);
            return;
        }
        const timer = setTimeout(() => {
            signUpapi.post('/checkDoubleId', { username: user.username })
                .then(res => {
                    console.log("res:", res);
                    console.log("res.data:", res.data);

                    if (res.data === true) {
                        setIdValid(false);
                        setMessage("이미 사용중인 이메일(아이디)입니다");
                    } else {
                        setIdValid(true);
                        setMessage("사용가능한 이메일(아이디)입니다");
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }, 500); //0.5초

        return () => clearTimeout(timer);

    }, [user.username])


    //비밀번호 생성
    const [pwRuleValid, setPwRuleValid] = useState(false);

    useEffect(() => {
        //영문, 숫자, 특수기호를 포함한 8-16자
        const rule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/]{8,16}$/
            ;
        if (user.password === '') {
            setPwRuleValid(null);
        } else {
            setPwRuleValid(rule.test(user.password));
        }
    }, [user.password]);

    //비밀번호 확인
    const [pwValid, setPwValid] = useState(null);

    useEffect(() => {
        if (user.checkPassword === '') {
            setPwValid(null);
        } else if (user.password === user.checkPassword) {
            setPwValid(true); //일치
        } else {
            setPwValid(false); //불일치
        }
    }, [user.password, user.checkPassword]);

    //닉네임
    const [nickValid, setNickValid] = useState(null);
    useEffect(() => {
        const nicknameRule = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]{2,20}$/;

        if (user.nickname === '') {
            setNickValid(null);
        } else {
            setNickValid(nicknameRule.test(user.nickname));
        }
    }, [user.nickname]);

    //문자 인증
    const [phoneValid, setPhoneValid] = useState(null);
    const checkPhoneAuth = (e) => {

    }

    //주소
    const [isAddOpen, setIsAddOpen] = useState(false);
    const complateHandler = (data) => {
        setUser({
            ...user,
            zonecode: data.zonecode,
            addr1: data.address
        });
    }

    const closeHandler = (state) => {
        setIsAddOpen(false);
    }

    //약관동의
    const [agree, setAgree] = useState({
        all: false,
        necessary1: false,
        necessary2: false,
        service1: false,
        service2: false
    })

    const handleAllCheck = (e) => {
        const checked = e.target.checked;

        setAgree({
            all: checked,
            necessary1: checked,
            necessary2: checked,
            service1: checked,
            service2: checked
        });

    }

    const handleSingleCheck = (e) => {
        const { name, checked } = e.target;

        const newAgree = {
            ...agree,
            [name]: checked,
        };

        const allChecked =
            newAgree.service1 &&
            newAgree.service2 &&
            newAgree.necessary1 &&
            newAgree.necessary2

        setAgree({
            ...newAgree,
            all: allChecked,
        })
    }



    //회원가입
    const submit = (e) => {
        e.preventDefault();

        if (!user.username?.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        } else if (!user.password?.trim()) {
            alert("비밀번호를 입력해주세요")
            return;
        } else if (!user.checkPassword?.trim()) {
            alert("비밀번호 확인을 입력해주세요")
            return;
        } else if (!user.name?.trim()) {
            alert("이름을 입력해주세요")
            return;
        } else if (!user.phone?.trim()) {
            alert("전화번호를 입력해주세요")
            return;
        } else if (!agree.necessary1 && !agree.necessary2) {
            alert("필수약관의 동의가 필요합니다.")
            return;
        }

        const { checkPassword, auth_num, ...sendUser } = user; //checkPassword,auth_num 제거

        signUpapi.post('/joinUser', sendUser)
            .then(res => {
                if (res.data == true) {
                    setMessage("회원가입 완료!")
                    
                } else {
                    setMessage("회원가입 실패")
                }
            })
            .catch(err => {
                console.log(err)
                setMessage("회원가입 중 오류가 발생했습니다.")
            })
            .finally(() => {
                setModal(true);
            })

    }

    return (
        <>
            <div className="signUp-box">
                <div className="signUser">
                    {/* <div className="logo"></div> */}
                    <a href="/zipddak/main" >
                    <img src="/zipddak_smile.png" style={{width:"150px"}}/>
                    </a>
                    <div className="title"></div>

                    <div className="sns_login">
                        <div className="sns_top">
                            <div className="sns_title">sns계정으로 간편 회원가입</div>
                        </div>
                        <div className="sns_icons">
                            <a href="/zipddak/login"><img src="/naver_r.png" alt="naverSocial" style={{ width: 56, height: 56 }} /></a>
                            <a href="/zipddak/login"><img src="/kakao_r.png" alt="kakaoSocial" style={{ width: 56, height: 56 }} /></a>
                            <a href="/zipddak/login"><img src="/google_r.png" alt="googleSocial" style={{ width: 56, height: 56 }} /></a>
                        </div>
                    </div>

                    <div className="line1"></div>

                    <Form>
                        <div className="input_form">

                            <div className="input_parts">
                                <div className="row-cm">
                                    <div className="input_label">아이디(이메일)</div>
                                    <span className="necc">*</span>
                                </div>
                                <Input
                                    name="username"
                                    placeholder="아이디로 사용할 이메일을 입력해주세요."
                                    type="email"
                                    value={user.username}
                                    onChange={changeInput}
                                    valid={idValid === true ? true : undefined}
                                    invalid={idValid === false ? true : undefined}
                                />
                                {
                                    idValid === true &&
                                    <FormFeedback valid>사용가능한 이메일입니다</FormFeedback>
                                }
                                {
                                    idValid === false &&
                                    <FormFeedback invalid>이미 가입된 이메일입니다</FormFeedback>
                                }
                            </div>

                            <div className="input_parts">
                                <div className="row-cm">
                                    <div className="input_label">비밀번호</div>
                                    <span className="necc">*</span>
                                </div>
                                <div className="input_detail">영문, 숫자, 특수문자를 포함한 8~16자</div>

                                <Input
                                    name="password"
                                    value={user.password}
                                    placeholder="비밀번호를 입력해주세요."
                                    type="password"
                                    onChange={changeInput}
                                    valid={pwRuleValid === true}
                                    invalid={pwRuleValid === false}
                                />

                                {
                                    pwRuleValid === true &&
                                    <FormFeedback valid></FormFeedback>
                                }

                                {
                                    pwRuleValid === false &&
                                    <FormFeedback invalid>비밀번호 조건을 충족해주세요</FormFeedback>
                                }

                            </div>

                            <div className="input_parts">
                                <div className="row-cm">
                                    <div className="input_label">비밀번호 확인</div>
                                    <span className="necc">*</span>
                                </div>
                                <Input
                                    name="checkPassword"
                                    value={user.checkPassword}
                                    placeholder="비밀번호를 입력해주세요."
                                    type="password"
                                    onChange={changeInput}
                                    valid={pwValid === true}
                                    invalid={pwValid === false}
                                />

                                {
                                    pwValid === true &&
                                    <FormFeedback valid>비밀번호가 일치합니다</FormFeedback>
                                }

                                {
                                    pwValid === false &&
                                    <FormFeedback invalid>비밀번호가 일치하지 않습니다</FormFeedback>
                                }

                            </div>

                            <div className="input_parts">
                                <div className="input_label">닉네임</div>
                                <div className="input_detail">한글, 영문, 숫자로 2~20자</div>
                                <Input
                                    name="nickname"
                                    placeholder="닉네임(2~20자)"
                                    type="text"
                                    onChange={changeInput}
                                    valid={nickValid === true}
                                    invalid={nickValid === false}
                                />
                                {nickValid === true &&
                                    <FormFeedback valid></FormFeedback>
                                }
                                {nickValid === false &&
                                    <FormFeedback invalid></FormFeedback>
                                }
                            </div>

                            <div className="input_parts">
                                <div className="row-cm">
                                    <div className="input_label">이름</div>
                                    <span className="necc">*</span>
                                </div>
                                <Input
                                    name="name"
                                    placeholder="이름(실명)을 입력해주세요"
                                    type="text"
                                    onChange={changeInput}
                                />
                            </div>

                            <div className="input_parts">
                                <div className="row-cm">
                                    <div className="input_label">휴대폰 인증</div>
                                    <span className="necc">*</span>
                                </div>
                                <div className="row-cm phone-auth">
                                    <Input
                                        name="phone"
                                        placeholder="'-'없이 숫자만 입력"
                                        type="text"
                                        onChange={changeInput}
                                    />
                                    <Button className="tertiary-button">인증번호 전송</Button>
                                </div>
                                <Input
                                    name="phone_auth"
                                    placeholder="인증번호 입력"
                                    type="text"
                                    onChange={changeInput}
                                />
                            </div>

                            <div className="input_parts">
                                <div className="input_label">주소</div>
                                <div className="input_detail">주소를 입력하고 우리동네 공구를 찾아보세요!</div>
                                <div className="input_post">
                                    <Input
                                        className="code-box"
                                        name="zonecode"
                                        placeholder="우편번호"
                                        type="text"
                                        value={user.zonecode} readOnly />
                                    <Button className="primary-button"
                                        onClick={() => setIsAddOpen(!isAddOpen)}>주소찾기
                                    </Button>
                                </div>

                                <Input
                                    name="addr1"
                                    placeholder="도로명/지번 주소"
                                    type="text"
                                    value={user.addr1} readOnly />

                                <Input
                                    name="addr2"
                                    placeholder="상세주소"
                                    type="text"
                                    onChange={changeInput}
                                />
                            </div>

                            <div className="input_parts">
                                <div className="row-cm">
                                    <div className="input_label">약관동의</div>
                                    <span className="necc">*</span>
                                </div>
                                <div className="input_detail">회원가입 및 회원 관리등의 목적으로 이메일, 비밀번호, 휴대폰 번호 등의 정보를 수집 및 이용 하고 있습니다.</div>
                                <div className="condition_box">
                                    <div className="conditionAll">
                                        <FormGroup check>
                                            <Label check className="check_All">
                                            <Input
                                                type="checkbox"
                                                name="all"
                                                checked={agree.all}
                                                onChange={handleAllCheck}
                                            />
                                                전체동의
                                            </Label>
                                        </FormGroup>
                                    </div>
                                    <div className="line"></div>
                                    <div className="conditionOption">
                                        <FormGroup check className="condition-check">
                                            <Label check className="condition-label">
                                            <Input type="checkbox"
                                                name="necessary1"
                                                checked={agree.necessary1}
                                                onChange={handleSingleCheck}
                                            />
                                            이용약관<span className="necct">(필수)</span></Label>
                                        </FormGroup>
                                        <FormGroup check className="condition-check">
                                            <Label check className="condition-label">
                                            <Input type="checkbox"
                                                name="necessary2"
                                                checked={agree.necessary2}
                                                onChange={handleSingleCheck}
                                            />
                                            만 14세 이상입니다<span className="necct">(필수)</span></Label>
                                        </FormGroup>
                                        <FormGroup check className="condition-check">
                                            <Label check className="condition-label">
                                            <Input type="checkbox"
                                                name="service1"
                                                checked={agree.service1}
                                                onChange={handleSingleCheck}
                                            />
                                            개인정보 수집 및 이용동의(선택)</Label>
                                        </FormGroup>
                                        <FormGroup check className="condition-check">
                                            <Label check className="condition-label">
                                            <Input type="checkbox"
                                                name="service2"
                                                checked={agree.service2}
                                                onChange={handleSingleCheck}
                                            />
                                            개인정보 마케팅 활용동의(선택)</Label>
                                        </FormGroup>

                                    </div>
                                </div>
                            </div>

                            <div className="mainButton">
                                <Button
                                    className="primary-button long-button"
                                    disabled={!pwValid}
                                    onClick={submit}
                                >
                                    회원가입하기</Button>
                            </div>
                        </div>
                    </Form>


                    <div className="loginFooter">
                        <div className="input_detail">이미 아이디가 있으신가요?</div>
                        <a href="/zipddak/login">
                            <div className="input_detail2">로그인</div>
                        </a>
                    </div>

                </div>

                <Modal isOpen={modal}>
                    <ModalHeader>회원가입</ModalHeader>
                    <ModalBody>
                        {message}
                    </ModalBody>
                    <div className="row-cm centerbutton">
                    <Button color="secondary-button" onClick={() => {setModal(false);}} >취소</Button>
                    <Button color="primary-button" onClick={() => {setModal(false); navigate(`/login`);}} >확인</Button>
                    </div>
                </Modal>
            </div>

            {
                isAddOpen &&
                <AddrModal title='주소찾기'
                    open={isAddOpen} footer={null} onCancel={() => setIsAddOpen(false)}>
                    <DaumPostcode onComplete={complateHandler} onClose={closeHandler} />
                </AddrModal>
            }
        </>
    );
}
