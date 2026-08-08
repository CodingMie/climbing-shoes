"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  SHOE_SCENARIOS,
  SHOE_STIFFNESS,
  SHOE_WIDTHS,
  SHOE_LEVELS,
  SHOE_DOWNTURNS,
  SHOE_CLOSURES,
} from "@/db/schema";
import { updateShoeAction, type UpdateShoeData } from "@/app/admin/actions";

interface ShoeEditFormProps {
  shoeId: number;
  brands: { id: number; name: string }[];
  initialData: UpdateShoeData;
}

export function ShoeEditForm({
  shoeId,
  brands,
  initialData,
}: ShoeEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UpdateShoeData>({
    brandId: initialData.brandId,
    model: initialData.model,
    price: initialData.price,
    scenarios: initialData.scenarios,
    stiffness: initialData.stiffness,
    width: initialData.width,
    level: initialData.level,
    downturn: initialData.downturn,
    closure: initialData.closure,
    material: initialData.material,
    images: initialData.images,
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  const handleScenarioToggle = (scenario: (typeof SHOE_SCENARIOS)[number]) => {
    setFormData((prev) => ({
      ...prev,
      scenarios: prev.scenarios.includes(scenario)
        ? prev.scenarios.filter((s) => s !== scenario)
        : [...prev.scenarios, scenario],
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.model.trim()) {
      setError("请输入型号名称");
      return;
    }
    if (formData.price <= 0) {
      setError("请输入有效的价格");
      return;
    }
    if (formData.scenarios.length === 0) {
      setError("请至少选择一个使用场景");
      return;
    }

    startTransition(async () => {
      const result = await updateShoeAction(shoeId, formData);
      if (result.ok) {
        router.push("/admin/shoes");
        router.refresh();
      } else {
        setError(result.error || "更新失败");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">品牌</Label>
              <Select
                id="brand"
                value={formData.brandId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    brandId: Number(e.target.value),
                  }))
                }
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">型号</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, model: e.target.value }))
                }
                placeholder="例如: Solution"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">价格（元）</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">材质</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, material: e.target.value }))
                }
                placeholder="例如: 合成纤维"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>使用场景</Label>
            <div className="flex flex-wrap gap-2">
              {SHOE_SCENARIOS.map((scenario) => (
                <button
                  key={scenario}
                  type="button"
                  onClick={() => handleScenarioToggle(scenario)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    formData.scenarios.includes(scenario)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-surface-2"
                  }`}
                >
                  {scenario}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stiffness">硬度</Label>
              <Select
                id="stiffness"
                value={formData.stiffness}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stiffness: e.target.value as (typeof SHOE_STIFFNESS)[number],
                  }))
                }
              >
                {SHOE_STIFFNESS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">宽度楦型</Label>
              <Select
                id="width"
                value={formData.width}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    width: e.target.value as (typeof SHOE_WIDTHS)[number],
                  }))
                }
              >
                {SHOE_WIDTHS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="level">定位等级</Label>
              <Select
                id="level"
                value={formData.level}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    level: e.target.value as (typeof SHOE_LEVELS)[number],
                  }))
                }
              >
                {SHOE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downturn">下弯程度</Label>
              <Select
                id="downturn"
                value={formData.downturn}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    downturn: e.target.value as (typeof SHOE_DOWNTURNS)[number],
                  }))
                }
              >
                {SHOE_DOWNTURNS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closure">闭合方式</Label>
            <Select
              id="closure"
              value={formData.closure}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  closure: e.target.value as (typeof SHOE_CLOSURES)[number],
                }))
              }
            >
              {SHOE_CLOSURES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>图片</Label>
            <div className="space-y-3">
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`图片 ${i + 1}`}
                        className="h-20 w-20 rounded border border-border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="输入图片 URL"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddImage}>
                  添加
                </Button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "保存中..." : "保存修改"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/shoes")}
            disabled={isPending}
          >
            取消
          </Button>
        </div>
      </div>
    </form>
  );
}
