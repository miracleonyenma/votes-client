"use client"; // Indicates that this file contains client-side logic for Next.js

import PollCard from "@/components/Poll/Card"; // Importing the PollCard component to display the poll
import { useUserStore } from "@/store/useUserStore"; // Hook to get the current user from the user store
import { InstantDBVote, PollResponse } from "@/types"; // Types for vote and poll data
import { db } from "@/utils/instant"; // InstantDB client for real-time data
import restRequest from "@/utils/restRequest"; // Utility for making REST requests
import { Loader, Trash2 } from "lucide-react"; // Icons for loading spinner and trash/delete button
import { useRouter } from "next/navigation"; // Hook for navigating between routes
import { useCallback, useEffect, useState } from "react"; // React hooks for state and lifecycle management
import { toast } from "sonner"; // Toast notifications for success and error messages

const PollPage: React.FC<{
  id: string;
}> = ({ id }) => {
  const router = useRouter(); // Router instance for navigating the user after an action
  const { data } = db.useQuery({ votes: {} }); // Query votes from InstantDB
  const { user } = useUserStore(); // Get the current logged-in user from the store

  // State variables for holding poll data, loading state, and real-time vote updates
  const [poll, setPoll] = useState<PollResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const pollUrl = `${process.env.NEXT_PUBLIC_API}/api/polls/${id}`; // Poll API URL
  const [realTimeVotes, setRealTimeVotes] = useState<InstantDBVote[]>([]); // Holds filtered votes for real-time updates

  // Function to fetch poll data from the server using the poll ID and user's token
  const handleGetPoll = useCallback(
    async (id: string, token: string) => {
      try {
        const pollResponse = await restRequest<PollResponse>({
          url: `${pollUrl}?populate[votes][populate][0]=option&populate[options]=*`, // Fetch poll options and votes
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authenticated requests
          },
        });
        setPoll(pollResponse); // Update state with the fetched poll
        // Filter and update the real-time votes based on the poll ID
        if (data?.votes?.length)
          setRealTimeVotes(
            data?.votes.filter(
              (vote: InstantDBVote) => vote.poll.documentId === id
            )
          );
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.log("🚨🚨🚨🚨 ~ handleGetPoll ~ error", error); // Log any errors
      } finally {
        setLoading(false); // Ensure loading state is false even if there is an error
      }
    },
    [data?.votes, pollUrl]
  );

  // Function to handle the deletion of the poll
  const handleDeletePoll = (id: string, token: string) => {
    toast.promise(
      restRequest<PollResponse>({
        url: pollUrl, // Endpoint for poll deletion
        method: "DELETE", // HTTP DELETE method to remove the poll
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
      }),
      {
        loading: (() => {
          setLoading(true); // Set loading state while deleting the poll
          return "Deleting poll..."; // Show a loading message
        })(),
        success: () => {
          router.push("/"); // Redirect to the home page after successful deletion
          return "Poll deleted successfully!"; // Show success message
        },
        error: (error) => {
          console.log("🚨🚨🚨🚨 ~ handleDeletePoll ~ error", error); // Log error
          return "An error occurred while deleting the poll."; // Show error message
        },
        finally: () => {
          setLoading(false); // Ensure loading state is false when done
        },
      }
    );
  };

  // Fetch the poll data when the component is mounted or the poll ID changes
  useEffect(() => {
    handleGetPoll(id, localStorage.getItem("token") || ""); // Fetch poll data with the token from localStorage
  }, [handleGetPoll, id]);

  // Update real-time votes whenever the vote data changes in InstantDB
  useEffect(() => {
    if (data?.votes?.length)
      setRealTimeVotes(
        data?.votes.filter((vote: InstantDBVote) => vote.poll.documentId === id)
      );
  }, [data, id]);

  return (
    <main>
      <header className="site-section">
        <div className="wrapper">
          <h1 className="text-4xl lg:text-7xl">
            {/* Display the poll question, or a fallback message if not found */}
            {poll?.data.question || "No poll found"}
          </h1>
          {/* Display delete button if the poll belongs to the current user */}
          {poll?.data && poll?.data?.user?.documentId == user?.documentId && (
            <div className="action-cont">
              <button
                onClick={() =>
                  handleDeletePoll(id, localStorage.getItem("token") || "")
                }
                className="btn"
              >
                {loading ? (
                  <Loader className="icon" /> // Show a loading spinner while deleting
                ) : (
                  <Trash2 className="icon" /> // Show trash icon for deletion
                )}
              </button>
            </div>
          )}
        </div>
      </header>
      <section className="site-section">
        <div className="wrapper">
          {loading ? (
            <p>Loading...</p> // Display loading message while fetching poll data
          ) : (
            <div>
              {/* Display the poll card if poll data is available, otherwise show fallback message */}
              {poll?.data ? (
                <PollCard poll={poll.data} votes={realTimeVotes} type="large" />
              ) : (
                <p>No poll found. Try again later. </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PollPage; // Export the component as default for use in other parts of the application
