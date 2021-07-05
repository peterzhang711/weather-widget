import { fireEvent, render, screen, waitFor, act, cleanup, } from '@testing-library/react';
import React from "react";
import WeatherWidget, { windDegreeToWindDirection } from '.';
import axiosMock from "axios";
import Widget from './components/widget/Widget';



afterEach(cleanup);
const mockGeolocation = {
    getCurrentPosition: ((success) => Promise.resolve(success({
        coords: {
          latitude: 51.1,
          longitude: 45.3
        }
      })))
  };

{/* eslint-disable-next-line */}
global.navigator.geolocation = mockGeolocation;

describe("widgets", () => {
    describe("WeatherWidget", () => {

        it("renders", () => {
            render(<WeatherWidget />);

            expect(screen.queryByText("Temperature")).toBeInTheDocument();
            expect(screen.queryByText("Title")).toBeInTheDocument();
            expect(screen.queryByText("Wind")).toBeInTheDocument();
        });

        it("Temperature radio C button has value of metric", () => {
            const { queryByTestId } = render(<WeatherWidget />);
            const radioTempC = queryByTestId("radio_tempC");

            expect(radioTempC.value).toBe("metric");
        })

        it("Wind radio on button has value of ON", () => {
            const { queryByTestId } = render(<WeatherWidget />);
            const radioWindON = queryByTestId("radio_windON");

            expect(radioWindON.value).toBe("ON");
        })

        it("Can update the title", async () => {
            act(async () => {          
                const { queryByText } = render(<WeatherWidget />);
                const title = "test title";
                fireEvent.change(
                    screen.queryByTestId("widgetTitleInput"),
                    { target: { value: title } },
                );
                const listNode = await waitFor(() => queryByText(title));

                expect(listNode).toBeInTheDocument();
              });
        });

        it("fetches and displays correct city name", async () => {
           await act(async () => {
            axiosMock.get.mockResolvedValueOnce({data: { cityName: "Sydney"}})
            const cityName = "Sydney";
            const loading = false;
            const error = "";
            const wind = { windSpeed: "30", windDirection: "NE"};
            const {findByTestId} = render(<Widget wind={wind} cityName={cityName} loading={loading} error={error}/>);
            const resolvedSpan = await waitFor(() => findByTestId("city_name"));

            expect(resolvedSpan).toHaveTextContent("Sydney");
            });
        });

        it("Displays correct reminder when title input is empty", async () => {
            await act(async () => {
             const cityName = "Sydney";
             const loading = false;
             const error = "";
             const wind = { windSpeed: "30", windDirection: "NE"};
             const title = "";
             const {findByTestId} = render(<Widget title={title} wind={wind} cityName={cityName} loading={loading} error={error}/>);
             const titleContent = await waitFor(() => findByTestId("title"))

             expect(titleContent).toHaveTextContent("Please enter the Title")
             });
         });

         it("Image src receives proper icon value", async () => {
            await act(async () => {
             const cityName = "Sydney";
             const loading = false;
             const error = "";
             const wind = { windSpeed: "30", windDirection: "NE"}
             const icon = "abc";
             const imgURL = "http://openweathermap.org/img/wn/abc@2x.png"
             const {findByTestId} = render(<Widget icon={icon} wind={wind} cityName={cityName} loading={loading} error={error}/>);
             const imgContent = await waitFor(() => findByTestId("img"));

             expect(imgContent.src).toContain(icon);
             });
         });

         it("Wind contains the correct className when recevie the show/off boolean value", async () => {
            await act(async () => {
             const cityName = "Sydney";
             const loading = false;
             const error = "";
             const wind = { windSpeed: "30", windDirection: "NE"};
             const showWind = true;
             const {findByTestId} = render(<Widget showWind={showWind} wind={wind} cityName={cityName} loading={loading} error={error}/>);
             const windContent = await waitFor(() => findByTestId("wind_on_off"));

             expect(windContent.classList.contains("widget__wind--show")).toBe(true);
             });
         });

         it("windDegreeToWindDirection takes wind degree number returns correct code", () => {
             const result_01 = windDegreeToWindDirection(250);
             const result_02 = windDegreeToWindDirection(0);
             expect(result_01).toBe("W");
             expect(result_02).toBe("N");
         })

        it("Click the tempature F button fires off the function and reflect on UI", async () => {
            await act(async () => {
             axiosMock.get.mockResolvedValueOnce({data: { temperature: 7}})
             const cityName = "Sydney";
             const loading = false;
             const error = "";
             const wind = { windSpeed: "30", windDirection: "NE"};
             const temperature = Math.round(7*1.8+32)
             const { queryByTestId } = render(
                <>
                <WeatherWidget />
                <Widget temperature={temperature} wind={wind} cityName={cityName} loading={loading} error={error}/>
                </>)
            const btn = queryByTestId("radio_tempF")
            fireEvent.click(btn);
            const resolvedSpan = await waitFor(() => queryByTestId("temp"))
            
            expect(resolvedSpan).toHaveTextContent(temperature)
             })
         })

        it("Click the Wind off button fires off handleShowWind event and reflects on UI", async () => {
            await act(async () => {
             const cityName = "Sydney";
             const loading = false;
             const error = "";
             const wind = { windSpeed: "30", windDirection: "NE"};
             const { queryByTestId } = render(
             <>
             <WeatherWidget />
             <Widget wind={wind} cityName={cityName} loading={loading} error={error}/>
             </>)
            const windClassName = "widget__wind--hide";
            const btn = queryByTestId("radio_windOff");
            fireEvent.click(btn);
            const windContent = await waitFor(() => queryByTestId("wind_on_off"));

             expect(windContent.classList.contains(windClassName)).toBe(true);
             });
         });
    });
});
