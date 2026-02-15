import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/zSchema"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form"
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react"
import Spinner from "./Spinner"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"
import { getEnv } from "@/helpers/getEnv"
import GoogleAuth from "./GoogleAuth"
import { useAuthStore } from "@/store/useAuthStore"

export function LoginForm({
    className,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const { loginSuccess, loginFailure } = useAuthStore()

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values) {
        try {
            const res = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/login`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                loginSuccess(data.user)
                toast.success(data.message)
                navigate("/")
            } else {
                loginFailure(data.message || "Login failed")
                toast.error(data.message || "Login failed")
            }
        } catch (error) {
            loginFailure(error.message)
            toast.error(error.message)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Field>
                                                <FormLabel asChild>
                                                    <FieldLabel htmlFor="email" className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" /> Email Address
                                                    </FieldLabel>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="Enter your email address"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </Field>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Field>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel asChild>
                                                        <FieldLabel htmlFor="password" className="flex items-center gap-2">
                                                            <LockKeyhole className="h-4 w-4" /> Password
                                                        </FieldLabel>
                                                    </FormLabel>
                                                    <Link
                                                        to="/forgot-password"
                                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </Link>
                                                </div>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            id="password"
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Enter your password"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-0 top-0 h-full w-9 hover:bg-transparent"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                            ) : (
                                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </Field>
                                        </FormItem>
                                    )}
                                />

                                <Field>
                                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <Spinner className="mr-2 h-4 w-4" />
                                                Logging in...
                                            </>
                                        ) : (
                                            "Login"
                                        )}
                                    </Button>
                                </Field>
                                <FieldSeparator>Or continue with</FieldSeparator>
                                <Field>
                                    <GoogleAuth />
                                    <FieldDescription className="text-center">
                                        Don&apos;t have an account? <Link to="/register" className="underline underline-offset-4 hover:text-primary">Sign up</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
