export type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  footer?: {
    text: string;
    icon_url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
};
