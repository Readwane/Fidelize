// Hook personnalisé pour simplifier l'utilisation des services API
import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage, isApiError } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(errorMessage);
      throw error;
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

// Hook spécialisé pour les listes paginées
export function usePaginatedApi<T>(
  apiCall: (params: any) => Promise<{ content: T[]; totalElements: number; totalPages: number }>,
  initialParams: any = {}
) {
  const [params, setParams] = useState({ page: 0, size: 20, ...initialParams });
  const [allData, setAllData] = useState<T[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { data, loading, error, execute } = useApi(
    () => apiCall(params),
    {
      immediate: false,
      onSuccess: (result) => {
        setAllData(result.content);
        setTotalElements(result.totalElements);
        setTotalPages(result.totalPages);
      },
    }
  );

  const loadPage = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  const changePageSize = useCallback((size: number) => {
    setParams(prev => ({ ...prev, size, page: 0 }));
  }, []);

  const updateFilters = useCallback((filters: Record<string, any>) => {
    setParams(prev => ({ ...prev, ...filters, page: 0 }));
  }, []);

  const refresh = useCallback(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    execute();
  }, [execute, params]);

  return {
    data: allData,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage: params.page,
    pageSize: params.size,
    loadPage,
    changePageSize,
    updateFilters,
    refresh,
  };
}

// Hook pour les mutations (create, update, delete)
export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: string, variables: TVariables) => void;
    onSettled?: (data: TData | null, error: string | null, variables: TVariables) => void;
  } = {}
) {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
  }>({
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (variables: TVariables) => {
    setState({ loading: true, error: null });
    
    try {
      const result = await mutationFn(variables);
      setState({ loading: false, error: null });
      options.onSuccess?.(result, variables);
      options.onSettled?.(result, null, variables);
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState({ loading: false, error: errorMessage });
      options.onError?.(errorMessage, variables);
      options.onSettled?.(null, errorMessage, variables);
      throw error;
    }
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

// Hook pour la gestion du cache
export function useCachedApi<T>(
  key: string,
  apiCall: () => Promise<T>,
  options: UseApiOptions & { cacheTime?: number } = {}
) {
  const { cacheTime = 5 } = options; // 5 minutes par défaut
  
  const cachedApiCall = useCallback(async () => {
    // Vérifier le cache d'abord
    const cached = sessionStorage.getItem(key);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheTime * 60 * 1000) {
          return data;
        }
      } catch {
        // Ignorer les erreurs de parsing du cache
      }
    }

    // Appeler l'API si pas de cache valide
    const result = await apiCall();
    
    // Mettre en cache le résultat
    sessionStorage.setItem(key, JSON.stringify({
      data: result,
      timestamp: Date.now(),
    }));
    
    return result;
  }, [key, apiCall, cacheTime]);

  return useApi(cachedApiCall, options);
}

// Hook pour les requêtes en temps réel
export function useRealTimeApi<T>(
  endpoint: string,
  options: {
    onUpdate?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${endpoint}/stream`);
    
    eventSource.onopen = () => {
      setConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData(newData);
        options.onUpdate?.(newData);
      } catch (err) {
        const errorMessage = 'Erreur lors du parsing des données temps réel';
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      const errorMessage = 'Erreur de connexion temps réel';
      setError(errorMessage);
      options.onError?.(errorMessage);
    };

    return () => {
      eventSource.close();
      setConnected(false);
    };
  }, [endpoint, options]);

  return {
    data,
    connected,
    error,
  };
}