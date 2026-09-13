# Blackpanda Team desktop upgrade

## What will change

- Remove both wallpaper chooser buttons and the chooser panel. Keep the uploaded wallpaper collection and select one randomly on every full page refresh.
- Rename the top-left system label to **Blackpanda Team**.
- Restyle the top system indicators in active green, matching the supplied reference. Make Wi-Fi, sound, and notifications interactive status controls with clear tooltips and accessible labels; keep CPU, battery, clock, and lock readable.
- Expand Terminal into a safe Linux practice shell with a realistic prompt, filesystem navigation, command history, help/manual pages, common read-only commands, demo files, command chaining where appropriate, and the existing CTF challenge. Potentially dangerous commands will remain simulated.
- Upgrade Ask AI so visitors can ask Linux command, cybersecurity learning, ethical-hacking, defensive-security, and portfolio questions. Add relevant starter prompts and render replies as readable Markdown.
- Move the AI route to the required Lovable AI default model and streaming Responses API, preserve full conversation history, show reasoning status, forward request tracking, and surface useful service errors.
- Improve loading speed by rendering only the selected wallpaper instead of loading every large wallpaper at once.

## Validation

- Test boot skip, randomized wallpaper behavior, top indicators, terminal commands and CTF flow on desktop and mobile.
- Send a real question through Ask AI and confirm the streamed answer displays correctly.
- Confirm there are no browser errors, clipping, or leftover wallpaper controls.

## Technical details

- The terminal remains an educational simulation; it cannot access or modify the visitor’s real device.
- AI guidance will enforce legal, authorized, defensive cybersecurity use and refuse harmful requests while offering safe alternatives.
