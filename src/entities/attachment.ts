export interface Attachment {
  name: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}
