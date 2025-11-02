import { useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, User, Mail } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logoutThunk } from "@/redux/slices/auth";

export default function SettingsPage() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.push("/login", "root");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {user && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-muted-foreground">
          Ally - Your personal assistant for chat and quizzes.
        </p>
        <p className="text-sm text-muted-foreground mt-2">Version 1.0.0</p>
      </Card>
    </div>
  );
}

