// ./app/register/page.tsx

// Import the AuthForm component which will handle the registration form
import AuthForm from "@/components/Auth/Form";

// Define a functional component for the Register page
const RegisterPage = () => {
  return (
    <main>
      {/* The main content of the page */}
      <header className="site-section">
        {/* A header section for the page title */}
        <div className="wrapper">
          {/* Wrapper to contain and center the content */}
          <h1 className="text-3xl lg:text-7xl">Register</h1>
          {/* Large heading for the page title, with responsive sizing */}
        </div>
      </header>
      <section className="site-section">
        {/* A section to contain the registration form */}
        <div className="wrapper mx-auto max-w-3xl">
          {/* Wrapper that centers the content and limits the width to 3xl */}
          <AuthForm type="register" />
          {/* Renders the AuthForm component with "register" as the type for the form */}
        </div>
      </section>
    </main>
  );
};

// Export the RegisterPage component to be used in the application
export default RegisterPage;
