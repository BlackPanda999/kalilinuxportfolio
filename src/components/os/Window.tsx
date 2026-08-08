import { Minus, Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

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
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (dragRef.current) {
        const nextX = event.clientX - dragRef.current.dx;
        const nextY = event.clientY - dragRef.current.dy;
        onMove(Math.max(0, Math.min(nextX, window.innerWidth - 180)), Math.max(34, nextY));
      }
      if (resizeRef.current) {
        const r = resizeRef.current;
        onResize(Math.max(340, r.w + (event.clientX - r.x)), Math.max(220, r.h + (event.clientY - r.y)));
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
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopTracking);
    };
  }, [handlePointerMove, stopTracking]);

  if (state.minimized) return null;

  const maximized = state.maximized;

  return (
    <section
      role="dialog"
      aria-label={title}
      onPointerDown={onFocus}
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-lg border window-shadow",
        active ? "border-primary/60" : "border-border/70",
      )}
      style={{
        left: maximized ? 0 : state.x,
        top: maximized ? 34 : state.y,
        width: maximized ? "100%" : state.w,
        height: maximized ? "calc(100% - 34px - 3.25rem)" : state.h,
        zIndex: state.z,
        backgroundColor: "var(--color-card)",
      }}
    >
      <header
        onPointerDown={(event) => {
          if (maximized) return;
          dragRef.current = { dx: event.clientX - state.x, dy: event.clientY - state.y };
        }}
        onDoubleClick={onToggleMaximize}
        className={cn(
          "flex shrink-0 items-center gap-2 border-b px-3 py-2 select-none",
          maximized ? "" : "cursor-grab active:cursor-grabbing",
        )}
        style={{ backgroundColor: "var(--color-titlebar)" }}
      >
        <span className="text-primary [&_svg]:size-4">{icon}</span>
        <h2 className="truncate font-mono text-xs tracking-wide text-foreground/90">{title}</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Minimize window"
            onClick={onMinimize}
            className="grid size-6 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Maximize window"
            onClick={onToggleMaximize}
            className="grid size-6 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Square className="size-3" />
          </button>
          <button
            type="button"
            aria-label="Close window"
            onClick={onClose}
            className="grid size-6 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </header>

      <div className="term-scroll min-h-0 flex-1 overflow-auto">{children}</div>

      {!maximized && (
        <button
          type="button"
          aria-label="Resize window"
          onPointerDown={(event) => {
            event.stopPropagation();
            resizeRef.current = { x: event.clientX, y: event.clientY, w: state.w, h: state.h };
          }}
          className="absolute right-0 bottom-0 size-4 cursor-se-resize"
        />
      )}
    </section>
  );
}
