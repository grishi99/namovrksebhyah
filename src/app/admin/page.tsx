'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Download } from 'lucide-react';
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
  address: string;
  submittedAt: Timestamp;
  screenshotURL?: string;
  screenshotUrl?: string; // Support both field names
  transactionId: string;
  plantingOption: string;
  otherTrees: string;
  dedication: string;
  oneTreeOption: string;
  bundlePlanOption: string;
  lifetimePlanOption: string;
  donationOption: string;
  otherDonationAmount: string;
  totalAmount: number;
  contributionMode: string;
  contributionFrequency: string;
  finalContributionAmount: string;
  verificationChoice: string;
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'submissions'), orderBy('submittedAt', 'desc'));
  }, [firestore]);

  const { data: submissions, isLoading: submissionsLoading } = useCollection<Submission>(submissionsQuery);

  const downloadCSV = () => {
    if (!submissions || submissions.length === 0) return;

    // CSV headers
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Address',
      'PAN',
      'Submitted Date',
      'Submitted Time',
      'Transaction ID',
      'Screenshot URL',
      'Planting Option',
      'Trees Planted',
      'Dedication',
      'One Tree Adoption',
      'Bundle Plan',
      'Lifetime Plan',
      'Donation Option',
      'Other Donation Amount',
      'Verification Choice',
      'Contribution Mode',
      'Contribution Frequency',
      'Final Contribution Amount',
      'Total Amount'
    ];

    // CSV rows
    const rows = submissions.map(s => [
      `${s.firstName} ${s.middleName} ${s.lastName}`.trim(),
      s.email || '',
      s.phone || '',
      s.address || '',
      s.pan || '',
      format(s.submittedAt.toDate(), 'dd/MM/yyyy'),
      format(s.submittedAt.toDate(), 'HH:mm:ss'),
      s.transactionId || '',
      s.screenshotURL || s.screenshotUrl || '',
      s.plantingOption || '',
      getPlantingCount(s),
      s.dedication || '',
      s.oneTreeOption || '',
      s.bundlePlanOption || '',
      s.lifetimePlanOption || '',
      s.donationOption || '',
      s.otherDonationAmount || '',
      s.verificationChoice || '',
      s.contributionMode || '',
      s.contributionFrequency || '',
      s.finalContributionAmount || '',
      s.totalAmount?.toString() || '0'
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      const years = submission.oneTreeOption.split('-')[3];
      details.push(`One Tree (${years} year${parseInt(years) > 1 ? 's' : ''})`);
    }
    if (submission.bundlePlanOption) {
      if (submission.bundlePlanOption === 'adopt-family-pack') {
        details.push(`Bundle (Family Pack)`);
      } else if (submission.bundlePlanOption === 'adopt-grove-pack') {
        details.push(`Bundle (Grove Pack)`);
      }
    }
    if (submission.lifetimePlanOption) {
      const trees = submission.lifetimePlanOption.split('-')[1];
      details.push(`Lifetime (${trees} tree${parseInt(trees) > 1 ? 's' : ''})`);
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

  const getDonationAmount = (submission: Submission) => {
    if (!submission.donationOption) return 'N/A';

    if (submission.donationOption === 'other-donation') {
      return submission.otherDonationAmount ? `₹${parseInt(submission.otherDonationAmount).toLocaleString()}` : 'N/A';
    }

    // For predefined donation amounts (10000, 25000, 50000)
    const amount = parseInt(submission.donationOption);
    return amount ? `₹${amount.toLocaleString()}` : 'N/A';
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="flex-grow p-4 md:p-8 mt-16">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Admin Dashboard: Submissions ({submissions?.length || 0})</CardTitle>
            <Button onClick={downloadCSV} disabled={!submissions || submissions.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </CardHeader>
          <CardContent>
            {submissionsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : submissions && submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Screenshot</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Planted</TableHead>
                      <TableHead>Dedicated To</TableHead>
                      <TableHead>Adopted</TableHead>
                      <TableHead>Donated</TableHead>
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
                        <TableCell className="max-w-xs truncate">{s.address || 'N/A'}</TableCell>
                        <TableCell>{s.pan}</TableCell>
                        <TableCell>
                          <div>{format(s.submittedAt.toDate(), 'dd/MM/yyyy')}</div>
                          <div>{format(s.submittedAt.toDate(), 'p')}</div>
                        </TableCell>
                        <TableCell>
                          <Link href={s.screenshotURL || s.screenshotUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            View
                          </Link>
                        </TableCell>
                        <TableCell>{s.transactionId}</TableCell>
                        <TableCell>{getPlantingCount(s)}</TableCell>
                        <TableCell>{s.dedication || 'N/A'}</TableCell>
                        <TableCell>{getAdoptionDetails(s)}</TableCell>
                        <TableCell>{getDonationAmount(s)}</TableCell>
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
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No submissions yet.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
