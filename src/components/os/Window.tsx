import { Minus, Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { WindowState } from "./types";

type WindowProps = {
  state: WindowState;
  title: string;
  icon: ReactNode;
  active: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
};

export function Window({
  state,
  title,
  icon,
  active,
  children,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onResize,
}: WindowProps) {
  const isMobile = useIsMobile();
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (dragRef.current) {
        const nextX = event.clientX - dragRef.current.dx;
        const nextY = event.clientY - dragRef.current.dy;
        onMove(
          Math.max(0, Math.min(nextX, window.innerWidth - 180)),
          Math.max(34, Math.min(nextY, window.innerHeight - 90)),
        );
      }
      if (resizeRef.current) {
        const r = resizeRef.current;
        onResize(
          Math.max(300, Math.min(r.w + (event.clientX - r.x), window.innerWidth - 16)),
          Math.max(220, Math.min(r.h + (event.clientY - r.y), window.innerHeight - 60)),
        );
      }
    },
    [onMove, onResize],
  );

  const stopTracking = useCallback(() => {
    dragRef.current = null;
    resizeRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopTracking);
    window.addEventListener("pointercancel", stopTracking);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopTracking);
      window.removeEventListener("pointercancel", stopTracking);
    };
  }, [handlePointerMove, stopTracking]);

  if (state.minimized) return null;

  // On phones/tablets every window becomes a full-bleed sheet: no clipping,
  // no dragging off-screen, and comfortably large touch targets.
  const fullBleed = isMobile || state.maximized;

  return (
    <section
      role="dialog"
      aria-label={title}
      onPointerDown={onFocus}
      className={cn(
        "window-shadow absolute flex flex-col overflow-hidden border",
        fullBleed ? "rounded-none sm:rounded-lg" : "rounded-lg",
        active ? "border-primary/60" : "border-border/70",
      )}
      style={{
        left: fullBleed ? 0 : state.x,
        top: fullBleed ? 34 : state.y,
        width: fullBleed ? "100%" : state.w,
        height: fullBleed ? "calc(100% - 34px - 3.25rem)" : state.h,
        maxWidth: "100%",
        zIndex: state.z,
        backgroundColor: "var(--color-card)",
      }}
    >
      <header
        onPointerDown={(event) => {
          if (fullBleed) return;
          dragRef.current = { dx: event.clientX - state.x, dy: event.clientY - state.y };
        }}
        onDoubleClick={() => {
          if (!isMobile) onToggleMaximize();
        }}
        className={cn(
          "flex shrink-0 items-center gap-2 border-b px-2.5 py-2 select-none sm:px-3",
          fullBleed ? "" : "cursor-grab touch-none active:cursor-grabbing",
        )}
        style={{ backgroundColor: "var(--color-titlebar)" }}
      >
        <span className="shrink-0 text-primary [&_svg]:size-4">{icon}</span>
        <h2 className="truncate font-mono text-[11px] tracking-wide text-foreground/90 sm:text-xs">
          {title}
        </h2>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Minimize window"
            onClick={onMinimize}
            className="grid size-9 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:size-7"
          >
            <Minus className="size-4" />
          </button>
          {!isMobile && (
            <button
              type="button"
              aria-label="Maximize window"
              onClick={onToggleMaximize}
              className="grid size-9 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:size-7"
            >
              <Square className="size-3.5" />
            </button>
          )}
          <button
            type="button"
            aria-label="Close window"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground sm:size-7"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <div className="term-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
        {children}
      </div>

      {!fullBleed && (
        <button
          type="button"
          aria-label="Resize window"
          onPointerDown={(event) => {
            event.stopPropagation();
            resizeRef.current = { x: event.clientX, y: event.clientY, w: state.w, h: state.h };
          }}
          className="absolute right-0 bottom-0 size-5 cursor-se-resize touch-none"
        />
      )}
    </section>
  );
}
