// ./components/Auth/Form.tsx

// Import necessary modules and hooks
"use client"; // Enables client-side rendering in a Next.js app

import { useUserStore } from "@/store/useUserStore"; // Zustand store for managing user state
import { Loader } from "lucide-react"; // Loader icon from the lucide-react library
import Link from "next/link"; // Link component for navigation
import { useRouter } from "next/navigation"; // Next.js hook for programmatic navigation
import { useState } from "react"; // React hook for managing local component state
import { toast } from "sonner"; // Toast notifications for showing feedback
import { db } from "@/utils/instant"; // InstantDB client for interacting with the database
import restRequest from "@/utils/restRequest"; // Utility function for making REST API requests
import {
  LoginBody,
  LoginResponse,
  RegisterBody,
  RegsiterResponse,
} from "@/types"; // Types for login and registration

// Function to handle user login using the Strapi API
const loginUser = async ({ identifier, password }: LoginBody) => {
  try {
    // Send login request to Strapi API
    const data = await restRequest<LoginResponse, LoginBody>({
      url: `${process.env.NEXT_PUBLIC_API}/api/auth/local`,
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: {
        identifier,
        password,
      },
    });

    return data;
  } catch (error) {
    // Log and throw any errors that occur
    console.log("🚨🚨🚨🚨 ~ loginUser error:", error);
    throw error;
  }
};

// Function to handle user registration using the Strapi API
const registerUser = async ({ username, email, password }: RegisterBody) => {
  try {
    // Send registration request to Strapi API
    const data = await restRequest<RegsiterResponse, RegisterBody>({
      url: `${process.env.NEXT_PUBLIC_API}/api/auth/local/register`,

      method: "POST",
      body: {
        username,
        email,
        password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    // Log and throw any errors that occur
    console.log("🚨🚨🚨🚨 ~ register error:", error);
    throw error;
  }
};

// AuthForm component to handle both login and registration
const AuthForm: React.FC<{
  type: "login" | "register"; // The form type: "login" or "register"
}> = ({ type }) => {
  const router = useRouter(); // Use Next.js router for navigation
  const { setUser } = useUserStore(); // Zustand store function to set the user
  // State variables for form fields and loading state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission for both login and registration
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    if (type === "login") {
      // Handle login case
      return toast.promise(
        loginUser({ identifier: email.trim(), password: password.trim() }),
        {
          loading: (() => {
            setLoading(true); // Set loading state to true
            return "Logging in..."; // Display loading message
          })(),
          success: (data) => {
            // On success, store JWT, user info, and InstantDB token in localStorage
            localStorage.setItem("token", data.jwt);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("instantDBToken", data.instantdbToken);
            setUser(data.user); // Set user in Zustand store
            db?.auth.signInWithToken(data.instantdbToken); // Authenticate with InstantDB

            router.push("/"); // Redirect to the homepage
            return "Logged in successfully";
          },
          error: (err) => {
            // Handle errors and display error message
            console.log("🚨🚨🚨🚨 ~ handleSubmit ~ err", err);
            return err.message; // Display error in toast notification
          },
          finally: () => {
            setLoading(false); // Reset loading state
          },
        }
      );
    }

    if (type === "register") {
      // Handle registration case
      return toast.promise(
        registerUser({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
        {
          loading: (() => {
            setLoading(true); // Set loading state to true
            return "Registering..."; // Display loading message
          })(),
          success: (data) => {
            // On success, store JWT, user info, and InstantDB token in localStorage
            localStorage.setItem("token", data.jwt);
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("instantDBToken", data.instantdbToken);
            setUser(data.user); // Set user in Zustand store
            db?.auth.signInWithToken(data.instantdbToken); // Authenticate with InstantDB

            router.push("/"); // Redirect to the homepage
            return "Registered successfully";
          },
          error: (err) => {
            // Handle errors and display error message
            console.log("🚨🚨🚨🚨 ~ handleSubmit ~ err", err);
            return err.message; // Display error in toast notification
          },
          finally: () => {
            setLoading(false); // Reset loading state
          },
        }
      );
    }
  };

  return (
    <>
      {/* Form for login or registration */}
      <form
        onSubmit={handleSubmit}
        className="border border-zinc-200 bg-zinc-50 p-4 lg:p-6"
      >
        <div className="wrapper flex flex-col gap-8">
          {/* Show username field only for registration */}
          {type === "register" && (
            <div className="form-control">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="form-input"
                required
              />
            </div>
          )}

          {/* Email input field */}
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="form-input"
              required
            />
          </div>

          {/* Password input field */}
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="form-input"
              required
            />
          </div>

          {/* Submit button */}
          <div className="action-cont">
            <button
              disabled={!email.trim() || !password.trim() || loading}
              className="btn"
              type="submit"
            >
              {type === "login" ? "Login" : "Register"}
              {loading && <Loader className="icon animate-spin" />}
            </button>
          </div>
        </div>
      </form>

      {/* Display link to switch between login and registration */}
      {type == "login" ? (
        <p className="mt-6">
          Don&apos;t have an account?{" "}
          <Link className="underline" href="/register">
            Create one
          </Link>
        </p>
      ) : (
        <p className="mt-6">
          Already have an account?{" "}
          <Link className="underline" href="/login">
            Login
          </Link>
        </p>
      )}
    </>
  );
};

export default AuthForm;
