// ./app/layout.tsx

// Import global CSS styles and necessary components
import "./globals.css"; // Imports global CSS file for styling
import { Toaster } from "@/components/ui/sonner"; // Imports a custom Toaster component for notifications
import SiteHeader from "@/components/Site/Header"; // Imports the header component for the site
import { Metadata } from "next"; // Type definition for page metadata in Next.js

// Define metadata for the page, including title and description for SEO purposes
export const metadata: Metadata = {
  title: "Votes.", // Title of the webpage
  description: "Express your opinion with Votes and polls.", // Brief description of the site
};

// Root layout component that wraps the entire application
export default function RootLayout({
  children, // Accepts children components to be rendered within the layout
}: Readonly<{
  children: React.ReactNode; // Defines the type for children, which are React components
}>) {
  return (
    <html lang="en">
      {/* Sets the language attribute for the HTML document */}
      <body>
        <SiteHeader /> {/* Renders the SiteHeader component at the top */}
        <Toaster richColors theme="system" className="bg-white" />{" "}
        {/* Renders the Toaster for displaying notifications, using system theme */}
        {children} {/* Renders any child components passed into the layout */}
      </body>
    </html>
  );
}
