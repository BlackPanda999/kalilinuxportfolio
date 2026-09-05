import { Shuffle, X } from "lucide-react";

import { wallpapers } from "@/data/wallpapers";
import { cn } from "@/lib/utils";

export function WallpaperPicker({
  active,
  onSelect,
  onRandomize,
  onClose,
}: {
  active: number;
  onSelect: (index: number) => void;
  onRandomize: () => void;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label="Wallpaper settings"
      className="panel-blur absolute right-2 bottom-[3.6rem] z-[9500] w-[min(22rem,calc(100vw-1rem))] rounded-xl border border-border/70 p-3 shadow-2xl"
    >
      <div className="mb-2.5 flex items-center gap-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-primary uppercase">
          appearance
        </p>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onRandomize}
            title="Pick a random wallpaper"
            aria-label="Pick a random wallpaper"
            className="flex items-center gap-1.5 rounded-md border border-border/70 px-2 py-1 font-mono text-[10.5px] text-muted-foreground transition-colors hover:border-primary/70 hover:text-primary [&_svg]:size-3.5"
          >
            <Shuffle />
            randomize
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close wallpaper settings"
            aria-label="Close wallpaper settings"
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground [&_svg]:size-4"
          >
            <X />
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-3 gap-2">
        {wallpapers.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              title={`Wallpaper ${i + 1}`}
              aria-label={`Use wallpaper ${i + 1}`}
              aria-pressed={active === i}
              className={cn(
                "block w-full overflow-hidden rounded-lg border transition-all",
                active === i
                  ? "border-primary glow-primary"
                  : "border-border/60 hover:border-primary/60",
              )}
            >
              <img
                src={src}
                alt=""
                width={320}
                height={180}
                loading="lazy"
                className="aspect-video size-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
        tip: every refresh picks a fresh background.
      </p>
    </div>
  );
}
