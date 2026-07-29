import { Relic, RelicCondition } from "../game/relics";
import { getRelicTheme } from "../game/relicTheme";
import "./RelicCard.css";

interface Props {
  relic: Relic;
  onPick?: () => void;
  active?: boolean;
  delay?: number;
}

function formatCondition(cond: RelicCondition): string {
  switch (cond.type) {
    case "contains":
      return `contains a ${cond.value}`;
    case "sum_gt":
      return `total is greater than ${cond.value}`;
    case "sum_lt":
      return `total is less than ${cond.value}`;
    case "combo":
      return `the combo is ${cond.value}`;
    case "count_gte":
      return `you roll at least ${cond.count} ${cond.value}`;
    case "all_same":
      return "all dice match";
    case "no_duplicates":
      return "no dice repeat";
    case "even_count_gte":
      return `you roll at least ${cond.count} even dice`;
    case "odd_count_gte":
      return `you roll at least ${cond.count} odd dice`;
    default:
      return "a special condition";
  }
}

function formatEffect(relic: Relic): string {
  const parts: string[] = [];
  if (relic.effect.bones) parts.push(`+${relic.effect.bones} Bones`);
  if (relic.effect.mult) parts.push(`+${relic.effect.mult} Mult`);
  return parts.join(" · ");
}

export default function RelicCard({ relic, onPick, active, delay = 0 }: Props) {
  const theme = getRelicTheme(relic);
  const bones = relic.effect.bones ?? 0;
  const mult = relic.effect.mult ?? 0;

  const effectParts: string[] = [];
  if (bones) effectParts.push(`+${bones} Bones`);
  if (mult) effectParts.push(`+${mult} Mult`);

  const tooltipText = `${relic.name}: ${relic.describtion}. Trigger: ${formatCondition(relic.condition)}. Effect: ${formatEffect(relic)}`;

  return (
    <button
      type="button"
      className={`relic-card relic-card--${theme.pattern} ${active ? "relic-active" : ""}`}
      style={
        {
          animationDelay: `${delay}s`,
          "--relic-color": theme.color,
          "--relic-ink": theme.ink,
        } as React.CSSProperties
      }
      onClick={onPick}
      disabled={!onPick}
      aria-label={tooltipText}
    >
      <div className="relic-icon-badge" aria-hidden>
        {theme.icon}
      </div>
      <span className="relic-name">{relic.name}</span>
      <span className="relic-desc">{relic.describtion}</span>
      {effectParts.length > 0 && (
        <span className="relic-effect">{effectParts.join(" · ")}</span>
      )}
      <span className="relic-tooltip" role="tooltip">
        <strong>{relic.name}</strong>
        <span>{relic.describtion}</span>
        <span>Trigger: {formatCondition(relic.condition)}</span>
        <span>Effect: {formatEffect(relic)}</span>
      </span>
    </button>
  );
}
