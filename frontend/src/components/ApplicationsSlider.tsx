import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Application {
  id: number;
  title: string;
  image: string;
  description: string;
}

const applications: Application[] = [
  {
    id: 1,
    title: 'Water Storage Tank Powder Manufacturers',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-01.png',
    description: 'High-quality rotomolding powder for water storage tanks'
  },
  {
    id: 2,
    title: 'Traffic Cone Roto Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-03.jpg',
    description: 'Durable powder for traffic safety equipment'
  },
  {
    id: 3,
    title: 'Road Barrier Roto Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-04.jpg',
    description: 'Industrial-grade powder for road safety barriers'
  },
  {
    id: 4,
    title: 'Roto Molded Mobile Toilet Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-05.png',
    description: 'Specialized powder for portable sanitation solutions'
  },
  {
    id: 5,
    title: 'Roto Moulding Pallet',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-06.png',
    description: 'Heavy-duty powder for industrial pallets'
  },
  {
    id: 6,
    title: 'Playground Equipment Rotational Mould Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-07.jpg',
    description: 'Safe, colorful powder for playground equipment'
  },
  {
    id: 7,
    title: 'Slimline Water Tank Mould Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-08.jpg',
    description: 'Powder for space-efficient water storage solutions'
  },
  {
    id: 8,
    title: 'Rotomolded Ice Box Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-09.jpg',
    description: 'Insulated powder for coolers and ice boxes'
  },
  {
    id: 9,
    title: 'Slimline Rain Water Tanks',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-11.jpg',
    description: 'Eco-friendly powder for rainwater harvesting'
  },
  {
    id: 10,
    title: 'Rotomolded Boat Manufacturer',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-12.jpg',
    description: 'Marine-grade powder for boat manufacturing'
  },
  {
    id: 11,
    title: 'Water Storage Tank Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-13.jpg',
    description: 'Premium powder for large water storage solutions'
  },
  {
    id: 12,
    title: 'Flower Pot Mould Powder Manufacturer',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-14.jpg',
    description: 'Decorative powder for garden and nursery products'
  },
  {
    id: 13,
    title: 'Rotomolded Garden Products',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-16.jpg',
    description: 'Versatile powder for outdoor applications'
  },
  {
    id: 14,
    title: 'Wheeled Bins Storage',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-17.jpg',
    description: 'Robust powder for waste management solutions'
  },
  {
    id: 15,
    title: 'Rotomolded Ice Box Powder Manufacturer',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-18.jpg',
    description: 'Professional-grade powder for cooling equipment'
  },
  {
    id: 16,
    title: 'Roto Moulded Milk Cans Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-19.jpg',
    description: 'Food-grade powder for dairy containers'
  },
  {
    id: 17,
    title: 'Roto Moulded Pallet Powder',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-20.jpg',
    description: 'Industrial powder for logistics and warehousing'
  },
  {
    id: 18,
    title: 'Roto Moulding Basin',
    image: 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/roto/home/ex-21.jpg',
    description: 'Multipurpose powder for household applications'
  }
];

export function ApplicationsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = applications.length - getVisibleSlides();
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Get number of visible slides based on screen width
  const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 5;
    if (window.innerWidth >= 1280) return 5; // xl - 5 slides
    if (window.innerWidth >= 1024) return 4; // lg - 4 slides
    if (window.innerWidth >= 768) return 3;  // md - 3 slides
    return 2; // sm - 2 slides
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? 0 : prevIndex - 1
    );
  };

  const handleNext = () => {
    const maxIndex = applications.length - getVisibleSlides();
    setCurrentIndex((prevIndex) => 
      prevIndex >= maxIndex ? maxIndex : prevIndex + 1
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 md:py-16 pb-20 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Applications & Industries
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how our products serve diverse industries worldwide
          </p>
        </div>

        {/* Slider Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex >= applications.length - getVisibleSlides()}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>

          {/* Slider Track */}
          <div className="overflow-hidden group">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out gap-3 md:gap-4"
              style={{
                transform: `translateX(-${currentIndex * (100 / getVisibleSlides())}%)`
              }}
            >
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <div className="relative h-40 md:h-48 overflow-hidden">
                      <img
                        src={app.image}
                        alt={app.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm md:text-base font-bold text-gray-900 text-center">
                        {app.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {Array.from({ length: applications.length - getVisibleSlides() + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'w-8 bg-blue-600' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-10 md:mt-12">
          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Looking for products for your industry?
          </p>
          <button className="px-6 md:px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
            Explore All Products
          </button>
        </div>
      </div>
    </div>
  );
}
