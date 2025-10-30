export interface PrefixConfig {
  name: string;
  fontSize: string;
  color: string;
}

export interface ParsedContent {
  prefix: string | null;
  text: string;
  style: {
    fontSize: string;
    color: string;
  };
}