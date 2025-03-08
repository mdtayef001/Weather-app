import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Loading from "./components/Loading";
import { FaSearch } from "react-icons/fa";
import { FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { IoLocationSharp } from "react-icons/io5";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const { isPending } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      // get the current location

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // fetching data of the current location

            const { data } = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
                import.meta.env.VITE_API_KEY
              }&units=metric`
            );
            setWeather(data);
            setCity(data.name);
          } catch (err) {
            setError("Unable to fetch weather for your location.");
            console.log(err.message);
          }
        },
        () => setError("Geolocation permission denied."),
        { enableHighAccuracy: true }
      );
    },
  });

  // fetching data of city

  const fetchWeather = async () => {
    if (!city) return;
    try {
      setError(null);
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric`
      );
      setWeather(data);
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
      console.log(err.message);
    }
  };

  if (isPending) return <Loading />;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gradient-to-br from-teal-400 to-blue-600 p-6 rounded-2xl shadow-lg text-white w-full max-w-lg">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-full mb-4">
            <input
              type="text"
              className="flex-1 outline-none text-black px-2"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              onClick={fetchWeather}
              className="text-black cursor-pointer mr-2"
            >
              <FaSearch />
            </button>
          </div>
          {error && <p className="text-red-200 text-center">{error}</p>}
          {weather && (
            <div className="text-center">
              <div className="flex justify-center mt-8">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  className="w-20 h-20"
                />
              </div>
              <p className="text-4xl mt-5 font-bold">{weather.main.temp}°C</p>
              <p className="text-xl flex items-center justify-center gap-1 mt-2">
                <IoLocationSharp />
                {weather.name}, {weather.sys.country}
              </p>
              <div className="flex justify-between mt-8 text-lg">
                <p className="flex items-center  gap-2">
                  <span>
                    <WiHumidity className="text-2xl" />
                  </span>
                  {weather.main.humidity}% Humidity
                </p>
                <p className="flex items-center gap-2">
                  <span>
                    <FaWind />
                  </span>{" "}
                  {weather.wind.speed} km/h Wind Speed
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
