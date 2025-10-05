"use client";

import { Badge, Button } from "@hackathon/ui";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { StoredScenario } from "../_types/scenario-storage";
import { getStoredScenarios, removeScenario } from "../_utils/scenario-storage";

interface ScenarioPaginationProps {
  onScenarioChange: (scenario: StoredScenario | null) => void;
  onCreateNew: () => void;
  currentTokenID: string;
}

export function ScenarioPagination({
  onScenarioChange,
  onCreateNew,
  currentTokenID,
}: ScenarioPaginationProps) {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Array<StoredScenario>>([]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const scenariosPerPage = 3;

  const loadScenarios = useCallback(() => {
    const storage = getStoredScenarios();
    setScenarios(storage.scenarios);

    // Find the scenario that matches the current tokenID
    const currentScenario = storage.scenarios.find(
      (s) => s.parameters.tokenID === currentTokenID,
    );

    if (currentScenario) {
      setCurrentScenarioId(currentScenario.localId);
      onScenarioChange(currentScenario);
    } else {
      setCurrentScenarioId("");
      onScenarioChange(null);
    }
  }, [onScenarioChange, currentTokenID]);

  useEffect(() => {
    loadScenarios();
  }, [loadScenarios]);

  // Refresh scenarios when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      loadScenarios();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    window.addEventListener("scenariosUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scenariosUpdated", handleStorageChange);
    };
  }, [loadScenarios]);

  const totalPages = Math.ceil(scenarios.length / scenariosPerPage);
  const startIndex = currentPage * scenariosPerPage;
  const endIndex = startIndex + scenariosPerPage;
  const currentScenarios = scenarios.slice(startIndex, endIndex);

  const handleScenarioSelect = (scenario: StoredScenario) => {
    // Navigate to the scenario's dashboard
    router.push(`/dashboard/${scenario.parameters.tokenID}`);
  };

  const handleRemoveScenario = (localId: string) => {
    removeScenario(localId);
    const updatedStorage = getStoredScenarios();
    setScenarios(updatedStorage.scenarios);
    setCurrentScenarioId(updatedStorage.currentScenarioId);

    // If we removed the current scenario, notify parent
    if (currentScenarioId === localId) {
      const newCurrent = updatedStorage.scenarios.find(
        (s) => s.localId === updatedStorage.currentScenarioId,
      );
      onScenarioChange(newCurrent || null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (scenarios.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Scenariusze Symulacji</h2>
          <Button onClick={onCreateNew} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Utwórz Scenariusz
          </Button>
        </div>
        <div className="text-muted-foreground py-8 text-center">
          <p>Brak zapisanych scenariuszy</p>
          <p className="text-sm">Utwórz pierwszy scenariusz, aby rozpocząć</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Scenariusze Symulacji</h2>
          <p className="text-muted-foreground text-sm">
            {scenarios.length} scenariusz{scenarios.length !== 1 ? "y" : ""}
          </p>
        </div>
        <Button onClick={onCreateNew} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nowy Scenariusz
        </Button>
      </div>

      {/* Scenario Cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {currentScenarios.map((scenario) => (
          <div
            key={scenario.localId}
            className={`relative flex cursor-pointer flex-col gap-3 rounded-lg border-2 p-4 transition-all ${
              currentScenarioId === scenario.localId
                ? "border-primary bg-primary/5 shadow-md"
                : "border-muted hover:border-primary/50 hover:bg-muted/50"
            }`}
            onClick={() => handleScenarioSelect(scenario)}
          >
            <div className="flex items-center justify-between">
              <div className="bg-primary/10 rounded-full p-2">
                <Calendar className="text-primary h-4 w-4" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-destructive/10 hover:text-destructive h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveScenario(scenario.localId);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="truncate text-sm font-medium">
                  {scenario.name}
                </h3>
                {currentScenarioId === scenario.localId && (
                  <Badge variant="secondary" className="text-xs">
                    Aktywny
                  </Badge>
                )}
              </div>

              <div className="text-muted-foreground space-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <span>👤</span>
                  {scenario.parameters.age} lat
                </div>
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  {scenario.parameters.expectedPension.toLocaleString()} zł
                </div>
                <div className="flex items-center gap-1">
                  <span>💼</span>
                  {scenario.parameters.typeOfEmployment}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(scenario.createdAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Strona {currentPage + 1} z {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
