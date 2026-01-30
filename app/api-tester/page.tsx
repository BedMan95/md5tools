import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APITester } from "@/APITester";

export default function APITesterPage() {
  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader className="gap-4">
          <CardTitle className="text-3xl font-bold">MD5 API Tester</CardTitle>
          <CardDescription>Test the MD5 reverse lookup API endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          <APITester />
        </CardContent>
      </Card>
    </div>
  );
}
