//css
import settings from "../css/settings.module.css";
//js
import usePageTitle from "../js/usePageTitle.jsx";

import { FormGroup, Input, Label, FormFeedback } from "reactstrap";
import Tippy from "@tippyjs/react";

export default function MyInfo() {
    const pageTitle = usePageTitle("설정 > 내 정보 관리");

    return (
        <>
            {/* 페이지 탭 타이틀 */}
            {pageTitle}

            <main className="main">
                <div className="mainFrame regiFrame">
                    <div className="headerFrame">
                        <i className="bi bi-gear" />
                        <span>내 정보 관리</span>
                    </div>

                    <div className="bodyFrame">
                        <div className="descript">
                            <span className="required">*</span> : 필수 입력
                        </div>

                        <div className={settings.mainBody}>
                            <div className={settings.profileSummary}>
                                <div className={settings.settings_imgPart}>
                                    <img src="/no-image.svg" />
                                </div>
                                <div className={settings.settings_infoPart}>
                                    <div className={settings.compInfo}>
                                        활동상태
                                        <div className="blankSpace">~</div>
                                        <p>업체명 :</p>
                                        <p>사업자번호 : </p>
                                        <p>대표자명 : </p>
                                    </div>
                                    <div className="btn_part">
                                        <button type="button" className="secondary-button " style={{ padding: "8px" }}>
                                            업체 정보 수정
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="blankSpace">~</div>
                            <FormGroup className="position-relative">
                                <Label for="examplePassword" className="input_title">
                                    기본 정보
                                </Label>
                            </FormGroup>
                            <FormGroup className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    로그인 아이디
                                </Label>
                                <Input readOnly /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>
                            <FormGroup className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    비밀번호
                                </Label>
                                <Input type="password" /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>
                            <FormGroup className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    비밀번호 확인
                                </Label>
                                <Input type="password" /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>
                            <FormGroup className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    이름<span className="required">*</span>
                                </Label>
                                <Input placeholder="" /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>
                            <FormGroup className="position-relative mb-4 ">
                                <Label for="examplePassword" className="input_title">
                                    휴대폰번호<span className="required">*</span>
                                </Label>
                                <div className="input_set">
                                    <Input className="me-2" /> {/* invalid */}
                                    {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                                    <button type="button" className="sub-button" style={{ height: "30px" }}>
                                        {/* 인증 */}
                                        <i class="bi bi-link-45deg"></i>
                                    </button>
                                </div>
                            </FormGroup>
                            <hr />
                            <div className="blankSpace">~</div>
                            <FormGroup className="position-relative">
                                <Label for="examplePassword" className="input_title">
                                    회사 내 영업 담당자 정보
                                </Label>
                            </FormGroup>
                            <FormGroup className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    이름<span className="required">*</span>
                                </Label>
                                <Input placeholder="" /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>
                            <FormGroup className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    전화번호<span className="required">*</span>
                                </Label>
                                <Input placeholder="" /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>
                            <FormGroup className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    이메일<span className="required">*</span>
                                </Label>
                                <Input placeholder="" /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>

                            <hr />
                            <div className="blankSpace">~</div>
                            {/* 사업자 번호 */}
                            <FormGroup className="position-relative">
                                <Label className="input_title">
                                    사업자 등록증<span className="required">*</span>
                                </Label>
                                <Tippy content="첨부파일 다운로드" theme="custom">
                                    <i className="bi bi-download fileDownIcon pointer"></i>
                                </Tippy>
                                {/* <img src="/Paperclip.svg" className="fileAttachIcon pointer" /> */}
                            </FormGroup>

                            {/* 통신판매업 신고번호 */}
                            <FormGroup className="position-relative">
                                <Label className="input_title">
                                    통신판매업 신고증<span className="required">*</span>
                                </Label>
                                <Tippy content="첨부파일 다운로드" theme="custom">
                                    <i className="bi bi-download fileDownIcon pointer"></i>
                                </Tippy>
                                {/* <img src="/Paperclip.svg" className="fileAttachIcon pointer" /> */}
                            </FormGroup>

                            {/* 대표자 */}
                            <FormGroup className="position-relative">
                                <Label className="input_title">
                                    대표자명<span className="required">*</span>
                                </Label>
                                <Input placeholder="상호명을 입력하세요" /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>

                            {/* 법인명 */}
                            <FormGroup className="position-relative mb-4">
                                <Label for="examplePassword" className="input_title">
                                    법인명<span className="required">*</span>
                                </Label>
                                <Input placeholder="" /> {/* invalid */}
                                {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                            </FormGroup>

                            <FormGroup className=" position-relative mb-4">
                                <Label for="examplePassword" className="input_title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    사업장 주소지
                                    <button type="button" className="small-button">
                                        <i className="bi bi-search"></i>
                                    </button>
                                </Label>
                                <div className="addr_column mb-2">
                                    <Input style={{ width: "30%" }} placeholder="우편번호" readOnly />
                                    <Input style={{ width: "70%" }} placeholder="도로명주소" readOnly />
                                </div>
                                <div className="addr_column ">
                                    <Input type="text" placeholder="상세주소를 입력하세요" />
                                </div>
                            </FormGroup>

                            <FormGroup className="position-relative">
                                <Label for="examplePassword" className="input_title">
                                    정산 계좌<span className="required">*</span>
                                </Label>
                                <div className={settings.accountPart} style={{ width: "100%" }}>
                                    <div className={[settings.accountPart, "me-2"].join(" ")} style={{ width: "100%" }}>
                                        <Input type="select" className="me-2" style={{ width: "30%" }}>
                                            <option>은행 선택</option>
                                            <option>신한</option>
                                            <option>국민</option>
                                            <option>농협</option>
                                            <option>신한</option>
                                            <option>국민</option>
                                            <option>농협</option>
                                        </Input>
                                        <Input className="me-2" style={{ width: "40%" }} placeholder="계좌번호" />
                                        <Input style={{ width: "30%" }} placeholder="예금주명" readOnly />
                                    </div>
                                    <button type="button" className="sub-button" style={{ height: "30px" }}>
                                        {/* 인증 */}
                                        <i class="bi bi-link-45deg"></i>
                                    </button>
                                </div>
                            </FormGroup>
                        </div>
                        <div className="btn_part">
                            <button type="button" className="primary-button saveBtn">
                                저장 <i className="bi bi-arrow-right-short"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
