# Öz Mevsim - Modular Architecture Implementation

## Overview

This document outlines the complete modular architecture migration for the Öz Mevsim website, transforming it from a monolithic structure to a scalable, maintainable, and enterprise-ready modular system.

## Architecture Structure

### 📁 Directory Structure

```
src/
├── components/
│   ├── common/                 # Shared components
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── types.ts
│   │   │   ├── hooks/
│   │   │   │   └── useHeader.ts
│   │   │   ├── components/
│   │   │   │   ├── TopBar.tsx
│   │   │   │   ├── Logo.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── MobileMenuButton.tsx
│   │   │   │   └── MobileMenu.tsx
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   ├── Layout/
│   │   ├── Loader/
│   │   └── ErrorBoundary/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Card/
│   ├── features/               # Feature-specific components
│   │   ├── auth/
│   │   ├── admin/
│   │   └── public/
│   └── index.ts               # Main component exports
├── services/                   # Business logic services
│   ├── api/
│   │   └── client.ts          # HTTP client with interceptors
│   ├── auth/
│   │   └── authService.ts     # Authentication logic
│   ├── admin/
│   └── public/
├── hooks/                      # Custom React hooks
│   ├── useToast.ts
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── useDebounce.ts
├── context/                    # React context providers
├── utils/                      # Utility functions
│   ├── constants.ts
│   └── helpers.ts
└── config/                     # Configuration files
    ├── app.config.ts
    ├── routes.config.ts
    └── api.config.ts
```

## 🛠️ Core Components

### 1. Configuration System

#### `src/config/app.config.ts`
- Application settings and constants
- API configuration
- Authentication settings
- Upload limits and file types
- SEO defaults
- Social media links
- Contact information
- Feature flags

#### `src/config/routes.config.ts`
- Centralized route definitions
- Public, admin, legal, and API routes
- Type-safe route access

#### `src/config/api.config.ts`
- API endpoint definitions
- HTTP status codes
- Request methods

### 2. Service Layer

#### API Client (`src/services/api/client.ts`)
```typescript
// Features:
- Axios-based HTTP client
- Request/response interceptors
- Automatic token management
- Token refresh on 401 errors
- Error handling and transformation
- Support for all HTTP methods
- File upload capabilities
```

#### Authentication Service (`src/services/auth/authService.ts`)
```typescript
// Features:
- Admin user login/logout
- Token verification and refresh
- Cookie-based session management
- Permission and role checking
- Authentication state initialization
```

### 3. Custom Hooks

#### `useToast` - Toast Notification System
```typescript
const { showToast } = useToast();

showToast.success('İşlem başarılı!');
showToast.error('Bir hata oluştu!');
showToast.loading('Yükleniyor...');
```

#### `useAuth` - Authentication Management
```typescript
const { 
  isAuthenticated, 
  user, 
  login, 
  logout, 
  checkPermission 
} = useAuth();
```

#### `useApi` - API Call Management
```typescript
const { 
  data, 
  loading, 
  error, 
  execute,
  mutate 
} = useApi('/api/products');
```

#### `useDebounce` - Value Debouncing
```typescript
const debouncedValue = useDebounce(searchTerm, 300);
const debouncedCallback = useDebounceCallback(handleSearch, 500);
```

### 4. UI Component Library

#### Button Component
```typescript
<Button 
  variant="primary" 
  size="md" 
  loading={isLoading}
  leftIcon={<IconSave />}
  onClick={handleSave}
>
  Kaydet
</Button>
```

#### Input Component
```typescript
<Input
  label="E-posta"
  type="email"
  error={errors.email}
  leftIcon={<IconMail />}
  placeholder="ornek@email.com"
/>
```

#### Modal Component
```typescript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Ürün Detayları"
  size="lg"
>
  <ModalContent />
</Modal>
```

#### Card Component
```typescript
<Card variant="elevated" hover>
  <Card.Header>
    <Card.Title>Başlık</Card.Title>
    <Card.Description>Açıklama</Card.Description>
  </Card.Header>
  <Card.Body>
    İçerik
  </Card.Body>
  <Card.Footer>
    <Button>İşlem</Button>
  </Card.Footer>
</Card>
```

### 5. Common Components

#### Header Component (Modularized)
- **Main Component**: `Header.tsx`
- **Custom Hook**: `useHeader.ts` - Manages state and scroll effects
- **Sub-components**:
  - `TopBar.tsx` - Contact information
  - `Logo.tsx` - Company branding
  - `Navigation.tsx` - Desktop navigation
  - `MobileMenuButton.tsx` - Mobile menu toggle
  - `MobileMenu.tsx` - Mobile navigation overlay

#### Footer Component
- Company information
- Quick links navigation
- Legal links
- Social media integration
- Copyright information

#### Layout Component
```typescript
<Layout showHeader showFooter>
  <PageContent />
</Layout>
```

#### ErrorBoundary Component
- Graceful error handling
- Development error details
- User-friendly error messages
- Retry functionality

#### Loader Component
```typescript
<Loader 
  variant="spinner" 
  size="lg" 
  text="Yükleniyor..." 
/>
```

## 🔧 Utility System

### Constants (`src/utils/constants.ts`)
- Storage keys
- Cookie names
- Date formats
- Error/success messages
- Animation durations
- Responsive breakpoints
- Z-index layers

### Helpers (`src/utils/helpers.ts`)
- `cn()` - Class name merging utility
- String manipulation functions
- Date formatting utilities
- Validation helpers
- File operation utilities
- Object manipulation functions

## 🎯 Key Features

### 1. Type Safety
- Full TypeScript implementation
- Comprehensive type definitions
- Interface-based component props
- Type-safe configuration system

### 2. Modular Design
- Component composition over inheritance
- Separation of concerns
- Reusable component library
- Feature-based organization

### 3. Performance Optimizations
- Lazy loading capabilities
- Optimized bundle sizes
- Tree-shaking friendly exports
- Minimal re-renders

### 4. Developer Experience
- Comprehensive TypeScript support
- Consistent naming conventions
- Well-documented interfaces
- Easy-to-use API design

### 5. Maintainability
- Clear separation of business logic
- Centralized configuration
- Consistent error handling
- Comprehensive logging

## 🚀 Usage Examples

### Using the Modular Components

```typescript
// Import from main index
import { 
  Button, 
  Input, 
  Modal, 
  Card, 
  Layout,
  useToast,
  useAuth 
} from '@/components';

// Use in your pages
export default function MyPage() {
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Card>
        <Card.Header>
          <Card.Title>Başlık</Card.Title>
        </Card.Header>
        <Card.Body>
          <Input label="İsim" />
          <Button onClick={() => showToast.success('Başarılı!')}>
            Gönder
          </Button>
        </Card.Body>
      </Card>
    </Layout>
  );
}
```

### API Service Usage

```typescript
import { apiClient } from '@/services/api/client';
import { authService } from '@/services/auth/authService';

// API calls
const products = await apiClient.get('/products');
const newProduct = await apiClient.post('/products', productData);

// Authentication
const loginResult = await authService.login(credentials);
const isValid = await authService.verifyToken();
```

## 🔒 Security Features

- Token-based authentication
- Automatic token refresh
- Secure cookie handling
- Permission-based access control
- XSS protection
- CSRF protection

## 📊 Build & Performance

### Build Results
- ✅ TypeScript compilation successful
- ✅ No linting errors
- ✅ All 49 pages generated successfully
- ✅ Optimized bundle sizes
- ✅ Static generation working

### Bundle Analysis
- Main bundle: 82.5 kB shared
- Individual pages: 1-10 kB additional
- Optimized chunk splitting
- Tree-shaking enabled

## 🔄 Migration Benefits

### Before (Monolithic)
- Single large components
- Mixed concerns
- Difficult to maintain
- Limited reusability
- Tight coupling

### After (Modular)
- Small, focused components
- Clear separation of concerns
- Easy to maintain and test
- High reusability
- Loose coupling
- Type-safe architecture
- Scalable structure

## 📝 Development Guidelines

### 1. Component Creation
- Follow the established folder structure
- Include TypeScript interfaces
- Create index.ts for exports
- Add proper documentation

### 2. Service Implementation
- Use the API client for HTTP requests
- Implement proper error handling
- Follow the service pattern
- Include TypeScript types

### 3. Hook Development
- Follow React hooks rules
- Include proper dependencies
- Handle cleanup in useEffect
- Provide TypeScript types

### 4. Configuration Management
- Use centralized config files
- Include environment variables
- Provide default values
- Document configuration options

## 🎉 Conclusion

The modular architecture implementation provides:

- **Scalability**: Easy to add new features and components
- **Maintainability**: Clear structure and separation of concerns
- **Reusability**: Component library for consistent UI
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized bundles and lazy loading
- **Developer Experience**: Comprehensive tooling and documentation

The project is now ready for enterprise-level development with a solid foundation for future growth and maintenance.

---

**Last Updated**: December 2024  
**Architecture Version**: 2.0.0  
**Next.js Version**: 14.0.4  
**TypeScript**: ✅ Enabled  
**Build Status**: ✅ Successful 