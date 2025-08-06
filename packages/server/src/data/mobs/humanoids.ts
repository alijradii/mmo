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
};
