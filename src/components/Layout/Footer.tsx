import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Briefcase className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">IndustryJobs</span>
            </div>
            <p className="text-sm">
              Connecting skilled workers with industrial opportunities across manufacturing, mechanical, electrical, and more.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-white transition">Create Profile</a></li>
              <li><a href="#" className="hover:text-white transition">Upload Resume</a></li>
              <li><a href="#" className="hover:text-white transition">Career Resources</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Post a Job</a></li>
              <li><a href="#" className="hover:text-white transition">Search Candidates</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Employer Resources</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2024 IndustryJobs. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
