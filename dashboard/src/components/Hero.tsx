import type { Dataset } from "../lib/data";
import type { Config } from "../lib/types";

function breaches(data: Dataset, cfg: Config): { worked: number; tried: number } | null {
  const run = data.gauntlet[cfg];
  if (!run) return null;
  const tried = run.probes.filter((p) => p.status === "fail" || p.status === "pass");
  return { worked: tried.filter((p) => p.status === "fail").length, tried: tried.length };
}

const PILLARS = [
  { n: "1", name: "Isolate", text: "Red, blue, model and audit each sit on their own internal network, with their own secrets and read-only data mounts." },
  { n: "2", name: "Mediate", text: "No team talks to another directly. Every model call crosses one gateway that checks identity, scope and rate." },
  { n: "3", name: "Observe", text: "Security events are logged as hashes, so the record never exposes a protected payload or defense rule." },
  { n: "4", name: "Replay", text: "A hash chain with signed checkpoints that you can re-verify in this page, without trusting us." },
];

export function Hero({ data }: { data: Dataset }) {
  const ins = breaches(data, "insecure");
  const har = breaches(data, "hardened");
  return (
    <section className="hero-wrap" aria-labelledby="h-hero">
      <p className="eyebrow">Bayora · AI safety × isolation × verifiable evidence</p>
      <h1 id="h-hero">Make the AI security test itself trustworthy.</h1>
      <p className="lede">
        A shared red/blue-team sandbox is only worth something if neither side, and not the model, can tamper with the experiment.
        Sentinel doesn’t claim the lab is secure. It attacks it live, in two builds, and shows what held.
      </p>

      <div className="boundary" role="img" aria-label="Red team, policy gate, target LLM, policy gate, blue team, all above a verifiable evidence log">
        <div className="boundary-row">
          <div className="zone-card zone-red"><b>Red team</b><span>attack payloads stay private</span></div>
          <div className="gate">Policy gate</div>
          <div className="zone-card zone-llm"><b>Target LLM</b><span>model state stays isolated</span></div>
          <div className="gate">Policy gate</div>
          <div className="zone-card zone-blue"><b>Blue team</b><span>defense logic stays private</span></div>
        </div>
        <div className="evidence-bar">Verifiable evidence · hash-chained, signed audit log · replayable by an independent party</div>
      </div>

      <div className="scoreboard" aria-label="Headline results">
        <div className="score score-bad">
          <span className="score-num">{ins ? `${ins.worked}/${ins.tried}` : "–"}</span>
          <span className="score-cap">attacks breached the <b>insecure</b> build</span>
        </div>
        <div className="score score-good">
          <span className="score-num">{har ? `${har.worked}/${har.tried}` : "–"}</span>
          <span className="score-cap">attacks breached the <b>hardened</b> build</span>
        </div>
        <div className="score score-note">
          <span className="score-num">AUC {data.side?.modes.find((m) => m.mode === "shared")?.auc_hit_faster.toFixed(1) ?? "–"}</span>
          <span className="score-cap">cache-timing leak measured with a <b>shared</b> cache</span>
        </div>
      </div>

      <ol className="pillars">
        {PILLARS.map((p) => (
          <li key={p.n} className="pillar">
            <span className="pillar-n">{p.n}</span>
            <h3>{p.name}</h3>
            <p>{p.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
