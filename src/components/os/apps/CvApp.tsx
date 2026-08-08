import { Download, FileText } from "lucide-react";

import { cvFiles } from "@/data/profile";
import { Pane, PathBar } from "./ui";

export function CvApp() {
  return (
    <div>
      <PathBar path={`/home/blackpanda999/cv/ — ${cvFiles.length} items`} />
      <Pane className="space-y-4">
        <p className="text-sm text-foreground/80">
          Two tailored résumés — open in the browser or download the PDF.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {cvFiles.map((cv) => (
            <li
              key={cv.file}
              className="rounded-md border border-border/70 p-4"
              style={{ backgroundColor: "var(--color-terminal)" }}
            >
              <FileText className="size-8 text-primary" />
              <p className="mt-3 text-sm font-medium text-foreground">{cv.label}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {cv.file} · {Math.round(cv.size / 1024)} KB
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href={cv.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-sm border border-border px-3 py-1.5 font-mono text-[11px] text-foreground/85 transition-colors hover:border-primary hover:text-primary"
                >
                  open
                </a>
                <a
                  href={cv.url}
                  download={cv.file}
                  className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 font-mono text-[11px] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Download className="size-3.5" />
                  download
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Pane>
    </div>
  );
}
