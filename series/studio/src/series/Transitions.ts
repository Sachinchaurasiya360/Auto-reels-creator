// Scene transitions from Remocn (all @remotion/transitions presentations), checked mid-transition in the
// 2026-11-02 trial. Use between two Beats inside a TransitionSeries; the beats overlap by the transition
// length, so total = a + b - transition.
//
//   <TransitionSeries>
//     <TransitionSeries.Sequence durationInFrames={a}><BeatA /></TransitionSeries.Sequence>
//     <TransitionSeries.Transition presentation={whipPan({ direction: "left" })} timing={linearTiming({ durationInFrames: 12 })} />
//     <TransitionSeries.Sequence durationInFrames={b}><BeatB /></TransitionSeries.Sequence>
//   </TransitionSeries>
//
// lensZoom (RGB-split skewed zoom) is the strongest; whipPan for fast topic turns; pushThrough / zoomBlur
// for "going inside" a thing. Mix with ColorWipe and match cuts to reach 3+ transition kinds per reel.

export { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
export { whipPan } from "@/components/remocn/whip-pan";
export { pushThrough } from "@/components/remocn/push-through";
export { zoomBlur } from "@/components/remocn/zoom-blur";
export { lensZoom, LENS_ZOOM_DURATION_IN_FRAMES } from "@/components/remocn/lens-zoom";
