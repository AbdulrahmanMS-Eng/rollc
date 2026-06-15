import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/types";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function Products({ locale, dict }: Props) {
  return (
    <section className="section products" id="products">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <span className="eyebrow">{dict.productsSection.eyebrow}</span>
            <h2 className="h-display">{dict.productsSection.title}</h2>
          </div>
          <a href="#" className="sec-link">
            <span>{dict.productsSection.link}</span>
            <span className="arrow">→</span>
          </a>
        </Reveal>

        <Reveal className="prod-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} dict={dict} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
