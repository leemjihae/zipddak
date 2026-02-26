import { SquarePlus, ChevronDown, MapPinned, Plus, Minus, UserRound } from "lucide-react";
import "../css/ProductOrder.css";
import "../css/RegistTool.css";
import "../../css/common.css";
import { Input, FormGroup, Label, Button, ModalBody, ModalHeader, Modal } from "reactstrap";
import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { myAxios } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import DaumPostcode from "react-daum-postcode";
import { Modal as AddrModal } from "antd";
import { MapTool } from "../../main/component/Tool";

export default function ApplyTool() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);
    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState("");

    const [tool, setTool] = useState();
    const { toolIdx } = useParams();
    const navigate = useNavigate();

    const mapContainer = useRef(null);
    const map = useRef(null);

    //기본 날짜
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const ownerAddress = tool?.ownerAddr ? tool.ownerAddr.split(" ").slice(0, 2).join(" ") : "";

    const [rental, setRental] = useState({
        // rentalIdx: '',
        rentalCode: "",
        startDate: today,
        endDate: tomorrowStr,
        request: "",
        directRental: true,
        postCharge: 0,
        postRental: false,
        zonecode: "",
        addr1: "",
        addr2: "",
        postRequest: "배송시 요청사항 없음",
        paymentType: "",
        satus: null,
        borrower: user.username,
        owner: "",
        paymentIdx: "",
        createdAt: "",

        toolIdx: toolIdx,
        phone: "",
    });

    //스크롤 탑
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    //대상 공구
    const targetTool = () => {
        console.log(" myAxios 여기");

        token &&
            myAxios(token, setToken)
                .get(`/tool/detail`, {
                    params: {
                        toolIdx: toolIdx,
                        username: user.username,
                    },
                })
                .then((res) => {
                    console.log(res.data);
                    setTool(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
    };

    useEffect(() => {
        console.log("1.useEffect 왜 안돼");
        if (toolIdx) {
            targetTool();
        }
    }, [toolIdx]);

    //툴 정보
    useEffect(() => {
        if (tool) {
            setRental((prev) => ({
                ...prev,
                toolIdx: tool.toolIdx,
                owner: tool.owner,
                postCharge: tool.postCharge,
            }));
        }
    }, [tool]);

    //직접 입력
    const ChangeInput = (e) => {
        setRental({ ...rental, [e.target.name]: e.target.value });
    };

    //거래방식
    const [rentalType, setRentalType] = useState(false);
    useEffect(() => {
        setRental((prev) => ({
            ...prev,
            directRental: rentalType === "DIRECT",
            postRental: rentalType === "POST",
        }));
    }, [rentalType]);

    //주소
    const [isAddOpen, setIsAddOpen] = useState(false);
    const complateHandler = (data) => {
        setRental({
            ...rental,
            zonecode: data.zonecode,
            addr1: data.address,
        });
    };

    const closeHandler = (state) => {
        setIsAddOpen(false);
    };

    //주소지 설정
    const [useProfile, setUseProfile] = useState(true);
    useEffect(() => {
        if (useProfile && user) {
            setRental((prev) => ({
                ...prev,
                addr1: user.addr1 ?? "",
                addr2: user.addr2 ?? "",
                zonecode: user.zonecode ?? "",
            }));
        }

        if (!useProfile) {
            // 직접 입력 → 초기화
            setRental((prev) => ({
                ...prev,
                addr1: "",
                addr2: "",
                zonecode: "",
            }));
        }
    }, [useProfile, user]);

    //결제선택
    const [paymentType, setPaymentType] = useState(null);
    const [successPay, setSuccessPay] = useState(false);

    useEffect(() => {
        setRental((prev) => ({ ...prev, paymentType }));
    }, [paymentType]);

    //대여기간
    const [totalDays, setTotalDays] = useState(1);

    const totalDate = (e) => {
        const { name, value } = e.target;
        setRental((prev) => ({ ...prev, [name]: value }));

        // 총일수 계산
        if (name === "startDate" || name === "endDate") {
            const start = name === "startDate" ? value : rental.startDate;
            const end = name === "endDate" ? value : rental.endDate;

            if (start && end) {
                const startTime = new Date(start).getTime();
                const endTime = new Date(end).getTime();
                const diffDays = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24)) + 1; // +1 포함
                setTotalDays(diffDays > 0 ? diffDays : 0);
            }
        }
    };

    //총대여비
    const [totalCharge, setTotalCharge] = useState(0);

    useEffect(() => {
        if (tool?.rentalPrice && totalDays > 0) {
            setTotalCharge(tool.rentalPrice * totalDays);
        } else {
            setTotalCharge(0);
        }
    }, [tool, totalDays]);

    const [finalCharge, setFinalCharge] = useState();

    useEffect(() => {
        if (!tool || totalCharge <= 0) {
            setFinalCharge(0);
            return;
        }

        const needPostCharge = rental.postRental === true && paymentType === true;

        setFinalCharge(totalCharge + (needPostCharge ? tool.postCharge : 0));
    }, [tool, totalCharge, rental.postRental, paymentType]);

    //거래 동의
    const [agree, setAgree] = useState(false);

    //직거래 지도
    //tool지도
    useEffect(() => {
        if (!window.kakao || !tool) return;

        const geocoder = new window.kakao.maps.services.Geocoder();

        // 주소 → 좌표 변환
        geocoder.addressSearch(tool.tradeAddr1, (result, status) => {
            if (status !== window.kakao.maps.services.Status.OK) return;

            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            // 지도 생성
            map.current = new window.kakao.maps.Map(mapContainer.current, {
                center: coords,
                level: 1,
            });

            // 마커 이미지 설정
            const imageSrc =  "/zipddak_pin.png",
                imageSize = new window.kakao.maps.Size(64, 69),
                imageOption = { offset: new window.kakao.maps.Point(27, 69) };

            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            const marker = new window.kakao.maps.Marker({
                position: coords,
                image: markerImage,
            });
            marker.setMap(map.current);

            // 커스텀 오버레이
            const content = `<div class="customoverlay">
        <a href="https://map.kakao.com/link/map/${result[0].y},${result[0].x}" target="_blank">
          <span class="title"></span>
        </a>
      </div>`;

            const customOverlay = new window.kakao.maps.CustomOverlay({
                map: map.current,
                position: coords,
                content,
                yAnchor: 1,
            });
        });
    }, [tool, rentalType]);

    //토스페이 0원 대여 등록
    const doFreeRental = () => {
        token &&
            myAxios(token, setToken)
                .post("/rental/application", rental)
                .then((res) => {
                    console.log(res.data);
                    setMessage("대여요청이 등록되었습니다");
                    setModal(true);
                    navigate(`/zipddak/mypage/tools/rentals`);
                })
                .catch((err) => {
                    console.log(err);
                });
    };

    //대여 등록
    const doRental = () => {
        if (!rental.name || !rental.phone) {
            setMessage("신청자 정보를 입력해주세요");
            setModal(true);
            return;
        } else if (!rental.startDate || !rental.endDate) {
            setMessage("대여기간을 선택해주세요");
            setModal(true);
            return;
        }

        //만나서 결제
        if (paymentType === false) {
            doFreeRental();
            return;
        }

        //토스페이
        requestTossPaymentApi();
    };

    // 토스 페이먼츠 결제 요청 시작
    const requestTossPaymentApi = async () => {
        const res = await myAxios(token, setToken).post(`/user/payment/rental`, {
            username: user.username,
            amount: finalCharge,
            rental: rental,
            toolIdx: toolIdx,
        });

        const { orderId, orderName, amount } = res.data;

        const encodedOrderName = encodeURIComponent(orderName);

        // 테스트 경우 클라이언트 키가 노출되어도 상관 없음
        // 실제 운영하는 환경에서는 서버에서 clientKey를 내려주고 클라이언트 요청시 가져와서 사용
        const tossPayments = await loadTossPayments("test_ck_Ba5PzR0ArnGLGeODLa1B8vmYnNeD");

        await tossPayments.requestPayment({
            method: "CARD",
            amount: amount,
            orderId: orderId,
            orderName: orderName,
            successUrl: `http://localhost:8080/user/payment/rental/complete?orderName=${encodedOrderName}&username=${user.username}&toolIdx=${toolIdx}`, // 성공시 서버쪽으로 보냄
            failUrl: `http://localhost:5173/zipddak/tool/${toolIdx}`,
        });
    };

    if (!tool) return <div>로딩중...</div>;
    return (
        <>
            <div className="regTool-container ">
                <div className="regTool applyTool">
                    <div className="col-cm appTool-userbox">
                        <div className="d-user tuserbox">
                            {tool.ownerProfile != null ? (
                                <div className="profileImage">
                                    <img src={`http://localhost:8080/imageView?type=profile&filename=${tool.ownerProfile}`} alt="유저" />
                                </div>
                            ) : (
                                <div className="profile-img">
                                    <UserRound color="#303441" />
                                </div>
                            )}
                            <div className="userInfo">
                                <span className="nick">{tool.nickname}</span>
                                <span className="loca">{ownerAddress}</span>
                            </div>
                        </div>
                        <Button className="primary-button">대여문의</Button>
                    </div>
                    <div className="col-cm">
                        <div className="app-tool-form">
                            <div className="r-title">
                                <SquarePlus />
                                <span>공구대여 신청</span>
                            </div>

                            <div className="regToolForm">
                                <div className="options">
                                    <span className="o-label">거래대상 공구</span>
                                    <MapTool key={tool.idx} tool={tool} />
                                </div>

                                <div className="options">
                                    <span className="o-label">대여기간</span>
                                    <div className="flex-box">
                                        <FormGroup>
                                            <Label>대여 시작일</Label>
                                            <Input className="pinput" name="startDate" placeholder="date placeholder" type="date" value={rental.startDate} min={today} onChange={totalDate} />
                                        </FormGroup>
                                        <div className="hypen">
                                            <Minus />
                                        </div>
                                        <FormGroup>
                                            <Label>대여 종료일</Label>
                                            <Input
                                                className="pinput"
                                                name="endDate"
                                                placeholder="date placeholder"
                                                type="date"
                                                value={rental.endDate}
                                                min={rental.startDate || today}
                                                onChange={totalDate}
                                            />
                                        </FormGroup>
                                        {/* <div className="period">
                                    <span>총</span>
                                    <span>4</span>
                                    <span>일</span>
                                </div> */}
                                    </div>
                                </div>

                                <div className="options">
                                    <span className="o-label">신청자</span>
                                    <div className="flex-box">
                                        <span className="tag">이름</span>
                                        <Input placeholder="이름(실명)" name="name" type="text" onChange={ChangeInput} />
                                    </div>
                                    <div className="flex-box">
                                        <span className="tag">전화전호</span>
                                        <Input placeholder="'-'없이 숫자로만 입력" name="phone" type="number" onChange={ChangeInput} />
                                    </div>
                                </div>

                                <div className="options">
                                    <span className="o-label">거래방식</span>
                                    <div className="check-col">
                                        <FormGroup check>
                                            <Label check>
                                                <Input name="rentalType" type="radio" value="POST" checked={rentalType === "POST"} onChange={(e) => setRentalType(e.target.value)} /> 택배 배송
                                            </Label>
                                        </FormGroup>
                                        {tool.tradeAddr1 && (
                                            <FormGroup check>
                                                <Label check>
                                                    <Input name="rentalType" type="radio" value="DIRECT" checked={rentalType === "DIRECT"} onChange={(e) => setRentalType(e.target.value)} /> 직접 픽업
                                                </Label>
                                            </FormGroup>
                                        )}
                                    </div>
                                </div>

                                {rentalType === "POST" && (
                                    <div className="options">
                                        <span className="o-label">받을주소</span>
                                        <div className="post-box">
                                            {user.addr1 && (
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="radio" checked={useProfile === true} onChange={() => setUseProfile(true)} />
                                                        기본 주소지 (프로필 주소지)
                                                    </Label>
                                                </FormGroup>
                                            )}
                                            <FormGroup check>
                                                <Label check>
                                                    <Input type="radio" checked={useProfile === false} onChange={() => setUseProfile(false)} /> 직접 입력
                                                </Label>
                                            </FormGroup>
                                            <div className="check-col">
                                                <Input className="zonecodeInput" type="text" name="zonecode" placeholder="우편번호" value={rental.zonecode} readOnly />
                                                {!useProfile && (
                                                    <Button className="primary-button" onClick={() => setIsAddOpen(!isAddOpen)}>
                                                        주소검색
                                                    </Button>
                                                )}
                                            </div>
                                            <Input type="text" name="addr1" placeholder="지번/도로명주소" value={rental.addr1} readOnly />
                                            <Input type="text" name="addr2" placeholder="상세주소" value={rental.addr2} readOnly={useProfile} onChange={useProfile ? undefined : ChangeInput} />

                                            <Input name="postRequest" type="select" className="toolBank pqSelect" value={rental.postRequest} onChange={ChangeInput}>
                                                <option value={"배송시 요청사항 없음"}>배송시 요청사항</option>
                                                <option value={"문앞에 놔주세요"}>문앞에 놔주세요</option>
                                                <option value={"경비실에 맡겨주세요"}>경비실에 맡겨주세요</option>
                                            </Input>
                                        </div>
                                    </div>
                                )}

                                {rentalType === "DIRECT" && (
                                    <div className="de-two">
                                        {tool.tradeAddr1 && (
                                            <div className="de-favlocation">
                                                <div className="de-map">
                                                    <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
                                                </div>

                                                <div className="mapinfo">
                                                    <span className="map-label">거래 희망장소</span>
                                                    <span>{tool.tradeAddr1}</span>
                                                    <div>{tool.tradeAddr2}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isAddOpen && (
                                    <AddrModal title="주소찾기" open={isAddOpen} footer={null} onCancel={() => setIsAddOpen(false)}>
                                        <DaumPostcode onComplete={complateHandler} onClose={closeHandler} />
                                    </AddrModal>
                                )}

                                <div className="options">
                                    <span className="o-label">요청사항</span>
                                    <Input type="textarea" name="request" placeholder="대여시 요청사항이 있나요?" className="ttextarea" onChange={ChangeInput} />
                                </div>

                                <div className="options">
                                    <span className="o-label">결제방식</span>
                                    <div className="flex-box pay">
                                        {rental.directRental && (
                                            <div className={`payOption ${paymentType === false ? "active" : ""}`} onClick={() => setPaymentType(false)}>
                                                만나서 결제
                                            </div>
                                        )}
                                        <div className={`payOption ${paymentType === true ? "active" : ""}`} onClick={() => setPaymentType(true)}>
                                            토스페이
                                        </div>
                                    </div>
                                </div>

                                <div className="options">
                                    <span className="o-label">결제금액</span>

                                    {/* 오른쪽 결제 폼 */}
                                    <div className="product-order-form-div wide">
                                        <div className="product-order-form-div-top wide">
                                            <div className="product-order-form-div-intop">
                                                {/* <span className="font-16 semibold">결제금액</span> */}
                                                <div className="product-order-form-second">
                                                    <span className="font-15">1일 대여비</span>
                                                    <span className="row-cm moneyGap">
                                                        {tool.rentalPrice == null && tool.rentalPrice.toLocaleString()}
                                                        <span className="font-14">원</span>
                                                    </span>
                                                </div>
                                                {totalDays > 0 && (
                                                    <div className="product-order-form-second">
                                                        <div className="product-order-form-second totalRental">
                                                            <span className="font-15">총 대여비</span>
                                                            <span className="font-15 rental-period"> {totalDays}일</span>
                                                        </div>
                                                        <span className="row-cm moneyGap">
                                                            {totalCharge.toLocaleString()}
                                                            <span className="font-14">원</span>
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="product-order-form-second">
                                                    <span className="font-15">배송비</span>
                                                    <span className="row-cm moneyGap">
                                                        {rental.postRental === false ? 0 : tool.postCharge.toLocaleString()}
                                                        <span className="font-14">원</span>
                                                    </span>
                                                </div>
                                                <div className="product-order-form-second">
                                                    <span className="font-16 total-rental-label">최종 결제 금액</span>
                                                    <span className="total-rental-price">
                                                        <span className="row-cm moneyGap">
                                                            <span className="font-22 semibold order-price">{finalCharge.toLocaleString()}</span>
                                                            <span>원</span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            {/* 아래 주문 확인 설명 */}
                                            <div className="product-order-from-bottom-content">
                                                <span className="font-13 semibold">본인은 만 14세 이상이며, 주문 내용을 확인하였습니다.</span>
                                                <div className="font-11 product-order-from-bottom-content-indiv">
                                                    본 사이트는 통신판매중개자로서 상품의 거래 당사자가 아닙니다. 따라서 판매자가 등록한 상품정보 및 거래 과정에서 발생하는 문제에 대해 책임을 지지
                                                    않습니다. 단, 이용자는 업체 신고 및 문의하기 기능을 통해 판매자와의 소통이 가능하며, 문제가 발생한 경우 이를 통해 조치를 요청하실 수 있습니다.
                                                </div>
                                            </div>
                                        </div>
                                        {/* {totalPrice.toLocaleString()} */}
                                        {/* <button className="product-order-from-bottom-button font-16 semibold">원 결제하기</button> */}
                                    </div>
                                </div>

                                <div className="options">
                                    <div className="check-col">
                                        <FormGroup check>
                                            <Input id="checkbox2" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />{" "}
                                        </FormGroup>
                                        <span className="check-detail">(필수) 집딱의 파손면책 어쩌구에 동의 합니다.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row-cm appTool-btn">
                            <Button
                                className="tertiary-button"
                                // 임시, 추후모달 추가
                                onClick={() => navigate(`/zipddak/tool`)}
                            >
                                작성취소
                            </Button>
                            {finalCharge == 0 ? (
                                <Button
                                    className="primary-button"
                                    onClick={() => {
                                        if (!agree) {
                                            setMessage("필수약관에 동의해주세요");
                                            setModal(true);
                                            return;
                                        }
                                        doFreeRental(); // 동의했으면 실제 결제/등록 함수 호출
                                    }}
                                >
                                    대여신청 완료하기
                                </Button>
                            ) : (
                                <Button
                                    className="primary-button"
                                    onClick={() => {
                                        if (!agree) {
                                            setMessage("필수약관에 동의해주세요");
                                            setModal(true);
                                            return;
                                        }
                                        doRental(); // 동의했으면 실제 결제/등록 함수 호출
                                    }}
                                >
                                    {paymentType === false ? "대여신청 완료하기" : "결제하기"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={modal}>
                <ModalHeader>공구대여</ModalHeader>
                <ModalBody>{message}</ModalBody>
                {successPay && (
                    <Button
                        color="primary-button"
                        onClick={() => {
                            setModal(false);
                            navigate(`/zipddak/mypage/tools/rentals`);
                        }}
                    >
                        확인
                    </Button>
                )}
                <Button color="primary-button" onClick={() => setModal(false)}>
                    확인
                </Button>
            </Modal>
        </>
    );
}
