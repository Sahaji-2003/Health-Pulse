// Organisms - Complex UI components composed of molecules and atoms
// Examples: navigation bars, forms, data tables, modals

// Sidebar
export { Sidebar } from './Sidebar';
export type { SidebarProps, NavItem } from './Sidebar';

// PageHeader
export { PageHeader } from './PageHeader';
export type { PageHeaderProps } from './PageHeader';

// ProfileSettings
export {
  AccountSection,
  DataImportSection,
  PrivacySection,
  MyNetworkSection,
} from './ProfileSettings';
export type {
  AccountSectionProps,
  ProfileFormData,
  DataImportSectionProps,
  HealthApp,
  DataField,
  ImportStatus,
  PrivacySectionProps,
  MyNetworkSectionProps,
  NetworkContact,
} from './ProfileSettings';

// Dashboard Components
export {
  ProfileCard,
  VitalsCard,
  FitnessActivityCard,
  RecommendationsCard,
  WeeklyChartCard,
  AwardsCard,
  ResourcesTabsCard,
  WidgetSelectorSidebar,
  CustomizeDashboardHeader,
  DraggableWidget,
} from './Dashboard';
export type {
  ProfileCardProps,
  VitalsCardProps,
  VitalReading,
  VitalRange,
  FitnessActivityCardProps,
  FitnessHistoryItem,
  RecommendationsCardProps,
  WeeklyChartCardProps,
  ChartDataPoint,
  AwardsCardProps,
  ResourcesTabsCardProps,
  ResourceItem,
  ResourceTab,
  WidgetSelectorSidebarProps,
  CustomizeDashboardHeaderProps,
  DraggableWidgetProps,
} from './Dashboard';

// Notification Panel
export { NotificationPanel } from './NotificationPanel';
export type {
  NotificationPanelProps,
  NotificationItem,
  NotificationCategory,
} from './NotificationPanel';

// Fitness Dashboard
export { FitnessDashboard } from './FitnessDashboard';
export type {
  FitnessDashboardProps,
  FitnessTab,
  DailyGoals,
} from './FitnessDashboard';

// Vitals Components
export {
  VitalsTabsFilter,
  HeartStatusCard,
  VitalsHistorySection,
  VitalsEntrySection,
  RemindersAlertsSection,
  VitalsDashboard,
} from './vitals';
export type {
  VitalsTabsFilterProps,
  VitalsTab,
  HeartStatusCardProps,
  VitalsHistorySectionProps,
  VitalsEntrySectionProps,
  VitalsFormData,
  RemindersAlertsSectionProps,
  VitalsDashboardProps,
} from './vitals';

// Healthcare Provider Components
export {
  ProviderCard,
  ProviderList,
  NoMatchesFound,
  ProviderDetailView,
  VideoSession,
  MessageConversation,
  HealthcareSystemsDashboard,
} from './healthcareProvider';
export type {
  Provider,
  ProviderCardProps,
  ProviderListProps,
  NoMatchesFoundProps,
  ProviderDetailViewProps,
  VideoSessionProps,
  Message,
  Conversation,
  MessageConversationProps,
  ViewState,
  HealthcareSystemsDashboardProps,
} from './healthcareProvider';

// Library - Educational Resources and Community Forum
export {
  ResourceCard,
  LibraryTabs,
  ArticlesSection,
  PersonalLibrarySection,
  CommunityForumSection,
  CreatePostForm,
  LibraryDashboard,
} from './library';
export type {
  ResourceCardProps,
  Resource,
  LibraryTabsProps,
  ArticlesSectionProps,
  PersonalLibrarySectionProps,
  CommunityForumSectionProps,
  ForumTopic,
  CreatePostFormProps,
  CreatePostFormData,
  LibraryDashboardProps,
  LibraryTabValue,
} from './library';
