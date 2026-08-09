import { Download, FileText } from "lucide-react";

import { cvFiles } from "@/data/profile";
import { Card, Pane, PageHeader, PathBar } from "./ui";

export function CvApp() {
  return (
    <div>
      <PathBar path={`/home/blackpanda999/cv/ — ${cvFiles.length} items`} />
      <Pane className="space-y-6">
        <PageHeader
          kicker="documents"
          title="Résumés"
          intro="Two tailored CVs — open in the browser or download the PDF."
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {cvFiles.map((cv) => (
            <li key={cv.file}>
              <Card className="p-5">
                <span className="grid size-11 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </span>
                <p className="mt-4 text-base font-semibold text-foreground">{cv.label}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {cv.file} · {Math.round(cv.size / 1024)} KB
                </p>
                <div className="mt-5 flex gap-2">
                  <a
                    href={cv.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-border px-3 py-1.5 font-mono text-[11px] text-foreground/85 transition-colors hover:border-primary hover:text-primary"
                  >
                    open
                  </a>
                  <a
                    href={cv.url}
                    download={cv.file}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-mono text-[11px] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Download className="size-3.5" />
                    download
                  </a>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Pane>
    </div>
  );
}
