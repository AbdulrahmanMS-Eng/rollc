import { RollcHomePage } from "@/components/rollc/RollcHomePage";

export default function EnglishHome() {
  return (
    <div className="scroll-shell">
      <div className="rollc-page rollc-page-en">
        <RollcHomePage locale="en" />
      </div>
    </div>
  );
}
