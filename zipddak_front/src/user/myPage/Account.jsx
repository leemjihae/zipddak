import { Input, Modal, ModalBody } from "reactstrap";
import DaumPostcode from "react-daum-postcode";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";

export default function Account() {
    const [user, setUser] = useState({});
    const [address, setAddress] = useState({ zonecode: "", addr1: "" }); // 우편번호 및 도로명주소
    const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 파일

    const [modalType, setModalType] = useState(""); // 주소, 안내
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [userValue, setUserValue] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const fileRef = useRef(null); // 프로필 이미지 input 클릭

    // 유저 정보 조회
    const getAccount = () => {
        myAxios(token, setToken)
            .get("http://localhost:8080" + `/account/detail?username=${userValue.username}`)
            .then((res) => {
                setUser(res.data);

                // 지역 세팅
                setAddress({ zonecode: res.data.zonecode, addr1: res.data.addr1 });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 유저 정보 수정
    const modifyAccount = () => {
        const formData = new FormData();

        formData.append("username", userValue.username);
        formData.append("nickname", user.nickname);
        formData.append("password", user.password);
        formData.append("name", user.name);
        formData.append("phone", user.phone);
        formData.append("zonecode", address.zonecode);
        formData.append("addr1", address.addr1);
        formData.append("addr2", user.addr2);
        formData.append("settleBank", user.settleBank);
        formData.append("settleAccount", user.settleAccount);
        formData.append("settleHost", user.settleHost);
        formData.append("profileImage", profileImage);

        myAxios(token, setToken)
            .post("http://localhost:8080" + "/account/modify", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.data) {
                    setModalType("안내");
                    setIsModalOpen(true);

                    // atom 세팅
                    myAxios(token, setToken)
                        .get("http://localhost:8080" + `/account/detail?username=${userValue.username}`)
                        .then((res) => {
                            console.log(res.data);
                            setUser(res.data);
                            setUserValue((prev) => ({
                                ...prev,
                                ...res.data,
                            }));
                        })
                        .catch((err) => {
                            console.log(err);
                        });

                    setTimeout(() => {
                        setIsModalOpen(false);
                    }, 1500);
                }
            })
            .catch((err) => console.error(err));
    };

    // 우편번호 설정
    const handleComplate = (data) => {
        let { zonecode, address } = data;
        setAddress({ zonecode: zonecode, addr1: address });
    };
    const handleClose = (state) => {
        if (state == "COMPLETE_CLOSE") setIsModalOpen(false);
    };

    useEffect(() => {
        userValue.username && getAccount();
    }, [userValue.username]);

    return (
        <div className="mypage-layout">
            <h1 className="mypage-title">회원정보 수정</h1>
            <div>
                <h3 className="mypage-sectionTitle">내 프로필</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>프로필 이미지</label>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <img
                            src={profileImage ? URL.createObjectURL(profileImage) : user.profile ? `http://localhost:8080/imageView?type=profile&filename=${user.profile}` : "/default-profile.png"}
                            width="72px"
                            height="72px"
                            style={{ borderRadius: "999px" }}
                        />
                        <input
                            type="file"
                            hidden
                            ref={fileRef}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                setProfileImage(file); // 새 이미지 파일 저장
                            }}
                        />
                        <div style={{ display: "flex", gap: "4px" }}>
                            <button className="secondary-button" style={{ width: "66px", height: "33px" }} onClick={() => fileRef.current.click()}>
                                변경
                            </button>
                            <button
                                className="secondary-button"
                                style={{ width: "66px", height: "33px" }}
                                onClick={() => {
                                    // 새 업로드 이미지 제거
                                    setProfileImage(null);

                                    // 서버 이미지도 제거
                                    setUser((prev) => ({ ...prev, profile: null }));
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>닉네임</label>
                    <Input value={user.nickname} onChange={(e) => setUser({ ...user, nickname: e.target.value })} />
                </div>
            </div>
            <div>
                <h3 className="mypage-sectionTitle">내 정보</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>아이디</label>
                    <p>{user.username}</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>비밀번호</label>
                    <Input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>이름</label>
                    <Input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>휴대폰 번호</label>
                    <Input value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                </div>
            </div>
            <div>
                <h3 className="mypage-sectionTitle">주소</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>우편번호</label>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "40px",
                        }}
                    >
                        <p>{address.zonecode}</p>
                        <button
                            className="secondary-button"
                            style={{ width: "100px", height: "33px" }}
                            onClick={() => {
                                setModalType("주소");
                                setIsModalOpen(!isModalOpen);
                            }}
                        >
                            우편번호 검색
                        </button>
                    </div>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>도로명 주소</label>
                    <p>{address.addr1}</p>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>상세 주소</label>
                    <Input value={user.addr2} onChange={(e) => setUser({ ...user, addr2: e.target.value })} />
                </div>
            </div>
            <div>
                <h3 className="mypage-sectionTitle">계좌 정보</h3>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>예금주</label>
                    <Input value={user.settleHost} onChange={(e) => setUser({ ...user, settleHost: e.target.value })} />
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>은행명</label>
                    <Input type="select" style={{ width: "200px" }} value={user.settleBank} onChange={(e) => setUser({ ...user, settleBank: e.target.value })}>
                        <option value="">은행 선택</option>
                        <option value="국민은행">국민은행</option>
                        <option value="신한은행">신한은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="하나은행">하나은행</option>
                        <option value="농협은행">농협은행</option>
                        <option value="기업은행">기업은행</option>
                        <option value="SC제일은행">SC제일은행</option>
                    </Input>
                </div>
                <div className="labelInput-wrapper">
                    <label style={{ width: "120px" }}>계좌번호</label>
                    <Input type="number" value={user.settleAccount} onChange={(e) => setUser({ ...user, settleAccount: e.target.value })} />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <button className="primary-button" style={{ width: "200px", height: "40px", fontSize: "14px" }} onClick={() => modifyAccount()}>
                    완료
                </button>
                <span style={{ width: "48.4px" }} />
            </div>

            {/* 다음 주소 모달 */}
            {modalType === "주소" && (
                <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
                    <ModalBody>
                        <DaumPostcode onComplete={handleComplate} onClose={handleClose} />
                    </ModalBody>
                </Modal>
            )}

            {modalType === "안내" && (
                <Modal isOpen={isModalOpen} className="mypage-modal" style={{ width: "380px" }}>
                    <ModalBody>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                            }}
                        >
                            <p>정보가 정상적으로 수정되었습니다.</p>
                        </div>
                    </ModalBody>
                </Modal>
            )}
        </div>
    );
}
