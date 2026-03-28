import { Clock, Route } from 'lucide-react';

export function ReceiverMatchCard({ receiver, onAssign, distStr, etaMins }: any) {
  return (
    <div className="border border-[#334155] rounded-[12px] p-5 flex flex-col sm:flex-row shadow-[0_4px_6px_rgba(0,0,0,0.3)] bg-[#1E293B] hover:border-[#16A34A] transition-colors items-start sm:items-center justify-between gap-4">
      <div>
        <h4 className="font-bold text-lg text-[#F8FAFC] flex items-center gap-2">
          {receiver.org_name}
          <span className="bg-[#14532D] text-[#86EFAC] text-xs px-2 py-1 rounded-full border border-[#16A34A]">Verified</span>
        </h4>
        <p className="text-[#94A3B8] text-sm mb-3">{receiver.address}</p>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-sm bg-[#334155] text-[#F8FAFC] px-3 py-1 rounded-md mb-0">
            <Route size={14} className="text-[#16A34A]"/> {distStr} km away
          </span>
          <span className="flex items-center gap-1 text-sm bg-[#334155] text-[#F8FAFC] px-3 py-1 rounded-md mb-0">
            <Clock size={14} className="text-[#3B82F6]"/> {etaMins} mins ETA
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button 
        onClick={() => onAssign(receiver)}
        className="w-full sm:w-auto bg-[#16A34A] text-[#FFFFFF] px-6 py-2.5 rounded-lg font-bold hover:bg-[#14532D] transition-colors whitespace-nowrap"
      >
        Assign Delivery
      </button>
      </div>
    </div>
  );
}
