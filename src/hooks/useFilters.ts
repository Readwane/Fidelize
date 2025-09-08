// Hook personnalisé pour la gestion des filtres et de la recherche
import { useState, useCallback, useMemo } from 'react';
import { debounce } from '../utils/api';
import { LIMITS } from '../utils/constants';

interface UseFiltersOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  defaultFilters?: Record<string, any>;
  debounceMs?: number;
}

export function useFilters<T>({
  data,
  searchFields,
  defaultFilters = {},
  debounceMs = LIMITS.SEARCH_DEBOUNCE_MS,
}: UseFiltersOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>(defaultFilters);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce de la recherche
  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), debounceMs),
    [debounceMs]
  );

  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
    debouncedSetSearch(term);
  }, [debouncedSetSearch]);

  // Filtrage des données
  const filteredData = useMemo(() => {
    let result = [...data];

    // Appliquer la recherche textuelle
    if (debouncedSearchTerm.trim() && debouncedSearchTerm.length >= LIMITS.SEARCH_MIN_CHARS) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          if (typeof value === 'number') {
            return value.toString().includes(searchLower);
          }
          return false;
        })
      );
    }

    // Appliquer les filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        result = result.filter(item => {
          const itemValue = item[key as keyof T];
          
          // Gestion des filtres de plage (min/max)
          if (key.endsWith('Min') && typeof value === 'number') {
            const fieldName = key.replace('Min', '') as keyof T;
            const fieldValue = item[fieldName];
            return typeof fieldValue === 'number' && fieldValue >= value;
          }
          
          if (key.endsWith('Max') && typeof value === 'number') {
            const fieldName = key.replace('Max', '') as keyof T;
            const fieldValue = item[fieldName];
            return typeof fieldValue === 'number' && fieldValue <= value;
          }
          
          // Gestion des filtres de date
          if (key.endsWith('From') && value instanceof Date) {
            const fieldName = key.replace('From', '') as keyof T;
            const fieldValue = item[fieldName];
            return fieldValue instanceof Date && fieldValue >= value;
          }
          
          if (key.endsWith('To') && value instanceof Date) {
            const fieldName = key.replace('To', '') as keyof T;
            const fieldValue = item[fieldName];
            return fieldValue instanceof Date && fieldValue <= value;
          }
          
          // Filtre exact
          return itemValue === value;
        });
      }
    });

    return result;
  }, [data, debouncedSearchTerm, filters, searchFields]);

  // Gestion des filtres
  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, [defaultFilters]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  // Statistiques des filtres
  const filterStats = useMemo(() => {
    const totalItems = data.length;
    const filteredItems = filteredData.length;
    const isFiltered = debouncedSearchTerm.trim().length > 0 || 
                     Object.keys(filters).some(key => filters[key] !== defaultFilters[key]);

    return {
      totalItems,
      filteredItems,
      isFiltered,
      filterRatio: totalItems > 0 ? filteredItems / totalItems : 0,
    };
  }, [data.length, filteredData.length, debouncedSearchTerm, filters, defaultFilters]);

  // Obtenir les valeurs uniques pour un champ (utile pour les filtres select)
  const getUniqueValues = useCallback(<K extends keyof T>(field: K): T[K][] => {
    const values = data.map(item => item[field]).filter(Boolean);
    return Array.from(new Set(values));
  }, [data]);

  // Obtenir les options pour un filtre select
  const getFilterOptions = useCallback(<K extends keyof T>(
    field: K,
    labelFormatter?: (value: T[K]) => string
  ): { value: T[K]; label: string }[] => {
    const uniqueValues = getUniqueValues(field);
    return uniqueValues.map(value => ({
      value,
      label: labelFormatter ? labelFormatter(value) : String(value),
    }));
  }, [getUniqueValues]);

  // Obtenir la plage de valeurs pour un champ numérique
  const getValueRange = useCallback(<K extends keyof T>(field: K): { min: number; max: number } | null => {
    const values = data
      .map(item => item[field])
      .filter(value => typeof value === 'number') as number[];
    
    if (values.length === 0) return null;
    
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [data]);

  return {
    // État
    searchTerm,
    debouncedSearchTerm,
    filters,
    filteredData,
    filterStats,
    
    // Actions de recherche
    updateSearchTerm,
    
    // Actions de filtrage
    updateFilter,
    updateFilters,
    clearFilter,
    clearAllFilters,
    resetFilters,
    
    // Utilitaires
    getUniqueValues,
    getFilterOptions,
    getValueRange,
  };
};