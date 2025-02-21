import AccountLogin from "@/components/auth/account-login";
import CreateAccount from "@/components/auth/create-account";
import { AuthType } from "@/type/auth-type";

type AuthPageProps = {
  params: Promise<{
    type: AuthType;
  }>;
};

export default async function AuthPage({ params }: AuthPageProps) {
  const { type } = await params;

  return (
    <main className="w-full flex justify-center items-center h-full">
      <div>
        {type == "login" && <AccountLogin />}
        {type == "register" && <CreateAccount />}
      </div>
    </main>
  );
}
