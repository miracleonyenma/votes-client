// ./utils/poll/index.ts

import { InstantDBVote, Vote, VoteResponse } from "@/types"; // Import types for votes
import restRequest from "@/utils/restRequest"; // Import the utility for making REST requests

// Function to create a vote for a specific poll option
const createVote = async ({
  poll, // Poll ID to which the vote is associated
  option, // Option ID that is being voted for
  token, // Authorization token for the API request
}: {
  poll: string;
  option: string;
  token: string;
}) => {
  // Define the API endpoint for creating votes
  const voteUrl = `${process.env.NEXT_PUBLIC_API}/api/votes?populate=*`;

  // Make the REST request to create a vote
  const voteResponse = await restRequest<
    VoteResponse,
    {
      data: {
        option: string;
        poll: string;
      };
    }
  >({
    url: voteUrl, // URL of the API endpoint
    method: "POST", // HTTP method for creating a new resource
    headers: {
      Authorization: `Bearer ${token}`, // Include authorization token in headers
    },
    body: {
      data: {
        poll, // Include the poll ID in the request body
        option, // Include the option ID in the request body
      },
    },
  });

  return voteResponse; // Return the response from the vote creation
};

// Combine votes from the poll and real-time votes from InstantDB
const mergeVotes = (
  pollVotes: Vote[], // Existing votes from the poll
  realTimeVotes: InstantDBVote[] // Real-time votes to be merged
): Vote[] => {
  const mergedVotes = [...pollVotes]; // Start with existing poll votes

  // Convert realTimeVotes into Vote objects and add them if they don't exist
  realTimeVotes.forEach((instantVote) => {
    const existsInPoll = pollVotes.some(
      (pollVote) =>
        pollVote.option.documentId === instantVote.option.documentId &&
        pollVote.user?.documentId === instantVote.user.documentId
    );

    // If the real-time vote does not already exist in pollVotes, transform and add it
    if (!existsInPoll) {
      mergedVotes.push({
        id: Math.random(), // Placeholder ID since real-time votes won't have it
        documentId: instantVote.poll.documentId,
        createdAt: instantVote.createdAt,
        updatedAt: instantVote.createdAt,
        publishedAt: instantVote.createdAt,
        locale: null,
        option: {
          documentId: instantVote.option.documentId,
          value: instantVote.option.value,
          id: Math.random(), // Placeholder ID for option
          createdAt: instantVote.createdAt,
          updatedAt: instantVote.createdAt,
          publishedAt: instantVote.createdAt,
          locale: null,
        },
        user: {
          documentId: instantVote.user.documentId,
          username: instantVote.user.username,
          email: instantVote.user.email,
          id: Math.random(), // Placeholder ID for user
        },
      });
    }
  });

  return mergedVotes; // Return the combined list of votes
};

export { createVote, mergeVotes }; // Export the functions for external use
