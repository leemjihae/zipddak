//css
import product from "../css/productRegist.module.css";

import { FormGroup, Label, Input } from "reactstrap";
import Tippy from "@tippyjs/react";

export default function OptionSetting({ options, setOptions, addOptionColumn, removeOptionColumn, addValueLine, removeValueLine }) {
    return (
        <FormGroup className="position-relative optPart mb-4">
            <div className="title_line mb-2">
                <Label className="input_title" style={{ marginBottom: 0, minWidth: "fit-content" }}>
                    옵션 설정
                </Label>

                <div className="btn_group" style={{ gap: "3px" }}>
                    {/* <Tippy content="옵션을 추가하려면 클릭하세요" theme="custom"> */}
                    <button type="button" className="small-button" onClick={addOptionColumn}>
                        <i className="bi bi-plus-lg"></i>
                    </button>
                    {/* </Tippy> */}
                    {/* <Tippy content="옵션을 삭제하려면 클릭하세요" theme="custom"> */}
                    <button type="button" className="small-button" onClick={removeOptionColumn}>
                        <i className="bi bi-dash-lg"></i>
                    </button>
                    {/* </Tippy> */}
                </div>
            </div>

            {/* 옵션 박스 - 옵션이 하나도 없으면 opt_frame 숨김 */}
            {options.length > 0 && (
                <div className={[product.opt_frame, "mb-2", "ps-3"].join(" ")}>
                    {options.map((opt, optionIdx) => (
                        <div className={product.option_column} key={optionIdx}>
                            {/* 옵션명 */}
                            <div className={product.optionHeader}>
                                <div className={product.optionNameInput}>
                                    <Label className="sub_title">
                                        옵션명<span className="required">*</span>
                                    </Label>
                                    <Input
                                        className="optionName"
                                        placeholder="예: 색상"
                                        value={opt.optionName}
                                        onChange={(e) => {
                                            const updated = [...options];
                                            updated[optionIdx].optionName = e.target.value;
                                            setOptions(updated);
                                        }}
                                    />
                                </div>

                                <div className={product.add_btn}>
                                    <Label>
                                        <span className="blankSpace">~</span>
                                    </Label>
                                    {/* <Tippy content="선택값을 추가하려면 클릭하세요" theme="custom"> */}
                                    <button type="button" className="small-button2" onClick={() => addValueLine(optionIdx)}>
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                    {/* </Tippy> */}
                                </div>
                            </div>

                            <div className={product.optionBody}>
                                {opt.values.map((val, valueIdx) => (
                                    <div className={product.optionBodyColumn} key={valueIdx}>
                                        <div className={product.optionContent}>
                                            {/* 선택값 */}
                                            <div className="optionValue">
                                                <Label className="sub_title">
                                                    선택값<span className="required">*</span>
                                                </Label>
                                                <Input
                                                    placeholder="예: 빨강"
                                                    value={val.value}
                                                    onChange={(e) => {
                                                        const updated = [...options];
                                                        updated[optionIdx].values[valueIdx].value = e.target.value;
                                                        setOptions(updated);
                                                    }}
                                                />
                                            </div>

                                            {/* 가격 */}
                                            <div className="optionPrice">
                                                <Label className="sub_title">옵션 가격</Label>
                                                <Input
                                                    placeholder="예: 0"
                                                    value={val.price}
                                                    onChange={(e) => {
                                                        const updated = [...options];
                                                        updated[optionIdx].values[valueIdx].price = e.target.value;
                                                        setOptions(updated);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className={product.add_btn}>
                                            <Label>
                                                <span className="blankSpace">~</span>
                                            </Label>
                                            {/* <Tippy content="선택값을 삭제하려면 클릭하세요" theme="custom"> */}
                                            <button type="button" className="small-button2" style={{ marginBottom: "2px" }} onClick={() => removeValueLine(optionIdx, valueIdx)}>
                                                <i className="bi bi-dash-lg"></i>
                                            </button>
                                            {/* </Tippy> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </FormGroup>
    );
}
