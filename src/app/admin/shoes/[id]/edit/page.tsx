import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { shoe } from "@/db/schema";
import { eq } from "drizzle-orm";
import { listBrands } from "@/lib/shoes";
import { ShoeEditForm } from "./shoe-edit-form";

export const metadata: Metadata = {
  title: "编辑鞋款",
};

export default async function EditShoePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shoeId = Number(id);
  if (Number.isNaN(shoeId)) notFound();

  const db = getDb();
  const shoeRow = await db
    .select()
    .from(shoe)
    .where(eq(shoe.id, shoeId))
    .get();

  if (!shoeRow) notFound();

  const brands = await listBrands();
  const brandName = brands.find((b) => b.id === shoeRow.brandId)?.name ?? "";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px] font-black tracking-[-0.01em]">编辑鞋款</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {brandName} {shoeRow.model}
        </p>
      </div>

      <ShoeEditForm
        shoeId={shoeId}
        brands={brands}
        initialData={{
          brandId: shoeRow.brandId,
          model: shoeRow.model,
          price: shoeRow.price,
          scenarios: shoeRow.scenarios,
          stiffness: shoeRow.stiffness,
          width: shoeRow.width,
          level: shoeRow.level,
          downturn: shoeRow.downturn,
          closure: shoeRow.closure,
          material: shoeRow.material ?? "",
          images: shoeRow.images,
        }}
      />
    </div>
  );
}
