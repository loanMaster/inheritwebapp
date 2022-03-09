export type HistoryEventType =
  | "Health check sent"
  | "Access code changed"
  | "Death"
  | "Resurrection"
  | "Archive created"
  | "Archive deleted"
  | "Archive content replaced"
  | "Health check triggered"
  | "Settings changed"
  | "First access to dashboard"
  | 'Deactivated "alive" switch'
  | "Sign up"
  | "Health check acknowledged";

export interface HistoryEvent {
  name: HistoryEventType;
  date: number;
  email?: string;
  fileId?: string;
  previousFileId?: string;
  accessCode?: string;
}

export interface EventHistory {
  history: HistoryEvent[];
  hasMore: boolean;
}
