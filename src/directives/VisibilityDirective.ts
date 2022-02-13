import type { Directive } from "vue";

export const visibilityDirective: Directive = ({ style }, { value }) => {
  style.visibility = value ? "" : "hidden";
};
