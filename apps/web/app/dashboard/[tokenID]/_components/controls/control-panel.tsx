"use client";

import { usePensionData } from "../../_hooks/use-pension-data";
import { DashboardForm } from "../dashboard-form";

interface ControlPanelProps {
  tokenID: string;
}

export function ControlPanel({ tokenID }: ControlPanelProps) {
  const { simulationData } = usePensionData(tokenID);

  return (
    <div className="space-y-6">
      <DashboardForm
        initialData={{
          expectedPension: simulationData?.expectedPension,
        }}
      />
    </div>
  );
}
