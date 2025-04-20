
import { AlertCircle } from "lucide-react";

const WalkInShowerAlert = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-amber-800">
            Voor inloopdouches rekenen we een vaste chapekost van €750 (excl. BTW). Douchewanden zijn niet inbegrepen in de prijsberekening.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalkInShowerAlert;
