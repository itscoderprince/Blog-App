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
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema } from "@/lib/zSchema"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form"
import { Mail, ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function ForgotPassword({
    className,
    ...props
}) {
    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    function onSubmit(values) {
        console.log("Forgot password values:", values)
        // Handle forgot password logic here
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a code to reset your password.
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
                                <Field>
                                    <Button type="submit" className="w-full">Send Reset Link</Button>
                                </Field>
                                <div className="text-center text-sm">
                                    <Link to="/login" className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-primary">
                                        <ChevronLeft className="h-4 w-4" /> Back to login
                                    </Link>
                                </div>
                            </FieldGroup>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}