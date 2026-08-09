import wallpaper1 from "@/assets/wallpaper.jpg";
import wallpaper2 from "@/assets/wallpaper-2.jpg";
import wallpaper3 from "@/assets/wallpaper-3.jpg";
import wallpaper4 from "@/assets/wallpaper-4.jpg";
import wallpaper5 from "@/assets/wallpaper-5.jpg";

export const wallpapers = [wallpaper1, wallpaper2, wallpaper3, wallpaper4, wallpaper5];

/** Random wallpaper index — changes on every page load / refresh. */
export function randomWallpaperIndex() {
  return Math.floor(Math.random() * wallpapers.length);
}
