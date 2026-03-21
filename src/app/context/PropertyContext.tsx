import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchFeaturedProperties, fetchAllProperties, type DBProperty, scoreProperty } from '../../lib/supabase';

export interface Property {
  id: number;
  location: string;
  type: string;
  name: string;
  price: string;
  tag: string;
  specs: { beds: number; baths: number; sqft: string };
  image?: string;
  instagram_link?: string | null;
  is_featured?: boolean;
  featured_order?: number | null;
  tags?: string[];
}

function dbToProperty(p: DBProperty): Property {
  return {
    id: p.id, location: p.location, type: p.type, name: p.name, price: p.price,
    tag: (p.tags || [])[0] || 'Featured', tags: p.tags || [],
    specs: { beds: p.beds || 0, baths: p.baths || 0, sqft: p.sqft || '' },
    image: p.image_url || undefined,
    instagram_link: p.instagram_link || null, is_featured: p.is_featured, featured_order: p.featured_order,
  };
}

export const DEFAULT_PROPERTIES: Property[] = [
  { id:1, name:'Beachfront Plot', location:'Serenity Beach, Pondicherry', type:'Plot', price:'₹80L – 1.5 Cr', tag:'New Launch', specs:{beds:0,baths:0,sqft:'1,200'} },
  { id:2, name:'Luxury Villa', location:'Auroville Road, Pondicherry', type:'Luxury Villa', price:'₹1.2 – 1.8 Cr', tag:'Trending', specs:{beds:4,baths:3,sqft:'2,500'} },
  { id:3, name:'Residential Apartment', location:'ECR Road, Pondicherry', type:'Apartment', price:'₹45L – 75L', tag:'Best Value', specs:{beds:2,baths:2,sqft:'950'} },
  { id:4, name:'ECR Sea View Plot', location:'East Coast Road, Pondicherry', type:'Plot', price:'₹60L – 90L', tag:'Hot Deal', specs:{beds:0,baths:0,sqft:'2,000'} },
  { id:5, name:'Heritage Bungalow', location:'White Town, Pondicherry', type:'Bungalow', price:'₹2.5 – 3.5 Cr', tag:'Exclusive', specs:{beds:5,baths:4,sqft:'3,600'} },
];

interface PropertyContextType {
  properties: Property[];
  allProperties: Property[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: Property[];
  loading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(DEFAULT_PROPERTIES);
  const [allProperties, setAllProperties] = useState<Property[]>(DEFAULT_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [featured, all] = await Promise.all([fetchFeaturedProperties(), fetchAllProperties()]);
      if (featured.length > 0) setProperties(featured.map(dbToProperty).slice(0, 5));
      if (all.length > 0) setAllProperties(all.map(dbToProperty));
      setLoading(false);
    }
    load();
  }, []);

  const searchResults = searchQuery
    ? [...allProperties]
        .map(p => ({ ...p, _score: scoreProperty(p as any, searchQuery) }))
        .filter(p => p._score > 0)
        .sort((a: any, b: any) => b._score - a._score)
    : [];

  return (
    <PropertyContext.Provider value={{ properties, allProperties, searchQuery, setSearchQuery, searchResults, loading }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperties must be used within PropertyProvider');
  return ctx;
}
