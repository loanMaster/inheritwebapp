import { mapError } from "@/util/map.error";
import { EventHistory } from "@/entities/history";

export class HistoryService {
  async fetchHistory(): Promise<EventHistory> {
    const response = await fetch(`/api/history`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await mapError(response, "Error fetching data.");
    return response.json();
  }
}
