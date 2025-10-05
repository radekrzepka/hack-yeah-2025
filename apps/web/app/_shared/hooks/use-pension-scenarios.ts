"use client";

import { useCallback, useEffect, useState } from "react";

export interface PensionScenario {
  id: string;
  age: number;
  contractType: "uop" | "b2b" | "zlecenie" | "dzielo";
  timestamp: number;
}

const STORAGE_KEY = "pension-scenarios";
const MAX_SCENARIOS = 10;

export function usePensionScenarios() {
  const [scenarios, setScenarios] = useState<PensionScenario[]>([]);

  // Ładowanie danych z localStorage przy inicjalizacji
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const scenarios = Array.isArray(parsed) ? parsed : [];

        // Sprawdź czy nie przekroczono limitu przy ładowaniu
        if (scenarios.length > MAX_SCENARIOS) {
          const sortedScenarios = scenarios.sort(
            (a, b) => b.timestamp - a.timestamp,
          );
          const limitedScenarios = sortedScenarios.slice(0, MAX_SCENARIOS);
          setScenarios(limitedScenarios);
          // Zapisz zaktualizowaną listę
          localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedScenarios));
        } else {
          setScenarios(scenarios);
        }
      }
    } catch (error) {
      console.error(
        "Error loading pension scenarios from localStorage:",
        error,
      );
      setScenarios([]);
    }
  }, []);

  // Zapisywanie danych do localStorage
  const saveToStorage = useCallback((newScenarios: PensionScenario[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newScenarios));
      setScenarios(newScenarios);
    } catch (error) {
      console.error("Error saving pension scenarios to localStorage:", error);
    }
  }, []);

  // Dodawanie nowego scenariusza
  const addScenario = useCallback(
    (scenario: Omit<PensionScenario, "timestamp">) => {
      const newScenario: PensionScenario = {
        ...scenario,
        timestamp: Date.now(),
      };

      // Dodaj nowy scenariusz na początku listy
      const updatedScenarios = [newScenario, ...scenarios];

      // Jeśli przekroczono limit, usuń najstarsze scenariusze
      if (updatedScenarios.length > MAX_SCENARIOS) {
        // Sortuj po timestamp (najstarsze na końcu) i usuń nadmiarowe
        const sortedScenarios = updatedScenarios.sort(
          (a, b) => b.timestamp - a.timestamp,
        );
        const limitedScenarios = sortedScenarios.slice(0, MAX_SCENARIOS);
        saveToStorage(limitedScenarios);
      } else {
        saveToStorage(updatedScenarios);
      }
    },
    [scenarios, saveToStorage],
  );

  // Usuwanie scenariusza
  const removeScenario = useCallback(
    (id: string) => {
      const updatedScenarios = scenarios.filter(
        (scenario) => scenario.id !== id,
      );
      saveToStorage(updatedScenarios);
    },
    [scenarios, saveToStorage],
  );

  // Czyszczenie wszystkich scenariuszy
  const clearScenarios = useCallback(() => {
    saveToStorage([]);
  }, [saveToStorage]);

  // Pobieranie scenariusza po ID
  const getScenario = useCallback(
    (id: string) => {
      return scenarios.find((scenario) => scenario.id === id);
    },
    [scenarios],
  );

  // Sprawdzanie czy limit został przekroczony
  const isLimitReached = scenarios.length >= MAX_SCENARIOS;

  // Automatyczne czyszczenie najstarszych scenariuszy
  const enforceLimit = useCallback(() => {
    if (scenarios.length > MAX_SCENARIOS) {
      const sortedScenarios = [...scenarios].sort(
        (a, b) => b.timestamp - a.timestamp,
      );
      const limitedScenarios = sortedScenarios.slice(0, MAX_SCENARIOS);
      saveToStorage(limitedScenarios);
    }
  }, [scenarios, saveToStorage]);

  return {
    scenarios,
    addScenario,
    removeScenario,
    clearScenarios,
    getScenario,
    isLimitReached,
    enforceLimit,
    maxScenarios: MAX_SCENARIOS,
  };
}
