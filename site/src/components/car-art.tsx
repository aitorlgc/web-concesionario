import { carSVG } from "@/lib/car-art";
import { nombre, type Car } from "@/lib/stock";
import { cn } from "@/lib/utils";

export function CarArt({ car, className, uid }: { car: Car; className?: string; uid?: string }) {
  const svg = carSVG(car.shape, {
    id: uid ?? car.id,
    body: car.color,
    label: `${nombre(car)} en ${car.paint}, vista lateral`,
  });
  return <div className={cn("car-art", className)} dangerouslySetInnerHTML={{ __html: svg }} />;
}
