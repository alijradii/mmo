export interface HumanoidAppearance {
  frontextra?: string;
  hat?: string;
  head?: string;
  hair?: string;
  top?: string;
  bottom?: string;
  backextra?: string;
  backhair?: string;
}

export const HUMANOIDS_APPEARANCE: { [key: string]: HumanoidAppearance } = {
  baseSkeleton: {
    head: "head_skull",
    top: "top11_c5",
    bottom: "bottom13_c7",
  },
  castleGuard: {
    head: "head3",
    hat: "hat3",
    top: "top11_c5",
    bottom: "bottom13_c15",
  },
  royalGuard: {
    hat: "hat8_c3",
    head: "head2",
    top: "top11_c3",
    bottom: "bottom18_c3"
  }
};
