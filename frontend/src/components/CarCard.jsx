import { useNavigate } from "react-router-dom";

export default function CarCard({ car }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/car/${car.id}`)}
      className="border rounded p-4 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="text-xl font-bold">
        {car.make} {car.model}
      </h3>
      <p>Год: {car.year}</p>
      <p>VIN: {car.vin}</p>
    </div>
  );
}
