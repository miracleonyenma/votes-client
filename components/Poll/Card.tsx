// ./components/Poll/Card.tsx

// Importing necessary libraries and types
import { useUserStore } from "@/store/useUserStore";
import { InstantDBVote, Option, Poll, Vote } from "@/types";
import { createVote, mergeVotes } from "@/utils/poll";
import { Check, Loader, VoteIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// Component for displaying an option in the poll with a progress bar for votes
const OptionBar: React.FC<{
  option: Option; // The option object containing option details
  votes?: Vote[]; // Array of votes for this option
  votesCount: number; // Count of votes for this option
  totalVotes: number; // Total votes for all options
  onOptionClick?: (option: string) => void; // Function to call when the option is clicked
  loading?: { [key: string]: boolean }; // Loading states for options
}> = ({ option, votesCount, votes, totalVotes, onOptionClick, loading }) => {
  const { user } = useUserStore(); // Get user details from the store

  // Check if the user has voted for this option
  const userVotedForOption = votes?.find(
    (vote) =>
      vote.user?.documentId === user?.documentId &&
      vote.option.documentId === option.documentId
  );

  return (
    <div className="flex gap-2">
      <div className="relative flex w-full items-center justify-between">
        <div className="relative flex w-full items-center justify-between border border-zinc-200">
          {/* Progress bar representing the percentage of votes */}
          <div
            className="absolute h-full bg-zinc-300 transition-all"
            style={{ width: `${(votesCount / totalVotes) * 100}%` }} // Calculate width based on votes
          ></div>
          <span className="relative p-2 text-zinc-900">{option.value}</span>
          <span className="right-0 z-10 p-2 px-4">{votesCount}</span>
        </div>
      </div>
      {/* Button for voting */}
      <button
        onClick={() => {
          if (onOptionClick) {
            onOptionClick(option.documentId); // Call the option click handler with option ID
          }
        }}
        className="btn shrink-0"
        disabled={loading?.[option.documentId] || !!userVotedForOption} // Disable if loading or user has voted
      >
        {/* Display different icons based on voting state */}
        {!loading?.[option.documentId] ? (
          !userVotedForOption ? (
            <VoteIcon className="icon shrink-0" /> // Voting icon
          ) : (
            <Check className="icon shrink-0" /> // Checkmark icon if voted
          )
        ) : (
          <Loader className="icon shrink-0 animate-spin" /> // Loader icon if loading
        )}
      </button>
    </div>
  );
};

// Main component for displaying the poll card
const PollCard: React.FC<{
  poll: Poll; // The poll object containing poll details
  votes: InstantDBVote[]; // Array of real-time votes
  type?: "small" | "large"; // Type of poll card for styling
}> = ({ poll, votes, type = "small" }) => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>(); // Loading state for options

  // Memoize merged votes to avoid recalculating on each render
  const mergedVotes = useMemo(
    () => mergeVotes(poll.votes, votes), // Merge existing poll votes with real-time votes
    [poll.votes, votes]
  );

  // Handle voting option click
  const handleOptionClick = (option: string) => {
    toast.promise(
      createVote({
        poll: poll.documentId, // Poll ID
        option, // Selected option ID
        token: localStorage.getItem("token") || "", // Get token from local storage
      }),
      {
        loading: (() => {
          setLoading({
            ...loading,
            [option]: true, // Set loading state for the clicked option
          });
          return "Voting..."; // Loading message
        })(),
        success: () => {
          return "Voted successfully!"; // Success message
        },
        error: (error) => {
          console.log("🚨🚨🚨🚨 ~ handleOptionClick ~ error", error); // Log error

          return error.message; // Return error message
        },
        finally: () => {
          setLoading({
            ...loading,
            [option]: false, // Reset loading state for the clicked option
          });
        },
      }
    );
  };

  return (
    <article
      className={`poll-card h-full ${type == "small" ? "border border-zinc-200 bg-zinc-50" : ""}`}
    >
      <div
        className={`wrapper flex h-full flex-col gap-4 ${type == "small" ? "p-4 lg:p-6" : ""}`}
      >
        {type == "small" && (
          <h2 className="text-2xl font-semibold lg:text-3xl">
            {poll.question} {/* Display poll question */}
          </h2>
        )}
        <ul className="flex flex-col gap-2">
          {poll.options.map((option, index) => {
            const votesForOption = mergedVotes.filter(
              (vote) => vote.option.documentId === option.documentId // Count votes for this option
            ).length;
            const totalVotes = mergedVotes.length; // Get total votes

            return (
              <li
                key={index}
                className={`${type == "small" ? "" : "text-3xl"}`} // Set text size based on card type
              >
                <OptionBar
                  option={option}
                  votesCount={votesForOption} // Pass votes count for the option
                  totalVotes={totalVotes} // Pass total votes
                  onOptionClick={handleOptionClick} // Pass click handler
                  loading={loading} // Pass loading state
                  votes={mergedVotes} // Pass merged votes
                />
              </li>
            );
          })}
        </ul>
        {/*  Link to view full poll */}
        {type === "small" && (
          <Link className="btn mt-auto" href={`/poll/${poll.documentId}`}>
            View Poll &rarr;
          </Link>
        )}

        {/* Display poll results for large card type */}
        {type === "large" && (
          <div className="poll-results py-8">
            <h3 className="text-3xl font-semibold">Results</h3>
            <hr />
            <ul className="mt-6 flex flex-col gap-4">
              {poll.options.map((option, index) => {
                const votesForOption = mergedVotes.filter(
                  (vote) => vote.option.documentId === option.documentId // Get votes for the option
                );
                const votesPercentage =
                  (votesForOption.length / mergedVotes.length) * 100 || 0; // Calculate percentage

                return (
                  <li key={index}>
                    <article>
                      <h4 className={`text-2xl`}>
                        {/* Display option value and percentage */}
                        {option.value} - {votesPercentage.toFixed(2)}%
                      </h4>

                      <ul className="flex flex-col gap-2">
                        {votesForOption.map((vote, index) => (
                          <li className="text-lg" key={index}>
                            {/* Display username of voters */}
                            <span>{vote?.user?.username}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};

export default PollCard; // Export PollCard component
