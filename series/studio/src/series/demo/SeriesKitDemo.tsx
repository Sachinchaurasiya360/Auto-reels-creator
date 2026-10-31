import { AbsoluteFill, Sequence } from "remotion";
import { NodeGraph } from "@/components/onda/node-graph/NodeGraph";
import { ImessageChatFlow } from "@/components/remocn/imessage-chat-flow";
import { TerminalSimulator } from "@/components/remocn/terminal-simulator";
import { colors, fonts } from "../brand";
import { CommentPrompt } from "../CommentPrompt";
import { FollowCard } from "../FollowCard";
import { SeriesFrame } from "../SeriesFrame";
import { Stage, type Rect } from "../Stage";

// A smoke test of the kit: brand frame + installed library components restyled to the series look.
// Not a reel. Render a still of each section to check the brand carries into every library.

export const SERIES_KIT_DEMO_FRAMES = 30 * 20;

// Where each library component's content sits on its own canvas (measured from native renders).
export const FOCUS = {
  nodeGraph: { x: 0, y: 0, w: 1080, h: 1080 } as Rect,
  imessage: { x: 0, y: 0, w: 440, h: 560 } as Rect,
  terminal: { x: 500, y: 290, w: 920, h: 500 } as Rect,
};

export function SeriesKitDemo() {
  return (
    <SeriesFrame series="system-design" episode={1}>
      <Sequence durationInFrames={120} name="node-graph (onda)">
        <Stage design={{ w: 1080, h: 1080 }} focus={FOCUS.nodeGraph} name="node-graph">
          <NodeGraph
            hubLabel="NPCI"
            satellites={[
              { label: "PhonePe", radius: 300, speed: 0.008, startAngle: 0.3 },
              { label: "SBI", radius: 360, speed: -0.006, startAngle: 1.6 },
              { label: "HDFC", radius: 250, speed: 0.011, startAngle: 2.8 },
              { label: "Paytm", radius: 390, speed: -0.005, startAngle: 4.0 },
              { label: "GPay", radius: 320, speed: 0.009, startAngle: 5.2 },
            ]}
            accent={colors.blue}
            background="transparent"
            fontFamily={fonts.display}
            hubDiameter={180}
            hubFontSize={44}
            ellipse={0.8}
            seed={7}
            delay={0}
            glow
            kind="node-graph"
          />
        </Stage>
      </Sequence>
      <Sequence from={120} durationInFrames={150} name="imessage-chat-flow (remocn)">
        <Stage design={{ w: 440, h: 560 }} focus={FOCUS.imessage} y={340} x={125} width={760} name="imessage">
          <AbsoluteFill>
            <ImessageChatFlow
              contact={{ name: "Interviewer" }}
              accentColor={colors.blue}
              messages={[
                { from: "them", text: "Ek second mein 1 lakh request aa gayi. Kya karoge?" },
                { from: "me", text: "Server badha dunga?" },
                { from: "them", text: "Aur jab tak naye server boot ho rahe hain?" },
                { from: "me", text: "Rate limiter. Token bucket per user." },
              ]}
            />
          </AbsoluteFill>
        </Stage>
      </Sequence>
      <Sequence from={270} durationInFrames={120} name="terminal-simulator (remocn)">
        <Stage design={{ w: 1920, h: 1080 }} focus={FOCUS.terminal} y={560} clip={false} name="terminal">
          <TerminalSimulator
            title="upi-switch"
            background={colors.code}
            chromeColor="#1b1e24"
            fontSize={30}
            lines={[
              { text: "pay sachin@okhdfc 10.00", type: "command" },
              { text: "VPA resolved -> HDFC Bank", type: "log" },
              { text: "debit SBI ****4821 ... ok", type: "log" },
              { text: "credit HDFC ****0193 ... ok", type: "success" },
            ]}
          />
        </Stage>
      </Sequence>
      <Sequence from={390} durationInFrames={110} name="comment-prompt (series)">
        <CommentPrompt question="UPI ya card, tum roz kya use karte ho?" options={["UPI", "Card"]} />
      </Sequence>
      <Sequence from={500} durationInFrames={100} name="follow-card (series)">
        <FollowCard />
      </Sequence>
    </SeriesFrame>
  );
}
