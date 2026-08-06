import Link from "next/link";
import { Users, UserCheck, Repeat, ShoppingCart, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  getSignupTrend,
  getActivationStats,
  getRetention,
  getUsageDepth,
  getConversionFunnel,
  getAtRiskUsers,
  getGenerationDiagnostics,
} from "~/lib/analytics/queries";
import { SignupTrendChart } from "~/components/analytics/signup-trend-chart";
import { FunnelChart } from "~/components/analytics/funnel-chart";
import { UsageDepthChart } from "~/components/analytics/usage-depth-chart";

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}

function formatDate(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

export default async function AnalyticsPage() {
  const [
    signupTrend,
    activation,
    retention,
    usageDepth,
    funnel,
    atRiskUsers,
    diagnostics,
  ] = await Promise.all([
    getSignupTrend(30),
    getActivationStats(),
    getRetention(),
    getUsageDepth(),
    getConversionFunnel(),
    getAtRiskUsers(),
    getGenerationDiagnostics(),
  ]);

  const totalFailureEvents = diagnostics.failuresByReason.reduce(
    (sum, r) => sum + r.events,
    0,
  );

  const conversionRate =
    funnel.signedUp === 0 ? 0 : funnel.purchased / funnel.signedUp;
  const d7 = retention.find((r) => r.windowDays === 7);

  const kpis = [
    { label: "Total users", value: activation.totalUsers.toLocaleString(), icon: Users },
    {
      label: "Activation rate",
      value: formatPercent(activation.activationRate),
      icon: UserCheck,
    },
    {
      label: "7-day retention",
      value: d7 ? formatPercent(d7.retentionRate) : "—",
      icon: Repeat,
    },
    {
      label: "Conversion rate",
      value: formatPercent(conversionRate),
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-gray-600">
          Signup, activation, retention and conversion — admin only.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-lg bg-purple-50 p-3">
                <Icon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Signups over time */}
      <Card>
        <CardHeader>
          <CardTitle>New signups (last 30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupTrendChart data={signupTrend} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelChart funnel={funnel} />
          </CardContent>
        </Card>

        {/* Usage depth */}
        <Card>
          <CardHeader>
            <CardTitle>Generations per user</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageDepthChart data={usageDepth} />
          </CardContent>
        </Card>
      </div>

      {/* First-run diagnostics */}
      <Card>
        <CardHeader>
          <CardTitle>First-run diagnostics</CardTitle>
          <p className="text-sm text-gray-500">
            Did users who reached the product actually try to generate — and
            what stopped them? Counts only activity since this shipped.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Users who tried</p>
              <p className="text-2xl font-bold text-gray-900">
                {diagnostics.attemptedUsers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Users who hit a failure</p>
              <p className="text-2xl font-bold text-gray-900">
                {diagnostics.failedUsers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">Total failure events</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalFailureEvents.toLocaleString()}
              </p>
            </div>
          </div>

          {diagnostics.failuresByReason.length === 0 ? (
            <p className="text-sm text-gray-500">
              No generation events recorded yet — check back after a day or two
              of live traffic.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 font-medium">Failure reason</th>
                  <th className="py-2 font-medium">Events</th>
                  <th className="py-2 font-medium">Share</th>
                </tr>
              </thead>
              <tbody>
                {diagnostics.failuresByReason.map((r) => (
                  <tr key={r.reason} className="border-b last:border-0">
                    <td className="py-2">{r.reason}</td>
                    <td className="py-2">{r.events.toLocaleString()}</td>
                    <td className="py-2 font-semibold">
                      {totalFailureEvents === 0
                        ? "—"
                        : `${((r.events / totalFailureEvents) * 100).toFixed(1)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Retention table */}
      <Card>
        <CardHeader>
          <CardTitle>Retention</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 font-medium">Window</th>
                <th className="py-2 font-medium">Eligible users</th>
                <th className="py-2 font-medium">Returned</th>
                <th className="py-2 font-medium">Retention rate</th>
              </tr>
            </thead>
            <tbody>
              {retention.map((r) => (
                <tr key={r.windowDays} className="border-b last:border-0">
                  <td className="py-2">D{r.windowDays}</td>
                  <td className="py-2">{r.eligibleUsers.toLocaleString()}</td>
                  <td className="py-2">{r.returnedUsers.toLocaleString()}</td>
                  <td className="py-2 font-semibold">
                    {formatPercent(r.retentionRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* At-risk users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-amber-500" />
            At-risk users — hit the free limit, never purchased, inactive 7+ days
          </CardTitle>
        </CardHeader>
        <CardContent>
          {atRiskUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No at-risk users right now.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2 font-medium">Email</th>
                    <th className="py-2 font-medium">Signed up</th>
                    <th className="py-2 font-medium">Hit limit</th>
                    <th className="py-2 font-medium">Last active</th>
                    <th className="py-2 font-medium">Generations</th>
                    <th className="py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {atRiskUsers.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2">{u.email}</td>
                      <td className="py-2">{formatDate(u.signedUpAt)}</td>
                      <td className="py-2">{formatDate(u.quotaHitAt)}</td>
                      <td className="py-2">
                        {u.lastActiveAt ? formatDate(u.lastActiveAt) : "—"}
                      </td>
                      <td className="py-2">{u.generations}</td>
                      <td className="py-2">
                        <Link
                          href={`/dashboard/send-email?to=${encodeURIComponent(u.email)}`}
                          className="font-medium text-purple-600 hover:text-purple-700"
                        >
                          Send email
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
