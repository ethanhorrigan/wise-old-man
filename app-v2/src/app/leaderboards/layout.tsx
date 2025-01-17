import Link from "next/link";
import { PropsWithChildren } from "react";
import { Container } from "~/components/Container";
import { Tabs, TabsList, TabsTrigger } from "~/components/Tabs";
import { LeaderboardsFilters } from "~/components/leaderboards/LeaderboardsFilters";

export default function LeaderboardsLayout(props: PropsWithChildren) {
  const { children } = props;

  // @ts-ignore - There's no decent API from Next.js yet (as of 13.3.0)
  const routeSegment = children.props.childProp.segment;

  return (
    <Container>
      <h1 className="mb-8 text-h1 font-bold">Leaderboards</h1>
      <Tabs defaultValue={routeSegment}>
        <TabsList>
          <Link href="/leaderboards/top" prefetch={false}>
            <TabsTrigger value="top">Current Top</TabsTrigger>
          </Link>
          <Link href="/leaderboards/records" prefetch={false}>
            <TabsTrigger value="records">Records</TabsTrigger>
          </Link>
          <Link href="/leaderboards/efficiency" prefetch={false}>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      <LeaderboardsFilters />
      <div className="mx-auto mt-10 grid max-w-md grid-cols-1 gap-x-4 gap-y-8 lg:max-w-none lg:grid-cols-3">
        {children}
      </div>
    </Container>
  );
}
