import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import Tippy from "@tippyjs/react";

export default function UploadThumb({ thumbRef, thumbPreview, onChange, onDelete }) {
    return (
        <>
            <FormGroup className="position-relative">
                <Label className="input_title" style={{ minWidth: "fit-content" }}>
                    썸네일<span className="required">*</span>
                </Label>
                <Tippy content="상품 이미지 첨부하기" theme="custom">
                    <img src="/Paperclip.svg" className="pointer" onClick={() => thumbRef.current.click()} />
                </Tippy>
                {/* ↓선택된 파일 갖고있는 용 */}
                <Input type="file" name="thumbnailFileIdx" accept="image/*" innerRef={thumbRef} onChange={onChange} hidden />

                {/* 이미지 미리보기 */}
                {thumbPreview && (
                    <div id="thumbPreview" className="img_previewBox">
                        <div className="preview-wrap">
                            <img src={thumbPreview} className="preview-img" />
                            <button type="button" className="delete-btn" onClick={onDelete}>
                                <i class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>
                )}
            </FormGroup>
        </>
    );
}
