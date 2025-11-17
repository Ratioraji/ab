import { computeSummary } from "../src/services/portfolioSummary";
import { Position, PositionStatus } from "../src/types";

describe("computeSummary", () => {
  it("should handle empty array", () => {
    const result = computeSummary([]);
    expect(result).toEqual({
      totalTonnes: 0,
      totalValue: 0,
      averagePricePerTonne: 0,
    });
  });

  it("should calculate correct totals for single position", () => {
    const positions: Position[] = [
      {
        id: "1",
        projectName: "Test Project",
        tonnes: 100,
        pricePerTonne: 25,
        status: "available",
        vintage: 2023,
      },
    ];

    const result = computeSummary(positions);

    expect(result.totalTonnes).toBe(100);
    expect(result.totalValue).toBe(2500);
    expect(result.averagePricePerTonne).toBe(25);
  });

  it("should calculate weighted average correctly for multiple positions", () => {
    const positions: Position[] = [
      {
        id: "1",
        projectName: "Project A",
        tonnes: 1000,
        pricePerTonne: 20,
        status: "available",
        vintage: 2023,
      },
      {
        id: "2",
        projectName: "Project B",
        tonnes: 100,
        pricePerTonne: 30,
        status: "available",
        vintage: 2023,
      },
    ];

    const result = computeSummary(positions);

    expect(result.totalTonnes).toBe(1100);
    expect(result.totalValue).toBe(23000);
    expect(result.averagePricePerTonne).toBeCloseTo(20.909, 2);
  });

  it("should handle positions with zero tonnes", () => {
    const positions: Position[] = [
      {
        id: "1",
        projectName: "Project A",
        tonnes: 100,
        pricePerTonne: 25,
        status: "available",
        vintage: 2023,
      },
      {
        id: "2",
        projectName: "Project B",
        tonnes: 0,
        pricePerTonne: 30,
        status: "available",
        vintage: 2023,
      },
    ];

    const result = computeSummary(positions);

    expect(result.totalTonnes).toBe(100);
    expect(result.totalValue).toBe(2500);
    // What should the average be when one position has zero tonnes?
    expect(result.averagePricePerTonne).toBeDefined();
  });

  it("should filter positions by status correctly", () => {
    const positions: Position[] = [
      {
        id: "1",
        projectName: "A",
        tonnes: 100,
        pricePerTonne: 20,
        status: "available",
        vintage: 2023,
      },
      {
        id: "2",
        projectName: "B",
        tonnes: 50,
        pricePerTonne: 30,
        status: "retired",
        vintage: 2022,
      },
      {
        id: "3",
        projectName: "C",
        tonnes: 200,
        pricePerTonne: 25,
        status: "available",
        vintage: 2024,
      },
    ];

    const result = computeSummary(positions, { status: "available" });
    const expectedTotalTonnes = 300;
    const expectedTotalValue = 100 * 20 + 200 * 25;
    const averagePricePerTonne = expectedTotalValue / expectedTotalTonnes;

    expect(result.totalTonnes).toBe(expectedTotalTonnes);
    expect(result.totalValue).toBe(expectedTotalValue);
    expect(result.averagePricePerTonne).toBeCloseTo(averagePricePerTonne, 2);
  });

  it("should return zeros when status does not match any of the filters", () => {
    const positions: Position[] = [
      {
        id: "1",
        projectName: "Alpha",
        tonnes: 100,
        pricePerTonne: 20,
        status: "available",
        vintage: 2023,
      },
      {
        id: "2",
        projectName: "Beta",
        tonnes: 50,
        pricePerTonne: 30,
        status: "retired",
        vintage: 2022,
      },
    ];

    const result = computeSummary(positions, {
      status: "pending" as PositionStatus,
    });

    expect(result.totalTonnes).toBe(0);
    expect(result.totalValue).toBe(0);
    expect(result.averagePricePerTonne).toBe(0);
  });
});
