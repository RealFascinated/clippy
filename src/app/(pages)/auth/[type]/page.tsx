import AuthForm from "@/components/auth-form";
import { auth, toClientAuthOptions } from "@/lib/auth";
import { AuthType } from "@/type/auth-type";

type AuthPageProps = {
  params: Promise<{
    type: AuthType;
  }>;
};

export default async function AuthPage({ params }: AuthPageProps) {
  const { type } = await params;

  return (
    <main className="w-full flex justify-center items-center h-[calc(90dvh-var(--header-height))]">
      <AuthForm
        authOptions={toClientAuthOptions(auth.options)}
        type={type}
        logo="/logo.png"
      />
    </main>
  );
}
