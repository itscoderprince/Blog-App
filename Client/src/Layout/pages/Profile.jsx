"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeClosed,
  User,
  Mail,
  FileText,
  Lock,
  ShieldCheck,
} from "lucide-react"; // Import icons

import Spinner from "@/components/Spinner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profileSchema } from "@/lib/zSchema";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/Loading";
import { toast } from "sonner";

// --- Helper Component for Password Toggle ---
const PasswordInput = ({ field, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...field}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeClosed className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, loginSuccess, loginFailure } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Fetching userData 
  const {
    data: userData,
    loading,
    error,
  } = useFetch(`${getEnv("VITE_API_BASE_URL")}/user/get-user/${user?._id}`, {
    method: "get",
    credentials: "include",
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData?.user?.name,
        email: userData?.user?.email,
        bio: userData?.user?.bio,
      });
    }
  }, [userData]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      });

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const res = await fetch(`${getEnv('VITE_API_BASE_URL')}/user/update-user/${user?._id}`, {
        method: 'put',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        loginSuccess(data.user)
        toast.success(data.message)
        navigate("/")
      } else {
        loginFailure(data.message || "Update failed")
        toast.error(data.message || "Update failed")
      }
    } catch (error) {
      loginFailure(error.message)
      toast.error(error.message)
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading fullPage={false} />;

  return (
    <div className="flex w-full h-full bg-muted/40 justify-center">
      <Card className="w-full max-w-2xl border-0 shadow-none sm:border sm:shadow-sm bg-background">
        <CardHeader className="pb-4 gap-1">
          <CardTitle className="text-xl font-bold">Profile Settings</CardTitle>
          <CardDescription className="text-sm">
            Manage your public profile and account security settings.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* SECTION 1: Personal Info */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Avatar
                    className="h-24 w-24 mb-4 cursor-pointer ring-2 ring-primary ring-offset-2"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <AvatarImage src={previewUrl || userData?.user?.avatar} />
                    <AvatarFallback>
                      {userData?.user?.name?.substring(0, 2).toUpperCase() || "PK"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Change Avatar
                  </Button>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Full Name
                          </FormLabel>

                          <FormControl>
                            <Input placeholder="Prince Kumar" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email
                          </FormLabel>

                          <FormControl>
                            <Input placeholder="prince@gmail.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          Bio
                        </FormLabel>

                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-2" />

              {/* SECTION 2: Security */}
              <div className={userData?.user?.fromGoogle ? "opacity-50 pointer-events-none" : ""}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Security</h3>
                  {userData?.user?.fromGoogle && (
                    <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                      Managed by Google
                    </span>
                  )}
                </div>

                {/* Grid Layout: 1 col on mobile, 2 cols on md */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Current Password: Spans 2 columns on desktop */}
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                          Current Password
                        </FormLabel>

                        <FormControl>
                          <PasswordInput field={field} placeholder="•••••••" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* New Password: 1 column */}
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          New Password
                        </FormLabel>

                        <FormControl>
                          <PasswordInput field={field} placeholder="•••••••" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password: 1 column */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Confirm New Password
                        </FormLabel>

                        <FormControl>
                          <PasswordInput field={field} placeholder="•••••••" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
