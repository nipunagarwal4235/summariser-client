import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const navigate = useNavigate();

  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedIn(false);
      data.success && setUserData(null);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="p-2 sm:p-4 flex justify-end">
      <div className="space-x-2">
        {userData ? (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>
                    {userData.name[0].toUpperCase()}
                  </AvatarFallback>
                  <span className="sr-only">Toggle user menu</span>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem className="font-bold text-lg">
                  {userData.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!userData.isAccountVerified && (
                  <DropdownMenuItem asChild>
                    <Button
                      variant="outline"
                      onClick={sendVerificationOtp}
                      className="block w-full text-left"
                    >
                      Verify Email
                    </Button>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="block w-full text-left"
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm sm:size-default"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
