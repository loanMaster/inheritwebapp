import { Archive } from "@/entities/archive";

export interface Settings {
  email: string;
  intervalReminder: number;
  archives: Archive[];
  triggerOnce: boolean;
  dueDate: number;
  isReminder: boolean;
  contactAttempts: number[];
  dead: boolean;
  justCreated: boolean;
}
