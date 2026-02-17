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
  const [isError, setIsError] = useState(false);
  const [carNotFound, setCarNotFound] = useState(false)

  const handleSearch = async () => {
    // TODO: Call fetchCarById with the carId and update the state accordingly.
    //set the loading to be true
    setLoading(true)
    //set up the returned car variable
    let returnedCar: carType | undefined;
    try {
      returnedCar = await fetchCarById(carId)
    } catch (error: any) {
      if (error && typeof error.message === 'string') {
        if (error.message.match("Car not found")) {
          setCarNotFound(true)
        } else if (error.message.match("Network error")) {
          setIsError(true)
        }
      }

    }



    if (typeof returnedCar !== 'undefined') {
      setIsError(false)
      setCar(returnedCar);
      setLoading(false)
      setCarNotFound(false)
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
      {isError ?
        <div className='error-box'>
          <h2>We're Really Sorry!</h2>
          <p>Something seems to have gone wrong! Please retry your search</p>
        </div>
        :
        carNotFound ?
          <div className='error-box'>
            <h2>No car found</h2>
            <p>Please check to see if you entered the car ID correctly.</p>
          </div>
          :
          loading ? <CarSkeleton /> : <CarCard car={car} />
      }

    </div>
  );
}



function CarCard({ car }: { car: carType | null }) {
  const currentYear = new Date().getFullYear()

  if (!car) {
    return (
      <>No car found</>
    )
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

function CarSkeleton() {
  return (
    <div className='car-card'>
      <div className="car-card-header">
        <p>🚗</p>
        <p>£<LoadingSpinner /></p>
      </div>
      <div className='car-card-title'>
        <h2 className='car-type'><LoadingSpinner /></h2>
      </div>
      <div className="car-card-info-grid">
        <div>Made In: <LoadingSpinner /></div>
        <div>Age: <LoadingSpinner /></div>
        <div>Colour: <LoadingSpinner /></div>
        <div>Fuel Type: <LoadingSpinner /></div>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <span className="loader"></span>
  )
}


export default App;
