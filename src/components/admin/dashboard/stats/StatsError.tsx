
import { Card } from "@/components/ui/card";

interface StatsErrorProps {
  error: string;
}

const StatsError = ({ error }: StatsErrorProps) => {
  return (
    <Card className="p-4 text-center text-amber-800 bg-amber-50 border-amber-200">
      <p>{error}</p>
      <button 
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
        onClick={() => window.location.reload()}
      >
        Ververs de pagina
      </button>
    </Card>
  );
};

export default StatsError;
