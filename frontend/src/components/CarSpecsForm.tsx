import { Car } from 'lucide-react';

export interface CarSpecs {
  make: string;
  model: string;
  year: string;
  mileage: string;
  engineCC: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  condition: string;
  exteriorColor: string;
  vin: string;
}

export const defaultCarSpecs: CarSpecs = {
  make: '',
  model: '',
  year: '',
  mileage: '',
  engineCC: '',
  transmission: '',
  fuelType: '',
  bodyType: '',
  condition: 'used',
  exteriorColor: '',
  vin: '',
};

interface CarSpecsFormProps {
  specs: CarSpecs;
  onChange: (specs: CarSpecs) => void;
}

export function CarSpecsForm({ specs, onChange }: CarSpecsFormProps) {
  const update = (field: keyof CarSpecs, value: string) =>
    onChange({ ...specs, [field]: value });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Car className="w-5 h-5 text-blue-600" />
        Vehicle Details
      </h2>

      <div className="space-y-4">
        {/* Make / Model / Year */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Make <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={specs.make}
              onChange={(e) => update('make', e.target.value)}
              placeholder="e.g., Toyota"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={specs.model}
              onChange={(e) => update('model', e.target.value)}
              placeholder="e.g., Land Cruiser"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1990"
              max="2026"
              value={specs.year}
              onChange={(e) => update('year', e.target.value)}
              placeholder="e.g., 2022"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Condition / Mileage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={specs.condition}
              onChange={(e) => update('condition', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select condition</option>
              <option value="new">Brand New</option>
              <option value="used">Used</option>
              <option value="certified">Certified Pre-Owned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mileage (km)
            </label>
            <input
              type="number"
              min="0"
              value={specs.mileage}
              onChange={(e) => update('mileage', e.target.value)}
              placeholder="e.g., 45000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Transmission / Fuel Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission
            </label>
            <select
              value={specs.transmission}
              onChange={(e) => update('transmission', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select transmission</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="cvt">CVT</option>
              <option value="semi-automatic">Semi-Automatic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type
            </label>
            <select
              value={specs.fuelType}
              onChange={(e) => update('fuelType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select fuel type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="lpg">LPG</option>
            </select>
          </div>
        </div>

        {/* Body Type / Engine / Color */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Type
            </label>
            <select
              value={specs.bodyType}
              onChange={(e) => update('bodyType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select body type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV / 4x4</option>
              <option value="pickup">Pickup Truck</option>
              <option value="van">Van / Minivan</option>
              <option value="hatchback">Hatchback</option>
              <option value="coupe">Coupe</option>
              <option value="wagon">Station Wagon</option>
              <option value="bus">Bus / Matatu</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Engine (cc)
            </label>
            <input
              type="number"
              min="0"
              value={specs.engineCC}
              onChange={(e) => update('engineCC', e.target.value)}
              placeholder="e.g., 2000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exterior Color
            </label>
            <input
              type="text"
              value={specs.exteriorColor}
              onChange={(e) => update('exteriorColor', e.target.value)}
              placeholder="e.g., Pearl White"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chassis Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chassis Number
          </label>
          <input
            type="text"
            value={specs.vin}
            onChange={(e) => update('vin', e.target.value)}
            placeholder="e.g., JN1CV6EK5CM640XXX"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
