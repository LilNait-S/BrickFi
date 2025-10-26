import { Skeleton } from "@/components/ui/skeleton"

export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen py-12">
      <div className="container space-y-8 mx-auto">
        {/* Back Button Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Skeleton */}
          <div>
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="flex gap-4 py-4 px-1">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-24 w-32 rounded-lg shrink-0" />
              ))}
            </div>
          </div>

          {/* Project Info Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-5 w-1/3" />
            </div>

            <Skeleton className="h-20 w-full" />

            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 w-24" />
            ))}
          </div>
          <div className="border rounded-lg p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
