import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { productList } from "@/lib/api";
import ProductListSkeleton from "@/components/ProductListSkeleton";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  created_at: string;
}

export interface ProductsProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  image_url: string;
  reviews: Review[];
  summary_updated_at: string;
  review_summary:  string
}

export default function Products() {
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      const response = await productList();
      console.log("Fetched products:", response);
      setProducts(response);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Curated - Premium Products Collection</title>
        <meta
          name="description"
          content="Discover our curated collection of premium products. Shop handcrafted goods, minimalist accessories, and sustainable essentials."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 md:py-12">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Our Collections
            </h1>
            <p className="mt-2 text-muted-foreground">
              Thoughtfully selected products for modern living
            </p>
          </div>
          {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div> */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductListSkeleton key={i} />
                ))
              : products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </main>
      </div>
    </>
  );
}
