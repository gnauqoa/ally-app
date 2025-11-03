import { useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, BookOpen, Settings } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { ROUTE_PATHS } from "@/lib/constant";

export default function HomePage() {
  const router = useIonRouter();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to Ally{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Your personal assistant for chat and learning
        </p>
      </div>

      <div className="grid gap-4">
        <Card
          className="p-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => router.push(ROUTE_PATHS.CHAT)}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold">Chat</p>
              <p className="text-muted-foreground">
                Start a conversation and get help with your problems. Share your
                concerns and receive personalized guidance.
              </p>
              <Button className="mt-4" size="sm">
                Start Chatting
              </Button>
            </div>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => router.push(ROUTE_PATHS.QUIZ)}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold mb-2">Quiz</p>
              <p className="text-muted-foreground">
                Create and take quizzes to test your knowledge. Track your
                progress and improve your skills.
              </p>
              <Button className="mt-4" size="sm">
                View Quizzes
              </Button>
            </div>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => router.push(ROUTE_PATHS.SETTINGS)}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold mb-2">Settings</p>
              <p className="text-muted-foreground">
                Manage your account, view your profile, and customize your
                preferences.
              </p>
              <Button className="mt-4" size="sm" variant="outline">
                Go to Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
