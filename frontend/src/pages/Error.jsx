import {
  Link,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { ArrowLeft, Bug, Home, Lock, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown for unknown URLs, /unauthorized (see Protected.jsx) and crashes.
const Error = () => {
  const error = useRouteError();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const isUnauthorized = pathname === "/unauthorized";

  const { icon: Icon, code, title, text } = isUnauthorized
    ? {
        icon: Lock,
        code: "403",
        title: "You don't have access to this page",
        text: "Your role doesn't allow this. Ask an admin if you think you should have access.",
      }
    : isNotFound
      ? {
          icon: SearchX,
          code: "404",
          title: "Page not found",
          text: "The page you're looking for doesn't exist or has moved.",
        }
      : {
          icon: Bug,
          code: "Error",
          title: "Something went wrong",
          text: "An unexpected error happened. Try again, or go back to the home page.",
        };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background p-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-8" />
        </span>
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {code}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{text}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft />
            Go back
          </Button>
          <Button asChild>
            <Link to="/">
              <Home />
              Home page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
