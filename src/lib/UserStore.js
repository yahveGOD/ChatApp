import { create } from "zustand";
import { databases } from "../lib/AppWriteConfig";

export const useUserStore = create ((set) => ({
    currentUser:null,
    isLoading:true,
    fetchUserInfo: async (uid) =>{
        if(!uid) return set({currentUser:null,isLoading:false});
        try {
            
            const userDoc = await databases.getDocument(
                "67e55994002fd6e76a8f", 
                "users",
                uid
            );

            set({ currentUser: userDoc, isLoading: false });

        } catch (error) {
            console.log(error)
            return set({currentUser:null,isLoading:false});
        }
    }
}))