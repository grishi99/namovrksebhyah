'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const ADMIN_EMAIL = 'grishi99@gmail.com';

interface Submission {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  pan: string;
  submittedAt: Timestamp;
  screenshotUrl: string;
  transactionId: string;
  plantingOption: string;
  otherTrees: string;
  dedication: string;
  oneTreeOption: string;
  bundlePlanOption: string;
  lifetimePlanOption: string;
  totalAmount: number;
  contributionFrequency: string;
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'submissions'), orderBy('submittedAt', 'desc'));
  }, [firestore]);

  const { data: submissions, isLoading: submissionsLoading } = useCollection<Submission>(submissionsQuery);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user?.email !== ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold text-destructive">Access Denied</h1>
        <p className="mt-2">You do not have permission to view this page.</p>
        <Link href="/" className="mt-4 text-primary underline">Go to Homepage</Link>
      </div>
    );
  }

  const getAdoptionDetails = (submission: Submission) => {
    const details = [];
    if (submission.oneTreeOption) {
      details.push(`One Tree (${submission.oneTreeOption.split('-').slice(3).join(' ')})`);
    }
    if (submission.bundlePlanOption) {
      details.push(`Bundle (${submission.bundlePlanOption.split('-').slice(1).join(' ')})`);
    }
    if (submission.lifetimePlanOption) {
      details.push(`Lifetime (${submission.lifetimePlanOption.split('-').slice(1).join(' ')})`);
    }
    return details.length > 0 ? details.join(', ') : 'N/A';
  };

  const getPlantingCount = (submission: Submission) => {
    if (submission.plantingOption === 'other-planting') {
      return submission.otherTrees;
    }
    const match = submission.plantingOption.match(/(\d+)-tree/);
    return match ? match[1] : '0';
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-4 md:p-8 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard: Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissionsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Screenshot</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Planted</TableHead>
                      <TableHead>Dedicated To</TableHead>
                      <TableHead>Adopted</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Installments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions?.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{`${s.firstName} ${s.middleName} ${s.lastName}`}</TableCell>
                        <TableCell>
                          <div>{s.email}</div>
                          <div>{s.phone}</div>
                        </TableCell>
                        <TableCell>{s.pan}</TableCell>
                        <TableCell>
                          <div>{format(s.submittedAt.toDate(), 'dd/MM/yyyy')}</div>
                          <div>{format(s.submittedAt.toDate(), 'p')}</div>
                        </TableCell>
                        <TableCell>
                          <Link href={s.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            View
                          </Link>
                        </TableCell>
                        <TableCell>{s.transactionId}</TableCell>
                        <TableCell>{getPlantingCount(s)}</TableCell>
                        <TableCell>{s.dedication || 'N/A'}</TableCell>
                        <TableCell>{getAdoptionDetails(s)}</TableCell>
                        <TableCell>₹{s.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                           <Badge variant={s.contributionFrequency === 'annual' ? 'default' : 'secondary'}>
                            {s.contributionFrequency === 'annual' ? 'Yes' : 'No'}
                           </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
