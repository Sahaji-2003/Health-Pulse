export interface NetworkContact {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  status: 'connected' | 'connection-error' | 'pending';
  message?: string;
  isFollowing: boolean;
}

export type StatusFilter = 'all' | 'followed' | 'connected' | 'pending';

export interface MyNetworkSectionProps {
  /** Optional custom title */
  title?: string;
  /** Optional contacts list */
  contacts?: NetworkContact[];
  /** Handler for following/unfollowing a contact */
  onFollowToggle?: (contactId: string) => void;
  /** Handler for search query change */
  onSearchChange?: (query: string) => void;
  /** Handler for status filter change */
  onStatusFilterChange?: (status: StatusFilter) => void;
  /** Optional content to render */
  children?: React.ReactNode;
}
