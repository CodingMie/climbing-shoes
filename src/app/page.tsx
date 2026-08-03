const FEATURES = [
  {
    title: "鞋款目录",
    description: "收录主流品牌攀岩鞋，按场景、硬度、楦型筛选与搜索。",
  },
  {
    title: "脚型档案",
    description: "记录脚长、脚宽、足弓、脚背等脚型数据，让反馈更有参考价值。",
  },
  {
    title: "结构化测评",
    description: "七维评分、合身度反馈与尺码偏移建议，选码不再盲试。",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-16 text-center">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          攀岩鞋试穿体验平台
        </h1>
        <p className="text-lg text-muted-foreground">
          记录真实试穿体验，按脚型与场景找到合脚的那双鞋
        </p>
      </section>
      <section className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border bg-card p-6 text-left shadow-sm"
          >
            <h2 className="font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
