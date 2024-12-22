import Navbar from "@/components/navbar";
import { useContext, useEffect, useState } from "react";
// import { Header } from './components/Header';
import SummaryForm from "../../components/summary-form";
import { SummaryHistory } from "@/components/summary-history";
// import { getSummaryHistory } from './services/api';
import type { Summary } from "../../types";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

export default function Summariser() {
  const { backendUrl } = useContext(AppContext);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const data = await getSummaryHistory();
      setSummaries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch summaries:", error);
      setSummaries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);
  const getSummaryHistory = async () => {
    const response = await axios.get(
      backendUrl + "/api/summarise/get-summaries"
    );
    console.log(response);
    return response.data.summaries;
  };
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* <Header /> */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <SummaryForm onSummaryComplete={fetchSummaries} />
          </div>
          <SummaryHistory summaries={summaries} loading={loading} />
        </div>
      </div>
    </div>
  );
}
