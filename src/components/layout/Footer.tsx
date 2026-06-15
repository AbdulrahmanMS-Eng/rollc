import type { Dictionary } from "@/dictionaries/types";
import { socials, payments } from "@/data/site";
import NewsletterForm from "./NewsletterForm";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <span className="mark">
              Roll<b>c</b>
            </span>
            <div className="ar">رولـك</div>
            <p className="foot-statement">{dict.footer.statement}</p>
            <div className="socials">
              {socials.map((s) => (
                <a key={s} href="#" aria-label={s}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="foot-col">
            <h4>{dict.footer.shopTitle}</h4>
            {dict.footer.shopLinks.map((l, i) => (
              <a key={i} href="#">
                {l}
              </a>
            ))}
          </div>

          <div className="foot-col">
            <h4>{dict.footer.companyTitle}</h4>
            {dict.footer.companyLinks.map((l, i) => (
              <a key={i} href="#">
                {l}
              </a>
            ))}
          </div>

          <div className="foot-col news">
            <h4>{dict.footer.joinTitle}</h4>
            <p>{dict.footer.joinBody}</p>
            <NewsletterForm dict={dict} />
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2026 Rollc رولك. {dict.footer.rights}</span>
          <span className="pay">{dict.footer.payLabel} {payments}</span>
        </div>
      </div>
    </footer>
  );
}
