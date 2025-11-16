import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LogIn, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginThunk, clearError } from "@/redux/slices/auth";
import { useIonRouter } from "@ionic/react";
import PageContainer from "@/components/page-container";
import { ROUTE_PATHS } from "@/lib/constant";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error: reduxError } = useAppSelector(
    (state) => state.auth
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "user@example.com",
      password: "password123",
    },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(clearError());
    try {
      await dispatch(loginThunk(values)).unwrap();
    } catch (err: any) {
      console.error("Login failed:", err);
    }
  };

  const handleRegisterClick = () => {
    router.push(ROUTE_PATHS.REGISTER, "root");
  };

  return (
    <PageContainer className="flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 sm:p-8 flex overflow-y-auto">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome to Ally
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full h-12 text-base"
                      disabled={isLoading}
                      autoComplete="email"
                      autoCapitalize="none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full h-12 text-base"
                      disabled={isLoading}
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {reduxError && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                {reduxError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full gap-2 h-12 text-base font-medium"
              disabled={isLoading}
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Don't have an account?
          </p>
          <Button
            variant="outline"
            onClick={handleRegisterClick}
            className="w-full gap-2 h-12 text-base font-medium"
            disabled={isLoading}
          >
            <UserPlus className="h-5 w-5" />
            Create Account
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
