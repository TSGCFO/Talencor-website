import { Helmet } from "react-helmet-async";
import { Search, MapPin, Briefcase, Clock, Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

// <JobListingsDataSnippet>
// This section creates sample job listings with industry information
// Think of it like a catalog of different jobs organized by industry type
const jobListings = [
  {
    id: 1,
    title: "Warehouse Associate",
    company: "Leading Distribution Center",
    location: "Mississauga, ON",
    type: "Full-time",
    salary: "$18-22/hour",
    posted: "2 days ago",
    description: "Join our team as a warehouse associate handling inventory and order fulfillment.",
    industry: "Manufacturing" // What type of industry this job belongs to
  },
  {
    id: 2,
    title: "Administrative Assistant",
    company: "Professional Services Firm",
    location: "Toronto, ON",
    type: "Full-time",
    salary: "$45,000-55,000/year",
    posted: "3 days ago",
    description: "Support our executive team with administrative tasks and office management.",
    industry: "Administrative"
  },
  {
    id: 3,
    title: "Customer Service Representative",
    company: "Tech Support Company",
    location: "Remote",
    type: "Full-time",
    salary: "$40,000-50,000/year",
    posted: "1 week ago",
    description: "Provide excellent customer support via phone and email for our clients.",
    industry: "Customer Service"
  },
  {
    id: 4,
    title: "Machine Operator",
    company: "Manufacturing Plant",
    location: "Brampton, ON",
    type: "Full-time",
    salary: "$20-25/hour",
    posted: "4 days ago",
    description: "Operate and maintain production machinery in a fast-paced environment.",
    industry: "Manufacturing"
  },
  {
    id: 5,
    title: "Accounting Clerk",
    company: "Financial Services",
    location: "Toronto, ON",
    type: "Contract",
    salary: "$22-28/hour",
    posted: "5 days ago",
    description: "Assist with bookkeeping, data entry, and financial record management.",
    industry: "Finance & Accounting"
  },
  {
    id: 6,
    title: "Forklift Operator",
    company: "Logistics Company",
    location: "Vaughan, ON",
    type: "Full-time",
    salary: "$19-23/hour",
    posted: "1 day ago",
    description: "Certified forklift operator needed for busy distribution center.",
    industry: "Manufacturing"
  },
  // Add IT jobs to show when Information Technology is selected
  {
    id: 7,
    title: "Software Developer",
    company: "Tech Innovations Inc",
    location: "Toronto, ON",
    type: "Full-time",
    salary: "$70,000-90,000/year",
    posted: "2 days ago",
    description: "Develop web applications using modern frameworks and technologies.",
    industry: "Information Technology"
  },
  {
    id: 8,
    title: "IT Support Specialist",
    company: "Corporate Solutions Ltd",
    location: "Mississauga, ON",
    type: "Full-time",
    salary: "$50,000-65,000/year",
    posted: "3 days ago",
    description: "Provide technical support and maintain IT infrastructure.",
    industry: "Information Technology"
  },
  {
    id: 9,
    title: "Data Analyst",
    company: "Analytics Corp",
    location: "Remote",
    type: "Contract",
    salary: "$35-45/hour",
    posted: "1 week ago",
    description: "Analyze business data and create insightful reports for decision making.",
    industry: "Information Technology"
  }
];
// </JobListingsDataSnippet>

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [location] = useLocation();
  
  // <IndustryFilterSnippet>
  // This gets the industry from the URL (like getting a package label from the address)
  // If someone clicked "Information Technology" on Job Seekers page, this will extract that
  const industryParam = new URLSearchParams(location.split('?')[1] || '').get('industry');
  // </IndustryFilterSnippet>

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    // <IndustryMatchingSnippet>
    // Check if the job matches the selected industry (like checking if a book belongs on a specific shelf)
    const matchesIndustry = !industryParam || job.industry === industryParam;
    // </IndustryMatchingSnippet>
    return matchesSearch && matchesLocation && matchesIndustry;
  });

  return (
    <>
      <Helmet>
        <title>Job Listings | Talencor Staffing</title>
        <meta 
          name="description" 
          content="Browse current job openings and career opportunities through Talencor Staffing. Find your next position in various industries across Canada." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-montserrat mb-6 text-center">
            Current Job <span className="text-talencor-gold">Opportunities</span>
          </h1>
          <p className="text-xl text-gray-200 text-center max-w-3xl mx-auto mb-8">
            Explore our latest job openings and take the next step in your career journey
          </p>
          
          {/* <IndustryFilterDisplaySnippet> */}
          {/* Show which industry is currently selected (like a label showing which aisle you're in) */}
          {industryParam && (
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-talencor-gold/20 text-talencor-gold rounded-full">
                <Briefcase size={16} />
                Showing jobs in: <strong>{industryParam}</strong>
                <Link href="/jobs" className="ml-2 text-white hover:text-talencor-gold">
                  <span>✕</span>
                </Link>
              </span>
            </div>
          )}
          {/* </IndustryFilterDisplaySnippet> */}
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Search job title or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-charcoal"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10 bg-white text-charcoal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 bg-light-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-charcoal">
              Showing <span className="font-semibold">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
            </p>
            <Link href="/contact">
              <Button variant="outline" className="border-talencor-gold text-talencor-gold hover:bg-talencor-gold hover:text-white">
                Can't find what you're looking for? Contact us
              </Button>
            </Link>
          </div>

          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-charcoal mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                <Link href="/contact">
                  <Button className="bg-talencor-gold hover:bg-talencor-orange text-white">
                    Contact Our Recruiters
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="md:flex md:items-center md:justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold font-montserrat text-navy mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-charcoal mb-3">
                          <span className="flex items-center">
                            <Building size={16} className="mr-1" />
                            {job.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Briefcase size={16} className="mr-1" />
                            {job.type}
                          </span>
                          <span className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            {job.posted}
                          </span>
                        </div>
                        <p className="text-charcoal mb-3">{job.description}</p>
                        <p className="text-lg font-semibold text-talencor-gold">{job.salary}</p>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Link href="/apply">
                          <Button className="bg-talencor-gold hover:bg-talencor-orange text-white w-full md:w-auto">
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-corporate-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-montserrat mb-4">
            Don't See the Right Fit?
          </h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Submit your resume and our recruiters will match you with opportunities that align with your skills and goals
          </p>
          <Link href="/resume-wizard">
            <Button className="bg-talencor-gold hover:bg-talencor-orange text-white px-8 py-4 text-lg font-semibold">
              Submit Your Resume
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}