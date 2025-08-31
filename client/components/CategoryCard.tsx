import { Card } from "./ui/card";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  productCount: number;
  icon?: React.ReactNode;
}

export function CategoryCard({
  id,
  name,
  image,
  productCount,
  icon,
}: CategoryCardProps) {
  const handleClick = () => {
    // Navigate to products page with category filter
    window.location.href = `/products?category=${encodeURIComponent(name.toLowerCase())}`;
  };

  return (
    <Card
      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card cursor-pointer hover-lift hover-glow"
      onClick={handleClick}
    >
      {/* Category Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          {icon && (
            <div className="mb-2 p-3 rounded-full bg-white/20 backdrop-blur-sm">
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-lg text-center mb-1">{name}</h3>
          <p className="text-sm text-white/90">{productCount} products</p>
        </div>
      </div>
    </Card>
  );
}
