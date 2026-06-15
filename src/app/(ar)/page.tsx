import { RollcHomePage } from "@/components/rollc/RollcHomePage";

export default function Home() {
  return (
    <div className="scroll-shell">
      <div className="rollc-page rollc-page-ar">
        <RollcHomePage locale="ar" />
      </div>
    </div>
  );
}
