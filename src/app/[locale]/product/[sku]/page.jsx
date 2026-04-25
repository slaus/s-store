import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ProductPageClient from "./ProductPageClient";
import { getProductBySku, getProducts } from "@/utils/db";

// Генерация мета-тегов (title, description)
export async function generateMetadata({ params }) {
  const { locale, sku } = await params;
  const product = await getProductBySku(sku);
  if (!product) return { title: "Товар не найден" };
  const title = product.metaTitle?.[locale] || product.title?.[locale] || product.title?.uk;
  const description = product.metaDescription?.[locale] || product.description?.[locale] || "";
  return { title, description };
}

// (Опционально) статические пути для SSG
export async function generateStaticParams() {
  const products = await getProducts("uk", {}, { limit: 100 });
  return products.map((p) => ({ sku: p.sku, locale: "uk" }));
}

export default async function ProductPage({ params }) {
  const { locale, sku } = await params;
  const product = await getProductBySku(sku);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "common" });
  const title = product.title?.[locale] || product.title?.uk;
  const description = product.description?.[locale] || "";
  const imgUrl = product.images?.[0] || "/images/no-photo.jpg";

  // JSON-LD Schema.org
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.salePrice || product.price,
      priceCurrency: "UAH",
      availability: product.visible ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    image: imgUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductPageClient
        product={product}
        locale={locale}
        t={{
          discount: t("discount"),
          new: t("new"),
          currency: t("currency"),
        }}
      />
    </>
  );
}