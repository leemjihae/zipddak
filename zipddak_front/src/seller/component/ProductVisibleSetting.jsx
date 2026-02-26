import { FormGroup, Input, Label, FormFeedback } from "reactstrap";

export default function VisibleSetting({ visible, setVisible }) {
    return (
        <FormGroup className="position-relative ">
            <Label for="examplePassword" className="input_title">
                상품 공개 유무<span className="required">*</span>
            </Label>
            <div>
                <FormGroup check inline>
                    <Label check>
                        <Input type="radio" name="visibleYN" value="hide" checked={visible === "hide"} onChange={(e) => setVisible(e.target.value)} />
                        비공개
                    </Label>
                </FormGroup>
                <FormGroup check inline>
                    <Label check>
                        <Input type="radio" name="visibleYN" value="open" checked={visible === "open"} onChange={(e) => setVisible(e.target.value)} />
                        공개
                    </Label>
                </FormGroup>
            </div>
        </FormGroup>
    );
}
