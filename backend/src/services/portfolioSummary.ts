import { Position, PortfolioSummary } from "../types";

/**
 * Computes a summary of the given positions.
 */
export function computeSummary(positions: Position[]): PortfolioSummary {
  if (positions.length === 0) {
    return {
      totalTonnes: 0,
      totalValue: 0,
      averagePricePerTonne: 0,
    };
  }

  const totalTonnes = positions.reduce((sum, pos) => sum + pos.tonnes, 0);
  const totalValue = positions.reduce(
    (sum, pos) => sum + pos.tonnes * pos.pricePerTonne,
    0
  );

  const averagePricePerTonne = totalValue / totalTonnes;

  return {
    totalTonnes,
    totalValue,
    averagePricePerTonne,
  };
}
