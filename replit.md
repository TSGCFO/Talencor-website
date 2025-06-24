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

## User Preferences

Preferred communication style: Simple, everyday language.