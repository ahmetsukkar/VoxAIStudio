import { HandCoins } from "lucide-react";
import { getUserCredits } from "~/actions/tts";


export default async function Credits() {
  const result = await getUserCredits();
  const credits = result.success ? (result.credits as number) : 0;
  return (
    <div className="group flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <HandCoins className="h-6 w-6 text-yellow-500 transition-colors duration-200 group-hover:text-yellow-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-bold transition-colors duration-200 group-hover:text-yellow-600">
            {credits}
          </span>
          <span className="text-muted-foreground text-xs leading-tight">
            Credits
          </span>
        </div>
      </div>
    </div>
  );
}
