"use client";

import { useMemo, useState } from "react";
import FieldSelector from "@/components/labs/FieldSelector";
import LabList from "@/components/labs/LabList";
import { groupLabsByField, RESEARCH_FIELDS, type LabEntry } from "@/lib/labs";
import type { Lang } from "@/lib/nav";

export default function LabsExplorer({
  lang,
  labs,
  initialField,
}: {
  lang: Lang;
  labs: LabEntry[];
  initialField?: string;
}) {
  const grouped = useMemo(() => groupLabsByField(labs), [labs]);
  const isValidInitialField = initialField != null && RESEARCH_FIELDS.some((f) => f.key === initialField);
  const [active, setActive] = useState<string>(isValidInitialField ? initialField! : "all");

  const visibleLabs = active === "all" ? labs : grouped[active] ?? [];

  return (
    <div>
      <FieldSelector lang={lang} active={active} onSelect={setActive} />
      <div className="mt-10">
        <LabList lang={lang} labs={visibleLabs} />
      </div>
    </div>
  );
}
