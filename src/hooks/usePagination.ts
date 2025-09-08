// Hook personnalisé pour la gestion de la pagination
import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '../utils/constants';
import { calculatePagination } from '../utils/api';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
}

export function usePagination({
  initialPage = 0,
  initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  totalItems,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculs dérivés
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  const startIndex = useMemo(() => {
    return currentPage * pageSize;
  }, [currentPage, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize, totalItems);
  }, [startIndex, pageSize, totalItems]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages - 1;
  }, [currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return currentPage > 0;
  }, [currentPage]);

  // Calcul des pages visibles
  const paginationInfo = useMemo(() => {
    return calculatePagination(currentPage, totalPages);
  }, [currentPage, totalPages]);

  // Actions de navigation
  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages - 1);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  const changePageSize = useCallback((newPageSize: number) => {
    if (PAGINATION.PAGE_SIZE_OPTIONS.includes(newPageSize)) {
      setPageSize(newPageSize);
      // Ajuster la page courante pour rester dans les limites
      const newTotalPages = Math.ceil(totalItems / newPageSize);
      if (currentPage >= newTotalPages) {
        setCurrentPage(Math.max(0, newTotalPages - 1));
      }
    }
  }, [totalItems, currentPage]);

  // Fonction pour paginer un tableau
  const paginateArray = useCallback(<T>(array: T[]): T[] => {
    return array.slice(startIndex, endIndex);
  }, [startIndex, endIndex]);

  // Informations de pagination pour l'affichage
  const paginationText = useMemo(() => {
    if (totalItems === 0) {
      return 'Aucun élément';
    }
    
    const start = startIndex + 1;
    const end = endIndex;
    
    return `${start}-${end} sur ${totalItems}`;
  }, [startIndex, endIndex, totalItems]);

  // Reset de la pagination
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  return {
    // État actuel
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    
    // Informations de navigation
    hasNextPage,
    hasPreviousPage,
    paginationInfo,
    paginationText,
    
    // Actions de navigation
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
    
    // Utilitaires
    paginateArray,
    reset,
  };
}

// Hook spécialisé pour la pagination côté client
export function useClientPagination<T>(data: T[], initialPageSize?: number) {
  const pagination = usePagination({
    totalItems: data.length,
    initialPageSize,
  });

  const paginatedData = useMemo(() => {
    return pagination.paginateArray(data);
  }, [data, pagination]);

  return {
    ...pagination,
    data: paginatedData,
  };
}

// Hook spécialisé pour la pagination côté serveur
export function useServerPagination(
  fetchFunction: (page: number, size: number) => Promise<{ data: any[]; total: number }>,
  initialPageSize?: number
) {
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pagination = usePagination({
    totalItems,
    initialPageSize,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(pagination.currentPage, pagination.pageSize);
      setData(result.data);
      setTotalItems(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pagination.currentPage, pagination.pageSize]);

  // Recharger les données quand la page ou la taille change
  const goToPage = useCallback((page: number) => {
    pagination.goToPage(page);
    fetchData();
  }, [pagination, fetchData]);

  const changePageSize = useCallback((newPageSize: number) => {
    pagination.changePageSize(newPageSize);
    fetchData();
  }, [pagination, fetchData]);

  return {
    ...pagination,
    data,
    loading,
    error,
    goToPage,
    changePageSize,
    refresh: fetchData,
  };
}