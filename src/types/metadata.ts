export interface Metadata {
  title?: string;
  listeners?: number;
  bitrate?: number;
  type: 'SHOUTCAST_V1' | 'SHOUTCAST_V2' | 'ICECAST' | 'ICY';
}
