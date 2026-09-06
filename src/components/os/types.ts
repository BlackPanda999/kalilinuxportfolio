export type AppId =
  | "about"
  | "projects"
  | "certifications"
  | "experience"
  | "skills"
  | "cv"
  | "contact"
  | "cyber"
  | "terminal"
  | "ai";

export type WindowState = {
  id: AppId;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};
