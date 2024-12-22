export default function LoadingSpinner() {
  return (
    <div className="text-center text-gray-500 py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2">Loading summaries...</p>
    </div>
  );
}
