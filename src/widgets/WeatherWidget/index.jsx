import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import Editor from "./components/editor/Editor";
import Widget from "./components/widget/Widget";
import "./index.scss";
import {
  TEMP_DISPLAY_METRIC,
  SHOW_WIND_ON,
} from "./constants/WeatherWidgetConstants";

export const windDegreeToWindDirection = (degree) => {
  if (degree > 337.5) return "N";
  if (degree > 292.5) return "NW";
  if (degree > 247.5) return "W";
  if (degree > 202.5) return "SW";
  if (degree > 157.5) return "S";
  if (degree > 122.5) return "SE";
  if (degree > 67.5) return "E";
  if (degree > 22.5) return "NE";

  return "N";
};

const WeatherWidget = () => {
  const [title, setTitle] = useState("Title of widget");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [temperature, setTemperature] = useState("");
  const [cityName, setCityName] = useState("");
  const [wind, setWind] = useState({ windSpeed: "", windDirection: "" });
  const [icon, setIcon] = useState("");

  const [showWind, setShowWind] = useState(true);
  const [tempDisplay, setTempDisplay] = useState(TEMP_DISPLAY_METRIC);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?appid=03635fcabb1ff7130cea1a272aa67725&lat=${latitude}&lon=${longitude}&units=${tempDisplay}`
        );

        setTemperature(res.data.main.temp);
        setCityName(res.data.name);
        setIcon(res.data.weather[0].icon);
        setWind({
          ...wind,
          windSpeed: res.data.wind.speed,
          windDirection: windDegreeToWindDirection(res.data.wind.deg),
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude, tempDisplay]);

  const handleShowWind = (event) => {
    setShowWind(event.target.value === SHOW_WIND_ON);
  };

  const handleTempDisplay = (event) => {
    setTempDisplay(event.target.value);
  };

  return (
    <div className="weather-widget">
      <Container>
        <Row className="weather-widget__row">
          <Col sm={6} className="weather-widget__editor">
            <Editor
              title={title}
              handleShowWind={handleShowWind}
              handleTempDisplay={handleTempDisplay}
              onTitleChange={(event) => setTitle(event.target.value)}
            />
          </Col>
          <Col sm={6} className="weather-widget__widget">
            <Widget
              title={title}
              status={status}
              cityName={cityName}
              temperature={temperature}
              icon={icon}
              wind={wind}
              showWind={showWind}
              loading={loading}
              error={error}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WeatherWidget;
