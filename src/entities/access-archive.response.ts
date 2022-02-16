import { Archive } from "@/entities/archive";

export interface AccessArchiveResponse {
  email: string;
  archive: Archive;
  intervalReminder: number;
  dead: boolean;
  dueDate: number;
  contactAttempts: number[];
  triggerOnce: boolean;
}
