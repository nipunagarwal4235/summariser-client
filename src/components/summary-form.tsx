import React, { useContext, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

interface SummaryFormProps {
  onSummaryComplete: () => void;
}

export default function SummaryForm({ onSummaryComplete }: SummaryFormProps) {
  const { backendUrl } = useContext(AppContext);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const summarizeText = async (text: string) => {
    const response = await axios.post(
      backendUrl + "/api/summarise/summarise-text",
      { text }
    );
    return response.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await summarizeText(text);
      setText("");
      onSummaryComplete();
      toast.success("Text summarized successfully!");
    } catch (error) {
      toast.error("Failed to summarize text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to summarize..."
        className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          "Summarizing..."
        ) : (
          <>
            Summarize <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
