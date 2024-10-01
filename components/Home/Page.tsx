// ./components/Home/Page.tsx

// Use client-side rendering
"use client";

import PollDrawer from "@/components/Poll/Drawer"; // Import the PollDrawer component for creating new polls
import { PollsResponse } from "@/types"; // Import the PollsResponse type for typing the polls data
import restRequest from "@/utils/restRequest"; // Import the utility function for making API requests
import { Plus } from "lucide-react"; // Import the Plus icon from Lucide
import { useEffect, useState } from "react"; // Import React hooks for managing state and side effects
import PollCard from "@/components/Poll/Card";
import { db } from "@/utils/instant";

// Function to fetch polls from the API
const getPolls = async ({ token }: { token: string }) => {
  // Construct the API URL for fetching polls with related data
  const pollsUrl = `${process.env.NEXT_PUBLIC_API}/api/polls?populate[votes][populate][0]=option&populate[options]=*`;

  // Make a request to the API to fetch polls
  const pollsResponse = await restRequest<PollsResponse>({
    url: pollsUrl,
    headers: {
      Authorization: `Bearer ${token}`, // Set the Authorization header with the token
    },
  });

  return pollsResponse; // Return the polls data
};

const HomePage = () => {
  const { data } = db.useQuery({ votes: {} });
  const [polls, setPolls] = useState<PollsResponse | null>(null); // State to hold the fetched polls data
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status

  // Function to handle fetching polls with error handling
  const handleGetPolls = async (token: string) => {
    try {
      const data = await getPolls({ token }); // Call the getPolls function

      setPolls(data); // Set the fetched polls data to state
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.log("🚨🚨🚨🚨 ~ handleGetPolls ~ error", error); // Log any errors that occur
    } finally {
      setLoading(false); // Ensure loading is false in the end
    }
  };

  // useEffect to fetch polls when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    if (!token) {
      return setLoading(false); // If no token, set loading to false
    }
    handleGetPolls(token); // Fetch polls if token is available
  }, []);

  return (
    <main>
      <header className="site-section">
        <div className="wrapper flex w-full items-center justify-between gap-6">
          <h1 className="text-4xl lg:text-7xl">Polls</h1> {/* Page title */}
          <PollDrawer>
            <button className="btn max-lg:pl-2">
              {" "}
              {/* Button to open the poll creation drawer */}
              <span className="max-lg:hidden">Create a new poll</span>
              <Plus className="icon" /> {/* Plus icon */}
            </button>
          </PollDrawer>
        </div>
      </header>
      <section className="site-section">
        <div className="wrapper">
          {loading ? ( // Conditional rendering based on loading state
            <p>Loading...</p>
          ) : polls ? ( // If polls data is available
            <>
              {/* Display the number of polls found */}
              <p>{polls.data.length} polls found</p>

              <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 py-6">
                {polls?.data.map((poll) => (
                  <li key={poll.id} className="">
                    <PollCard
                      votes={
                        data?.votes.filter(
                          (vote) => vote.poll.documentId === poll.documentId
                        ) || []
                      }
                      poll={poll}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No polls found. Make sure you are logged in.</p> // Message if no polls are found
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;

// "use client";

// import PollDrawer from "@/components/Poll/Drawer";
// import { PollsResponse } from "@/types";
// import { db } from "@/utils/instant";
// import restRequest from "@/utils/restRequest";
// import { Plus } from "lucide-react";
// import { useEffect, useState } from "react";

// // Usage example for fetching polls
// const getPolls = async ({ token }: { token: string }) => {
//   const pollsUrl = `${process.env.NEXT_PUBLIC_API}/api/polls?populate[votes][populate][0]=option&populate[options]=*`;

//   const pollsResponse = await restRequest<PollsResponse>({
//     url: pollsUrl,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return pollsResponse;
// };

// const HomePage = () => {
//   const [polls, setPolls] = useState<PollsResponse | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const { data } = db.useQuery({ votes: {} });

//   const handleGetPolls = async (token: string) => {
//     try {
//       const data = await getPolls({ token });

//       setPolls(data);
//       setLoading(false);
//     } catch (error) {
//       console.log("🚨🚨🚨🚨 ~ handleGetPolls ~ error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       return setLoading(false);
//     }
//     handleGetPolls(token);
//   }, []);

//   return (
//     <main>
//       <header className="site-section">
//         <div className="wrapper flex w-full items-center justify-between gap-6">
//           <h1 className="text-4xl lg:text-7xl">Polls</h1>
//           <PollDrawer>
//             <button className="btn max-lg:pl-2">
//               <span className="max-lg:hidden">Create a new poll</span>
//               <Plus className="icon" />
//             </button>
//           </PollDrawer>
//         </div>
//       </header>
//       <section className="site-section">
//         <div className="wrapper">
//           {loading ? (
//             <p>Loading...</p>
//           ) : polls ? (
//             // number of polls
//             <p>{polls.data.length} polls found</p>
//             // <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//             //   {polls?.data.map((poll) => (
//             //     <li key={poll.id} className="">
//             //       <PollCard
//             //         votes={
//             //           data?.votes.filter(
//             //             (vote) => vote.poll.documentId === poll.documentId,
//             //           ) || []
//             //         }
//             //         poll={poll}
//             //       />
//             //     </li>
//             //   ))}
//             // </ul>
//           ) : (
//             <p>No polls found. Make sure you are logged in.</p>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// };

// export default HomePage;
