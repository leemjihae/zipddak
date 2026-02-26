import actionBox from "../css/actionDropdown.module.css";
import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const ActionDropdownPortal = ({ menuItems = [], pos, onClose }) => {
    const boxRef = useRef(null);

    useEffect(() => {
        // 외부 클릭 시 닫기
        const handleOutside = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                onClose();
            }
        };
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("click", handleOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("click", handleOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <div
            ref={boxRef}
            className={actionBox.dropdown_frame}
            style={{
                top: pos.y,
                left: pos.x,
            }}
        >
            {menuItems.map((item, idx) => (
                <div key={idx} className={actionBox.item} onClick={item.onClick}>
                    {item.label}
                </div>
            ))}
        </div>,
        document.body,
    );
};

export default ActionDropdownPortal;
