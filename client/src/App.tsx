import { useState } from 'react';
import { fetchCarById } from './services/api';
import './App.css';

interface carType {
  make: string,
  model: string,
  age: number,
  mileage: number,
  colour: string,
  description: string,
  cost: number,
  fuelType: string,
  damage: string | null
}

function App() {
  // example id - note abc-def-[001 -> 020] eg - "abc-def-001", "abc-def-002" etc 
  const [carId, setCarId] = useState('');
  const [car, setCar] = useState<carType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // TODO: Call fetchCarById with the carId and update the state accordingly.
    let returnedCar: carType | undefined;
    for (let retries = 0; retries < 10; retries++) {
      try {
        returnedCar = await fetchCarById(carId)
        break
      } catch (error) {
        //do it again
        console.log(`Error communicating with server.\nError: ${error}\nRetry: ${retries}/10`)
      }
    }

    if (typeof returnedCar !== 'undefined') {
      setCar(returnedCar);
    } else {
      setCar(null);
    }
  };

  return (
    <div className="app">
      <h1>Car Finder</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Enter a car ID (e.g. abc-def-001)"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {/* TODO: Handle the different states below — loading, error, and displaying the car */}
      {loading ?
        <>
          Loading...
        </>
        :
        (
          car
            ? <CarCard {...car} />
            : null
        )
      }
    </div>
  );
}



function CarCard(car: carType | null) {
  const currentYear = new Date().getFullYear()

  if (!car) {
    return ("No car found")
  }

  return (
    <div className='car-card'>
      <div className="car-card-header">
        <p>🚗</p>
        <p>£{car.cost}</p>
      </div>
      <div className='car-card-title'>
        <h2 className='car-type'>{car.make} {car.model}</h2>
      </div>
      <div className="car-card-info-grid">
        <div>Made In: {car.age}</div>
        <div>Age: {currentYear - car.age}</div>
        <div>Colour: {car.colour}</div>
        <div>Fuel Type: {car.fuelType}</div>
      </div>
      <div className="car-card-description">
        {car.description}
      </div>
      <div>
        {car.damage ? car.damage : "No damage reported"}
      </div>
    </div>
  )
}


export default App;
