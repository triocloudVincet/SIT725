import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EVChargingApp from "../../src/components/EVChargingApp";

describe("Route Planning E2E", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should allow planning a route", async () => {
    render(<EVChargingApp />);

    // Switch to route planning tab
    const routeTab = screen.getByText("Plan Route");
    fireEvent.click(routeTab);

    // Wait for route planning view
    await waitFor(() => {
      expect(screen.getByText("Start Location")).toBeInTheDocument();
    });

    // Click calculate route button
    const calculateButton = screen.getByText("Calculate Routes");
    fireEvent.click(calculateButton);

    // Should show error if locations not selected
    await waitFor(() => {
      expect(screen.getByText(/please select both/i)).toBeInTheDocument();
    });
  });
});
