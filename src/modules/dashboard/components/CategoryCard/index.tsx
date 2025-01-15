import { useState, FC } from "react";
import { Category } from "../../../../domain/category";
import "./Category.scss"

interface CategoryProps {
    category: Category
}

const CategoryCard: FC<CategoryProps> = ({ category }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="category"
            style={{
                backgroundImage: `url(${category.picture?.url})`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="category-name">{category.name}</div>
        </div>
    );
};

export default CategoryCard;