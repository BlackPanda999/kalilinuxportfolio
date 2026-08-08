import { skills } from "@/data/profile";
import { Chip, Pane, PathBar, SectionTitle } from "./ui";

export function SkillsApp() {
  return (
    <div>
      <PathBar path="/usr/local/bin/ — installed toolkit" />
      <Pane className="space-y-6">
        {skills.map((group) => (
          <section key={group.group}>
            <SectionTitle>{group.group}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </section>
        ))}
      </Pane>
    </div>
  );
}
