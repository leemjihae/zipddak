import actionBox from "../css/actionDropdown.module.css";
import useModifyImgUpload from "../js/useModifyImgUpload.jsx";
import ReactDOM from "react-dom";
import { useAtom } from "jotai/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; //페이지 이동
import { initUser, tokenAtom, userAtom } from "../../atoms";
import { myAxios, baseUrl } from "../../config.jsx";

const UserInfoBox = ({ pos, userId, onClose }) => {
    const navigate = useNavigate();
    const boxRef = useRef(null);

    const [user, setUser] = useAtom(userAtom);
    const [token, setToken] = useAtom(tokenAtom);

    //로고이미지
    const [oldThumb, setOldThumb] = useState({ filename: "", idx: 0 });
    //상호명
    const [brandName, setBrandName] = useState("");

    //박스 외부 클릭시 닫기
    useEffect(() => {
        const handleOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("click", handleOutside);
        return () => document.removeEventListener("click", handleOutside);
    }, [onClose]);

    // 화면 안에서 안 잘리도록 위치 보정
    useEffect(() => {
        if (!boxRef.current) return;

        const boxRect = boxRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        let newLeft = pos.x;

        // 오른쪽 화면 밖으로 나가면 왼쪽으로 이동
        if (boxRect.right > viewportWidth) {
            newLeft = viewportWidth - boxRect.width - 8;
        }

        // 왼쪽도 넘어가면 최소 여백 유지
        if (newLeft < 8) {
            newLeft = 8;
        }

        boxRef.current.style.left = `${newLeft}px`;
    }, [pos]);

    // -----------------------------
    // 기존 정보 불러오기
    // -----------------------------
    useEffect(() => {
        if (!user.username || !user) return;

        const params = new URLSearchParams({
            sellerId: user.username,
        });

        const sellerProfileUrl = `/seller/mypage/myProfile?${params}`;
        user.username &&
            myAxios(token, setToken)
                .get(sellerProfileUrl)
                .then((res) => {
                    const sellerProfile = res.data;

                    // 기존 로고 이미지
                    setOldThumb({
                        filename: sellerProfile.logoFileRename,
                        idx: sellerProfile.logoFileIdx,
                    });

                    //상호명
                    setBrandName(sellerProfile.brandName);
                })
                .catch((err) => {
                    console.log(err.message);
                    console.log("error data : " + err.response.data.message);

                    if (err.response && err.response.data) {
                        alert("프로필 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
                        forceReload();
                    }
                });
    }, [user]);

    // 로그아웃
    const logout = () => {
        setUser(initUser);
        setToken(null);
        navigate("/seller/sellerLogin");
    };

    return ReactDOM.createPortal(
        <div
            ref={boxRef}
            className={actionBox.userInfoBox_frame}
            style={{
                top: pos.y,
                left: pos.x,
            }}
        >
            <div className={[actionBox.block_column].join(" ")}>
                <img src={oldThumb.idx ? `${baseUrl}/imageView?type=seller&filename=${oldThumb.filename}` : "/no_img.svg"} style={{ width: "50%" }} />
                <span className={actionBox.compInfo}>{brandName}</span>
            </div>
            <hr className="section_divider" />
            <div className={[actionBox.item_column].join(" ")}>{userId}</div>
            <div className={actionBox.item} onClick={logout}>
                로그아웃
            </div>
        </div>,
        document.body,
    );
};

export default UserInfoBox;
