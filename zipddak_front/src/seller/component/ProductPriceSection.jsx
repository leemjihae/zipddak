import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

export default function PriceSection({ price, salePrice, discountRate, handlePrice, handleSalePrice, handleDiscountRate }) {
    return (
        <>
            <FormGroup className="position-relative">
                <Label className="input_title">
                    가격<span className="required">*</span>
                </Label>
                <div className="unit_set">
                    <Input className=" unit" value={price} placeholder="가격을 입력하세요" onChange={(e) => handlePrice(e.target.value)} />
                    {/* invalid */}
                    {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                    <span>원</span>
                </div>
            </FormGroup>

            <div className="position-relative input_set mb-4">
                <FormGroup className="position-relative">
                    <Label for="examplePassword" className="input_title">
                        판매가
                    </Label>
                    <div className="unit_set">
                        <Input className=" unit" value={salePrice} onChange={(e) => handleSalePrice(e.target.value)} /> {/* invalid */}
                        {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                        <span>원</span>
                    </div>
                </FormGroup>

                <FormGroup className="position-relative">
                    <Label for="examplePassword" className="input_title">
                        할인율
                    </Label>
                    <div className="unit_set">
                        <Input className=" unit" value={discountRate} onChange={(e) => handleDiscountRate(e.target.value)} /> {/* invalid */}
                        {/* <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback> */}
                        <span>%</span>
                    </div>
                </FormGroup>
            </div>
        </>
    );
}
