import { Position, PortfolioSummary, PositionStatus } from "../types";

/**
 * Computes a summary of the given positions.
 */
export function computeSummary(positions: Position[], options?: { status?: PositionStatus }): PortfolioSummary {
  let processedPositions = positions;

  // filter by status if provided
  if (options?.status) {
    processedPositions = processedPositions.filter((pos) => pos.status === options.status);
  }

  if (processedPositions.length === 0) {
    return {
      totalTonnes: 0,
      totalValue: 0,
      averagePricePerTonne: 0,
    };
  }

  const totalTonnes = processedPositions.reduce((sum, pos) => sum + pos.tonnes, 0);
  const totalValue = processedPositions.reduce(
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
