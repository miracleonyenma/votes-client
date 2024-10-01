// ./components/Site/Header.tsx

"use client"; // This enables client-side rendering for this component.

import { useUserStore } from "@/store/useUserStore"; // Import the Zustand store to access user state.
import Link from "next/link"; // Import Link from Next.js for navigation.
import { useEffect } from "react"; // Import useEffect to run code on component mount.

const SiteHeader = () => {
  // Extract user state and setUser function from Zustand store
  const { user, setUser } = useUserStore();

  // Handles user logout by clearing localStorage and resetting the user state.
  const handleLogout = async () => {
    localStorage.removeItem("user"); // Remove user data from local storage.
    localStorage.removeItem("token"); // Remove authentication token from local storage.
    localStorage.removeItem("instantDBToken"); // Remove InstantDB token from local storage.
    setUser(null); // Update the Zustand store to reflect no user is logged in.
    window.location.reload(); // Refresh the page to update the UI.
  };

  useEffect(() => {
    // On component mount, retrieve user from localStorage if present and set it in the store.
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user)); // Parse the JSON string and set the user state in the store.
    }
  }, [setUser]); // Effect runs when component mounts, no dependencies.

  return (
    <header className="sticky top-0 w-full bg-white border-b border-b-zinc-200 p-4">
      {/* Container for the site header */}
      <div className="wrapper mx-auto flex w-full max-w-3xl items-center justify-between">
        {/* Logo or site name that links back to the homepage */}
        <Link href="/">
          <figure>
            <h1 className="text-lg font-bold">Votes.</h1>
          </figure>
        </Link>

        {/* Navigation section */}
        <nav className="site-nav">
          <ul className="flex items-center gap-4">
            {/* Conditional rendering based on user login status */}
            {user ? (
              // If user is logged in, display a welcome message and logout button
              <>
                <li>
                  <p className="truncate">
                    Welcome, <strong>{user.username}</strong>
                  </p>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              // If user is not logged in, show login and register links
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
