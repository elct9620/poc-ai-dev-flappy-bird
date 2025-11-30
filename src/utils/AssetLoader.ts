import { Assets, Texture } from "pixi.js";

import digit0 from "@/assets/ui/numbers/0.png";
import digit1 from "@/assets/ui/numbers/1.png";
import digit2 from "@/assets/ui/numbers/2.png";
import digit3 from "@/assets/ui/numbers/3.png";
import digit4 from "@/assets/ui/numbers/4.png";
import digit5 from "@/assets/ui/numbers/5.png";
import digit6 from "@/assets/ui/numbers/6.png";
import digit7 from "@/assets/ui/numbers/7.png";
import digit8 from "@/assets/ui/numbers/8.png";
import digit9 from "@/assets/ui/numbers/9.png";

export async function loadNumberAssets(): Promise<Record<string, Texture>> {
  const paths: Record<string, string> = {
    "0": digit0,
    "1": digit1,
    "2": digit2,
    "3": digit3,
    "4": digit4,
    "5": digit5,
    "6": digit6,
    "7": digit7,
    "8": digit8,
    "9": digit9,
  };

  const textures: Record<string, Texture> = {};
  for (const [digit, path] of Object.entries(paths)) {
    textures[digit] = await Assets.load<Texture>(path);
  }

  return textures;
}
