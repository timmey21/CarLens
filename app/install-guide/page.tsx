import { Suspense } from "react";
import InstallGuideView from "./InstallGuideView";

export default function InstallGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-background text-muted">
          Loading...
        </div>
      }
    >
      <InstallGuideView />
    </Suspense>
  );
}
