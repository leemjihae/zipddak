import { Search, MapPinned, ChevronDown, MapPin, Heart, ChevronLeft, ChevronRight, Hammer, PlusCircle, ChevronUp, Pointer, RotateCcw } from "lucide-react";
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import "../css/ToolMain.css";
import { ToolL, MapTool, Toolmain } from "../../main/component/Tool";
import { userAtom, tokenAtom } from "../../atoms";
import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { myAxios, baseUrl } from "../../config";
import axios from "axios";
import LocationToolMap from "./ToolMap3";

export default function ToolMain() {
    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [tool, setTool] = useState([]);
    const [toolCount, setToolCount]=useState();
    const navigate = useNavigate();
    const [modal, setModal] = useState(false);

    const [offset, setOffset] = useState(0);
    const INIT_SIZE = 15;
    const MORE_SIZE = 15;

    //키워드
    const [input, setInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const searchTool = () => {
        setTool([]);
        setOffset(0);
        setKeyword(input);
    };

    //공구 지도로 찾기
    const [openMap, setOpenMap] = useState(true);

    //유저 주소 자르기
    const userAddressString = user?.addr1 || "";
    const userAdress = userAddressString.split(" ").slice(0, 2).join(" ");

    //카테고리
    const [checkedCategory, setCheckedCategory] = useState([]);

    const handleCategoryCheck = (e) => {
        const idx = Number(e.target.value);
        const checked = e.target.checked;

        setCheckedCategory((prev) => {
            if (checked) {
                return prev.includes(idx) ? prev : [...prev, idx];
            } else {
                return prev.filter((v) => v !== idx);
            }
        });
    };

    const toolCateIdx = checkedCategory.join(",");

    //거래방식
    const [tWay, setTWay] = useState(0);

    //정렬기준
    const [tOrder, setTOrder] = useState();
    const [tActiveOrder, setTActiveOrder] = useState(0);

    const toolOrder = (orderNo) => {
        setTOrder(orderNo);
        setTActiveOrder(orderNo);
    };

    //대여중인 공구 보기
    const [rentalTool, setRentalTool] = useState(false);
    const checkRentalRool = (e) => {
        setRentalTool(e.target.checked);
    };

    //스크롤 탑
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    //공구 리스트
    const toolList = (isMore = false, sizeParam = MORE_SIZE, offsetParam = offset) => {
        //지도 기준

        const userParam = user?.username ?? null;

        const params = {
            //키워드
            keyword: keyword,
            //유저
            username: userParam,
            //카테고리
            categoryNo: toolCateIdx,
            //거래방식
            wayNo: tWay,
            //정렬기준
            orderNo: tOrder,
            //대여중인 공구
            rentalState: rentalTool,

            offset: offsetParam,
            size: sizeParam,
        };

        const tokenParam = token ? token : null;

        myAxios(tokenParam, setToken)
            .get("/tool/main", { params })
            .then((res) => {
                console.log("toolMain LIst:", res.data);

                if (isMore) {
                    setTool((prev) => [...prev, ...res.data.cards]);
                } else {
                    setTool(res.data.cards);
                    setToolCount(res.data.totalCount);
                }

                setOffset(offsetParam + sizeParam);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 최초 & 필터 변경 시
    useEffect(() => {
        setTool([]);
        toolList(false, INIT_SIZE, 0);
    }, [user?.username, checkedCategory, tWay, tOrder, rentalTool, keyword]);

    //초기화
    const resetToolMain = () => {
        setCheckedCategory([]);
        setInput("");
        setKeyword("");
        setOffset(0);
        setRentalTool(false);
        setTOrder(0);
        setTWay(0);
    };

    // 더보기 확인
    useEffect(() => {
        console.log(
            "tool ids:",
            tool?.map?.((t) => t.toolIdx)
        );
    }, [tool]);

    // 관심 토글
    const toggleFavoriteTool = async (toolIdx) => {
        if (!user.username) {
            navigate("/zipddak/login");
            return;
        }

        await myAxios(token, setToken).post(`${baseUrl}/user/favoriteToggle/tool`, {
            toolIdx,
            username: user.username,
        });

        setTool((prev) => prev.map((t) => (t.toolIdx === toolIdx ? { ...t, favorite: !t.favorite } : t)));
    };

    return (
        <>
            <div className="tool-container">
                <div className="filters">
                    <div className="tool-filter">
                        <div className="t-filter">
                            <span className="f-label">검색</span>
                            <div className="search-box">
                                <input
                                    className="keyword"
                                    type="text"
                                    placeholder="공구명으로 검색"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") searchTool();
                                    }}
                                ></input>
                                <Search size={15} style={{ cursor: "pointer" }} onClick={searchTool} />
                            </div>
                        </div>
                        {/* <div className="t-filter">
                            <span className="f-label">지역검색</span>
                            <div className="location-box">
                                <input className="location" type="text" placeholder="동네찾기" readOnly></input>
                                <Button className="secondary-button mapBtn">
                                    <MapPinned size={20} />
                                </Button>
                            </div>
                        </div> */}
                        <div className="t-filter">
                            <span className="f-label">거래방식</span>
                            <div className="trade-main">
                                <select className="trade-select" value={tWay} onChange={(e) => setTWay(e.target.value)}>
                                    <option value={0}>전체</option>
                                    <option value={1}>직거래</option>
                                    <option value={2}>택배거래</option>
                                </select>
                                <ChevronDown className="trade-arrow" />
                            </div>
                        </div>
                        <span className="row-cm resetToolFilter" onClick={resetToolMain}>
                            <RotateCcw size={14} />
                            초기화
                        </span>
                    </div>
                    <div className="row-cm resetToolMain">
                        <div className="t-filter">
                            <span className="f-label">카테고리</span>
                            <div className="f-category">
                                <FormGroup check>
                                    <Label check>
                                        <Input id="checkbox2" type="checkbox" value={83} checked={checkedCategory.includes(83)} onChange={handleCategoryCheck} /> 전동공구
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        {" "}
                                        <Input id="checkbox2" type="checkbox" value={84} checked={checkedCategory.includes(84)} onChange={handleCategoryCheck} /> 일반공구
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input id="checkbox2" type="checkbox" value={85} checked={checkedCategory.includes(85)} onChange={handleCategoryCheck} />
                                        생활용품
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input id="checkbox2" type="checkbox" value={86} checked={checkedCategory.includes(86)} onChange={handleCategoryCheck} />
                                        기타공구
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input id="checkbox2" type="checkbox" value={87} checked={checkedCategory.includes(87)} onChange={handleCategoryCheck} />
                                        찾아요
                                    </Label>
                                </FormGroup>
                            </div>
                        </div>
                        {/* <span className="row-cm resetToolFilter" onClick={resetToolMain}>
                            <RotateCcw size={14} />
                            초기화
                        </span> */}
                    </div>
                </div>

                <div className="findByMap">
                    <div className="title-main">
                        <MapPin size={24} color="#FF5833" />
                        <span>{user.addr1 ? `${userAdress} 공구대여` : "공구대여"}</span>
                        {openMap ? (
                            <ChevronDown size={30} className="map-show" onClick={() => setOpenMap((prev) => !prev)} />
                        ) : (
                            <ChevronUp size={30} className="map-close" onClick={() => setOpenMap((prev) => !prev)} />
                        )}
                    </div>

                    <div className={`maplist ${openMap ? "open" : ""}`}>
                        {/* <div className="map"></div> */}
                        <LocationToolMap />
                    </div>
                </div>

                <div className="map-bottom-list">
                    <div className="row-cm toolMainSearch">
                    <div className="title-main-main">
                               <span>{keyword? "'"+keyword+"'"+"  "+"검색 결과" : "전체"}</span>
                                <span className="s-count">{toolCount}</span>
                            </div>
                            </div>
                    <div className="listBy">
                        <div className="by">
                            <div className={tActiveOrder === 0 ? "bbtn active" : "bbtn"} onClick={() => toolOrder(0)}>
                                전체
                            </div>
                            <div className={tActiveOrder === 1 ? "bbtn active" : "bbtn"} onClick={() => toolOrder(1)}>
                                별점높은순
                            </div>
                            <div className={tActiveOrder === 2 ? "bbtn active" : "bbtn"} onClick={() => toolOrder(2)}>
                                낮은가격순
                            </div>
                            <div className={tActiveOrder === 3 ? "bbtn active" : "bbtn"} onClick={() => toolOrder(3)}>
                                높은가격순
                            </div>
                        </div>

                        <Button
                            className="primary-button nonePd"
                            onClick={() => {
                                if (user.username) {
                                    navigate(`/zipddak/tool/regist`);
                                    return;
                                }
                                setModal(true);
                            }}
                        >
                            <Hammer size={22} />
                            <span className="btn-text">내 공구 등록하기</span>
                        </Button>
                    </div>
                    <div className="hiddenTool">
                        <FormGroup check>
                            <Label check>
                                <Input id="checkbox2" type="checkbox" checked={rentalTool} onChange={checkRentalRool} /> 대여중인 공구 보기
                            </Label>
                        </FormGroup>
                    </div>

                    <div className="toolMaincards">{Array.isArray(tool) && tool.map((toolCard) => <Toolmain key={toolCard.toolIdx} tool={toolCard} toggleFavoriteTool={toggleFavoriteTool} />)}</div>

                    <div
                        className="moreBtn"
                        onClick={() => {
                            toolList(true, MORE_SIZE);
                        }}
                    >
                        <span>더보기</span>
                        <PlusCircle size={20} />
                    </div>
                </div>
            </div>

            <Modal isOpen={modal}>
                <ModalHeader>공구 등록</ModalHeader>
                <ModalBody>
                    <div>공구 등록을 위해서는 로그인이 필요합니다</div>
                    {/* <div className="space-px"> </div>
                    <div>사업자등록증이 요구되며, 승인까지 최대 일주일이 소요됩니다.</div> */}
                </ModalBody>
                <div className="row-cm header-modal-button">
                    <Button className="secondary-button" onClick={() => setModal(false)}>
                        취소
                    </Button>
                    <Button className="primary-button" onClick={() => navigate(`/login`)}>
                        확인
                    </Button>
                </div>
            </Modal>
        </>
    );
}
