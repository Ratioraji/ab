import { useEffect, useState } from "react";
import { Position } from "@/types/portfolio";
import { PositionsTable } from "@/components/PositionsTable";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE_URL = "http://localhost:4000/api";
interface PortfolioSummary {
  totalTonnes: number;
  totalValue: number;
  averagePricePerTonne: number;
}

const STATUS_OPTIONS = ["all", "available", "retired"] as const;

const Index = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<(typeof STATUS_OPTIONS)[number]>("all");

  const { toast } = useToast();

  useEffect(() => {
    fetchPositions();
  }, []);

   useEffect(() => {
    fetchSummary(selectedStatus);
  }, [selectedStatus]);
  
  const fetchPositions = async () => {
    try {
      setIsLoadingPositions(true);
      const response = await fetch(`${API_BASE_URL}/portfolio`);
      if (!response.ok) throw new Error("Failed to fetch positions");
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to load portfolio positions. Make sure the backend is running.",
        variant: "destructive",
      });
      console.error("Error fetching positions:", error);
    } finally {
      setIsLoadingPositions(false);
    }
  };

  const fetchSummary = async (status: (typeof STATUS_OPTIONS)[number]) => {
    try {
      setIsLoadingSummary(true);
      let url = `${API_BASE_URL}/portfolio/summary`;
      if (status !== "all") {
        url += `?status=${status}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch portfolio summary");
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load portfolio summary",
        variant: "destructive",
      });
      console.error("Error fetching summary:", error);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Carbon Portfolio</h1>
          <p className="text-muted-foreground">
            Manage and track your carbon credit positions
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Portfolio Summary</h2>

            {/* Status Filter Dropdown */}
            <Select
              value={selectedStatus}
              onValueChange={(val) =>
                setSelectedStatus(val as (typeof STATUS_OPTIONS)[number])
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoadingSummary ? (
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          ) : summary ? (
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Tonnes</CardTitle>
                </CardHeader>
                <CardContent>
                  {summary.totalTonnes.toLocaleString()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  ${summary.totalValue.toLocaleString()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Price/Tonne</CardTitle>
                </CardHeader>
                <CardContent>
                  ${summary.averagePricePerTonne.toFixed(2)}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-muted-foreground">No summary available</div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Positions</h2>
            {isLoadingPositions ? (
             <div className="space-y-2">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ) : positions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No positions found
              </div>
            ) : (
              <PositionsTable positions={positions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
