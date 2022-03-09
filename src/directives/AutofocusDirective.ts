import type { Directive } from "vue";

export const autofocusDirective: Directive = {
  mounted: (el) => el.focus(),
};
