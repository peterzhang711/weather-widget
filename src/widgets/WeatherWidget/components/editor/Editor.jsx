import React from "react";
import { Form, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./editor.scss";
import {
  TEMP_DISPLAY_METRIC,
  TEMP_DISPLAY_IMPERIAL,
  SHOW_WIND_ON,
  SHOW_WIND_OFF,
} from "../../constants/WeatherWidgetConstants";

const Editor = ({
  title,
  onTitleChange,
  handleShowWind,
  handleTempDisplay,
}) => {
  return (
    <div className="editor">
      <Form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Col xs="auto">
            <Form.Control
              size="lg"
              type="text"
              data-testid="widgetTitleInput"
              placeholder={title}
              onChange={onTitleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group>
          <Form.Label column="lg" lg={2}>
            Temperature
          </Form.Label>
          <br />
          <Form.Check
            type="radio"
            name="temp"
            id={`radio_${TEMP_DISPLAY_METRIC}`}
            value={TEMP_DISPLAY_METRIC}
            label="°C"
            defaultChecked
            inline
            onChange={handleTempDisplay}
            data-testid="radio_tempC"
          />
          <Form.Check
            type="radio"
            name="temp"
            id={`radio_${TEMP_DISPLAY_IMPERIAL}`}
            value={TEMP_DISPLAY_IMPERIAL}
            label="°F"
            inline
            onChange={handleTempDisplay}
            data-testid="radio_tempF"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label column="lg" lg={2}>
            Wind
          </Form.Label>
          <br />
          <Form.Check
            type="radio"
            name="wind"
            value={SHOW_WIND_ON}
            id={`radio_${SHOW_WIND_ON}`}
            label="On"
            defaultChecked
            inline
            onChange={handleShowWind}
            data-testid="radio_windON"
          />
          <Form.Check
            type="radio"
            name="wind"
            value={SHOW_WIND_OFF}
            id={`radio_${SHOW_WIND_OFF}`}
            label="Off"
            inline
            onChange={handleShowWind}
            data-testid="radio_windOff"
          />
        </Form.Group>
      </Form>
    </div>
  );
};

Editor.propTypes = {
  title: PropTypes.string,
  onTitleChange: PropTypes.func,
  handleShowWind: PropTypes.func,
  handleTempDisplay: PropTypes.func,
};

export default Editor;
