import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/api/user.api';
import type { WidgetConfig } from '@/services/api/user.api';
import { useState, useCallback, useMemo } from 'react';

export const DASHBOARD_LAYOUT_QUERY_KEY = ['user', 'dashboard-layout'];

// Default widget configuration (matches backend defaults)
export const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'profile',
    type: 'profile',
    visible: true,
    position: { x: 0, y: 0 },
    size: { width: 4, height: 4 },
    category: 'profile'
  },
  {
    id: 'vitals',
    type: 'vitals',
    visible: true,
    position: { x: 4, y: 0 },
    size: { width: 8, height: 4 },
    category: 'vitals'
  },
  {
    id: 'fitness',
    type: 'fitness',
    visible: true,
    position: { x: 0, y: 4 },
    size: { width: 4, height: 6 },
    category: 'fitness'
  },
  {
    id: 'recommendations',
    type: 'recommendations',
    visible: true,
    position: { x: 4, y: 4 },
    size: { width: 4, height: 6 },
    category: 'recommendations'
  },
  {
    id: 'weekly-chart',
    type: 'weekly-chart',
    visible: true,
    position: { x: 8, y: 4 },
    size: { width: 4, height: 6 },
    category: 'fitness'
  },
  {
    id: 'awards',
    type: 'awards',
    visible: true,
    position: { x: 0, y: 10 },
    size: { width: 4, height: 6 },
    category: 'fitness'
  },
  {
    id: 'resources',
    type: 'resources',
    visible: true,
    position: { x: 4, y: 10 },
    size: { width: 8, height: 6 },
    category: 'social'
  }
];

// Widget metadata for display
export const WIDGET_METADATA: Record<string, { name: string; description: string; icon: string }> = {
  profile: {
    name: 'Profile Card',
    description: 'Your personal profile information',
    icon: 'person'
  },
  vitals: {
    name: 'Vitals',
    description: 'Blood pressure, heart rate, and weight',
    icon: 'favorite'
  },
  fitness: {
    name: 'Fitness Activity',
    description: 'Calories burned and activity history',
    icon: 'fitness_center'
  },
  recommendations: {
    name: 'Recommendations',
    description: 'Personalized health recommendations',
    icon: 'recommend'
  },
  'weekly-chart': {
    name: 'This Week',
    description: 'Weekly fitness activity chart',
    icon: 'bar_chart'
  },
  awards: {
    name: 'Awards',
    description: 'Your badges and achievements',
    icon: 'emoji_events'
  },
  resources: {
    name: 'Resources',
    description: 'Community and health resources',
    icon: 'library_books'
  }
};

export const useDashboardLayout = () => {
  const queryClient = useQueryClient();
  
  // Local state for editing (unsaved changes)
  const [editingWidgets, setEditingWidgets] = useState<WidgetConfig[] | null>(null);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);

  // Fetch dashboard layout
  const {
    data: layoutData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: DASHBOARD_LAYOUT_QUERY_KEY,
    queryFn: async () => {
      const response = await userApi.getDashboardLayout();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update layout mutation
  const updateLayoutMutation = useMutation({
    mutationFn: (widgets: WidgetConfig[]) => userApi.updateDashboardLayout(widgets),
    onSuccess: (response) => {
      queryClient.setQueryData(DASHBOARD_LAYOUT_QUERY_KEY, response.data);
      setEditingWidgets(null);
    },
  });

  // Reset layout mutation
  const resetLayoutMutation = useMutation({
    mutationFn: () => userApi.resetDashboardLayout(),
    onSuccess: (response) => {
      queryClient.setQueryData(DASHBOARD_LAYOUT_QUERY_KEY, response.data);
      setEditingWidgets(null);
    },
  });

  // Current widgets (editing state or saved state)
  const widgets = useMemo(() => {
    if (editingWidgets) return editingWidgets;
    return layoutData?.widgets || DEFAULT_WIDGETS;
  }, [editingWidgets, layoutData]);

  // Visible widgets only
  const visibleWidgets = useMemo(() => {
    return widgets.filter(w => w.visible);
  }, [widgets]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (!editingWidgets) return false;
    return JSON.stringify(editingWidgets) !== JSON.stringify(layoutData?.widgets || DEFAULT_WIDGETS);
  }, [editingWidgets, layoutData]);

  // Enter customize mode
  const enterCustomizeMode = useCallback(() => {
    setEditingWidgets(widgets);
    setIsCustomizeMode(true);
  }, [widgets]);

  // Exit customize mode (discard changes)
  const exitCustomizeMode = useCallback(() => {
    setEditingWidgets(null);
    setIsCustomizeMode(false);
  }, []);

  // Toggle widget visibility
  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setEditingWidgets((current) => {
      const widgetsList = current || widgets;
      return widgetsList.map((w) =>
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      );
    });
  }, [widgets]);

  // Update widget position
  const updateWidgetPosition = useCallback((widgetId: string, position: { x: number; y: number }) => {
    setEditingWidgets((current) => {
      const widgetsList = current || widgets;
      return widgetsList.map((w) =>
        w.id === widgetId ? { ...w, position } : w
      );
    });
  }, [widgets]);

  // Update widget size
  const updateWidgetSize = useCallback((widgetId: string, size: { width: number; height: number }) => {
    setEditingWidgets((current) => {
      const widgetsList = current || widgets;
      return widgetsList.map((w) =>
        w.id === widgetId ? { ...w, size } : w
      );
    });
  }, [widgets]);

  // Reorder widgets (for drag and drop)
  const reorderWidgets = useCallback((sourceIndex: number, destIndex: number) => {
    setEditingWidgets((current) => {
      const widgetsList = [...(current || widgets)];
      const [removed] = widgetsList.splice(sourceIndex, 1);
      widgetsList.splice(destIndex, 0, removed);
      return widgetsList;
    });
  }, [widgets]);

  // Save current layout
  const saveLayout = useCallback(async () => {
    if (editingWidgets) {
      await updateLayoutMutation.mutateAsync(editingWidgets);
      setIsCustomizeMode(false);
    }
  }, [editingWidgets, updateLayoutMutation]);

  // Reset to default
  const resetLayout = useCallback(async () => {
    await resetLayoutMutation.mutateAsync();
    setIsCustomizeMode(false);
  }, [resetLayoutMutation]);

  // Get time since last save
  const lastSavedText = useMemo(() => {
    if (!layoutData?.lastModified) return '';
    const lastModified = new Date(layoutData.lastModified);
    const now = new Date();
    const diffMs = now.getTime() - lastModified.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Saved just now';
    if (diffMins < 60) return `Saved ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Saved ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Saved ${diffDays}d ago`;
  }, [layoutData]);

  return {
    // Data
    widgets,
    visibleWidgets,
    layoutData,
    lastSavedText,
    
    // State
    isLoading,
    isError,
    error,
    isCustomizeMode,
    hasUnsavedChanges,
    isSaving: updateLayoutMutation.isPending,
    isResetting: resetLayoutMutation.isPending,
    saveError: updateLayoutMutation.error,
    resetError: resetLayoutMutation.error,
    
    // Actions
    refetch,
    enterCustomizeMode,
    exitCustomizeMode,
    toggleWidgetVisibility,
    updateWidgetPosition,
    updateWidgetSize,
    reorderWidgets,
    saveLayout,
    resetLayout,
  };
};

export default useDashboardLayout;
