"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InterestSignup {
  name: string;
  email: string;
  phone: string;
  signedUpAt: string;
}

export default function AdminInterestPage() {
  const [password, setPassword] = useState("");
  const [signups, setSignups] = useState<InterestSignup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeader = () => `Basic ${btoa(`admin:${password}`)}`;

  const load = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/interest", {
        headers: { Authorization: authHeader() },
      });

      if (response.status === 401) {
        setError("Wrong password.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError("Could not load signups. Please try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSignups(data.signups);
    } catch {
      setError("Could not load signups. Please try again.");
    }

    setLoading(false);
  };

  const downloadCsv = async () => {
    const response = await fetch("/api/admin/interest?format=csv", {
      headers: { Authorization: authHeader() },
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "cinema-interest.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!signups) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-sm p-8">
          <form onSubmit={load} className="space-y-5">
            <div className="space-y-1">
              <h1 className="text-2xl" style={{ fontWeight: 700 }}>Cinema Interest</h1>
              <p className="text-sm text-muted-foreground">Admin access only.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Admin password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Checking…" : "View signups"}
            </Button>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl" style={{ fontWeight: 700 }}>Cinema Interest</h1>
            <p className="text-muted-foreground">
              {signups.length} {signups.length === 1 ? "person has" : "people have"} registered for winter tickets.
            </p>
          </div>

          {signups.length > 0 && (
            <Button onClick={downloadCsv}>Download CSV</Button>
          )}
        </div>

        {signups.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            No signups yet.
          </Card>
        ) : (
          <Card className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4" style={{ fontWeight: 600 }}>Name</th>
                  <th className="p-4" style={{ fontWeight: 600 }}>Email</th>
                  <th className="p-4" style={{ fontWeight: 600 }}>Mobile</th>
                  <th className="p-4" style={{ fontWeight: 600 }}>Registered</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup, i) => (
                  <tr key={`${signup.email}-${i}`} className="border-b last:border-0">
                    <td className="p-4">{signup.name}</td>
                    <td className="p-4">
                      <a href={`mailto:${signup.email}`} className="underline">{signup.email}</a>
                    </td>
                    <td className="p-4">
                      <a href={`tel:${signup.phone}`} className="underline">{signup.phone}</a>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(signup.signedUpAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </main>
  );
}
