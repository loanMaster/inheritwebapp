import { Archive } from "@/entities/archive";

export interface Settings {
  interval: number;
  intervalReminder: number;
  archives: Archive[];
  active: boolean;
  triggerOnce: boolean;
  dueDate: number;
  isReminder: boolean;
  contactAttempts: number[];
  healthCheckTriggerCode: string;
}
