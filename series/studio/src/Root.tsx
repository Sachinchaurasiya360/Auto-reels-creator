import "./index.css";
import { Composition } from "remotion";
import { RateLimiterInterview, RL_FRAMES } from "./reels/RateLimiterInterview";
import { TOOL_FRAMES, ToolOfTheDay } from "./reels/ToolOfTheDay";
import { UPI_FRAMES, UpiChaiStall } from "./reels/UpiChaiStall";
import { FASTAG_FRAMES, FastagToll } from "./reels/FastagToll";
import { OTP_FRAMES, OtpSms } from "./reels/OtpSms";
import { CACHE_FRAMES, CacheInterview } from "./reels/CacheInterview";
import { ATM_FRAMES, AtmCash } from "./reels/AtmCash";
import { WA_FRAMES, WhatsappTicks } from "./reels/WhatsappTicks";
import { FLOCI_FRAMES, FlociAws } from "./reels/FlociAws";
import { SURGE_FRAMES, SurgePricing } from "./reels/SurgePricing";
import { LB6_FRAMES, LoadBalancerPart6 } from "./reels/LoadBalancerPart6";
import { NOTES_FRAMES, FlociNotesDrop } from "./reels/FlociNotesDrop";
import { FILEE_FRAMES, FileeGithubPick } from "./reels/FileeGithubPick";
import { PC_FRAMES, PhotoCraftTool } from "./reels/PhotoCraftTool";
import { TH_FRAMES, TrainHandover } from "./reels/TrainHandover";
import { RAP_FRAMES, RaptorTeardown } from "./reels/RaptorTeardown";
import { LB_FRAMES, LoadBalancerInterview } from "./reels/LoadBalancerInterview";
import { SW_FRAMES, SwiggyLiveMap } from "./reels/SwiggyLiveMap";
import { MQ_FRAMES, MessageQueueInterview } from "./reels/MessageQueueInterview";
import { TRAI_FRAMES, TraiCustomerCare } from "./reels/TraiCustomerCare";
import { GM_FRAMES, GoogleMapsTraffic } from "./reels/GoogleMapsTraffic";
import { CH_FRAMES, ConsistentHashingInterview } from "./reels/ConsistentHashingInterview";
import { DG_FRAMES, DigupFileSearch } from "./reels/DigupFileSearch";
import { DBI_FRAMES, DbIndexInterview } from "./reels/DbIndexInterview";
import { NAV_FRAMES, NavicNvs03 } from "./reels/NavicNvs03";
import { CNAP_FRAMES, CallerNameCnap } from "./reels/CallerNameCnap";
import { IDEM_FRAMES, IdempotencyInterview } from "./reels/IdempotencyInterview";
import { INCOG_FRAMES, IncognitoMyth } from "./reels/IncognitoMyth";
import { NOV01_SF_FRAMES, Nov01StyleFrames } from "./reels/styleframes/Nov01StyleFrames";
import { KIT_CHECK_FRAMES, KitCheck } from "./reels/styleframes/KitCheck";
import { NOV02_SF_FRAMES, Nov02StyleFrames } from "./reels/styleframes/Nov02StyleFrames";
import { NOV03_SF_FRAMES, Nov03StyleFrames } from "./reels/styleframes/Nov03StyleFrames";
import { NOV07_SF_FRAMES, Nov07StyleFrames } from "./reels/styleframes/Nov07StyleFrames";
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
      <Composition id="surge-pricing" component={SurgePricing} durationInFrames={SURGE_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="load-balancer-part6" component={LoadBalancerPart6} durationInFrames={LB6_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="floci-notesdrop" component={FlociNotesDrop} durationInFrames={NOTES_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="raptor-engine" component={RaptorTeardown} durationInFrames={RAP_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="train-call-handover" component={TrainHandover} durationInFrames={TH_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="photocraft" component={PhotoCraftTool} durationInFrames={PC_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="filee" component={FileeGithubPick} durationInFrames={FILEE_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="load-balancer" component={LoadBalancerInterview} durationInFrames={LB_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="floci-aws" component={FlociAws} durationInFrames={FLOCI_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="whatsapp-ticks" component={WhatsappTicks} durationInFrames={WA_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="swiggy-live-map" component={SwiggyLiveMap} durationInFrames={SW_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="message-queue-interview" component={MessageQueueInterview} durationInFrames={MQ_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="trai-ai-customer-care" component={TraiCustomerCare} durationInFrames={TRAI_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="google-maps-traffic" component={GoogleMapsTraffic} durationInFrames={GM_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="consistent-hashing-interview" component={ConsistentHashingInterview} durationInFrames={CH_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="digup-file-search" component={DigupFileSearch} durationInFrames={DG_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="atm-cash" component={AtmCash} durationInFrames={ATM_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="db-index-interview" component={DbIndexInterview} durationInFrames={DBI_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="navic-nvs03" component={NavicNvs03} durationInFrames={NAV_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="caller-name-cnap" component={CallerNameCnap} durationInFrames={CNAP_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="idempotency-interview" component={IdempotencyInterview} durationInFrames={IDEM_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="incognito-myth" component={IncognitoMyth} durationInFrames={INCOG_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="nov01-styleframes" component={Nov01StyleFrames} durationInFrames={NOV01_SF_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="kit-check" component={KitCheck} durationInFrames={KIT_CHECK_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="nov02-styleframes" component={Nov02StyleFrames} durationInFrames={NOV02_SF_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="nov03-styleframes" component={Nov03StyleFrames} durationInFrames={NOV03_SF_FRAMES} fps={30} width={1080} height={1920} />
      <Composition id="nov07-styleframes" component={Nov07StyleFrames} durationInFrames={NOV07_SF_FRAMES} fps={30} width={1080} height={1920} />
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
