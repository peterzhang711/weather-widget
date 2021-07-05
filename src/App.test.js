import { render, screen } from '@testing-library/react';
import React from "react";
import App from "./App";

describe("App", () => {

    it("App renders", () => {
        render(<App />);
        expect(screen.queryByText("Temperature")).toBeInTheDocument();
    });
})