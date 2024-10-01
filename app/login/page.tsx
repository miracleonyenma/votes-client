// ./app/login/page.tsx

// Import the AuthForm component which will handle the registration form
import AuthForm from "@/components/Auth/Form";

// Define a functional component for the Login page
const LoginPage = () => {
  return (
    <main>
      {/* The main content of the page */}
      <header className="site-section">
        {/* A header section for the page title */}
        <div className="wrapper">
          {/* Wrapper to contain and center the content */}
          <h1 className="text-3xl lg:text-7xl">Login</h1>
          {/* Large heading for the page title, with responsive sizing */}
        </div>
      </header>
      <section className="site-section">
        {/* A section to contain the registration form */}
        <div className="wrapper mx-auto max-w-3xl">
          {/* Wrapper that centers the content and limits the width to 3xl */}
          <AuthForm type="login" />
          {/* Renders the AuthForm component with "login" as the type for the form */}
        </div>
      </section>
    </main>
  );
};

// Export the LoginPage component to be used in the application
export default LoginPage;
