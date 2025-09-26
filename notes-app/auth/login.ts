import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";


export async function login(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("✅ Logged in as:", user.email);
        return user;
    } catch (error: any) {
        console.log("❌ Login failed:", error.code, error.message);
        throw error;
    }
}
