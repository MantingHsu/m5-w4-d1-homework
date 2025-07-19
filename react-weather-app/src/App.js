import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import "./App.css";

countries.registerLocale(enLocale);

function App() {
  const [apiData, setApiData] = useState({});
  const [getState, setGetState] = useState("Los Angeles");
  const [state, setState] = useState("Los Angeles");

  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid=${apiKey}`;

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setApiData(data));
  }, [apiUrl]);

  const inputHandler = (e) => setGetState(e.target.value);
  const submitHandler = (e) => {
    e.preventDefault();
    setState(getState);
  };

  const kelvinToFahrenheit = (k) =>
    Math.round((k - 273.15) * 9 / 5 + 32);

  return (
    <div className="container py-4">
      <h2 className="mb-4">React Weather App</h2>
      <form onSubmit={submitHandler} className="mb-4">
        <label htmlFor="city-input" className="form-label">Enter City:</label>
        <input
          id="city-input"
          type="text"
          className="form-control mb-2"
          value={getState}
          onChange={inputHandler}
          placeholder="City"
        />
        <button type="submit" className="btn btn-primary w-100">Search</button>
      </form>

      <div className="weather-results p-4 rounded shadow">
        {apiData.main ? (
          <>
            <div className="text-center mb-4">
              <img
                alt="weather icon"
                src={`https://openweathermap.org/img/wn/${apiData.weather[0].icon}@2x.png`}
              />
              <h1>
                {kelvinToFahrenheit(apiData.main.temp)}°F
              </h1>
              <div>
                <FontAwesomeIcon icon={faLocationDot} />{" "}
                {apiData.name}
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <div>
                  <FontAwesomeIcon icon={faArrowDown} /> Low:{" "}
                  {kelvinToFahrenheit(apiData.main.temp_min)}°F
                </div>
                <div>
                  <FontAwesomeIcon icon={faArrowUp} /> High:{" "}
                  {kelvinToFahrenheit(apiData.main.temp_max)}°F
                </div>
              </div>
              <div className="col text-center">
                <div>
                  Weather: {apiData.weather[0].main}
                </div>
                <div>
                  Country:{" "}
                  {countries.getName(apiData.sys.country, "en")}
                </div>
              </div>
            </div>
          </>
        ) : (
          apiData.cod === '404' ? (
            <div className="alert alert-warning">City not found.</div>
          ) : apiData.cod ? (
            <div className="alert alert-danger">Error: {apiData.message}</div>
          ) : (
            <div>Enter a city and click Search to view the weather.</div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
