export interface SidebarProps {
  /** Whether the sidebar is open (for mobile) */
  open?: boolean;
  /** Callback to close the sidebar (for mobile) */
  onClose?: () => void;
  /** Width of the sidebar */
  width?: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
