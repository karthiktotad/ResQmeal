-- ENUMS
CREATE TYPE user_role AS ENUM ('donor', 'receiver', 'admin', 'agent');
CREATE TYPE receiver_type AS ENUM ('ngo', 'shelter', 'farm', 'compost');
CREATE TYPE food_type_enum AS ENUM ('veg', 'non_veg', 'mixed');
CREATE TYPE ai_classification AS ENUM ('human_safe', 'animal_safe', 'unsafe');
CREATE TYPE food_status AS ENUM ('pending', 'in_transit', 'delivered', 'expired');
CREATE TYPE delivery_status AS ENUM ('assigned', 'picked_up', 'delivered', 'cancelled');
CREATE TYPE reward_level AS ENUM ('starter', 'food_hero', 'champion');

-- 1. users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  phone TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. receivers Table
CREATE TABLE receivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type receiver_type NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  address TEXT,
  capacity INTEGER DEFAULT 0,
  accepts_animal_food BOOLEAN DEFAULT FALSE,
  contact TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. food_listings Table
CREATE TABLE food_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  food_type food_type_enum NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  prepared_at TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  lat FLOAT,
  lng FLOAT,
  image_url TEXT,
  safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
  classification ai_classification,
  ai_reason TEXT,
  receiver_id UUID REFERENCES receivers(id) ON DELETE SET NULL,
  status food_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_estimate TIMESTAMP WITH TIME ZONE
);

-- 4. deliveries Table
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id UUID REFERENCES food_listings(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status delivery_status DEFAULT 'assigned',
  pickup_time TIMESTAMP WITH TIME ZONE,
  delivery_time TIMESTAMP WITH TIME ZONE,
  current_lat FLOAT,
  current_lng FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. rewards Table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points_balance INTEGER DEFAULT 0,
  level reward_level DEFAULT 'starter',
  streak_days INTEGER DEFAULT 0,
  last_donated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(donor_id)
);

-- 6. redemptions Table
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL,
  points_spent INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS & Realtime Settings
ALTER PUBLICATION supabase_realtime ADD TABLE food_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE deliveries;
