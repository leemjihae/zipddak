import { Button, Input, FormGroup, Label, FormFeedback, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import "../css/Signup.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { Modal as AddrModal } from "antd";
import { myAxios } from "../../config";

export default function SignStore2() {
    const [seller, setSeller] = useState({
        username: "",
        password: "",
        checkPassword: "",
        name: "",
        phone: "",
        logoFileIdx: "",
        zonecode: "",
        addr1: "",
        addr2: "",
        settleBank: "",
        settleAccount: "",
        settleHost: "",
        compBno: "",
        compFileIdx: "",
        onlinesalesFileIdx: "",
        compName: "",
        compHp: "",
        ceoName: "",
        managerName: "",
        managerTel: "",
        managerEmail: "",
        brandName: "",
        handleItemCateIdx: "",
        introduction: "",
        approvalYn: 0,
        role: "SELLER",
    });

    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const changeInput = (e) => {
        setSeller({ ...seller, [e.target.name]: e.target.value });
    };

    //최초회원가입 axios
    const signUpapi = myAxios(null, null);

    //중복 아이디 체크
    const [idValid, setIdValid] = useState(null);

    useEffect(() => {
        if (!seller.username) {
            setIdValid(null);
            return;
        }
        const timer = setTimeout(() => {
            signUpapi
                .post("/checkDoubleId", { username: seller.username })
                .then((res) => {
                    if (res.data === true) {
                        setIdValid(false);
                        setMessage("이미 사용중인 이메일(아이디)입니다");
                    } else {
                        setIdValid(true);
                        setMessage("사용가능한 이메일(아이디)입니다");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }, 500); //0.5초

        return () => clearTimeout(timer);
    }, [seller.username]);

    //비밀번호 생성
    const [pwRuleValid, setPwRuleValid] = useState(false);

    useEffect(() => {
        //영문, 숫자, 특수기호를 포함한 8-16자
        const rule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_+=\-{}\[\]:;"'<>,.?/]{8,16}$/;
        if (seller.password === "") {
            setPwRuleValid(null);
        } else {
            setPwRuleValid(rule.test(seller.password));
        }
    }, [seller.password]);

    //비밀번호 확인
    const [pwValid, setPwValid] = useState(null);

    useEffect(() => {
        if (seller.checkPassword === "") {
            setPwValid(null);
        } else if (seller.password === seller.checkPassword) {
            setPwValid(true); //일치
        } else {
            setPwValid(false); //불일치
        }
    }, [seller.password, seller.checkPassword]);

    //문자 인증
    const [phoneValid, setPhoneValid] = useState(null);
    const checkPhoneAuth = (e) => {};

    //사업자 등록 번호
    const [licenseValid, setLicenseValid] = useState(null);
    useEffect(() => {
        const licenseNum = /^[0-9]{13}$/;

        if (seller.compBno === "") {
            setLicenseValid(null);
        } else {
            setLicenseValid(licenseNum.test(seller.compBno));
        }
    }, [seller.compBno]);

    //파일
    const fileRef = useRef(null);
    const imgFileRef = useRef(null);

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();
    const [imgFile, setImageFile] = useState();
    const [imgFileName, setImgFileName] = useState();

    //주소
    const [isAddOpen, setIsAddOpen] = useState(false);
    const complateHandler = (data) => {
        setSeller({
            ...seller,
            zonecode: data.zonecode,
            addr1: data.address,
        });
    };

    const closeHandler = (state) => {
        setIsAddOpen(false);
    };

    //카테고리 String으로 가져가기
    const [checkedCategory, setCheckedCategory] = useState([]);

    const handleCategoryCheck = (e) => {
        const idx = e.target.value;
        const checked = e.target.checked;

        setCheckedCategory((prev) => {
            if (checked) {
                return [...prev, idx];
            } else {
                return prev.filter((v) => v !== idx);
            }
        });
    };

    const makeProvidedServiceIdx = () => {
        return checkedCategory.join(",");
    };

    //약관동의
    const [agree, setAgree] = useState(false);
    const checkNecc = () => {
        setAgree((prev) => !prev);
    };

    //회원가입
    const submit = (e) => {
        e.preventDefault();

        //선택한 카테고리를 db에 문자열로 저장
        const handleItemCateIdx = makeProvidedServiceIdx();
        setSeller({ ...seller, handleItemCateIdx: handleItemCateIdx });

        if (!seller.username?.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        } else if (!seller.password?.trim()) {
            alert("비밀번호를 입력해주세요");
            return;
        } else if (!seller.checkPassword?.trim()) {
            alert("비밀번호 확인을 입력해주세요");
            return;
        } else if (!seller.name?.trim()) {
            alert("이름을 입력해주세요");
            return;
        } else if (!seller.phone?.trim()) {
            alert("전화번호를 입력해주세요");
            return;
        }

        // const { checkPassword, auth_num, ...sendSeller } = seller; //checkPassword,auth_num 제거

        const formData = new FormData();

        formData.append("username", seller.username);
        formData.append("password", seller.password);
        formData.append("name", seller.name);
        formData.append("phone", seller.phone);
        formData.append("zonecode", seller.zonecode);
        formData.append("addr1", seller.addr1);
        formData.append("addr2", seller.addr2);
        formData.append("settleBank", seller.settleBank);
        formData.append("settleAccount", seller.settleAccount);
        formData.append("settleHost", seller.settleHost);
        formData.append("compBno", seller.compBno);
        formData.append("compName", seller.compName);
        formData.append("compHp", seller.compHp);
        formData.append("ceoName", seller.ceoName);
        formData.append("managerName", seller.managerName);
        formData.append("managerTel", seller.managerTel);
        formData.append("managerEmail", seller.managerEmail);
        formData.append("brandName", seller.brandName);
        formData.append("introduction", seller.introduction);
        formData.append("approvalYn", seller.approvalYn);
        formData.append("role", seller.role);

        formData.append("handleItemCateIdx", handleItemCateIdx);
        formData.append("compFile", file);
        formData.append("onlinesalesFile", imgFile);

        try {
            signUpapi
                .post("/joinSeller", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })

                .then((res) => {
                    if (res.data == true) {
                        setMessage("입점신청 완료!");
                        navigate(`/login`);
                    } else {
                        setMessage("입점신청 실패");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setMessage("입점신청 중 오류가 발생했습니다.");
                })
                .finally(() => {
                    setModal(true);
                });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="signUp-box">
                <div className="signStore2">
                    <div className="signStoreHeader">
                        <div className="s_headerItem">
                            <a href="/zipddak/main">
                                <img src="/zipddak_smile.png" style={{ width: "120px" }} />
                            </a>
                            <div className="headerTitle">입점신청</div>
                        </div>
                    </div>

                    <div className="s_form">
                        <div className="signStoreForm">
                            <div className="s_title">상점계정</div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">이메일(아이디)</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input
                                            id="username"
                                            name="username"
                                            placeholder="이메일(아이디)을 입력해주세요."
                                            type="email"
                                            value={seller.username}
                                            onChange={changeInput}
                                            valid={idValid === true ? true : undefined}
                                            invalid={idValid === false ? true : undefined}
                                        />
                                        {idValid === true && <FormFeedback valid></FormFeedback>}
                                        {idValid === false && <FormFeedback invalid>이미 가입된 이메일입니다</FormFeedback>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">비밀번호</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input
                                            name="password"
                                            value={seller.password}
                                            placeholder="비밀번호를 입력해주세요."
                                            type="password"
                                            onChange={changeInput}
                                            valid={pwRuleValid === true}
                                            invalid={pwRuleValid === false}
                                        />

                                        {pwRuleValid === true && <FormFeedback valid></FormFeedback>}

                                        {pwRuleValid === false && <FormFeedback invalid></FormFeedback>}
                                    </div>

                                    <div className="sl_input">
                                        <Input
                                            name="checkPassword"
                                            value={seller.checkPassword}
                                            placeholder="비밀번호 확인"
                                            type="password"
                                            onChange={changeInput}
                                            valid={pwValid === true}
                                            invalid={pwValid === false}
                                        />

                                        {pwValid === true && <FormFeedback valid></FormFeedback>}

                                        {pwValid === false && <FormFeedback invalid></FormFeedback>}
                                    </div>
                                </div>
                                <div className="input_detail">영문,숫자,특문 포함 8자리 이상 입력해주세요</div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">이름</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input id="name" name="name" placeholder="이름(실명)을 입력해주세요" type="text" onChange={changeInput} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">휴대폰번호</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow phoneauthInput">
                                    <div className="sl_input">
                                        <Input id="phone" name="phone" placeholder="'-'없이 숫자만 입력" type="text" onChange={changeInput} />
                                    </div>
                                    <div>
                                        <Button className="primary-button">인증하기</Button>
                                    </div>
                                </div>
                                <div className="sl_input">
                                    <Input id="phone_auth" name="phone_auth" placeholder="인증번호 입력" type="text" onChange={changeInput} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="s_form">
                        <div className="signStoreForm">
                            <div className="s_title">회사정보</div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">사업자등록번호</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input name="compBno" placeholder="숫자로만 13자" type="text" onChange={changeInput} valid={licenseValid === true} invalid={licenseValid === false} />

                                        {licenseValid === true && <FormFeedback valid></FormFeedback>}
                                        {licenseValid === false && <FormFeedback invalid>숫자 13자리 입력</FormFeedback>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">사업자등록증</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        {/* 실제 파일 input */}
                                        <input
                                            type="file"
                                            ref={fileRef}
                                            style={{ display: "none" }}
                                            accept="application/pdf"
                                            onChange={(e) => {
                                                const selectedFile = e.target.files[0];
                                                setFile(selectedFile); // 파일은 따로 저장
                                                setFileName(selectedFile?.name || ""); // 화면 표시용
                                            }}
                                        />

                                        {/* 파일명 표시용 input */}
                                        <Input name="compFileIdx" placeholder="*pdf파일 첨부" type="text" value={fileName} onChange={changeInput} readOnly />
                                    </div>
                                    <div>
                                        <Button className="tertiary-button" onClick={() => fileRef.current.click()}>
                                            파일 첨부
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">통신판매업자등록증</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        {/* 실제 파일 input */}
                                        <input
                                            type="file"
                                            ref={imgFileRef}
                                            style={{ display: "none" }}
                                            accept=".jpg,.jpeg,.png*"
                                            onChange={(e) => {
                                                const selectedFile = e.target.files[0];
                                                setImageFile(selectedFile); // 파일은 따로 저장
                                                setImgFileName(selectedFile?.name || ""); // 화면 표시용
                                            }}
                                        />

                                        {/* 파일명 표시용 input */}
                                        <Input name="onlinesalesFileIdx" placeholder="*이미지파일 첨부 ('.jpg,.jpeg,.png')" type="text" value={imgFileName} onChange={changeInput} readOnly />
                                    </div>

                                    <div>
                                        <Button className="tertiary-button" onClick={() => imgFileRef.current.click()}>
                                            첨부하기
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">대표자명</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input name="ceoName" placeholder="이름(실명) 입력" type="text" onChange={changeInput} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">법인명</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input name="compName" placeholder="회사이름 입력" type="email" onChange={changeInput} />
                                    </div>
                                </div>
                                <div className="input_detail">사업자 등록증의 법인명 또는 상호명을 입력하세요</div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">회사 주소</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formColt">
                                <div className="s_formRow">
                                    <div className="s_post">
                                        <div className="input_post">
                                            <Input className="code-box" name="zonecode" placeholder="우편번호" type="text" value={seller.zonecode} readOnly />
                                            <Button className="primary-button" onClick={() => setIsAddOpen(!isAddOpen)}>
                                                주소찾기
                                            </Button>
                                        </div>
                                        <div className="sl_input">
                                            <Input name="addr1" placeholder="도로명/지번 주소" type="text" value={seller.addr1} readOnly />
                                        </div>
                                        <div className="sl_input">
                                            <Input name="addr2" placeholder="상세주소" type="text" onChange={changeInput} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">홈페이지</div>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input name="compHp" placeholder="https://" type="text" onChange={changeInput} />
                                    </div>
                                </div>
                                <div className="input_detail">홈페이지 또는 상품확인이 가능한 대표상품 URL을 넣어주세요</div>
                            </div>
                        </div>
                    </div>

                    <div className="s_form">
                        <div className="signStoreForm">
                            <div className="s_title">회사 내 영업담당자 정보</div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">이름</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input name="managerName" placeholder="이름(실명) 입력" type="text" onChange={changeInput} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">휴대폰번호</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formCol">
                                    <div className="s_formRow phoneauthInput">
                                        <div className="sl_input">
                                            <Input name="managerTel" placeholder="‘-’제외 숫자만 입력" type="text" onChange={changeInput} />
                                        </div>
                                        <div>
                                            <Button className="primary-button">인증하기</Button>
                                        </div>
                                    </div>
                                    <div className="sl_input">
                                        <Input name="managerTel_auth" placeholder="인증번호 입력" type="text" onChange={changeInput} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">이메일</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input name="managerEmail" placeholder="이메일" type="email" onChange={changeInput} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="s_form">
                        <div className="signStoreForm">
                            <div className="s_title">상점 정보</div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">상점 이름</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sl_input">
                                        <Input name="brandName" placeholder="상점(브랜드)이름 입력" type="text" onChange={changeInput} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">취급 카테고리</div>
                                <span className="necc necc_stroe">*</span>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRowc">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"18"} onChange={handleCategoryCheck} /> <Label check>시트/필름</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"19"} onChange={handleCategoryCheck} /> <Label check>스위치/콘센트</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"20"} onChange={handleCategoryCheck} /> <Label check>커튼/블라인드</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"15"} onChange={handleCategoryCheck} /> <Label check>창호/폴딩도어</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"16"} onChange={handleCategoryCheck} /> <Label check>벽지/장판/마루</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"14"} onChange={handleCategoryCheck} /> <Label check>중문/도어</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"1"} onChange={handleCategoryCheck} /> <Label check>주방</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"6"} onChange={handleCategoryCheck} /> <Label check>욕실</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"17"} onChange={handleCategoryCheck} /> <Label check>타일</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"21"} onChange={handleCategoryCheck} /> <Label check>페인트</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="s_check">
                                                        <FormGroup check>
                                                            <Input type="checkbox" value={"22"} onChange={handleCategoryCheck} /> <Label check>조명</Label>
                                                        </FormGroup>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formtitle">
                                <div className="s_tr">상점 소개</div>
                            </div>
                            <div className="s_formCol">
                                <div className="s_formRow">
                                    <div className="sll_input">
                                        <Input placeholder="상점 소개글 (공백 포함 최대 200자)" name="introduction" type="textarea" onChange={changeInput} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="s_form">
                        <div className="signStoreForm">
                            <div className="s_titleM">
                                <div className="s_title">개인정보수집 및 이용동의</div>
                                <div className="input_detail">
                                    (주) 집딱!은 개인정보법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령상의 개인정보보호 규정을 준수하며, 판매자님의 입점신청시 필요한 최소한의
                                    개인정보를 수집합니다.
                                </div>
                            </div>
                        </div>

                        <div className="signStoreForm">
                            <div className="s_formCol">
                                <div className="s_formTable">
                                    <div className="s_formRow">
                                        <div>
                                            <table className="s_infoTable">
                                                <tbody className="s_table">
                                                    <tr className="s_tableb">
                                                        <td className="s_tableb">항목</td>
                                                        <td className="s_tableb">목적</td>
                                                        <td className="s_tableb">보유기간</td>
                                                    </tr>
                                                    <tr className="s_tableb">
                                                        <td className="s_tableb">판매자, 식별, 입점검토, 공지사항의 전달</td>
                                                        <td className="s_tableb">영업 담당자의 이름/전화번호/ 이메일 </td>
                                                        <td className="s_tableb">입점 처리 기간이 종료되는 시점</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="s_checkbody">
                            <div className="s_check">
                                <FormGroup check>
                                    <Input type="checkbox" checked={agree} onChange={checkNecc} />
                                    <Label check>
                                        <span>입점신청을 위한 개인정보 수집 및 이용에 동의 </span>
                                        <span className="necct">[필수]</span>
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>
                    </div>

                    <div className="mainButton storebottom">
                        <Button className="primary-button long-button" onClick={submit}>
                            입점신청하기
                        </Button>
                    </div>
                </div>
                <Modal isOpen={modal}>
                    <ModalHeader>회원가입</ModalHeader>
                    <ModalBody>{message}</ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => setModal(false)}>
                            확인
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>

            {isAddOpen && (
                <AddrModal title="주소찾기" open={isAddOpen} footer={null} onCancel={() => setIsAddOpen(false)}>
                    <DaumPostcode onComplete={complateHandler} onClose={closeHandler} />
                </AddrModal>
            )}
        </>
    );
}
