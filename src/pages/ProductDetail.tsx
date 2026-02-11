import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { Header } from "@/components/Header";
import { RatingStars } from "@/components/RatingStars";
import { RatingSummary } from "@/components/RatingSummary";
import { AISummary } from "@/components/AISummary";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { ProductsProps } from "./Products";
import { productDetail } from "@/lib/api";



export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductsProps | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProductDetail() {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await productDetail(slug);
      console.log("Fetched product detail:", response);
      setProduct(response);
    } catch (error) {
      console.error("Failed to fetch product detail:", error);
    }
    finally {
      setLoading(false);
    }
  }

  useState(() => {
    console.log("Fetching product detail for slug:", slug);
    fetchProductDetail();
  }, [slug]);


  if (loading) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading product details…
          </p>
        </div>
      </main>
    </div>
  );
}



  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Product not found
          </h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            Back to products
          </Link>
        </main>
      </div>
    );
  }

  const avgRating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  return (
    <>
      <Helmet>
        <title>{product.name} - Curated</title>
        <meta name="description" content={product.description.slice(0, 155)} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6 md:py-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Product Image */}
            <div className="overflow-hidden rounded-xl bg-muted">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-center gap-3">
                  <RatingStars rating={avgRating} size="md" showValue />
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
              </div>

              <p className="text-2xl font-bold text-primary">
                ${product.price}
              </p>

              <p className="text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <Button size="lg" className="w-full gap-2 md:w-auto">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="mt-12 space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Reviews
            </h2>

            <div className="grid gap-6 lg:grid-cols-2">
              <RatingSummary reviews={product.reviews} />
              <AISummary productSlug={product.slug} productSummary={product.review_summary} productName={product.name} />
            </div>

            <Card className="border-0 shadow-sm bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-lg">
                  All Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {product.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}
