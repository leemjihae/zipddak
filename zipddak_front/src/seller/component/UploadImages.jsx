import { FormGroup, Label, Input } from "reactstrap";
import Tippy from "@tippyjs/react";

export default function UploadImages({ addRef, addPreviewList, onChange, onDelete }) {
    return (
        <>
            <FormGroup className="position-relative">
                <Label className="input_title">추가이미지 (최대 5장까지)</Label>
                <Tippy content="상품의 추가이미지 첨부하기" theme="custom">
                    <img src="/Paperclip.svg" className="pointer" onClick={() => addRef.current.click()} />
                </Tippy>

                {/* ↓선택된 파일 갖고있는 용 */}
                <Input type="file" accept="image/*" innerRef={addRef} onChange={onChange} multiple hidden />

                {/* 이미지 미리보기 */}
                {addPreviewList.length > 0 && (
                    <div className="img_previewBox">
                        {addPreviewList.map((img, idx) => (
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
