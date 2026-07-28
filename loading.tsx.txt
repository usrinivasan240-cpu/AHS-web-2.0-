import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4">
        <div className="container mx-auto">
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <Skeleton className="h-16 w-64 mx-auto" />
            <Skeleton className="h-6 w-full mx-auto" />
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[600px] rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
