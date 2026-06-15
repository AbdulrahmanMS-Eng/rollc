import type { Dictionary } from "@/dictionaries/types";
import { signatureImage } from "@/data/site";
import { pillarIcons } from "@/components/ui/icons";
import Reveal from "@/components/ui/Reveal";

export default function Signature({ dict }: { dict: Dictionary }) {
  return (
    <section className="section signature">
      <div className="wrap">
        <div className="sig-grid">
          <Reveal className="sig-visual">
            <div className="main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={signatureImage} alt={dict.signature.title} />
            </div>
            <div className="badge">
              <div className="num">{dict.signature.badgeNum}</div>
              <div className="lbl">{dict.signature.badgeLabel}</div>
            </div>
          </Reveal>

          <Reveal className="sig-text">
            <span className="eyebrow">{dict.signature.eyebrow}</span>
            <h2 className="h-display">{dict.signature.title}</h2>
            <p className="lead">{dict.signature.body}</p>

            <div className="pillars">
              {dict.signature.pillars.map((pillar, i) => {
                const Icon = pillarIcons[i];
                return (
                  <div className="pillar" key={i}>
                    <span className="pi">
                      <Icon />
                    </span>
                    <h3>{pillar.title}</h3>
                    <p>{pillar.body}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
