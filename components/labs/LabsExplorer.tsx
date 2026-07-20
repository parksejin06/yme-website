"use client";

import { useMemo, useState } from "react";
import FieldSelector from "@/components/labs/FieldSelector";
import LabList from "@/components/labs/LabList";
import { RESEARCH_FIELDS, groupLabsByField, type LabEntry } from "@/lib/labs";
import type { Lang } from "@/lib/nav";

export default function LabsExplorer({ lang, labs }: { lang: Lang; labs: LabEntry[] }) {
  const grouped = useMemo(() => groupLabsByField(labs), [labs]);
  const [active, setActive] = useState(RESEARCH_FIELDS[0].key);

  return (
    <div>
      <FieldSelector lang={lang} active={active} onSelect={setActive} />
      <div className="mt-10">
        <LabList lang={lang} labs={grouped[active] ?? []} />
      </div>
    </div>
  );
}
