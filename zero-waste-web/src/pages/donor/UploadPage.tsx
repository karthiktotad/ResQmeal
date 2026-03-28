import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveCamera } from '../../components/LiveCamera';
import { SafetyScoreGauge } from '../../components/SafetyScoreGauge';
import { ReceiverMatchCard } from '../../components/ReceiverMatchCard';
import { MapPin, Navigation, Clock, Loader2, Route } from 'lucide-react';

export default function UploadPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', type: 'veg', quantity: '', unit: 'kg', prepTime: '', location: ''
  });

  // AI & Match State
  const [aiResult, setAiResult] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const handleCapture = (img: string) => setPhoto(img);

  const handleNextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return alert("Photo is mandatory");
    
    setStep(2);
    setIsAnalyzing(true);
    
    // Simulate Claude API Call
    setTimeout(() => {
      setAiResult({
        score: Math.floor(Math.random() * (100 - 80 + 1)) + 80, // Default to Safe for mock demo
        classification: 'human_safe',
        reason: 'The food appears fresh with vibrant colors, no signs of spoilage or mold visible.',
        confidence: 'High'
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const triggerMatch = () => {
    setStep(3);
    setIsMatching(true);
    
    // Simulate Supabase Geospatial Match
    setTimeout(() => {
      setMatches([
        { id: 1, name: 'Hope Foundation Shelter', type: 'NGO', distance: 2.4, eta: 12 },
        { id: 2, name: 'City Rescue Mission', type: 'Shelter', distance: 4.1, eta: 18 },
        { id: 3, name: 'Community Care Group', type: 'NGO', distance: 6.8, eta: 25 },
      ]);
      setIsMatching(false);
    }, 1500);
  };

  const confirmAssignment = (receiver: any) => {
    alert(`Donation Asssigned to ${receiver.name}! Points awarded.`);
    navigate('/donor/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-8 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors
              ${step === s ? 'bg-[#16A34A] text-[#FFFFFF] border-2 border-[#86EFAC] shadow-[0_0_15px_rgba(22,163,74,0.5)]' : 
                step > s ? 'bg-[#14532D] text-[#86EFAC]' : 'bg-[#334155] text-[#94A3B8]'}`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`h-1 flex-1 mx-2 rounded transition-colors ${step > s ? 'bg-[#16A34A]' : 'bg-[#334155]'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-[#1E293B] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden border border-[#334155]">
        <div className="p-8">
          
          {step === 1 && (
            <form onSubmit={handleNextSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-[#F8FAFC]">Food Details</h2>
                <p className="text-[#94A3B8]">Provide clear info and a live photo of the surplus food.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#86EFAC] mb-2">Live Photo Check</label>
                <LiveCamera onCapture={handleCapture} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#94A3B8] mb-1">Food Name *</label>
                <input required type="text" className="w-full bg-[#0F172A] text-[#F8FAFC] border-[#334155] rounded-lg shadow-sm focus:border-[#16A34A] focus:ring-[#16A34A] h-12 px-4 border" placeholder="e.g. 50 plates of Veg Biryani" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#94A3B8] mb-1">Type *</label>
                  <select required className="w-full bg-[#0F172A] text-[#F8FAFC] border-[#334155] rounded-lg shadow-sm focus:border-[#16A34A] focus:ring-[#16A34A] h-12 px-4 border" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="veg">Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#94A3B8] mb-1">Quantity *</label>
                  <div className="flex">
                    <input required type="number" min="1" className="w-2/3 bg-[#0F172A] text-[#F8FAFC] border-[#334155] rounded-l-lg shadow-sm focus:border-[#16A34A] focus:ring-[#16A34A] h-12 px-4 border border-r-0" placeholder="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                    <select className="w-1/3 bg-[#334155] text-[#F8FAFC] border-[#475569] rounded-r-lg border h-12 px-2" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                      <option value="kg">kg</option>
                      <option value="portions">portions</option>
                      <option value="litres">litres</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#94A3B8] mb-1 flex items-center gap-1"><Clock size={14}/> Prep Time</label>
                  <input type="datetime-local" className="w-full bg-[#0F172A] text-[#F8FAFC] border-[#334155] rounded-lg shadow-sm focus:border-[#16A34A] focus:ring-[#16A34A] h-12 px-4 border [color-scheme:dark]" value={formData.prepTime} onChange={e => setFormData({...formData, prepTime: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#94A3B8] mb-1 flex items-center gap-1"><MapPin size={14}/> Location</label>
                  <div className="relative">
                    <input type="text" className="w-full bg-[#0F172A] text-[#F8FAFC] border-[#334155] rounded-lg shadow-sm focus:border-[#16A34A] focus:ring-[#16A34A] h-12 pl-4 pr-10 border" placeholder="Enter address" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    <button type="button" className="absolute right-3 top-3 text-[#F97316] hover:text-[#EA580C]"><Navigation size={18}/></button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={!photo} className="w-full bg-[#16A34A] text-[#FFFFFF] font-bold py-4 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:bg-[#14532D] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed border border-[#14532D]">
                Analyze Safety & Find Receiver
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300 text-center">
              {isAnalyzing ? (
                <div className="py-20 flex flex-col items-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[#16A34A] opacity-20 rounded-full animate-ping" />
                    <div className="w-24 h-24 bg-[#16A34A] text-[#FFFFFF] rounded-full flex items-center justify-center relative z-10 shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
                      <Loader2 className="animate-spin" size={40} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Analyzing Food Image...</h2>
                  <p className="text-[#94A3B8] max-w-sm">Checking visual cues for mold, discoloration, texture, and freshness.</p>
                </div>
              ) : (
                <div className="w-full">
                  <h2 className="text-2xl font-bold mb-6 text-[#F8FAFC]">Safety Results</h2>
                  <div className="p-4 bg-[#0F172A] rounded-2xl border border-[#334155] mb-6">
                    <SafetyScoreGauge {...aiResult} />
                  </div>
                  <div className="mt-8 flex gap-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 text-[#F8FAFC] bg-[#334155] hover:bg-[#475569] rounded-lg font-bold transition">Retake</button>
                    {aiResult.classification !== 'unsafe' && (
                      <button onClick={triggerMatch} className="flex-1 py-3 text-[#FFFFFF] bg-[#16A34A] hover:bg-[#14532D] rounded-lg font-bold shadow-md transition">Find Receiver</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-10 duration-300">
               {isMatching ? (
                <div className="py-20 flex flex-col items-center text-center">
                  <Route size={48} className="text-[#F97316] animate-bounce mb-6" />
                  <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Finding Best Matches...</h2>
                  <p className="text-[#94A3B8]">Querying NGOs and shelters within 15km</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-[#F8FAFC]">Matches Found</h2>
                      <p className="text-[#94A3B8] text-sm mt-1">Select an active organization below</p>
                    </div>
                    <span className="bg-[#14532D] text-[#86EFAC] border border-[#16A34A] px-3 py-1 rounded-full font-bold text-sm">3 Verified</span>
                  </div>
                  <div className="space-y-4">
                    {matches.map(m => (
                      <ReceiverMatchCard key={m.id} receiver={m} onAssign={confirmAssignment} />
                    ))}
                  </div>
                  <button onClick={() => setStep(2)} className="w-full mt-6 py-3 text-[#94A3B8] font-medium hover:text-[#F8FAFC] transition">Go Back</button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
