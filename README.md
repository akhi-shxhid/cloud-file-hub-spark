
# CloudHub - Secure File Management System

**Developed by: Shahid Afrid**

CloudHub is a modern, secure file management web application built as a final year computer science project. It provides users with a comprehensive platform to upload, organize, and manage their files in the cloud with enterprise-grade security and a beautiful user interface.

## 🚀 Features

### Core Functionality
- **Secure Authentication**: Google OAuth integration with session management
- **File Upload**: Drag-and-drop interface with progress tracking
- **File Management**: View, download, and delete uploaded files
- **File Type Classification**: Automatic categorization (Documents, Images, Others)
- **Real-time Updates**: Live file status and progress indicators
- **Advanced Search**: Filter and search through uploaded files

### User Experience
- **Dark/Light Mode**: Automatic theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Modern transitions and micro-interactions
- **Glass Morphism UI**: Contemporary design with backdrop blur effects
- **Progressive Web App**: Fast loading and offline capabilities

### Security Features
- **Row Level Security (RLS)**: Database-level access control
- **File Type Validation**: Client and server-side validation
- **User Isolation**: Each user can only access their own files
- **Secure File Storage**: Files stored with unique paths and permissions
- **Session Management**: Automatic session handling and cleanup

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Vite** - Next-generation frontend build tool
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful and consistent icons
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data synchronization

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - Secure file storage with CDN
- **Row Level Security** - Database-level security policies

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **TypeScript Compiler** - Static type checking

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (shadcn/ui)
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── FileUpload.tsx   # File upload functionality
│   ├── FileList.tsx     # File listing and management
│   ├── LoginPage.tsx    # Authentication interface
│   ├── ThemeProvider.tsx # Theme management
│   └── ThemeToggle.tsx  # Dark/light mode toggle
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication logic
│   └── use-toast.ts     # Toast notifications
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
├── pages/               # Page components
└── App.tsx             # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd cloudhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the SQL migrations provided in the `supabase/migrations` folder
   - Configure Google OAuth in Supabase Auth settings

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Supabase Setup
1. **Create Tables**: Run the migration files to set up the database schema
2. **Storage Bucket**: Configure the `user-files` bucket with appropriate policies
3. **Authentication**: Enable Google OAuth provider
4. **Row Level Security**: Ensure RLS policies are active for data protection

### Environment Variables
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## 📊 Database Schema

### Tables

#### `profiles`
- User profile information
- Links to Supabase Auth users
- Stores additional user metadata

#### `uploaded_files`
- File metadata and references
- User ownership tracking
- Upload timestamps and file information

### Storage Buckets

#### `user-files`
- Secure file storage
- User-specific folder structure
- File type and size restrictions

## 🔐 Security Implementation

### Authentication
- **Google OAuth 2.0**: Secure third-party authentication
- **JWT Tokens**: Stateless session management
- **Automatic Session Refresh**: Seamless user experience

### Data Protection
- **Row Level Security**: Database-level access control
- **User Isolation**: Complete data separation between users
- **Secure File URLs**: Time-limited and authenticated file access
- **Input Validation**: Client and server-side validation

### File Security
- **Type Validation**: Restricted file types for security
- **Size Limits**: 50MB maximum file size
- **Virus Scanning**: Integration ready for malware detection
- **Access Control**: User-specific file permissions

## 🎨 Design System

### Color Palette
- **Primary**: Blue to Purple gradient
- **Secondary**: Neutral grays with high contrast
- **Accent**: Pink highlights for interactive elements
- **Status**: Green (success), Red (error), Yellow (warning)

### Typography
- **Headings**: Bold, gradient text for emphasis
- **Body**: Clear, readable fonts with proper hierarchy
- **Code**: Monospace fonts for technical content

### Components
- **Glass Morphism**: Backdrop blur with transparency
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach
- **Accessibility**: ARIA labels and keyboard navigation

## 🧪 Testing

### Test Categories
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and database interactions
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: WCAG compliance validation

### Running Tests
```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Coverage reports
```

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for reduced bundle size
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Service worker for offline functionality
- **Lazy Loading**: Components loaded on demand

### Backend Optimizations
- **Database Indexing**: Optimized queries for fast retrieval
- **CDN Integration**: Global file delivery network
- **Compression**: Gzip compression for reduced transfer size
- **Caching Headers**: Browser and proxy caching

## 🚀 Deployment

### Production Deployment
1. **Build the application**: `npm run build`
2. **Deploy to hosting platform** (Vercel, Netlify, etc.)
3. **Configure environment variables** on the hosting platform
4. **Set up custom domain** (optional)
5. **Configure SSL certificate** for secure connections

### Recommended Hosting Platforms
- **Vercel**: Optimized for React and Next.js applications
- **Netlify**: Easy deployment with Git integration
- **AWS Amplify**: Scalable cloud hosting
- **Railway**: Simple deployment with database integration

## 🔄 Future Enhancements

### Planned Features
- **File Sharing**: Share files with other users
- **Collaboration**: Real-time collaborative editing
- **Version Control**: File versioning and history
- **Advanced Search**: AI-powered content search
- **Mobile App**: Native iOS and Android applications
- **API Integration**: Third-party service connections

### Scalability Improvements
- **Microservices**: Break down into smaller services
- **Load Balancing**: Handle increased traffic
- **Database Sharding**: Horizontal scaling
- **CDN Optimization**: Global content delivery

## 🤝 Contributing

This project was developed as a final year computer science project by Shahid Afrid. While it's primarily an academic project, contributions and suggestions are welcome for learning purposes.

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain consistent code formatting
3. Write comprehensive tests
4. Update documentation for new features
5. Follow security best practices

## 📝 License

This project is developed for educational purposes as part of a final year computer science project. All rights reserved by Shahid Afrid.

## 📞 Contact

**Developer**: Shahid Afrid  
**Project Type**: Final Year Computer Science Project  
**Institution**: [Your University Name]  
**Year**: [Academic Year]

---

## 🎓 Academic Context

This project demonstrates the practical application of modern web development technologies in building a secure, scalable file management system. It showcases:

- **Full-Stack Development**: Frontend and backend integration
- **Database Design**: Relational database modeling and optimization
- **Security Implementation**: Authentication, authorization, and data protection
- **User Experience Design**: Intuitive interface and responsive design
- **Cloud Technologies**: Modern cloud-native architecture
- **Software Engineering**: Best practices in code organization and documentation

The project serves as a comprehensive example of contemporary web application development, suitable for academic evaluation and real-world deployment.
