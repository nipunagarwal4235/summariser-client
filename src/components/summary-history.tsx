import type { Summary } from "../types";
import LoadingSpinner from "./loading-spinner";
import EmptyState from "./empty-state";
import SummaryCard from "./summary-card";

interface SummaryHistoryProps {
  summaries: Summary[];
  loading: boolean;
}

export function SummaryHistory({ summaries, loading }: SummaryHistoryProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!Array.isArray(summaries) || summaries.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">History</h2>
      <div className="space-y-4">
        {summaries
          .slice()
          .reverse()
          .map((summary, index) => (
            <SummaryCard key={index} summary={summary} />
          ))}
      </div>
    </div>
  );
}
