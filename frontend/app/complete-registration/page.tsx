import { CompleteRegistrationForm } from "@/components/complete-registration-form";

export default function CompleteRegistration() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 md:gap-8 md:py-24">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Fin<span className="text-primary">(Ai)</span>d Hub
          </h1>
          <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
            AI-powered accounting automation for modern businesses
          </p>
        </div>
        <div className="w-full max-w-md">
          <CompleteRegistrationForm />
        </div>
      </div>
    </div>
  );
}
