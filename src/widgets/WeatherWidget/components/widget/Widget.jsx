import React from "react";
import LoadingBox from "../LoadingBox";
import { Alert, Card, ListGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import "./widget.scss";

const Widget = ({
  title,
  cityName,
  temperature,
  icon,
  wind,
  showWind,
  loading,
  error,
}) => {
  if (loading) {
    return <LoadingBox />;
  }

  if (error) {
    return <Alert className="warning">{error}</Alert>;
  }

  if (!cityName) {
    return null;
  }

  return (
    <div className="widget" data-testid="loading">
      <Card>
        <Card.Body>
          <Card.Title className="widget__title" data-testid="title">
            {title == "" ? "Please enter the Title" : title}
          </Card.Title>
          <div className="widget__content">
            {icon && (
              <Card.Img
                variant="top"
                src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
                data-testid="img"
              />
            )}
            <ListGroup variant="flush">
              <ListGroup.Item data-testid="city_name">
                {cityName}
              </ListGroup.Item>
              <ListGroup.Item className="widget__degree" data-testid="temp">
                {Math.round(temperature)} °
              </ListGroup.Item>
              <ListGroup.Item
                className={`widget__wind ${
                  showWind ? "widget__wind--show" : "widget__wind--hide"
                }`}
                data-testid="wind_on_off"
              >
                <span className="widget__wind--text">wind</span>
                <span>{wind.windDirection}</span>
                <span>{wind.windSpeed}km/h</span>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

Widget.propTypes = {
  title: PropTypes.string,
  cityName: PropTypes.string,
  temperature: PropTypes.string,
  icon: PropTypes.string,
  showWind: PropTypes.bool,
  loading: PropTypes.bool,
  wind: PropTypes.objectOf(PropTypes.string),
  error: PropTypes.string,
};

export default Widget;
