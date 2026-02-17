import { useState } from 'react';
import { fetchCarById } from './services/api';
import './App.css';

/* 
To help the page grow, we would definately take out the logic for car searches to it's own component, same with the car card & skeleton
There could also be a types file inside the car directory to store them

for validation, I would use multiple cases:
["", "abc", "abc-def", "abc-def-0", abc-def]
*/


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
  const [userMessge, setUserMessage] = useState("Please search for your car")
  const carIDRegex = new RegExp(/^abc-def-\d{3}$/)

  const handleSearch = async () => {
    setCar(null)
    //initial guarding
    if (carId == "") {
      setUserMessage("Please enter a valid car ID")
      return
    }

    if (!carIDRegex.test(carId)) {
      setUserMessage("Please enter a valid car ID eg: abc-def-xxx")
      return
    }

    if (carId.match(/^abc-def-000$/)) {
      setUserMessage("Please enter a valid car ID eg: abc-def-xxx")
      return
    }

    //set the loading to be true
    setUserMessage("")
    setLoading(true)
    //set up the returned car variable
    let returnedCar: carType | undefined;
    //error handling
    try {
      //try to find the car by ID
      returnedCar = await fetchCarById(carId)
    }
    //if there was an error with the API
    catch (error: any) {
      //we check the error exists, and that the message attribute is of type string
      if (error && typeof error.message === 'string') {
        //we do this so we can then check what the message contains
        if (error.message.match("Car not found")) {
          //set the associated hook
          setCarNotFound(true)
        } else if (error.message.match("Network error")) {
          setIsError(true)
        }
      }

    }

    //if the returned object isn't undefined -> i.e we have found it
    if (typeof returnedCar !== 'undefined') {
      //we set the error, loading and not found to false and then set the car, 
      setIsError(false)
      setCar(returnedCar);
      setLoading(false)
      setCarNotFound(false)
      setUserMessage("")
    } else {
      //since we have handled the other options in the catch, we only need to set the car and loading states here
      setCar(null);
      setLoading(false);
      setUserMessage("")
    }
  };
  //to conditionally display the different states we have a long tuple condition. The flow is Error -> Loading -> Not Found -> Car
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
        <button
          id="search-button"
          className='search-button'
          onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className='result'>
        {isError ?
          <div className='error-box'>
            <h2>We're Really Sorry!</h2>
            <p>Something seems to have gone wrong! Please retry your search</p>
          </div>
          :
          loading ? <CarSkeleton />
            :
            carNotFound ?
              <div className='error-box'>
                <h2>No car found</h2>
                <p>Please check to see if you entered the car ID correctly.</p>
              </div>
              :
              <CarCard car={car} />
        }
        {userMessge ?
          <div className='user-message'>{userMessge}</div>
          :
          <></>}
      </div>


    </div>
  );
}


//the car card to display car info
function CarCard({ car }: { car: carType | null }) {
  const currentYear = new Date().getFullYear()

  //just checking to ensure car is present. This is also what is shown on page load as all conditions are null, and car is null
  if (!car) {
    return (
      <></>
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

//car skeleton to display loading state
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

//loading spinner
function LoadingSpinner() {
  return (
    <span className="loader"></span>
  )
}


export default App;
