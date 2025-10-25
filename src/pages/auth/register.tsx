import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { register } from "@/lib/auth-storage";
import { UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = register(email, password, name);

      if (user) {
        history.push("/chat");
      } else {
        setError("Email already exists");
      }

      setIsLoading(false);
    }, 500);
  };

  const handleBackToLogin = () => {
    history.push("/login");
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-background p-4 sm:p-6">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Join Ally today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full h-12 text-base"
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

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
              placeholder="Enter your password (min 6 characters)"
              className="w-full h-12 text-base"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full h-12 text-base"
              disabled={isLoading}
              autoComplete="new-password"
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
            <UserPlus className="h-5 w-5" />
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Already have an account?
          </p>
          <Button
            variant="outline"
            onClick={handleBackToLogin}
            className="w-full gap-2 h-12 text-base font-medium"
            disabled={isLoading}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
}

