// ./components/Poll/Form.tsx
// Import necessary React hooks and libraries
import { useState } from "react"; // React hook to manage component state
import { toast } from "sonner"; // Importing toast notification from sonner
import { OptionResponse, PollResponse } from "@/types"; // Type definitions for API responses
import restRequest from "@/utils/restRequest"; // Utility function for making API requests
import { useRouter } from "next/navigation"; // Router hook for navigation
import { Loader, X } from "lucide-react"; // Icons for loading and remove option

// Async function to create a poll, accepts question, options, and token as parameters
const createPoll = async ({
  question,
  options,
  token,
}: {
  question: string;
  options: string[];
  token: string;
}) => {
  try {
    // API URLs for creating polls and options
    const pollUrl = `${process.env.NEXT_PUBLIC_API}/api/polls?populate=*`;
    const optionUrl = `${process.env.NEXT_PUBLIC_API}/api/options?populate=*`;

    // Create options by making API requests for each one
    const optionsResponses = await Promise.all(
      options.map(async (option) => {
        return await restRequest<OptionResponse, { data: { value: string } }>({
          url: optionUrl,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            data: {
              value: option, // The option text
            },
          },
        });
      })
    );

    // Create the poll by sending the question and option IDs
    const pollResponse = await restRequest<
      PollResponse,
      { data: { question: string; options: string[] } }
    >({
      url: pollUrl,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        data: {
          question, // Poll question
          options: optionsResponses.map((response) => response.data.documentId), // Map the option IDs
        },
      },
    });

    return pollResponse; // Return the created poll response
  } catch (error) {
    console.log("🚨🚨🚨🚨 ~ createPoll ~ error", error); // Log any errors
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Component for rendering individual options with a remove button
const OptionItem: React.FC<{
  option: string;
  updateRemoveOption: (option: string) => void; // Callback to remove the option
}> = ({ option, updateRemoveOption }) => {
  return (
    <li className="inline-flex w-fit items-center justify-between border border-zinc-200 bg-zinc-100">
      <span className="px-4">{option}</span> {/* Display option text */}
      <button
        className="btn h-full grow"
        onClick={() => {
          updateRemoveOption(option); // Trigger option removal when button is clicked
        }}
      >
        <X className="icon" />{" "}
        {/* Display the 'X' icon for removing the option */}
      </button>
    </li>
  );
};

// Main PollForm component
const PollForm: React.FC = ({}) => {
  const router = useRouter(); // Hook to navigate between pages
  const [question, setQuestion] = useState<string>(""); // State to manage the poll question
  const [options, setOptions] = useState<string[]>([]); // State to manage poll options
  const [option, setOption] = useState<string>(""); // State to manage the current option input
  const [loading, setLoading] = useState<boolean>(false); // State to manage loading state

  // Function to add the current option to the options list
  const addOption = () => {
    setOptions([...options, option]); // Add the current option to the options array
    setOption(""); // Clear the input field
  };

  // Function to handle the creation of a poll
  const handleCreatePoll = () => {
    // Display a toast notification during the poll creation process
    toast.promise(
      createPoll({
        question,
        options,
        token: localStorage.getItem("token") || "", // Retrieve the token from local storage
      }),
      {
        loading: (() => {
          setLoading(true); // Set loading state to true while the request is being processed
          return "Creating poll..."; // Loading message
        })(),
        success: (data) => {
          // Reset the form upon success
          setQuestion(""); // Clear the question
          setOptions([]); // Clear the options
          setOption(""); // Clear the option input
          router.push(`/poll/${data.data.documentId}`); // Redirect to the created poll page
          return "Poll created!"; // Success message
        },
        error: (error) => {
          return error.message; // Display error message in the toast
        },
        finally: () => {
          setLoading(false); // Reset loading state after completion
        },
      }
    );
  };

  return (
    // Form for creating a poll
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent default form submission
        handleCreatePoll(); // Trigger poll creation
      }}
      className="border border-zinc-200 bg-zinc-50 p-4 lg:p-6"
    >
      <div className="wrapper flex flex-col gap-4">
        <div className="form-control">
          <label htmlFor="question">Question</label>{" "}
          {/* Label for question input */}
          <input
            type="text"
            id="question"
            name="question"
            value={question} // Bind input value to the question state
            onChange={(e) => setQuestion(e.target.value)} // Update state when input changes
          />
        </div>

        <div className="form-control">
          <label htmlFor="option">Option</label> {/* Label for option input */}
          <div className="flex">
            <input
              type="text"
              id="option"
              name="option"
              value={option} // Bind input value to the option state
              onChange={(e) => setOption(e.target.value)} // Update state when input changes
            />
            <button className="btn" type="button" onClick={addOption}>
              Add
            </button>{" "}
            {/* Button to add the option to the list */}
          </div>
          <ul className="flex gap-2">
            {/* Map through the options array to display each option */}
            {options.map((option) => (
              <OptionItem
                key={option}
                option={option} // Pass option text
                updateRemoveOption={(option) => {
                  setOptions(options.filter((opt) => opt !== option)); // Remove option from the list
                }}
              />
            ))}
          </ul>
        </div>
        <div className="action-cont">
          {/* Button to submit the form and create the poll */}
          <button className="btn" type="submit" disabled={loading}>
            Create Poll
            {loading && <Loader className="icon animate-spin" />}{" "}
            {/* Show loader while processing */}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PollForm; // Export the PollForm component
