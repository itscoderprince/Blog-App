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
} from "@/components/ui/field"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { otpSchema } from "@/lib/zSchema"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Link } from "react-router-dom"

export function OtpForm({
    className,
    ...props
}) {
    const form = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    })

    function onSubmit(values) {
        console.log("OTP values:", values)
        // Handle OTP verification logic here
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
                    <CardDescription>
                        Please enter the 6-digit code sent to your email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field} containerClassName="w-full">
                                                    <InputOTPGroup className="w-full justify-between">
                                                        <InputOTPSlot index={0} className="h-11 w-11 border-l rounded-md" />
                                                        <InputOTPSlot index={1} className="h-11 w-11 border-l rounded-md" />
                                                        <InputOTPSlot index={2} className="h-11 w-11 border-l rounded-md" />
                                                        <InputOTPSlot index={3} className="h-11 w-11 border-l rounded-md" />
                                                        <InputOTPSlot index={4} className="h-11 w-11 border-l rounded-md" />
                                                        <InputOTPSlot index={5} className="h-11 w-11 border-l rounded-md" />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Field>
                                    <Button type="submit" className="w-full">Verify Code</Button>
                                    <FieldDescription className="text-center">
                                        Didn&apos;t receive a code? <button type="button" className="underline underline-offset-4 hover:text-primary">Resend</button>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-center text-sm">
                <Link to="/login" className="underline underline-offset-4 hover:text-primary">Back to login</Link>
            </div>
        </div>
    )
}
