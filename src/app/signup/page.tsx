import { SignUpForm } from '@/components/auth/SignUpForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
