<template>
  <div class="d-flex justify-content-center" v-if="!history">
    <div class="spinner-border"></div>
  </div>
  <div test="history" v-if="history">
    <table class="table table-borderless">
      <thead>
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
          <td test="history-event-date">
            {{ formatDateTime(historyEvent.date) }}
          </td>
          <td test="history-event-name">{{ historyEvent.name }}</td>
          <td test="history-event-additional">
            <span v-if="historyEvent.previousFileId"
              >{{ historyEvent.previousFileId }} ->
            </span>
            {{
              historyEvent.email ||
              historyEvent.fileId ||
              historyEvent.accessCode ||
              "-"
            }}
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
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
  }

  td:nth-of-type(1) {
    font-weight: 500;
  }
  td:nth-of-type(2) {
    white-space: normal;
  }
  td:nth-of-type(1):before {
    content: "Date";
  }
  td:nth-of-type(2):before {
    content: "Event";
  }
  td:nth-of-type(3):before {
    content: "Email / Archive id / Code";
  }
}
</style>
