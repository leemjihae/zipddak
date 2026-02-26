import { Form, FormGroup, Label, Input, Button, Col, UncontrolledAccordion, AccordionHeader, AccordionBody, AccordionItem, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../css/Signup.css";
import { useState, useEffect, useRef } from "react";
import { myAxios } from "../../config";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { Modal as AddrModal } from "antd";
import qs from "qs";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";

export default function SignExpert() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [expert, setExpert] = useState({
        username: "",
        activityName: "",
        zonecode: "",
        addr1: "",
        addr2: "",
        employeeCount: 0,
        businessLicense: "",
        businessLicensePdfId: null,
        settleBank: "",
        settleAccount: "",
        settleHost: "",
        createdAt: null,
        providedServiceIdx: "",
    });

    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const changeInput = (e) => {
        setExpert({ ...expert, [e.target.name]: e.target.value });
    };

    //테스트용 axios
    const signUpapi = myAxios(null, null);

    //탭구분
    const [activeTab, setActiveTab] = useState(1);
    const handleTab = (e) => {
        setActiveTab(e);
        document.getElementById("tabs").scrollIntoView({ behavior: "smooth" });
    };

    //전문가 분야 체크
    const [majorservice, setMajorService] = useState({
        majorCategory1: false,
        majorCategory2: false,
        majorCategory3: false,
    });

    const [repairCategory, setRepairCategory] = useState({
        repair1: [],
        repair2: [],
        repair3: [],
    });

    const [interiorCategory, setInteriorCategory] = useState({
        interior1: [],
        interior2: [],
        interior3: [],
    });

    const [counselCategory, setCounselCategory] = useState();

    const ranOnceRef = useRef(false); // StrictMode 이중실행 방지용

    const checkMajor = (e) => {
        const { name, checked } = e.target;

        setMajorService((prev) => ({
            ...prev,
            [name]: checked,
        }));

        if (name === "majorCategory1" && !checked) {
            setCounselCategory("75");
        }

        if (name === "majorCategory2" && !checked) {
            setRepairCategory({ repair1: [], repair2: [], repair3: [] });
            setCheckedCategory((prev) => prev.filter((id) => ![...repairCategory.repair1, ...repairCategory.repair2, ...repairCategory.repair3].includes(id)));
        }

        if (name === "majorCategory3" && !checked) {
            setInteriorCategory({ interior1: [], interior2: [], interior3: [] });
            setCheckedCategory((prev) => prev.filter((id) => ![...interiorCategory.interior1, ...interiorCategory.interior2, ...interiorCategory.interior3].includes(id)));
        }
    };

    useEffect(() => {
        // StrictMode에서 useEffect가 2번 호출될 수 있으니 방지
        if (ranOnceRef.current) return;
        ranOnceRef.current = true;

        const preload = async () => {
            try {
                const repair = await signUpapi.get("/signUpExpertCategory", {
                    params: { parentIdx: [23, 44, 74] },
                    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
                });

                // 방어: 요청이 취소되거나 실패하면 res가 없을 수 있음
                if (repair && repair.data) {
                    setRepairCategory({
                        repair1: repair.data["24"] || [],
                        repair2: repair.data["31"] || [],
                        repair3: repair.data["37"] || [],
                    });

                    setInteriorCategory({
                        interior1: repair.data["45"] || [],
                        interior2: repair.data["55"] || [],
                        interior3: repair.data["65"] || [],
                    });
                } else {
                    // 안전히 빈배열로 초기화
                    setRepairCategory({ repair1: [], repair2: [], repair3: [] });
                    setInteriorCategory({ interior1: [], interior2: [], interior3: [] });
                }
            } catch (err) {
                // 취소된 요청은 무시, 그 외는 로깅
                if (err?.code === "ERR_CANCELED" || err?.message?.includes("canceled")) {
                    // 요청 취소라면 별도 처리 없음
                    console.warn("preload 요청이 취소되었습니다.");
                } else {
                    console.error("카테고리 preload 실패", err);
                    // 실패 시에도 UI가 깨지지 않게 빈 배열로 초기화
                    setRepairCategory({ repair1: [], repair2: [], repair3: [] });
                    setInteriorCategory({ interior1: [], interior2: [], interior3: [] });
                }
            }
        };

        preload();
    }, []); // 빈 deps: 최초 1회

    //카테고리 String으로 가져가기
    const [checkedCategory, setCheckedCategory] = useState([]);

    const handleCategoryCheck = (e) => {
        const idx = Number(e.target.value);
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

    //파일
    const fileRef = useRef(null);
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState();

    //활동명
    const [nickValid, setNickValid] = useState(null);
    useEffect(() => {
        const nicknameRule = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]{2,20}$/;

        if (expert.activityName === "") {
            setNickValid(null);
        } else {
            setNickValid(nicknameRule.test(expert.activityName));
        }
    }, [expert.activityName]);

    //사업자 등록 번호
    const [licenseValid, setLicenseValid] = useState(null);
    useEffect(() => {
        const licenseNum = /^[0-9]{13}$/;

        if (expert.businessLicense === "") {
            setLicenseValid(null);
        } else {
            setLicenseValid(licenseNum.test(expert.businessLicense));
        }
    }, [expert.businessLicense]);

    //주소
    const [isAddOpen, setIsAddOpen] = useState(false);
    const complateHandler = (data) => {
        setExpert({
            ...expert,
            zonecode: data.zonecode,
            addr1: data.address,
        });
    };

    const closeHandler = (state) => {
        setIsAddOpen(false);
    };

    //약관동의
    const [agree, setAgree] = useState({
        all: false,
        necessary1: false,
        necessary2: false,
        service1: false,
        service2: false,
    });

    const handleAllCheck = (e) => {
        const checked = e.target.checked;

        setAgree({
            all: checked,
            necessary1: checked,
            necessary2: checked,
            service1: checked,
            service2: checked,
        });
    };

    const handleSingleCheck = (e) => {
        const { name, checked } = e.target;

        const newAgree = {
            ...agree,
            [name]: checked,
        };

        const allChecked = newAgree.service1 && newAgree.service2 && newAgree.necessary1 && newAgree.necessary2;

        setAgree({
            ...newAgree,
            all: allChecked,
        });
    };

    //회원가입
    const submit = (e) => {
        e.preventDefault();

        //선택한 카테고리를 db에 문자열로 저장
        const providedServiceIdx = makeProvidedServiceIdx();
        setExpert({ ...expert, providedServiceIdx: providedServiceIdx });

        if (!expert.activityName?.trim()) {
            alert("활동명을 입력해주세요.");
            return;
        } else if (!expert.businessLicense?.trim()) {
            alert("사업자등록번호를 입력해주세요");
            return;
            // } else if (!expert.businessLicensePdfId?.trim()) {
            //     alert("사업자 등록증을 첨부해주세요")
            //     return;
        } else if (!expert.addr1?.trim()) {
            alert("주소를 입력해주세요");
            return;
        } else if (!providedServiceIdx?.trim()) {
            alert("제공서비스는 최소 한가지 이상 선택해주세요");
            return;
        } else if (!expert.settleAccount?.trim()) {
            alert("정산계좌를 입력해주세요");
            return;
        } else if (!agree.necessary1 && !agree.necessary2) {
            alert("필수약관의 동의가 필요합니다.");
            return;
        }

        const formData = new FormData();

        formData.append("businessLicenseFile", file);
        formData.append("username", user.username);
        formData.append("activityName", expert.activityName);
        formData.append("zonecode", expert.zonecode);
        formData.append("addr1", expert.addr1);
        formData.append("addr2", expert.addr2);
        formData.append("employeeCount", +expert.employeeCount);
        formData.append("settleBank", expert.settleBank);
        formData.append("settleAccount", expert.settleAccount);
        formData.append("settleHost", expert.settleHost);
        formData.append("providedServiceIdx", providedServiceIdx);
        formData.append("businessLicense", expert.businessLicense);

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            myAxios(token, setToken)
                .post("/joinExpert", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((res) => {
                    if (res.data == true) {
                        console.log(res);
                        setMessage("전문가 회원가입 완료! 승인까지 최대 7영업일이 소요됩니다.");
                    } else {
                        setMessage("전문가 회원가입 실패");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setMessage("전문가 회원가입 중 오류가 발생했습니다.");
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
                <div className="SignExpert">
                    <a href="/zipddak/main">
                        <img src="/zipddak_smile.png" style={{ width: "150px" }} />
                    </a>
                    <div className="underLogo">전문가 회원가입</div>

                    <div className="tabs" id="tabs">
                        <div className={`tab_nav tab1 ${activeTab === 1 ? "active" : ""}`} onClick={() => handleTab(1)}>
                            전문분야 선택
                        </div>

                        <div className={`tab_nav tab2 ${activeTab === 2 ? "active" : ""}`} onClick={() => handleTab(2)}>
                            필수분야 입력
                        </div>
                    </div>

                    {activeTab === 1 && (
                        <div className="tab1 active">
                            <div className="title2">어떤 전문가로 활동하실 수 있나요?</div>

                            {/* <div className="row-cm"></div> */}
                            <div className="experts_category">
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" name={75} value={75} checked={checkedCategory.includes(75)} onChange={handleCategoryCheck} />
                                        시공견적 컨설팅
                                    </Label>
                                </FormGroup>
                                <div className="line"></div>
                                <span>컨설팅 전문가</span>
                            </div>

                            <div className="ecategory_part">
                                <div className="experts_category">
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="checkbox" name="majorCategory2" checked={majorservice.majorCategory2} onChange={checkMajor} />
                                            수리
                                        </Label>
                                    </FormGroup>
                                    <div className="line"></div>
                                    <div className="row-cm expca">
                                        <span>가전제품</span>
                                        <span>문/창문</span>
                                        <span>수도/보일러/전기</span>
                                    </div>
                                </div>
                                {majorservice.majorCategory2 && (
                                    <UncontrolledAccordion stayOpen>
                                        <AccordionItem>
                                            <AccordionHeader>수리 상세서비스</AccordionHeader>
                                            <AccordionBody>
                                                <div className="categoryCheck-box">
                                                    <div>
                                                        <span>가전제품 수리</span>
                                                    </div>
                                                    <div className="line"></div>
                                                    {repairCategory.repair1.map((c) => (
                                                        <div key={c.categoryIdx} className="form-check">
                                                            <Label check>
                                                                <Input
                                                                    type="checkbox"
                                                                    name={c.categoryIdx}
                                                                    value={c.categoryIdx}
                                                                    checked={checkedCategory.includes(c.categoryIdx)}
                                                                    onChange={handleCategoryCheck}
                                                                />
                                                                {c.name}
                                                            </Label>
                                                        </div>
                                                    ))}

                                                    <div className="line"></div>
                                                    <div>
                                                        <span>문/창문 수리</span>
                                                    </div>
                                                    <div className="line"></div>
                                                    {repairCategory.repair2.map((c) => (
                                                        <div key={c.categoryIdx} className="form-check">
                                                            <Label check>
                                                                <Input
                                                                    type="checkbox"
                                                                    name={c.categoryIdx}
                                                                    value={c.categoryIdx}
                                                                    checked={checkedCategory.includes(c.categoryIdx)}
                                                                    onChange={handleCategoryCheck}
                                                                />
                                                                {c.name}
                                                            </Label>
                                                        </div>
                                                    ))}

                                                    <div className="line"></div>
                                                    <div>
                                                        <span>수도/보일러/전기 수리</span>
                                                    </div>
                                                    <div className="line"></div>
                                                    {repairCategory.repair3.map((c) => (
                                                        <div key={c.categoryIdx} className="form-check">
                                                            <Label check>
                                                                <Input
                                                                    type="checkbox"
                                                                    name={c.categoryIdx}
                                                                    value={c.categoryIdx}
                                                                    checked={checkedCategory.includes(c.categoryIdx)}
                                                                    onChange={handleCategoryCheck}
                                                                />
                                                                {c.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionBody>
                                        </AccordionItem>
                                    </UncontrolledAccordion>
                                )}
                            </div>

                            <div className="ecategory_part">
                                <div className="experts_category">
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="checkbox" name="majorCategory3" checked={majorservice.majorCategory3} onChange={checkMajor} />
                                            인테리어
                                        </Label>
                                    </FormGroup>
                                    <div className="line"></div>
                                    <div className="row-cm expca">
                                        <span>부분 인테리어</span>
                                        <span>벽/천장 시공</span>
                                        <span>바닥시공</span>
                                    </div>
                                </div>
                                {majorservice.majorCategory3 && (
                                    <UncontrolledAccordion stayOpen>
                                        <AccordionItem>
                                            <AccordionHeader>인테리어 상세서비스</AccordionHeader>
                                            <AccordionBody>
                                                <div className="categoryCheck-box">
                                                    <div>
                                                        <span>부분 인테리어</span>
                                                    </div>
                                                    <div className="line"></div>
                                                    {interiorCategory.interior1.map((c) => (
                                                        <div key={c.categoryIdx} className="form-check">
                                                            <Label check>
                                                                <Input
                                                                    type="checkbox"
                                                                    name={c.categoryIdx}
                                                                    value={c.categoryIdx}
                                                                    checked={checkedCategory.includes(c.categoryIdx)}
                                                                    onChange={handleCategoryCheck}
                                                                />
                                                                {c.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                    <div className="line"></div>
                                                    <div>
                                                        <span>벽/천장 시공</span>
                                                    </div>
                                                    <div className="line"></div>
                                                    {interiorCategory.interior2.map((c) => (
                                                        <div key={c.categoryIdx} className="form-check">
                                                            <Label check>
                                                                <Input
                                                                    type="checkbox"
                                                                    name={c.categoryIdx}
                                                                    value={c.categoryIdx}
                                                                    checked={checkedCategory.includes(c.categoryIdx)}
                                                                    onChange={handleCategoryCheck}
                                                                />
                                                                {c.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                    <div className="line"></div>
                                                    <div>
                                                        <span>바닥시공</span>
                                                    </div>
                                                    <div className="line"></div>
                                                    {interiorCategory.interior3.map((c) => (
                                                        <div key={c.categoryIdx} className="form-check">
                                                            <Label check>
                                                                <Input
                                                                    type="checkbox"
                                                                    name={c.categoryIdx}
                                                                    value={c.categoryIdx}
                                                                    checked={checkedCategory.includes(c.categoryIdx)}
                                                                    onChange={handleCategoryCheck}
                                                                />
                                                                {c.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionBody>
                                        </AccordionItem>
                                    </UncontrolledAccordion>
                                )}
                            </div>

                            <div className="mainButton long-button">
                                <Button className="primary-button long-button" onClick={() => setActiveTab(2)}>
                                    다음으로
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* -------------------------------------------------------------- */}

                    {activeTab === 2 && (
                        <div className="tab2">
                            <div className="title2">상세정보 입력</div>
                            <Form>
                                <div className="input_form">
                                    <div className="input_parts">
                                        <div className="row-cm">
                                            <div className="input_label">활동명(회사이름)</div>
                                            <span className="necc">*</span>
                                        </div>
                                        <Input name="activityName" placeholder="활동명(2~20자)" type="text" onChange={changeInput} valid={nickValid === true} invalid={nickValid === false} />

                                        {nickValid === true && <FormFeedback valid></FormFeedback>}
                                        {nickValid === false && <FormFeedback invalid></FormFeedback>}
                                    </div>

                                    <div className="input_parts">
                                        <div className="input_label">직원수</div>
                                        <div className="input_detail">본인을 포함한 직원수를 적어주세요</div>
                                        <Input
                                            name="employeeCount"
                                            placeholder="숫자로만 입력"
                                            type="number"
                                            onChange={(e) =>
                                                setExpert({
                                                    ...expert,
                                                    employeeCount: e.target.value ? Number(e.target.value) : null,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="input_parts">
                                        <div className="row-cm">
                                            <div className="input_label">사업자등록번호</div>
                                            <span className="necc">*</span>
                                        </div>
                                        <Input
                                            name="businessLicense"
                                            placeholder="숫자로만 13자"
                                            maxLength={13}
                                            type="text"
                                            onChange={changeInput}
                                            valid={licenseValid === true}
                                            invalid={licenseValid === false}
                                        />

                                        {licenseValid === true && <FormFeedback valid></FormFeedback>}
                                        {licenseValid === false && <FormFeedback invalid>숫자 13자리 입력</FormFeedback>}
                                    </div>

                                    <div className="input_parts">
                                        <div className="row-cm">
                                            <div className="input_label">사업자등록증</div>
                                            <span className="necc">*</span>
                                        </div>
                                        <div className="row-cm phone-auth">
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
                                            <Input name="businessLicensePdfId" placeholder="*pdf파일 첨부" type="text" value={fileName} onChange={changeInput} readOnly />
                                            <Button className="tertiary-button" onClick={() => fileRef.current.click()}>
                                                파일 첨부
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="input_parts">
                                        <div className="row-cm">
                                            <div className="input_label">계좌번호</div>
                                            <span className="necc">*</span>
                                        </div>
                                        <div className="input_detail">정산이 이루어지는 계좌입니다</div>
                                        <Input name="settleBank" type="select" className="code-box" value={expert.settleBank} onChange={changeInput}>
                                            <option>은행 선택</option>
                                            <option value={"국민은행"}>국민은행</option>
                                            <option value={"신한은행"}>신한은행</option>
                                            <option value={"농협은행"}>농협은행</option>
                                            <option value={"카카오뱅크"}>카카오뱅크</option>
                                        </Input>
                                        <Input maxLength={14} name="settleAccount" placeholder="'-'제외 숫자로만 계좌번호 입력" type="text" onChange={changeInput} />
                                        <Input name="settleHost" placeholder="예금주" type="text" onChange={changeInput} />
                                    </div>

                                    <div className="input_parts">
                                        <div className="row-cm">
                                            <div className="input_label">주소</div>
                                            <span className="necc">*</span>
                                        </div>
                                        <div className="input_detail">활동지역이 노출됩니다</div>
                                        <div className="input_post">
                                            <Input className="code-box" name="zonecode" placeholder="우편번호" type="text" value={expert.zonecode} readOnly />
                                            <Button className="primary-button" onClick={() => setIsAddOpen(!isAddOpen)}>
                                                주소찾기
                                            </Button>
                                        </div>

                                        <Input name="addr1" placeholder="도로명/지번 주소" type="text" value={expert.addr1} readOnly />

                                        <Input name="addr2" placeholder="상세주소" type="text" onChange={changeInput} />
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
                                                        <Input type="checkbox" name="all" checked={agree.all} onChange={handleAllCheck} />
                                                        전체동의
                                                    </Label>
                                                </FormGroup>
                                            </div>
                                            <div className="line"></div>
                                            <div className="conditionOption">
                                                <FormGroup check className="condition-check">
                                                    <Label check className="condition-label">
                                                        <Input type="checkbox" name="necessary1" checked={agree.necessary1} onChange={handleSingleCheck} />
                                                        이용약관<span className="necct">(필수)</span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check className="condition-check">
                                                    <Label check className="condition-label">
                                                        <Input type="checkbox" name="necessary2" checked={agree.necessary2} onChange={handleSingleCheck} />만 14세 이상입니다
                                                        <span className="necct">(필수)</span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check className="condition-check">
                                                    <Label check className="condition-label">
                                                        <Input type="checkbox" name="service1" checked={agree.service1} onChange={handleSingleCheck} />
                                                        개인정보 수집 및 이용동의(선택)
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check className="condition-check">
                                                    <Label check className="condition-label">
                                                        <Input type="checkbox" name="service2" checked={agree.service2} onChange={handleSingleCheck} />
                                                        개인정보 마케팅 활용동의(선택)
                                                    </Label>
                                                </FormGroup>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mainButton">
                                        <Button className="primary-button long-button" onClick={submit}>
                                            전문가 회원가입하기
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    )}
                    <div className="loginFooter">
                        <div className="input_detail">이미 아이디가 있으신가요?</div>
                        <a>
                            <div className="input_detail2">로그인</div>
                        </a>
                    </div>
                    <div className="loginFooter"></div>
                </div>
                <Modal isOpen={modal}>
                    <ModalHeader>전문가 회원가입</ModalHeader>
                    <ModalBody>{message}</ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={() => {
                                setModal(false);
                                navigate(`/zipddak/main`);
                            }}
                        >
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
