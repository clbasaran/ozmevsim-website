export interface MenuItemType {
  label: string;
  href: string;
  submenu?: Array<{
    label: string;
    href: string;
    description?: string;
    icon?: string;
  }>;
}

export interface HeaderProps {
  className?: string;
}

export interface TopBarProps {
  isScrolled: boolean;
}

export interface LogoProps {
  isScrolled: boolean;
  className?: string;
}

export interface NavigationProps {
  menuItems: MenuItemType[];
  isScrolled: boolean;
  activeSubmenu: string | null;
  setActiveSubmenu: (submenu: string | null) => void;
}

export interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  menuItems: MenuItemType[];
}

export interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isScrolled: boolean;
} 