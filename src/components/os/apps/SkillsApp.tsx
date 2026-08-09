import { skills } from "@/data/profile";
import { Chip, Pane, PageHeader, PathBar, SectionTitle } from "./ui";

export function SkillsApp() {
  return (
    <div>
      <PathBar path="/usr/local/bin/ — installed toolkit" />
      <Pane className="space-y-8">
        <PageHeader
          kicker="package manager"
          title="Skills & toolkit"
          intro="Tools and platforms used day to day across security, cloud and IT operations."
        />
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
