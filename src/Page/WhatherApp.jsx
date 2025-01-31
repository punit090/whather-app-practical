import React, { useState, useEffect } from 'react';
import "../Css/WhatherApp.css";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FaLocationDot } from "react-icons/fa6";
import { FiSunrise, FiSunset, FiWind } from "react-icons/fi";
import { WiHumidity, WiBarometer, WiDayCloudy, WiDaySunny, WiRain, WiSnow, WiThunderstorm } from 'weather-icons-react';
import SunImg from "../assets/img/sunImg.png";
import axios from 'axios';

const WhatherApp = () => {
  const [city, setCity] = useState('Vadodara');  
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const apiKey = 'a94874d67c91515b424d6e267684cc0c';

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'Clear': return <WiDaySunny size={50} color='#FFD700' />;
      case 'Clouds': return <WiDayCloudy size={50} color='#B0C4DE' />;
      case 'Rain': return <WiRain size={50} color='#4682B4' />;
      case 'Snow': return <WiSnow size={50} color='#ADD8E6' />;
      case 'Thunderstorm': return <WiThunderstorm size={50} color='#8B0000' />;
      default: return <WiDaySunny size={50} color='#FFD700' />;
    }
  };

  const handleCitySearch = async () => {
    try {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      setWeatherData(weatherResponse.data);

      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };

  useEffect(() => {
    handleCitySearch();  
  }, []);

  return (
  
    <div className={`whatherMainDiv ${isDarkMode ? "dark-mode" : "light-mode"}`}>  
      <Container fluid style={{padding:"20px"}}>
      <Row className="whatherRow">
        <Col lg={2} md={2}>
          <Form.Check type="switch" id="custom-switch" label={isDarkMode ? "Dark Mode" : "Light Mode"} checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
        </Col>
        <Col lg={10} md={10}>
          <Row>
            <Col lg={10} md={10}>
              <Form.Control type="text" placeholder="Search for a city..." value={city} onChange={(e) => setCity(e.target.value)} className="sarchInput" />
            </Col>
            <Col lg={2} md={2} className='searchCol'>
              <Button className="searchBtn" onClick={handleCitySearch}>Search</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    {/* =====> city  */}
      {weatherData && (
        <Row className="timeRow">
          <Col lg={5} md={5}>
            <div className="timeCard">
              <div className="athensTitle">{weatherData.name}</div>
              <div className="timeTitle">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="dateDiv">{new Date().toLocaleDateString()}</div>
            </div>
          </Col>
          <Col lg={7} md={7}>
            <div className="timeCard">
              <Row>
                <Col lg={4} md={4}>
                  <div className="diageryDiv">{weatherData.main.temp}°C</div>
                  <div className="digreeSubtitle">Feels like: {weatherData.main.feels_like}°C</div>
                  <div className="digreeSubtitle"><FiSunrise /> {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</div>
                  <div className="digreeSubtitle"><FiSunset /> {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</div>
                </Col>
                <Col lg={4} md={4}>
                  <img src={SunImg} alt="weather icon" />
                  <div className="monsoonTitle">{weatherData.weather[0].description}</div>
                  {/* {getWeatherIcon(weatherData.weather[0].main)} */}
                </Col>
                <Col lg={4} md={4}>
                    <div className="speedMainDiv">
                      <div>
                        <div className="digreeSubtitle">
                          <WiHumidity size={20} /> {weatherData.main.humidity}%
                        </div>
                        <div className="digreeSubtitle">
                          Humidity
                        </div>
                      </div>
                      <div>
                        <div className="digreeSubtitle">
                          <FiWind size={20} /> {weatherData.wind.speed} km/h
                        </div>
                        <div className="digreeSubtitle">
                          Wind Speed
                        </div>
                      </div>
                    </div>
                    <div className="speedMainDiv">
                      <div>
                        <div className="digreeSubtitle">
                          <WiBarometer size={20} /> {weatherData.main.pressure} hPa
                        </div>
                        <div className="digreeSubtitle">
                          Pressure
                        </div>
                      </div>
                      <div>
                        <div className="digreeSubtitle">
                          {weatherData.uvi || 0}
                        </div>
                        <div className="digreeSubtitle">
                          UV
                        </div>
                      </div>
                    </div>
                  </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}
      {/* ====>forecastData */}
      {forecastData && (
        <Row>
          <Col lg={12}>
            <div className="timeCard">
              <div className="athensTitle">5-Day Forecast</div>
              <Row>
                {forecastData.list.filter((_, index) => index % 8 === 0).map((forecast, index) => (
                  <Col key={index}  className=" col-lg forecastCard">
                    <div>{new Date(forecast.dt * 1000).toLocaleDateString()}</div>
                    {getWeatherIcon(forecast.weather[0].main)}
                    <div>{forecast.main.temp}°C</div>
                    <div>{forecast.weather[0].description}</div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      )}
      </Container>
    </div>
 
  );
};

export default WhatherApp;