import { Button } from "./ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/helpers/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getEnv } from "@/helpers/getEnv";
import { useAuthStore } from "@/store/useAuthStore";

const GoogleAuth = () => {
    const navigate = useNavigate();
    const { loginSuccess, loginFailure } = useAuthStore();

    const handleGoogleClick = async () => {
        try {
            const resultsFromGoogle = await signInWithPopup(auth, googleProvider);

            const res = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
                credentials: 'include'
            });

            const data = await res.json();
            if (res.ok) {
                loginSuccess(data.user);
                toast.success(data.message);
                navigate("/");
            } else {
                loginFailure(data.message || "Google Authentication failed");
                toast.error(data.message || "Google Authentication failed");
            }
        } catch (error) {
            console.log(error);
            loginFailure(error.message);
            toast.error("Could not sign in with Google");
        }
    };

    return (
        <Button variant="outline" type="button" className="w-full" onClick={handleGoogleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                />
            </svg>
            Continue with Google
        </Button>
    )
}

export default GoogleAuth;