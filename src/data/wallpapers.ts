import wallpaper1 from "@/assets/wallpaper.jpg";
import wallpaper2 from "@/assets/wallpaper-2.jpg";
import wallpaper3 from "@/assets/wallpaper-3.jpg";
import wallpaper4 from "@/assets/wallpaper-4.jpg";
import wallpaper5 from "@/assets/wallpaper-5.jpg";
import kaliTiles from "@/assets/kali-tiles.jpg.asset.json";
import kaliHack from "@/assets/kali-hack.jpg.asset.json";
import kaliGlitch from "@/assets/kali-glitch.jpg.asset.json";
import kaliCubes from "@/assets/kali-cubes.jpg.asset.json";
import kaliNet from "@/assets/kali-net.jpg.asset.json";
import kali2026Cubes from "@/assets/kali-2026-cubes-4k.jpg.asset.json";

export const wallpapers = [
  kali2026Cubes.url,
  kaliTiles.url,
  kaliCubes.url,
  kaliNet.url,
  kaliGlitch.url,
  kaliHack.url,
  wallpaper1,
  wallpaper2,
  wallpaper3,
  wallpaper4,
  wallpaper5,
];

/** Random wallpaper index — changes on every page load / refresh. */
export function randomWallpaperIndex() {
  return Math.floor(Math.random() * wallpapers.length);
}
