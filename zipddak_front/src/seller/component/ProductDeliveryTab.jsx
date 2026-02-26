// css
import product from "../css/productRegist.module.css";

import { priceFormat } from "../js/priceFormat.jsx";

import { FormGroup, Input, Label, FormFeedback } from "reactstrap";
import { useEffect } from "react";

const DeliveryTab = ({ data, onChange }) => {
    const { postType, shippingFee } = data;

    return (
        <div className={[product.deli_frame, "ps-3"].join(" ")}>
            {/* 묶음/개별 배송 */}
            <div className="position-relative">
                <FormGroup check inline>
                    <Label check>
                        <Input type="radio" name="postType" value="bundle" checked={postType === "bundle"} onChange={(e) => onChange({ ...data, postType: e.target.value })} />
                        묶음 배송
                    </Label>
                </FormGroup>

                <FormGroup check inline>
                    <Label check>
                        <Input type="radio" name="postType" value="single" checked={postType === "single"} onChange={(e) => onChange({ ...data, postType: e.target.value })} />
                        개별 배송
                    </Label>
                </FormGroup>
            </div>

            {/* 배송비 */}
            <div className="position-relative" style={{ display: "flex", alignItems: "center" }}>
                <Label style={{ fontSize: "15px", fontWeight: "500", marginBottom: "0", marginRight: "10px" }}>
                    배송비<span className="required">*</span>
                </Label>

                <div className="unit_set">
                    <Input
                        className="unit me-3"
                        type="text"
                        readOnly={postType === "bundle"}
                        value={priceFormat(shippingFee)}
                        onChange={(e) => {
                            if (postType === "bundle") return;
                            const raw = e.target.value.replace(/[^0-9]/g, ""); //,제거
                            onChange({ ...data, shippingFee: Number(raw) });
                        }}
                    />
                    <span>원</span>
                </div>
            </div>
        </div>
    );
};

export default DeliveryTab;
