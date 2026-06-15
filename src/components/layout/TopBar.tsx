import type { Dictionary } from "@/dictionaries/types";

export default function TopBar({ dict }: { dict: Dictionary }) {
  // Split the topbar text so the highlighted phrase keeps its gold styling.
  const [before] = dict.topbar.split(dict.topbarHighlight);
  return (
    <div className="topbar">
      <span>
        {before}
        <b>{dict.topbarHighlight}</b>
      </span>
    </div>
  );
}
