import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SentryErrorBoundary } from "./lib/sentry";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Services from "@/pages/services";
import RecruitingService from "@/pages/services/recruiting";
import TrainingService from "@/pages/services/training";
import PayrollAdministrationService from "@/pages/services/payroll-administration";
import LabourRelationsService from "@/pages/services/labour-relations";
import FullTimePlacementsService from "@/pages/services/full-time-placements";
import ConsultingService from "@/pages/services/consulting";
import JobSeekers from "@/pages/job-seekers";
import Employers from "@/pages/employers";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import ApplicationInfo from "@/pages/application-info";
import Demo from "@/pages/demo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/services/recruiting" component={RecruitingService} />
          <Route path="/services/training" component={TrainingService} />
          <Route path="/services/payroll-administration" component={PayrollAdministrationService} />
          <Route path="/services/labour-relations" component={LabourRelationsService} />
          <Route path="/services/full-time-placements" component={FullTimePlacementsService} />
          <Route path="/services/consulting" component={ConsultingService} />
          <Route path="/job-seekers" component={JobSeekers} />
          <Route path="/employers" component={Employers} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/apply" component={ApplicationInfo} />
          <Route path="/demo" component={Demo} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <SentryErrorBoundary 
            fallback={({ error, componentStack, resetError }) => (
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                  <h1 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h1>
                  <p className="text-gray-600 mb-4">
                    We're sorry, but something unexpected happened. Our team has been notified.
                  </p>
                  <button 
                    onClick={resetError}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Try again
                  </button>
                  {import.meta.env.DEV && (
                    <details className="mt-4">
                      <summary className="text-sm text-gray-500 cursor-pointer">Error details</summary>
                      <pre className="text-xs text-red-500 mt-2 overflow-auto">{error?.toString()}</pre>
                    </details>
                  )}
                </div>
              </div>
            )}
          >
            <Toaster />
            <Router />
          </SentryErrorBoundary>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
