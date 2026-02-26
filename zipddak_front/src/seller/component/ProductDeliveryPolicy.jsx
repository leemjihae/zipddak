//component
import DeliveryTab from "./ProductDeliveryTab";
import PickupTab from "./ProductPickupTab";

import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

export default function DeliveryPolicySection({ register, errors, selected, toggleDelivery, togglePickup }) {
    return (
        <FormGroup className="position-relative mb-4">
            <Label className="input_title">배송 정책</Label>

            <div>
                <div className="mb-2">
                    <FormGroup check inline>
                        <Label check>
                            <Input type="checkbox" {...register("shippingMethod.delivery")} checked={selected.delivery} onChange={((e) => setSelectedCategory(e.target.value), toggleDelivery)} />
                            택배 배송
                        </Label>
                    </FormGroup>
                    <FormGroup check inline>
                        <Label check>
                            <Input type="checkbox" {...register("shippingMethod.pickup")} checked={selected.pickup} onChange={togglePickup} />
                            직접 픽업
                        </Label>
                    </FormGroup>
                </div>

                {/* 에러 메시지 */}
                {errors.shippingMethod?.delivery && <p style={{ color: "red", fontSize: 13 }}>{errors.shippingMethod.delivery.message}</p>}
                {errors.shippingMethod?.pickup && <p style={{ color: "red", fontSize: 13 }}>{errors.shippingMethod.pickup.message}</p>}

                {/* 실제 폼 섹션 표시 */}
                {selected.delivery && <DeliveryTab register={register} errors={errors} />}
                {selected.pickup && <PickupTab register={register} errors={errors} />}
            </div>
        </FormGroup>
    );
}
