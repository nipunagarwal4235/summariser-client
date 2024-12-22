import { AppContext } from "@/context/AppContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/summariser");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/summariser");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {state === "Sign Up" ? "Create Account" : "Login"}
              </CardTitle>
              <CardDescription>
                {state === "Sign Up"
                  ? "Enter your details to signup your account"
                  : "Enter your details to login into your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmitHandler}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    {state === "Sign Up" && (
                      <>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          required
                        />
                      </>
                    )}
                    <Label htmlFor="email">Email</Label>
                    <Input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      id="password"
                      type="password"
                      required
                    />
                    <p
                      className="text-right underline cursor-pointer text-red-500"
                      onClick={() => navigate("/reset-password")}
                    >
                      Forgot Password
                    </p>
                  </div>
                  <Button type="submit" className="w-full">
                    {state}
                  </Button>
                  {state === "Sign Up" ? (
                    <p onClick={() => setState("Login")}>
                      Already have an account.{" "}
                      <span className="underline cursor-pointer text-blue-500 ">
                        Login Here
                      </span>
                    </p>
                  ) : (
                    <p onClick={() => setState("Sign Up")}>
                      Don't have an account.{" "}
                      <span className="underline cursor-pointer text-blue-500 ">
                        Sign Up Here
                      </span>
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
