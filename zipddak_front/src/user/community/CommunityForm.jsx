import { Button, Input } from "reactstrap";
import "../css/CommunityDetail.css";
import { ChevronDown, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { tokenAtom, userAtom } from "../../atoms";
import { useAtom, useAtomValue } from "jotai";
import { baseUrl, myAxios } from "../../config";
import { useRef, useState, useEffect } from "react";
import { Community } from "../../main/component/Community";
import { Modal } from "reactstrap";
import { useParams } from "react-router";

export default function ComForm() {
    const { modifyCommunityId } = useParams();

    const user = useAtomValue(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    const [communityId, setCommunityId] = useState(0);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [writeModal, setWriteModal] = useState(false);
    const writeToggle = () => setWriteModal(!writeModal);

    const [category, setCategory] = useState(0);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 🔥 이미지 관련 state
    const [images, setImages] = useState([]); // File[]
    const [editIndex, setEditIndex] = useState(null);
    const fileInputRef = useRef(null);

    const [reason, setReason] = useState("");

    const navigate = useNavigate();

    // 파일 선택 처리
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImages((prev) => {
            const newImages = [...prev];

            if (editIndex !== null) {
                // 기존 이미지 교체
                newImages[editIndex] = file;
            } else {
                // 새 이미지 추가
                if (newImages.length >= 5) {
                    alert("이미지는 최대 5개까지 선택할 수 있습니다.");
                    return prev;
                }
                newImages.push(file);
            }

            return newImages;
        });

        setEditIndex(null);
        e.target.value = ""; // 같은 파일 다시 선택 가능
    };

    // 이미지 추가 버튼 클릭
    const openFilePicker = () => {
        if (images.length >= 5) {
            alert("이미지는 최대 5개까지 선택할 수 있습니다.");
            return;
        }
        setEditIndex(null);
        fileInputRef.current.click();
    };

    // 미리보기 이미지 클릭 (교체)
    const changeImage = (index) => {
        setEditIndex(index);
        fileInputRef.current.click();
    };

    const write = () => {
        if (category === 0) {
            setReason("카테고리를 선택해주세요");
            toggle();
            return;
        }
        if (title === "") {
            setReason("제목을 입력해주세요");
            toggle();
            return;
        }
        if (content === "") {
            setReason("내용을 입력해주세요");
            toggle();
            return;
        }

        const formData = new FormData();

        formData.append("category", category);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("username", user.username);

        // 기존 이미지 ID만 뽑아서 JSON 문자열로 보내기
        const existingIds = images
            .filter((img) => img.id) // id가 있으면 기존 이미지
            .map((img) => img.id);
        formData.append("existingImageIds", JSON.stringify(existingIds));

        // 새로 업로드한 이미지만 append
        images.forEach((img) => {
            if (img instanceof File) {
                formData.append("images", img);
            }
        });

        if (modifyCommunityId) {
            formData.append("communityId", modifyCommunityId);
            myAxios(token, setToken)
                .post(`${baseUrl}/user/modifyCommunity`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((res) => {
                    setCommunityId(res.data);
                    setReason("게시글이 수정되었습니다.");
                    writeToggle();
                });
        } else {
            myAxios(token, setToken)
                .post(`${baseUrl}/user/writeCommunity`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((res) => {
                    setCommunityId(res.data);
                    setReason("게시글이 작성되었습니다.");
                    writeToggle();
                });
        }
    };

    // 수정 할때만 실행
    useEffect(() => {
        if (!modifyCommunityId) return;

        myAxios()
            .get(`${baseUrl}/community/modify?communityId=${modifyCommunityId}`)
            .then((res) => {
                console.log(res.data);
                setCategory(res.data.category);
                setTitle(res.data.title);
                setContent(res.data.content);

                const existingImages = [];
                if (res.data.img1) existingImages.push({ id: res.data.img1id, url: `${baseUrl}/imageView?type=community&filename=${res.data.img1}` });
                if (res.data.img2) existingImages.push({ id: res.data.img2id, url: `${baseUrl}/imageView?type=community&filename=${res.data.img2}` });
                if (res.data.img3) existingImages.push({ id: res.data.img3id, url: `${baseUrl}/imageView?type=community&filename=${res.data.img3}` });
                if (res.data.img4) existingImages.push({ id: res.data.img4id, url: `${baseUrl}/imageView?type=community&filename=${res.data.img4}` });
                if (res.data.img5) existingImages.push({ id: res.data.img5id, url: `${baseUrl}/imageView?type=community&filename=${res.data.img5}` });

                setImages(existingImages);
            });
    }, [modifyCommunityId]);

    return (
        <>
            <div className="CommunityForm-container">
                <div className="col-cm comForm-body">
                    <div className="trade">
                        <select onChange={(e) => setCategory(e.target.value)} className="trade-select" value={category || "none"}>
                            <option value={"none"} disabled>
                                카테고리
                            </option>
                            <option value={76}>우리집 자랑</option>
                            <option value={77}>자재 토론회</option>
                            <option value={78}>전문가에게 묻다</option>
                            <option value={79}>나만의 노하우</option>
                            <option value={80}>함께해요</option>
                            <option value={81}>전문가 소식</option>
                        </select>
                        <ChevronDown className="trade-arrow" />
                    </div>

                    <Input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="제목을 입력해주세요" name="title" />

                    <Input value={content} onChange={(e) => setContent(e.target.value)} type="textarea" placeholder="내용을 입력해주세요" name="content" className="community-input-content" />

                    {/* 🔥 이미지 미리보기 영역 */}
                    <div className="row-cm com-write-images">
                        {images.map((img, idx) => (
                            <div key={idx} className="img-preview" onClick={() => changeImage(idx)}>
                                <img
                                    style={{ width: "80px", height: "80px" }}
                                    src={img instanceof File ? URL.createObjectURL(img) : img.url} // File이면 createObjectURL, 아니면 URL
                                    alt="preview"
                                />
                            </div>
                        ))}

                        {images.length < 5 && (
                            <div className="row-cm img-add-box" onClick={openFilePicker}>
                                <Plus color="#ffffff" size={30} />
                            </div>
                        )}
                    </div>
                    <Modal className="ask-modal-box" isOpen={modal} toggle={toggle}>
                        <div className="ask-modal-body">
                            <div>{reason}</div>
                            <div className="ask-modal-body-button-div">
                                <button className="ask-modal-back ask-modal-button" type="button" onClick={toggle}>
                                    확인
                                </button>
                            </div>
                        </div>
                    </Modal>

                    <Modal className="ask-modal-box" isOpen={writeModal} toggle={writeToggle}>
                        <div className="ask-modal-body">
                            <div>{reason}</div>
                            <div className="ask-modal-body-button-div">
                                <button
                                    onClick={() => {
                                        onclick = { writeToggle };
                                        navigate(`/zipddak/community/${communityId}`);
                                    }}
                                    className="ask-modal-back ask-modal-button"
                                    type="button"
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </Modal>
                    {/* 숨겨진 파일 input */}
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />

                    <div className="row-cm com-write-buttons">
                        <Button onClick={write}>작성완료</Button>
                        <Button onClick={() => navigate("/zipddak/community")}>작성취소</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
