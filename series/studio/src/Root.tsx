import "./index.css";
import { Composition } from "remotion";
import { RateLimiterInterview, RL_FRAMES } from "./reels/RateLimiterInterview";
import { TOOL_FRAMES, ToolOfTheDay } from "./reels/ToolOfTheDay";
import { UPI_FRAMES, UpiChaiStall } from "./reels/UpiChaiStall";
import { FASTAG_FRAMES, FastagToll } from "./reels/FastagToll";
import { OTP_FRAMES, OtpSms } from "./reels/OtpSms";
import { CACHE_FRAMES, CacheInterview } from "./reels/CacheInterview";
import { CNAP_FRAMES, CallerNameCnap } from "./reels/CallerNameCnap";
import { IDEM_FRAMES, IdempotencyInterview } from "./reels/IdempotencyInterview";
import { INCOG_FRAMES, IncognitoMyth } from "./reels/IncognitoMyth";
import { NOV01_SF_FRAMES, Nov01StyleFrames } from "./reels/styleframes/Nov01StyleFrames";
import { KIT_CHECK_FRAMES, KitCheck } from "./reels/styleframes/KitCheck";
import { NOV02_SF_FRAMES, Nov02StyleFrames } from "./reels/styleframes/Nov02StyleFrames";
import { LIB_TRIAL_FRAMES, LibTrial } from "./reels/styleframes/LibTrial";
import { SERIES_KIT_DEMO_FRAMES, SeriesKitDemo } from "./series/demo/SeriesKitDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="rate-limiter-interview" component={RateLimiterInterview} durationInFrames={RL_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="tool-of-the-day" component={ToolOfTheDay} durationInFrames={TOOL_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="upi-chai-stall" component={UpiChaiStall} durationInFrames={UPI_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="fastag-toll" component={FastagToll} durationInFrames={FASTAG_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="otp-sms" component={OtpSms} durationInFrames={OTP_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="cache-interview" component={CacheInterview} durationInFrames={CACHE_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="caller-name-cnap" component={CallerNameCnap} durationInFrames={CNAP_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="idempotency-interview" component={IdempotencyInterview} durationInFrames={IDEM_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="incognito-myth" component={IncognitoMyth} durationInFrames={INCOG_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="nov01-styleframes" component={Nov01StyleFrames} durationInFrames={NOV01_SF_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="kit-check" component={KitCheck} durationInFrames={KIT_CHECK_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="nov02-styleframes" component={Nov02StyleFrames} durationInFrames={NOV02_SF_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="lib-trial" component={LibTrial} durationInFrames={LIB_TRIAL_FRAMES} fps={30} width={1080} height={1920} />
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
