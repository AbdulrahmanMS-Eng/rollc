import { RollcHomePage } from "@/components/rollc/RollcHomePage";

export default function Home() {
  return (
    <div className="scroll-shell">
      <div className="rollc-page">
        <RollcHomePage locale="ar" />
      </div>
    </div>
  );
}
