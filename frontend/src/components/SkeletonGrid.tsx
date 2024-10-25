import { FC } from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SkeletonCardProps {
  count: number;
}

export const SkeletonGrid: FC<SkeletonCardProps> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="w-full flex flex-col m-3">
          <Skeleton className="rounded-t-md" style={{ height: 192 }} />
          <CardHeader>
            <Skeleton style={{ width: "80%", height: 24 }} />
            <Skeleton style={{ width: "60%", height: 18 }} />
          </CardHeader>
          <CardContent>
            <Skeleton style={{ height: 16 }} />
          </CardContent>
        </Card>
      ))}
    </>
  );
};
