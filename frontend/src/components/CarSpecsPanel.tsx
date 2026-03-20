import { Car, Gauge, Cog, Fuel, Calendar, Palette, FileText, Tag } from 'lucide-react';

interface CarSpecsPanelProps {
  specifications: Record<string, any>;
}

function capitalize(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export function CarSpecsPanel({ specifications: s }: CarSpecsPanelProps) {
  const items = [
    { label: 'Make', value: s.make, icon: Car },
    { label: 'Model', value: s.model, icon: Car },
    { label: 'Year', value: s.year, icon: Calendar },
    {
      label: 'Condition',
      value: s.condition === 'certified' ? 'Certified Pre-Owned' : capitalize(s.condition),
      icon: Tag,
    },
    {
      label: 'Mileage',
      value: s.mileage ? `${Number(s.mileage).toLocaleString()} km` : undefined,
      icon: Gauge,
    },
    {
      label: 'Engine',
      value: s.engineCC ? `${s.engineCC} cc` : undefined,
      icon: Cog,
    },
    { label: 'Transmission', value: capitalize(s.transmission), icon: Cog },
    { label: 'Fuel Type', value: capitalize(s.fuelType), icon: Fuel },
    { label: 'Body Type', value: capitalize(s.bodyType), icon: Car },
    { label: 'Color', value: s.exteriorColor, icon: Palette },
    { label: 'Chassis Number', value: s.vin, icon: FileText },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Car className="w-5 h-5 text-blue-600" />
        Vehicle Specifications
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-start gap-2">
            <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
              <div className="text-gray-900 font-medium mt-0.5">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
