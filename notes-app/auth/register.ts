import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

export async function register(email: string, password: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("✅ Registered new user:", user.email);
        return user;
    }
    catch (error: any) {
        console.log("❌ Registration failed:", error.code, error.message);
        throw error;
    }
          
}