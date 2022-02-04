export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedThumnail {
  url: string;
}

export interface EmbedMessage {
  author?: {
    iconUrl?: string;
    name: string;
    url?: string;
  };
  color?: number;
  description?: string;
  fields?: EmbedField[];
  footer?: string;
  title?: string;
  url?: string;
  thumnail: EmbedThumnail;
}
