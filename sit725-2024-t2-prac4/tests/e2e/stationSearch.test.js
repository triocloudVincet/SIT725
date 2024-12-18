import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EVChargingApp from "../../src/components/EVChargingApp";

describe("Station Search E2E", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should allow searching for stations", async () => {
    render(<EVChargingApp />);

    // Wait for map to load
    await waitFor(() => {
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    // Change search radius
    const radiusInput = screen.getByRole("slider");
    fireEvent.change(radiusInput, { target: { value: 20 } });

    await waitFor(() => {
      expect(screen.getByText("20km")).toBeInTheDocument();
    });
  });
});
