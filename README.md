
# CloudHub - Secure Cloud Storage Platform

A modern, full-stack cloud storage application built for secure file management and sharing. CloudHub provides users with an intuitive interface to upload, manage, preview, and share files with advanced security features.

## 🚀 Features

### Core Functionality
- **Secure File Upload**: Drag-and-drop file uploads with progress tracking
- **File Management**: Organize, search, and filter files by type
- **In-Browser Previews**: View PDFs, images, videos, and audio files directly in the browser
- **File Sharing**: Generate secure, time-limited shareable links with customizable permissions
- **Dark/Light Mode**: Full theme support with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Security Features
- **Google OAuth Authentication**: Secure sign-in with Google accounts
- **Row Level Security (RLS)**: Database-level security ensuring users can only access their own files
- **Encrypted Storage**: Files are securely stored with Supabase's encrypted storage
- **Permission-Based Sharing**: Control whether shared links allow viewing only or downloading
- **Expiring Links**: Set automatic expiration times for shared links

### User Experience
- **Glass Morphism UI**: Modern, translucent design with smooth animations
- **Real-time Progress**: Live upload progress with file size validation
- **Smart File Organization**: Automatic file type categorization and metadata extraction
- **Search & Filter**: Quickly find files with search and type-based filtering
- **Storage Analytics**: View total storage usage and file statistics

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe development for better code quality
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing for SPA navigation
- **Tanstack Query** - Server state management and caching
- **Date-fns** - Modern date utility library

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - Secure file storage with CDN
- **Row Level Security** - Database-level security policies

### UI Components
- **Shadcn/UI** - Re-usable component library built on Radix UI
- **Lucide React** - Beautiful SVG icon library
- **Sonner** - Toast notification system
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── Dashboard.tsx   # Main dashboard layout
│   ├── FileList.tsx    # File management interface
│   ├── FileUpload.tsx  # File upload component
│   ├── FilePreview.tsx # File preview component
│   ├── ShareDialog.tsx # File sharing interface
│   └── LoginPage.tsx   # Authentication page
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   └── use-toast.ts    # Toast notification hook
├── pages/              # Route components
│   ├── Index.tsx       # Landing page
│   ├── SharePage.tsx   # Public file sharing page
│   └── NotFound.tsx    # 404 error page
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── lib/                # Utility functions
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloudhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project
   - Enable Google OAuth in Authentication settings
   - Run the database migrations (see Database Schema section)
   - Update `src/integrations/supabase/client.ts` with your project credentials

4. **Start development server**
   ```bash
   npm run dev
   ```

### Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create uploaded_files table
CREATE TABLE public.uploaded_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create shared_links table for file sharing
CREATE TABLE public.shared_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.uploaded_files(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permissions TEXT NOT NULL CHECK (permissions IN ('view', 'download')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_links ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for user files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-files',
  'user-files',
  false,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);
```

## 🔐 Security Implementation

### Authentication
- Google OAuth integration for secure sign-in
- JWT token management with automatic refresh
- Session persistence across browser sessions

### Database Security
- Row Level Security (RLS) policies ensure data isolation
- Users can only access their own files and data
- Secure file sharing with permission controls

### File Storage Security
- Files stored in private Supabase storage buckets
- Signed URLs for secure file access
- Automatic cleanup of expired shared links

## 🎨 Design System

### Theme Support
- Light and dark mode with smooth transitions
- System preference detection
- Consistent color palette across all components

### Glass Morphism Design
- Translucent backgrounds with backdrop blur
- Gradient borders and subtle shadows
- Smooth animations and transitions

### Responsive Layout
- Mobile-first design approach
- Flexible grid systems
- Touch-friendly interface elements

## 📱 Responsive Design

CloudHub is fully responsive and optimized for:
- **Desktop**: Full feature set with multi-column layouts
- **Tablet**: Adapted layouts with touch-optimized controls
- **Mobile**: Streamlined interface with stack layouts

## 🔄 File Management Features

### Upload System
- Drag-and-drop file uploads
- Multiple file selection
- Real-time progress tracking
- File type validation
- Size limit enforcement (50MB)

### File Organization
- Automatic file type categorization
- Search functionality across file names
- Filter by file type (documents, images, other)
- Sort by upload date and size

### File Sharing
- Generate secure shareable links
- Set view-only or download permissions
- Configure link expiration times
- Track sharing analytics

## 🚀 Performance Optimizations

- **Lazy Loading**: Components and routes loaded on demand
- **Image Optimization**: Automatic image compression and format conversion
- **Caching**: Intelligent caching of file metadata and user data
- **Code Splitting**: Separate bundles for different app sections
- **Prefetching**: Predictive loading of user resources

## 🧪 Testing Strategy

### File Upload Testing
- Test various file types and sizes
- Validate progress tracking accuracy
- Error handling for failed uploads

### Sharing System Testing
- Verify link generation and access
- Test permission enforcement
- Validate expiration functionality

### Cross-Browser Compatibility
- Chrome, Firefox, Safari, Edge support
- Mobile browser optimization
- Progressive enhancement for older browsers

## 📈 Future Enhancements

- **Folder Organization**: Hierarchical file organization
- **Collaboration Features**: Multi-user file editing
- **Advanced Analytics**: Detailed usage statistics
- **API Access**: REST API for third-party integrations
- **Backup & Sync**: Automatic file backup and synchronization

## 🤝 Contributing

This project follows standard development practices:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Shahid Afrid**
- Final Year Computer Science Project
- Focus: Modern Web Development with React and TypeScript
- Emphasis: Security, Performance, and User Experience

---

*CloudHub represents the culmination of modern web development practices, combining cutting-edge frontend technologies with robust backend services to create a production-ready cloud storage platform.*
