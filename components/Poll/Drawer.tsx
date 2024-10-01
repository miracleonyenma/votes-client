// ./components/Poll/Drawer.tsx

// Import necessary components from the drawer UI library
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PollForm from "./Form";

// The PollDrawer component is a wrapper that displays a drawer containing the poll creation form.
const PollDrawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    // Main Drawer component that toggles the drawer UI
    <Drawer>
      {/* The trigger that opens the drawer, renders the passed child element */}
      <DrawerTrigger asChild>
        {children || <button>Open Drawer</button>}
      </DrawerTrigger>

      {/* The content inside the drawer */}
      <DrawerContent className="bg-white">
        {/* A wrapper to control the drawer's width and center it */}
        <div className="wrapper mx-auto w-full max-w-3xl">
          {/* Drawer header contains the title and description */}
          <DrawerHeader>
            <DrawerTitle>Create a new poll</DrawerTitle>
            <DrawerDescription>
              Fill in the form below to create a new poll.
            </DrawerDescription>
          </DrawerHeader>

          {/* Drawer body contains the poll creation form */}
          <div className="p-4">
            <PollForm />
          </div>

          {/* Drawer footer with a cancel button that closes the drawer */}
          <DrawerFooter>
            <DrawerClose asChild>
              <button className="btn w-full grow">Cancel</button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PollDrawer;
