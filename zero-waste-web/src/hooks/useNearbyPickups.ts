import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface PickupJob {
  id: string;
  food_name: string;
  food_type: string;
  quantity: number;
  unit: string;
  location: string;
  lat: number | null;
  lng: number | null;
  safety_score: number;
  classification: string;
  image_url: string;
  created_at: string;
  accepted_at: string;
  expiry_estimate: string;
  donor_id: string;
  accepted_by: string;
  volunteer_id: string | null;
  pickup_status: string;
  // computed
  distance_km?: number;
  eta_minutes?: number;
}

// Haversine distance formula
const getDistanceKm = (
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getEtaMinutes = (distanceKm: number): number =>
  Math.round((distanceKm / 20) * 60); // assume 20 km/h city speed

export const useNearbyPickups = (
  volunteerLat: number | null,
  volunteerLng: number | null,
  radiusKm: number = 15
) => {
  const [pickups, setPickups] = useState<PickupJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPickupAlert, setNewPickupAlert] = useState<PickupJob | null>(null);
  const previousIds = useRef<Set<string>>(new Set());

  const fetchPickups = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('status', 'accepted')
      .eq('pickup_status', 'awaiting_volunteer')
      .order('accepted_at', { ascending: false });

    if (error) {
      console.error('Error fetching pickups:', error);
      setLoading(false);
      return;
    }

    let jobs: PickupJob[] = data || [];

    // Attach distance if volunteer location known
    if (volunteerLat && volunteerLng) {
      jobs = jobs
        .map(job => {
          if (job.lat && job.lng) {
            const distance_km = parseFloat(
              getDistanceKm(
                volunteerLat, volunteerLng,
                job.lat, job.lng
              ).toFixed(1)
            );
            return {
              ...job,
              distance_km,
              eta_minutes: getEtaMinutes(distance_km)
            };
          }
          return { ...job, distance_km: 999, eta_minutes: 999 };
        })
        // Filter by radius
        .filter(job => job.distance_km! <= radiusKm)
        // Sort nearest first
        .sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
    }

    // Detect NEW pickups for notification alert
    jobs.forEach(job => {
      if (!previousIds.current.has(job.id)) {
        if (previousIds.current.size > 0) {
          // Only alert after initial load
          setNewPickupAlert(job);
          setTimeout(() => setNewPickupAlert(null), 6000);
        }
        previousIds.current.add(job.id);
      }
    });

    setPickups(jobs);
    setLoading(false);
  };

  useEffect(() => {
    fetchPickups();

    // Realtime: listen for donations becoming 'accepted'
    const channel = supabase
      .channel('volunteer-pickups')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'donations',
        filter: "status=eq.accepted"
      }, (payload) => {
        console.log('New accepted donation:', payload.new);
        fetchPickups(); // refresh list
      })
      .subscribe();

    // Poll every 30s as backup
    const poll = setInterval(fetchPickups, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
    };
  }, [volunteerLat, volunteerLng, radiusKm]);

  return { pickups, loading, newPickupAlert, refetch: fetchPickups };
};
