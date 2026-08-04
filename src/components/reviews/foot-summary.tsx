export type FootSummaryData = {
  footWidth?: string | null;
  arch?: string | null;
  instep?: string | null;
  heel?: string | null;
  bunion?: string | null;
};

const FOOT_WIDTH_LABELS: Record<string, string> = {
  窄: "窄脚",
  中: "正常脚",
  宽: "宽脚",
};
const ARCH_LABELS: Record<string, string> = {
  低: "低足弓",
  正常: "正常足弓",
  高: "高足弓",
};
const INSTEP_LABELS: Record<string, string> = {
  低: "低脚背",
  正常: "正常脚背",
  高: "高脚背",
};
const HEEL_LABELS: Record<string, string> = {
  窄: "窄脚后跟",
  中: "正常脚后跟",
  宽: "宽脚后跟",
};
const BUNION_LABELS: Record<string, string> = {
  无: "无拇外翻",
  轻度: "轻度拇外翻",
  中度: "中度拇外翻",
  重度: "重度拇外翻",
};

function mapLabel(
  labels: Record<string, string>,
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  return labels[value] ?? value;
}

export function FootSummaryLine({ profile }: { profile: FootSummaryData }) {
  if (!profile.footWidth) return null;
  const items = [
    mapLabel(FOOT_WIDTH_LABELS, profile.footWidth),
    mapLabel(ARCH_LABELS, profile.arch),
    mapLabel(INSTEP_LABELS, profile.instep),
    mapLabel(HEEL_LABELS, profile.heel),
    mapLabel(BUNION_LABELS, profile.bunion),
  ].filter((item): item is string => item !== null);
  return (
    <p className="text-xs text-muted-foreground">{items.join(" · ")}</p>
  );
}

export type FootStatsData = {
  footLength?: number | null;
  streetSize?: number | null;
  footShape?: string | null;
};

export function FootStatsLine({ profile }: { profile: FootStatsData }) {
  if (!profile.footLength) return null;
  return (
    <p className="text-xs text-muted-foreground">
      脚长 {profile.footLength} 毫米 · 日常鞋码 EU {profile.streetSize}
      {profile.footShape ? ` · 脚型 ${profile.footShape}` : ""}
    </p>
  );
}
