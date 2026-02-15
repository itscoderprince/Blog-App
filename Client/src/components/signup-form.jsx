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
import { signupSchema } from "@/lib/zSchema"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form"
import { User, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react"
import Spinner from "./Spinner"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"
import { getEnv } from "@/helpers/getEnv.js"
import { RouteLogin } from "@/helpers/Route"
import GoogleAuth from "./GoogleAuth"

export function SignupForm({
    className,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values) {
        try {
            const res = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/register`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(values),
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message)
                navigate("/login")
            } else {
                toast.error(data.message || "Registration failed")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Field>
                                                <FormLabel asChild>
                                                    <FieldLabel htmlFor="name" className="flex items-center gap-2">
                                                        <User className="h-4 w-4" /> Full Name
                                                    </FieldLabel>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input id="name" placeholder="Enter your full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </Field>
                                        </FormItem>
                                    )}
                                />
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
                                <Field>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Field>
                                                        <FormLabel asChild>
                                                            <FieldLabel htmlFor="password" className="flex items-center gap-2">
                                                                <LockKeyhole className="h-4 w-4" /> Password
                                                            </FieldLabel>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    id="password"
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder="Create a password"
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
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Field>
                                                        <FormLabel asChild>
                                                            <FieldLabel htmlFor="confirm-password" className="flex items-center gap-2">
                                                                <LockKeyhole className="h-4 w-4" /> Confirm
                                                            </FieldLabel>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    id="confirm-password"
                                                                    type={showConfirmPassword ? "text" : "password"}
                                                                    placeholder="Confirm password"
                                                                    {...field}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="absolute right-0 top-0 h-full w-9 hover:bg-transparent"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                >
                                                                    {showConfirmPassword ? (
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
                                    </div>
                                </Field>
                                <Field>
                                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <Spinner className="mr-2 h-4 w-4" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                </Field>
                                <FieldSeparator>Or continue with</FieldSeparator>
                                <Field>
                                    <GoogleAuth />
                                </Field>
                                <FieldDescription className="text-center">
                                    Already have an account? <Link to={RouteLogin} className="underline underline-offset-4 hover:text-primary">Sign Up</Link>
                                </FieldDescription>
                            </FieldGroup>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center text-xs">
                By clicking continue, you agree to our <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>{" "}
                and <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
