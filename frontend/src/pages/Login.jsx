import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  Eye,
  EyeOff,
  KanbanSquare,
  Loader2,
  Lock,
  BookOpen,
  User,
  AlertCircle,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { AuthProvider } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const FEATURES = [
  {
    icon: KanbanSquare,
    title: "Shift task board",
    text: "Track tickets and hand over open work between shifts.",
  },
  {
    icon: Calculator,
    title: "Trading calculators",
    text: "Pip value, PnL, margin and swap with live exchange rates.",
  },
  {
    icon: BookOpen,
    title: "Guides & releases",
    text: "Internal how-tos and new features in one place.",
  },
];

// The backend sends { errors: [{ message }] } for failed logins, e.g.
// "Invalid credentials." or "Your account is inactive. Please contact admin."
const getLoginError = (error) => {
  if (!error) return null;
  if (!error.response) return "Can't reach the server. Please try again.";
  return (
    error.response.data?.errors?.[0]?.message ??
    "Couldn't sign in. Please try again."
  );
};

const Brand = ({ className = "" }) => (
  <span className={`font-extrabold tracking-tight ${className}`}>
    <span className="opacity-70">CS</span>Board
  </span>
);

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading, loginLoading, error, login, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/");
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    await login(username.trim(), password);
  };

  const errorMessage = getLoginError(error);

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Brand panel — large screens only */}
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-primary-foreground/10 blur-3xl"
        />

        <Brand className="relative text-2xl" />

        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight">
              Everything your support shift needs, in one place.
            </h1>
            <p className="text-primary-foreground/80">
              Sign in with the account your administrator created for you.
            </p>
          </div>

          <ul className="space-y-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-primary-foreground/75">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} CSBoard
        </p>
      </aside>

      {/* Sign-in form */}
      <main className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <Brand className="block text-center text-3xl text-primary lg:hidden" />

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your username and password to continue.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
                <InputGroupInput
                  id="username"
                  name="username"
                  type="text"
                  placeholder="e.g. john.doe"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-invalid={!!errorMessage}
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputGroup className="h-11">
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errorMessage}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full text-base"
              disabled={loginLoading || !username.trim() || !password}
            >
              {loginLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Forgot your password? Ask an administrator to reset it.
          </p>
        </div>
      </main>
    </div>
  );
};

// The login page has its own AuthProvider (it sits outside the app layout).
const Login = () => {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
};

export default Login;
