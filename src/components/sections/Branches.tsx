import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/dictionaries/types";
import { branches } from "@/data/site";
import { PinIcon } from "@/components/ui/icons";
import Reveal from "@/components/ui/Reveal";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function Branches({ locale, dict }: Props) {
  return (
    <section className="section branches" id="branches">
      <div className="wrap">
        <div className="br-inner">
          <Reveal className="br-text">
            <span className="eyebrow">{dict.branches.eyebrow}</span>
            <h2 className="h-display">{dict.branches.title}</h2>
            <p>{dict.branches.body}</p>
            <a href="#" className="btn btn--solid br-book-btn">
              <span>{dict.branches.cta}</span>
              <span className="arrow">→</span>
            </a>
          </Reveal>

          <Reveal className="br-grid">
            {branches.map((branch, i) => (
              <article className="br-card" key={i}>
                <h3 className="br-city">
                  <span className="pin">
                    <PinIcon />
                  </span>
                  <span>{branch.city[locale]}</span>
                </h3>
                <p className="br-addr">{branch.addr[locale]}</p>
                <p className="br-hours">{branch.hours}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
