import { Props, print, commandHelp, blue, bold, gray } from "bluebun";

export default {
  name: "help",
  description: "Default command",
  run: async (props: Props) => {
    print(``);
    // needs 2 start chars for some reason?!?!
    print(blue(bold(`CClippy CLI`)));
    print(``);
    print(await commandHelp(props));
  },
};
