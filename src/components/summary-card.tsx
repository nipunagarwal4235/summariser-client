import { Clock } from "lucide-react";
import type { Summary } from "../types";

interface SummaryCardProps {
  summary: Summary;
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Clock className="h-4 w-4 mr-1" />
        {new Date(summary.createdAt).toLocaleDateString()}
      </div>
      <div className="space-y-2">
        <div>
          <h3 className="font-medium">Original Text:</h3>
          <p className="text-gray-600">{summary.originalText}</p>
        </div>
        <div>
          <h3 className="font-medium">Summary:</h3>
          <p className="text-gray-800">{summary.summarizedText}</p>
        </div>
      </div>
    </div>
  );
}
