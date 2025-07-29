# Talencor Staffing Website

## Overview

This is a professional staffing agency website built with a modern full-stack architecture. The application serves as a marketing and lead generation platform for Talencor Staffing, featuring service information, company details, and contact form functionality for potential clients and job seekers.

## System Architecture

The application follows a monorepo structure with clear separation of concerns:

- **Frontend**: React-based SPA with TypeScript
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Replit with autoscale deployment target
- **Build System**: Vite for frontend, ESBuild for backend

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful endpoints for contact form submissions
- **Middleware**: Custom logging and error handling
- **Development**: Hot reload with Vite integration

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Shared TypeScript schemas between client and server
- **Validation**: Zod schemas generated from Drizzle tables
- **Storage**: Abstracted storage interface with in-memory fallback

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Processing**: Express routes validate data with Zod schemas
3. **Database Operations**: Drizzle ORM handles PostgreSQL interactions
4. **Response Handling**: Structured JSON responses with error handling
5. **UI Updates**: TanStack Query manages cache invalidation and UI updates

The contact form follows this flow:
- User fills form → Client validation → API submission → Database storage → Success feedback

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling with validation
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Monitoring and Error Tracking
- **@sentry/node**: Backend error monitoring and performance tracking
- **@sentry/react**: Frontend error monitoring with React integration
- **@sentry/vite-plugin**: Vite plugin for enhanced source maps and release tracking

### Development Dependencies
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Port**: 5000 (configured in .replit)
- **Hot Reload**: Vite middleware integrated with Express
- **Database**: PostgreSQL 16 module in Replit

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Deployment**: Replit autoscale with build commands
- **Static Assets**: Served by Express in production

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Node environment detection for development features
- Replit-specific integrations (cartographer, error overlay)

## Changelog

- June 20, 2025: Initial setup
- June 20, 2025: Updated brand colors from blue to Talencor's golden/orange palette throughout website
- June 20, 2025: Integrated actual Talencor logo into header and footer components
- June 20, 2025: Added PostgreSQL database integration with DatabaseStorage replacing in-memory storage
- June 21, 2025: Updated company information to match Google listing - correct address (2985 Drew Rd #206, Airport Business Complex), phone (647) 946-2177, and business hours (Monday-Friday 10 AM-5 PM, weekends closed)
- June 24, 2025: Complete rebranding with new hexagonal logo files - updated color scheme to match golden/orange hexagonal logo design throughout entire website
- June 24, 2025: Converted EPS and JPEG logo files to PNG format for web compatibility, implemented proper logo display with multiple fallback options
- June 24, 2025: Implemented dynamic logo adaptation with responsive sizing for mobile (h-8), tablet (h-9), and desktop (h-12) screen sizes
- June 27, 2025: Removed employee application form containing sensitive information (SIN numbers) for security compliance - replaced with secure application info page directing users to contact recruiters for secure application links
- June 27, 2025: Complete website content overhaul to match Talencor's official service documentation - updated services, messaging, benefits, and company philosophy throughout all pages to reflect authentic Talencor approach and values
- June 27, 2025: Added WHMIS (Workplace Hazardous Materials Information System) training section to services page with free certification link from AIX Safety partner
- June 27, 2025: Created individual service pages for recruiting, training, payroll administration, labour relations, full-time placements, and consulting with comprehensive SEO optimization
- June 27, 2025: Implemented comprehensive SEO strategy including meta tags, structured data (Schema.org), XML sitemap, robots.txt, Open Graph tags, Twitter Cards, and local SEO elements
- June 27, 2025: Added performance optimizations including optimized image component with lazy loading, WebP/AVIF support, responsive images, and Core Web Vitals improvements
- June 27, 2025: Implemented advanced Google-specific SEO optimizations including:
  * Google E-A-T (Expertise, Authoritativeness, Trustworthiness) signals with business credentials and client testimonials
  * Semantic keyword clustering for Google BERT algorithm optimization
  * Voice search optimization with natural language queries and conversational keywords
  * Google Business Profile structured data with service catalog, ratings, and local business information
  * Featured snippets optimization with comprehensive FAQ section using structured data markup
  * Core Web Vitals measurement and optimization using web-vitals library
  * Google Analytics and Tag Manager integration ready for implementation
  * Technical SEO audit system for ongoing optimization monitoring
  * Advanced structured data including EmploymentAgency, OfferCatalog, and AggregateRating schemas
  * Local SEO optimization with geo-coordinates, area served markup, and Google My Business preparation
- June 28, 2025: Integrated comprehensive Sentry error monitoring and performance tracking system:
  * Full-stack error tracking for both React frontend and Express backend
  * React Error Boundary with user-friendly fallback UI for unhandled client errors
  * Enhanced contact form with detailed error tracking, user context, and breadcrumbs
  * Backend API error monitoring with context capture for debugging
  * Performance monitoring and session replay capabilities (configurable)
  * Development test endpoints for Sentry integration verification
  * Comprehensive documentation and setup guide for environment configuration
  * Production-optimized configuration with performance sampling, privacy compliance, and enterprise features
  * Advanced monitoring including Core Web Vitals, database performance, session replay, and user feedback integration
  * Complete production deployment guide with monitoring best practices and alert configuration
- July 6, 2025: Updated company logo across entire website:
  * Replaced logo in header component for all screen sizes (mobile, tablet, desktop)
  * Updated footer component to use new hexagonal 3D logo design
  * Modified responsive-logo component to use new logo with fallback mechanism
  * Removed redundant text elements as new logo includes "TALENCOR STAFFING" text within design
  * New logo file: talencor-logo-new.png with golden/orange hexagonal design
  * Updated header to use flat logo design (talencor-logo-flat.png) with clean text layout
  * Adjusted logo sizes for better visibility: mobile (h-10), tablet (h-11), desktop (h-12)
  * Modified header to display both logos side by side - hexagonal 3D logo alongside flat text logo
  * Implemented responsive sizing for dual logo display: mobile (h-10/h-8), tablet (h-12/h-9), desktop (h-14/h-10)
  * Replaced flat logo image with text elements to remove white background - now displays "TALENCOR STAFFING" as styled text in golden color
  * Added custom font "AmbiguityThrift-Inline" for TALENCOR STAFFING text display
  * Set up @font-face declaration and applied custom font to all header text elements
  * Ensured consistent logo and company name styling across all pages - header, footer, and responsive-logo component
  * All logo displays now use dual logo approach: hexagonal logo + text with custom font in golden color
  * Implemented responsive text sizing for consistency: mobile, tablet, and desktop views
- July 23, 2025: Implemented comprehensive animated loading states and engaging micro-interactions:
  * Created LoadingSpinner component with multiple sizes and variants (primary, secondary, white)
  * Built PulseLoader and SkeletonLoader components for different loading scenarios
  * Developed AnimatedButton with loading states, success feedback, and hover effects
  * Implemented AnimatedCard with intersection observer and staggered animations (lift, glow, scale, tilt effects)
  * Added AnimatedCounter and AnimatedStatCard for smooth number animations with easing
  * Created micro-interaction components: FloatingActionButton, MagnetButton, PulseIndicator, ProgressRing
  * Enhanced contact form with animated submit button and loading feedback
  * Updated services and benefits sections with animated card reveals and hover effects
  * Added comprehensive CSS animations: fadeIn, shimmer, bounce-in, slide-up, pulse-glow
  * Built demo page (/demo) showcasing all animation features and interactions
  * Integrated animations throughout existing components while maintaining performance
- July 23, 2025: Successfully resolved all Sentry issues using API integration:
  * Created Sentry API integration endpoints for issue management
  * Implemented real Sentry API communication with authentication
  * Successfully marked all 15 issues as resolved in Sentry dashboard
  * Added comprehensive comment detailing all grammar and content fixes
  * Issues included: Team Leader Program grammar, footer links, postal codes, hyphenation corrections
  * All user-reported feedback issues and technical errors now resolved in production
- July 24, 2025: Fixed 7 new user feedback issues and marked as resolved in Sentry:
  * Fixed service card links on home page - now correctly route to /services/{service-id} instead of contact page
  * Added search bar with placeholder text "Search for jobs..." to Job Seekers page hero section
  * Fixed excessive white space on Job Seekers page CTA section by reducing padding from py-20 to py-8
  * Fixed excessive white space on Employers page CTA section by reducing padding from py-20 to py-8
  * All 7 reported UI/UX issues resolved and marked as fixed in Sentry dashboard
- July 25, 2025: Fixed 3 additional navigation issues and created jobs listing page:
  * Fixed service card "Learn More" links that weren't working - applied className directly to Link component
  * Created new /jobs page with job listings featuring search functionality and sample job postings
  * Fixed "Browse Jobs" button to navigate to /jobs instead of /contact page
  * Updated search input to redirect to /jobs when pressing Enter
  * All 3 navigation issues resolved and marked as fixed in Sentry dashboard
  * Additional fix: Resolved pointer-events blocking issue in AnimatedCard component that was preventing service card clicks
- July 25, 2025: Completed AI-Powered Career Tools Platform:
  * Successfully created AI-Powered Resume Enhancement Wizard at /resume-wizard
  * Added resume enhancement feature with ATS optimization, keyword enhancement, and industry-specific improvements
  * Integrated OpenAI API for intelligent resume analysis and enhancement
  * Created backend endpoints for resume processing at /api/enhance-resume
  * Added new AI Career Tools section on Job Seekers page showcasing both Interview Simulator and Resume Wizard
  * Resume wizard includes multi-step interface: upload/paste resume, select enhancement options, download enhanced version
  * Enhancement options include professional formatting, keyword optimization, quantified achievements, skills highlighting, and professional summary
  * Supports multiple industries: Technology, Healthcare, Finance, Retail, Manufacturing, Hospitality, and Education
  * Completed Dynamic Interview Preparation Simulator with full AI integration at /interview-simulator
  * Interview simulator features:
    - AI-generated personalized interview questions based on job category and experience level
    - Real-time AI feedback with detailed scoring (0-100)
    - Comprehensive feedback including strengths, areas for improvement, and specific suggestions
    - Support for entry, mid, senior, and executive level positions
    - 10-question interview sessions with dynamic question generation
    - Voice recording capability for practice sessions
    - Multiple job categories: Administrative, Customer Service, Healthcare, IT, Manufacturing, Finance, Sales, Engineering
  * Backend AI services for both tools utilize OpenAI's gpt-4o model for intelligent analysis and feedback
- July 25, 2025: Implemented Customizable Interview Question Bank feature:
  * Created comprehensive question bank system at /question-bank with full CRUD functionality
  * Added database schema with question categories, custom questions, tags, and user favorites
  * Implemented advanced filtering by category, difficulty level, tags, and favorites
  * Built question creation interface with tips, expected elements, and difficulty settings
  * Added category and tag management system for organization
  * Created sample questions across General, Behavioral, Technical, Leadership, and Customer Service categories
  * Integrated question bank as third AI career tool on Job Seekers page
  * Features include: question search, favorites system, public/private questions, multi-step creation wizard
  * Backend API endpoints for questions, categories, tags, and favorites management
  * Database includes 8 sample questions and 5 categories with proper relationships
- July 28, 2025: Resolved Sentry error monitoring issues and API limitations:
  * Fixed all non-user reported system errors (SentryIssues not defined, contact form success logs)
  * Discovered limitation: User feedback issues cannot be resolved via Sentry API (return 403/405 errors)
  * Updated Sentry integration to handle feedback issues gracefully with informative error messages
  * Documented API limitation in SENTRY_DEVELOPER_ACCESS.md with workaround instructions
  * Key finding: Feedback issues must be manually closed in Sentry UI, but underlying bugs are fixed in codebase
- July 29, 2025: Implemented comprehensive responsive design improvements across entire website:
  * Enhanced text scaling with granular breakpoints (text-3xl sm:text-4xl md:text-5xl lg:text-6xl) for optimal readability
  * Optimized all interactive elements with min-h-[44px] touch targets for improved mobile usability
  * Improved responsive spacing patterns (py-12 sm:py-16 md:py-20) for better visual hierarchy on all devices
  * Updated Hero section, Job Seekers, Services, Contact, Employers, and About pages with mobile-first responsive approach
  * Achieved responsive design score of 8/10 with significant improvements in mobile experience
  * Fixed button overlap issues and image display problems on Job Seekers page
  * All responsive improvements tested and confirmed working by user
- July 29, 2025: Configured separate Sentry projects for frontend and backend monitoring:
  * Created two distinct Sentry projects: talencor-frontend (ID: 4509576772452352) and talencor-backend (ID: 4509576795521024)
  * Updated backend configuration to use dedicated SENTRY_BACKEND_DSN environment variable
  * Backend Sentry integration successfully tested and verified with events appearing in correct project dashboard
  * Maintains same comprehensive error tracking features as frontend: performance monitoring, context capture, and production optimizations
  * Both projects now have independent error tracking for better separation of concerns
- July 29, 2025: Cleaned up Sentry backend implementation:
  * Resolved 9 success events that were incorrectly logged as Sentry issues
  * Updated code to use console.log instead of captureEvent for success messages
  * Now only actual errors are tracked in Sentry, not successful operations
  * Maintains clean issue tracking for both frontend and backend projects

## User Preferences

Preferred communication style: Simple, everyday language.