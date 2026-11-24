# Claude mascot artwork

The footer uses Icons8's original **Color** Clawd SVGs, downloaded using the
site's SVG embed option. These icons are offered free with a link to Icons8;
the About page provides a visible attribution link in its Disclaimer section.

Source collection: https://icons8.com/icons/set/anthropic-claude
License: https://icons8.com/license

| Local file in `public/images/claude/` | Original                                                |
| ------------------------------------- | ------------------------------------------------------- |
| `neutral.svg`                         | https://icons8.com/icon/I6SkjDfWkWF0/clawd              |
| `up.svg`                              | https://icons8.com/icon/v1WcNdhmDm37/clawd-looking-up   |
| `right.svg`                           | https://icons8.com/icon/CkCC2YDSElU5/clawd-looking-righ |
| `down.svg`                            | https://icons8.com/icon/JzrjH5RCZz7I/clawd-looking-down |
| `left.svg`                            | https://icons8.com/icon/v2NiRbNL6u5m/clawd-looking-left |
| `dizzy.svg`                           | https://icons8.com/icon/QCVqGJAHXaAP/clawd-dizzy        |
| `sleeping.svg`                        | https://icons8.com/icon/IJM9GlYiqcQn/clawd-sleeping     |
| `happy.svg`                           | https://icons8.com/icon/R8xIuMXChJtp/clawd-happy        |

The artwork is hosted locally and is not recolored. `ClaudeMascot` is shared
between the React pages and Hugo's rendered/hydrated footer. It follows pointer
direction only while the cursor is inside the footer and resets circle tracking on exit.
It gets dizzy after two nearby circles within 2.4 seconds, sleeps after eight seconds without input,
and becomes happy for two seconds on click or keyboard activation. Expressions
switch directly; there is no continuous motion or animation loop.

The pixel coffee cup is original SVG artwork. Its steam moves in discrete steps
and stays still when reduced motion is requested.
