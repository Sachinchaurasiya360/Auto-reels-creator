import "./index.css";
import { Composition } from "remotion";
import { RateLimiterInterview, RL_FRAMES } from "./reels/RateLimiterInterview";
import { TOOL_FRAMES, ToolOfTheDay } from "./reels/ToolOfTheDay";
import { UPI_FRAMES, UpiChaiStall } from "./reels/UpiChaiStall";
import { SERIES_KIT_DEMO_FRAMES, SeriesKitDemo } from "./series/demo/SeriesKitDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="rate-limiter-interview" component={RateLimiterInterview} durationInFrames={RL_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="tool-of-the-day" component={ToolOfTheDay} durationInFrames={TOOL_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="upi-chai-stall" component={UpiChaiStall} durationInFrames={UPI_FRAMES} fps={30} width={1080} height={1920} />
      <Composition
        id="SeriesKitDemo"
        component={SeriesKitDemo}
        durationInFrames={SERIES_KIT_DEMO_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
