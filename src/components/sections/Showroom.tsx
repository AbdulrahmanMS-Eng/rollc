"use client";

import { useState } from "react";
import type { Dictionary } from "@/dictionaries/types";
import { roomImage } from "@/data/site";
import Reveal from "@/components/ui/Reveal";

export default function Showroom({ dict }: { dict: Dictionary }) {
  const [night, setNight] = useState(false);
  const sr = dict.showroom;

  return (
    <section className={`section showroom${night ? " night" : ""}`} id="showroom">
      <div className="wrap">
        <Reveal className="show-head">
          <div>
            <span className="eyebrow">{sr.eyebrow}</span>
            <h2 className="h-display">{sr.title}</h2>
            <p>{sr.body}</p>
          </div>
          <div className="mode-toggle">
            <span className={`ml${!night ? " on" : ""}`}>{sr.dayMode}</span>
            <button className="switch" onClick={() => setNight((v) => !v)} aria-label={dict.a11y.modeSwitch}>
              <span className="knob" />
            </button>
            <span className={`ml${night ? " on" : ""}`}>{sr.nightMode}</span>
          </div>
        </Reveal>

        <Reveal className="room">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="room-photo" src={roomImage} alt={sr.roomName} />
          <div className="grade-day" />
          <div className="grade-night" />
          <div className="glow center" />
          <div className="glow lamp-l" />
          <div className="glow lamp-r" />
          <div className="glow floor" />
          <span className="bulb b1" />
          <span className="bulb b2" />
          <div className="room-caption">
            <div>
              <p className="rc-name">{sr.roomName}</p>
              <p className="rc-sub">{sr.roomSub}</p>
            </div>
            <span className="rc-tag">{night ? sr.lightsOn : sr.lightsOff}</span>
          </div>
        </Reveal>

        <p className="show-note">{sr.note}</p>
      </div>
    </section>
  );
}
