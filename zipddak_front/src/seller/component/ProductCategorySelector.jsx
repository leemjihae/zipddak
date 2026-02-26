//css
import product from "../css/productRegist.module.css";

import { FormGroup, Label, Input } from "reactstrap";

export default function CategorySelector({ categories, selectedCategory, setSelectedCategory, subCategories, selectedSubCategory, setSelectedSubCategory }) {
    // DB에서 가져온 전체 카테고리 배열,  선택된 카테고리 ID, 카테고리 선택 세터,  선택된 카테고리의 소카테 배열

    return (
        <FormGroup className="position-relative mb-4">
            <Label className="input_title">
                카테고리<span className="required">*</span>
            </Label>

            {/* 상위 카테고리 */}
            <div>
                {categories.map((cat) => (
                    <FormGroup key={cat.categoryIdx} check inline className="mt-2">
                        <Label check>
                            <Input type="radio" name="productCategory" value={cat.categoryIdx} checked={String(selectedCategory) === String(cat.categoryIdx)} onChange={(e) => setSelectedCategory(e.target.value)} />
                            {cat.name}
                        </Label>
                    </FormGroup>
                ))}
            </div>

            {/* 소카테고리 */}
            {subCategories.length > 0 && (
                <div className={[product.small_category, "mt-3"].join(" ")}>
                    {subCategories.map((sub) => (
                        <FormGroup check inline key={sub.categoryIdx}>
                            <Label check>
                                <Input type="radio" name="productSubCategory" value={sub.categoryIdx} checked={String(selectedSubCategory) === String(sub.categoryIdx)} onChange={(e) => setSelectedSubCategory(e.target.value)} />
                                {sub.name}
                            </Label>
                        </FormGroup>
                    ))}
                </div>
            )}
        </FormGroup>
    );
}
