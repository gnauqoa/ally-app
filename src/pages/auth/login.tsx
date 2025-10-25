import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { login } from "@/lib/auth-storage";
import { LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = login(email, password);

      if (user) {
        history.push("/chat");
      } else {
        setError("Invalid email or password");
      }

      setIsLoading(false);
    }, 500);
  };

  const handleRegisterClick = () => {
    history.push("/register");
  };

  return (
    <div className="flex h-full items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-md p-6 sm:p-8 flex overflow-y-auto h-full">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome to Ally
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-12 text-base"
              disabled={isLoading}
              autoComplete="email"
              autoCapitalize="none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-12 text-base"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-3 rounded-lg">
              {error}
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
    </div>
  );
}
