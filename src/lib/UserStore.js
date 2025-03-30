import { create } from "zustand";
import {account, databases } from "../lib/AppWriteConfig";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async (uid) => {
        if (!uid) {
            set({ currentUser: null, isLoading: false });
            return;
        }
        try {
            const userDoc = await databases.getDocument(
                "67e55994002fd6e76a8f",
                "users",
                uid
            );
            set({ currentUser: userDoc, isLoading: false });
        } catch (error) {
            console.log(error);
            set({ currentUser: null, isLoading: false });
        }
    },
    logout: async () => {
        await account.deleteSession("current");
        set({ currentUser: null, isLoading: false });
    }
}));
