import { Heart } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-md shadow-blue-200">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          CareSphere
        </h1>
        <p className="text-sm text-slate-500">
          Rural Healthcare, Reimagined
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
