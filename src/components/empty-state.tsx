import { FileText } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="text-center text-gray-500 py-8">
      <FileText className="mx-auto h-12 w-12 mb-2" />
      <p>No summaries yet. Try summarizing some text!</p>
    </div>
  );
}
