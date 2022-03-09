<template>
  <div v-if="hasSettings" class="my-center" test="user-info">
    <div class="my-word-break-all">Hi {{ email }}</div>
    <div class="mt-2" v-if="!dead">
      You are still <b>alive</b>. The access to your archives is blocked.
    </div>
    <div class="mt-2" v-if="dead">
      ⚠ You are <b>dead</b>. Your heirs can access your archives. ⚠
    </div>
    <div class="mt-2" v-if="sessionValidityMin < 10">
      ⚠ Your session will end in {{ sessionValidityMin }} min due to inactivity.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { tokenValidityDuration } from "@/util/token.utils";
import { timer, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export default defineComponent({
  data() {
    return {
      sessionEndTime: -1,
      destroy: new Subject<void>(),
    };
  },
  created() {
    timer(0, 1000)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.sessionEndTime = tokenValidityDuration(
          this.$store.state.accessToken
        );
      });
  },
  beforeUnmount() {
    this.destroy.next();
    this.destroy.complete();
  },
  computed: {
    sessionValidityMin() {
      return Math.ceil((this as any).sessionEndTime / 60);
    },
    dead() {
      return this.$store.state.settings?.dead;
    },
    email() {
      return this.$store.state.settings?.email;
    },
    hasSettings() {
      return !!this.$store.state.settings;
    },
  },
});
</script>
