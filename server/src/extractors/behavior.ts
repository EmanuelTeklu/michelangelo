import type { Page } from "playwright";
import type {
  BehaviorData,
  TransitionInfo,
  AnimationInfo,
  TransformInfo,
} from "../types.js";

interface RawBehaviorResult {
  readonly transitions: ReadonlyArray<{
    readonly selector: string;
    readonly property: string;
    readonly duration: string;
    readonly timingFunction: string;
    readonly delay: string;
  }>;
  readonly animations: ReadonlyArray<{
    readonly selector: string;
    readonly name: string;
    readonly duration: string;
    readonly timingFunction: string;
    readonly iterationCount: string;
  }>;
  readonly transforms: ReadonlyArray<{
    readonly selector: string;
    readonly value: string;
  }>;
}

export async function extractBehavior(page: Page): Promise<BehaviorData> {
  const raw = await page.evaluate((): RawBehaviorResult => {
    const elements = document.querySelectorAll("*");
    const transitions: RawBehaviorResult["transitions"][number][] = [];
    const animations: RawBehaviorResult["animations"][number][] = [];
    const transforms: RawBehaviorResult["transforms"][number][] = [];

    function selectorFor(el: Element): string {
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : "";
      const cls = Array.from(el.classList)
        .slice(0, 2)
        .map((c) => `.${c}`)
        .join("");
      return `${tag}${id}${cls}`;
    }

    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const selector = selectorFor(el);

      // Transitions
      const tProp = style.transitionProperty;
      const tDur = style.transitionDuration;
      if (tProp && tProp !== "all" && tDur && tDur !== "0s") {
        transitions.push({
          selector,
          property: tProp,
          duration: tDur,
          timingFunction: style.transitionTimingFunction,
          delay: style.transitionDelay,
        });
      }

      // Animations
      const aName = style.animationName;
      const aDur = style.animationDuration;
      if (aName && aName !== "none" && aDur && aDur !== "0s") {
        animations.push({
          selector,
          name: aName,
          duration: aDur,
          timingFunction: style.animationTimingFunction,
          iterationCount: style.animationIterationCount,
        });
      }

      // Transforms
      const transform = style.transform;
      if (transform && transform !== "none") {
        transforms.push({ selector, value: transform });
      }
    });

    return { transitions, animations, transforms };
  });

  const transitions: ReadonlyArray<TransitionInfo> = raw.transitions.map(
    (t) => ({
      selector: t.selector,
      property: t.property,
      duration: t.duration,
      timingFunction: t.timingFunction,
      delay: t.delay,
    }),
  );

  const animationEntries: ReadonlyArray<AnimationInfo> = raw.animations.map(
    (a) => ({
      selector: a.selector,
      name: a.name,
      duration: a.duration,
      timingFunction: a.timingFunction,
      iterationCount: a.iterationCount,
    }),
  );

  const transformEntries: ReadonlyArray<TransformInfo> = raw.transforms.map(
    (t) => ({
      selector: t.selector,
      value: t.value,
    }),
  );

  return {
    transitions,
    animations: animationEntries,
    transforms: transformEntries,
    totalAnimated:
      transitions.length + animationEntries.length + transformEntries.length,
  };
}
