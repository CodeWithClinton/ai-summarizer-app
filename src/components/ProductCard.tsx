import { Link } from "react-router-dom";
import { RatingStars } from "./RatingStars";
import { Card, CardContent } from "@/components/ui/card";
import { ProductsProps } from "@/pages/Products";

interface Props {
  product: ProductsProps;
}

export function ProductCard({ product }: Props) {
  const avgRating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover-lift bg-card">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
            <div className="flex items-center gap-1.5">
              <RatingStars rating={avgRating} size="sm" />
              <span className="text-xs text-muted-foreground">
                ({product.reviews.length})
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
