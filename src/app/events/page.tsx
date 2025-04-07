import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Filter, MapPin, Search, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { colleges, events, featuredEvents, testimonials } from "@/utils/constants/events"


export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <Calendar className="h-6 w-6 text-[#1E90FF] transition-transform duration-300 group-hover:rotate-12" />
                <span className="font-bold text-xl">Zynvo</span>
              </Link>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8 w-64 h-9 focus-visible:ring-[#1E90FF] transition-all duration-300 focus:w-72"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-16 bg-gradient-to-r from-[#1E90FF]/10 to-[#1E90FF]/5 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
            Discover College Events Across India
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
            Find workshops, fests, hackathons, and more!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-delay">
            <Button className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white px-8 py-6 h-auto text-lg transition-transform duration-300 hover:scale-105">
              Browse Events
            </Button>
            <Button
              variant="outline"
              className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF] hover:text-white px-8 py-6 h-auto text-lg transition-all duration-300 hover:scale-105"
            >
              Add Your Event
            </Button>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#1E90FF]/10 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-[#1E90FF]/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-40 w-16 h-16 bg-[#1E90FF]/10 rounded-full animate-float-delay"></div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 animate-fade-in">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <Card
                key={event.id}
                className="overflow-hidden border-[#1E90FF]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-[#1E90FF] text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                    Featured
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {event.date}
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.location}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white transition-all duration-300 hover:shadow-md">
                    Register Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-all duration-300"
                  >
                    Check Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F8F9FA] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 animate-fade-in">How Zynvo Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div
              className="flex flex-col items-center transform transition-all duration-500 hover:translate-y-[-10px] animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              <div className="bg-[#1E90FF] text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md transition-transform duration-300 hover:scale-110">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
              <p className="text-gray-600">
                Browse through thousands of college events happening across India. Filter by location, date, or event
                type.
              </p>
            </div>
            <div
              className="flex flex-col items-center transform transition-all duration-500 hover:translate-y-[-10px] animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="bg-[#1E90FF] text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md transition-transform duration-300 hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h.01" />
                  <path d="M17 7h.01" />
                  <path d="M7 17h.01" />
                  <path d="M17 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Register & Attend</h3>
              <p className="text-gray-600">
                Easily register for events with a single click. Get all the details you need to attend and participate.
              </p>
            </div>
            <div
              className="flex flex-col items-center transform transition-all duration-500 hover:translate-y-[-10px] animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="bg-[#1E90FF] text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md transition-transform duration-300 hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create & Share</h3>
              <p className="text-gray-600">
                Organize your own events and share them with the community. Reach thousands of students across India.
              </p>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1E90FF]/5 rounded-full"></div>
        <div className="absolute top-20 -right-20 w-60 h-60 bg-[#1E90FF]/5 rounded-full"></div>
      </section>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 bg-white p-4 rounded-lg shadow-sm border animate-slide-in-left">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#1E90FF] h-8 px-2 transition-colors duration-300 hover:bg-[#1E90FF]/10"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto">
              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <Select>
                  <SelectTrigger className="w-full transition-colors duration-300 focus:border-[#1E90FF]">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="w-full z-10 bg-black text-white">
                    <SelectItem  className="z-10 bg-black " value="all">All States</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">College</h3>
                <Input
                  placeholder="Search college name"
                  className="w-full transition-all duration-300 focus:border-[#1E90FF]"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Event Type</h3>
                <div className="space-y-2">
                  {["Tech", "Cultural", "Sports", "Workshops", "Hackathons"].map((type) => (
                    <div key={type} className="flex items-center space-x-2 group">
                      <Checkbox
                        id={`type-${type.toLowerCase()}`}
                        className="transition-colors duration-300 data-[state=checked]:bg-[#1E90FF] data-[state=checked]:border-[#1E90FF]"
                      />
                      <label
                        htmlFor={`type-${type.toLowerCase()}`}
                        className="text-sm group-hover:text-[#1E90FF] transition-colors duration-300"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Date Range</h3>
                <div className="space-y-2">
                  <Input
                    type="date"
                    placeholder="From"
                    className="w-full transition-all duration-300 focus:border-[#1E90FF]"
                  />
                  <Input
                    type="date"
                    placeholder="To"
                    className="w-full transition-all duration-300 focus:border-[#1E90FF]"
                  />
                </div>
              </div>

              <Button className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white transition-all duration-300 hover:shadow-md">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 animate-slide-in-right">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search events by keyword..."
                  className="pl-10 w-full transition-all duration-300 focus:border-[#1E90FF]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select defaultValue="latest">
                  <SelectTrigger className="w-[140px] transition-colors duration-300 focus:border-[#1E90FF]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="nearby">Nearby</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <Card
                  key={event.id}
                  className="overflow-hidden border-[#1E90FF]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.date}
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-2">
                    <Button className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white transition-all duration-300 hover:shadow-md">
                      Register Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-all duration-300"
                    >
                      Check Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 transition-colors duration-300 hover:border-[#1E90FF] hover:text-[#1E90FF]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 transition-all duration-300 ${
                      page === 1 ? "bg-[#1E90FF] hover:bg-[#1E90FF]/90" : "hover:border-[#1E90FF] hover:text-[#1E90FF]"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 transition-colors duration-300 hover:border-[#1E90FF] hover:text-[#1E90FF]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 animate-fade-in">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#F8F9FA] p-6 rounded-lg border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1E90FF]/20 flex items-center justify-center mr-4 transition-transform duration-300 hover:scale-110">
                    <span className="text-[#1E90FF] font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.college}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">&quot;{testimonial.text}&quot;</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={i < testimonial.rating ? "#1E90FF" : "none"}
                      stroke="#1E90FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1 transition-transform duration-300 hover:scale-125"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-0 w-32 h-32 bg-[#1E90FF]/5 rounded-full"></div>
        <div className="absolute bottom-10 right-0 w-48 h-48 bg-[#1E90FF]/5 rounded-full"></div>
      </section>

      <section className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 animate-fade-in">Popular Colleges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {colleges.map((college, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-[#1E90FF]/10 flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-110">
                  <span className="text-[#1E90FF] font-bold text-xl">
                    {college.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")}
                  </span>
                </div>
                <h4 className="font-medium text-sm">{college.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{college.location}</p>
                <p className="text-xs font-medium text-[#1E90FF] mt-2">{college.eventCount} Events</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-4 group">
                <Calendar className="h-6 w-6 text-[#1E90FF] transition-transform duration-300 group-hover:rotate-12" />
                <span className="font-bold text-xl">Zynvo</span>
              </div>
              <p className="text-gray-600 text-sm">Discover and connect with college events across India.</p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-[#1E90FF] transition-colors duration-300 inline-flex items-center"
                  >
                    <span>About Us</span>
                    <ArrowRight className="ml-1 h-3 w-0 transition-all duration-300 group-hover:w-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-[#1E90FF] transition-colors duration-300 inline-flex items-center"
                  >
                    <span>Privacy Policy</span>
                    <ArrowRight className="ml-1 h-3 w-0 transition-all duration-300 group-hover:w-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-[#1E90FF] transition-colors duration-300 inline-flex items-center"
                  >
                    <span>Terms of Service</span>
                    <ArrowRight className="ml-1 h-3 w-0 transition-all duration-300 group-hover:w-3" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:text-[#1E90FF] transition-colors duration-300 inline-flex items-center"
                  >
                    <span>FAQ</span>
                    <ArrowRight className="ml-1 h-3 w-0 transition-all duration-300 group-hover:w-3" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-[#1E90FF] transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-[#1E90FF] transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-[#1E90FF] transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <h3 className="font-semibold mb-4">Stay Updated</h3>
              <div className="flex">
                <Input
                  placeholder="Your email"
                  className="rounded-r-none transition-all duration-300 focus:border-[#1E90FF]"
                />
                <Button className="rounded-l-none bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white transition-all duration-300 hover:shadow-md">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Stay updated on college events!</p>
            </div>
          </div>

          <div
            className="border-t mt-8 pt-6 text-center text-sm text-gray-500 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            <p>© {new Date().getFullYear()} Zynvo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
