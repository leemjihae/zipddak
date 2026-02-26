import { FormGroup, Label, Input } from "reactstrap";
import Tippy from "@tippyjs/react";

export default function UploadDetailImages({ detailRef, detailPreviewList, onChange, onDelete }) {
    return (
        <>
            <FormGroup className="position-relative mb-4">
                <Label className="input_title">
                    상세이미지 (최대 2장)<span className="required">*</span>
                </Label>
                <Tippy content="본문 상세 이미지 첨부하기" theme="custom">
                    <img src="/Paperclip.svg" className="pointer" onClick={() => detailRef.current.click()} />
                </Tippy>

                {/* ↓선택된 파일 갖고있는 용 */}
                <Input type="file" accept="image/*" innerRef={detailRef} onChange={onChange} multiple hidden />

                {/* 이미지 미리보기 */}
                {detailPreviewList.length > 0 && (
                    <div className="img_previewBox">
                        {detailPreviewList.map((img, idx) => (
                            <div key={idx} className="preview-wrap">
                                <img src={img} className="preview-img" />
                                <button className="delete-btn" onClick={() => onDelete(idx)}>
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </FormGroup>
        </>
    );
}
