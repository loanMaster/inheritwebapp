<template>
  <div class="d-flex justify-content-center" v-if="!history">
    <div class="spinner-border"></div>
  </div>
  <div test="history" v-if="history">
    <table class="table table-borderless">
      <thead class="my-mobile-hidden">
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Event</th>
          <th scope="col">Email / Archive Id / Access code</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="historyEvent in history.history"
          :key="historyEvent"
          :class="tableClass(historyEvent.name)"
          test="history-event-entry"
        >
          <td>
            <span class="my-desktop-hidden my-mobile-label">Date</span>
            <span class="my-cell-value" test="history-event-date">{{
              formatDateTime(historyEvent.date)
            }}</span>
          </td>
          <td>
            <span class="my-desktop-hidden my-mobile-label">Event</span>
            <span class="my-cell-value" test="history-event-name">{{
              historyEvent.name
            }}</span>
          </td>
          <td>
            <span class="my-desktop-hidden my-mobile-label"
              >Email / Archive Id / Access code</span
            >
            <div class="my-cell-value" test="history-event-additional">
              <span v-if="historyEvent.previousFileId"
                >{{ historyEvent.previousFileId }} ->
              </span>
              {{
                historyEvent.email ||
                historyEvent.fileId ||
                historyEvent.accessCode ||
                "-"
              }}
            </div>
          </td>
        </tr>
      </tbody>
      <span v-if="history.history.length === 0" test="history-empty-list"
        >- List is empty -</span
      >
      <span v-if="history.hasMore">...</span>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { HistoryEventType } from "@/entities/history";

export default defineComponent({
  name: "History",
  data() {
    return {
      fetchingData: false,
    };
  },
  async created() {
    this.fetchingData = true;
    await this.$store.dispatch("fetchHistory");
    this.fetchingData = false;
  },
  computed: {
    history() {
      return this.$store.state.history;
    },
  },
  methods: {
    formatDateTime(date: number) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(date).toLocaleDateString("en", options as any);
    },
    tableClass(eventType: HistoryEventType) {
      switch (eventType) {
        case "Resurrection":
          return "table-primary";
        case "Health check acknowledged":
          return "table-success";
        case "Health check sent":
          return "table-danger";
        case "Health check triggered":
          return "table-warning";
        case "Death":
        case 'Deactivated "alive" switch':
          return "table-dark";
        default:
          return "";
      }
    },
  },
});
</script>

<style scoped>
td {
  white-space: nowrap;
}
td:last-of-type {
  word-break: break-all;
  white-space: normal;
}

@media only screen and (max-width: 760px),
  (min-device-width: 768px) and (max-device-width: 1024px) {
  tr {
    border: 1px solid #ccc;
  }

  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    display: flex;
  }

  .my-mobile-label {
    flex: 1;
    word-break: break-word;
  }

  .my-cell-value {
    flex: 1;
    word-break: break-all;
  }

  td:nth-of-type(1) {
    font-weight: 500;
  }
}
</style>
