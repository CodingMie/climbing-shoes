export type FootSummaryData = {
  footWidth: string | null;
  arch: string | null;
  instep: string | null;
  heel: string | null;
  bunion: string | null;
};

export function FootSummaryLine({ profile }: { profile: FootSummaryData }) {
  if (!profile.footWidth) return null;
  const items = [
    { label: "脚宽窄", value: profile.footWidth },
    { label: "足弓", value: profile.arch },
    { label: "脚背", value: profile.instep },
    { label: "脚后跟", value: profile.heel },
    { label: "拇外翻", value: profile.bunion },
  ];
  return (
    <p className="text-xs text-muted-foreground">
      {items
        .filter((item) => item.value)
        .map((item) => `${item.label} ${item.value}`)
        .join(" · ")}
    </p>
  );
}
