import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });


//inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: "sync-user-from-clerk",
    },
    { event: "clerk/user.created" },
    async ({ event}) =>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data;
        const userData = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url
        };
        await connectDB();
        await User.create(userData);
    }
);

//inngest function to update user data in a database
export const syncUserUpdate = inngest.createFunction(
    {
        id: "sync-user-update-from-clerk",
    },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url
        };
        await connectDB();
        await User.updateOne({ _id: id }, userData);
    }
);

//inngest function to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
    {
        id: "sync-user-deletion-from-clerk",
    },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
);