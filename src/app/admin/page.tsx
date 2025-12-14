'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useState } from 'react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Loader2, Download, Trash } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';

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
  status?: 'pending' | 'confirmed';
  userEmail?: string;
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'submissions'), orderBy('submittedAt', 'desc'));
  }, [firestore]);

  const { data: submissions, isLoading: submissionsLoading } = useCollection<Submission>(submissionsQuery);

  // State for managing selected submissions
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);

  const handleToggleStatus = async (id: string, currentStatus?: string) => {
    if (!firestore) return;
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const submissionRef = doc(firestore, 'submissions', id);
      const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
      await updateDoc(submissionRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating submission status:", error);
      alert("Failed to update status");
    }
  };

  // Handle individual checkbox toggle
  const handleSelectSubmission = (id: string) => {
    setSelectedSubmissions(prev =>
      prev.includes(id)
        ? prev.filter(submissionId => submissionId !== id)
        : [...prev, id]
    );
  };

  // Handle select all checkbox toggle
  const handleSelectAll = () => {
    if (submissions && selectedSubmissions.length === submissions.length) {
      // Deselect all
      setSelectedSubmissions([]);
    } else {
      // Select all
      setSelectedSubmissions(submissions?.map(sub => sub.id) || []);
    }
  };

  const downloadCSV = () => {
    if (!submissions || submissions.length === 0) return;

    // CSV headers
    const headers = [
      'Status',
      'Name',
      'Email',
      'Phone',
      'Address',
      'PAN',
      'Submitted Date',
      'Submitted Time',
      'Transaction ID',
      'Transaction Type',
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
      'Total Amount',
      'Precise Amt',
      'Login Email'
    ];

    // CSV rows
    const rows = submissions.map(s => [
      s.status || 'pending',
      `${s.firstName} ${s.middleName} ${s.lastName}`.trim(),
      s.email || '',
      s.phone || '',
      s.address || '',
      s.pan || '',
      format(s.submittedAt.toDate(), 'dd/MM/yyyy'),
      format(s.submittedAt.toDate(), 'HH:mm:ss'),
      s.transactionId || '',
      s.contributionMode || '',
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
      s.totalAmount?.toString() || '0',
      s.finalContributionAmount || '',
      s.userEmail || ''
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

  // Handle deletion of selected submissions
  const handleDeleteSelected = async () => {
    if (!firestore || selectedSubmissions.length === 0) return;

    try {
      const { doc, deleteDoc } = await import('firebase/firestore');

      // Delete all selected submissions
      const deletePromises = selectedSubmissions.map(id => {
        const submissionRef = doc(firestore, 'submissions', id);
        return deleteDoc(submissionRef);
      });

      await Promise.all(deletePromises);

      // Clear selections after successful deletion
      setSelectedSubmissions([]);

      // Show success notification
      toast({
        title: "Submissions Deleted",
        description: `${selectedSubmissions.length} submission(s) have been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting submissions:", error);
      alert("Failed to delete submissions. Please try again.");
    }
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
            <div className="flex gap-2">
              <Link href="/thank-you" passHref>
                <Button variant="outline">
                  View Thank You Page
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={selectedSubmissions.length === 0}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete ({selectedSubmissions.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {selectedSubmissions.length} submission{selectedSubmissions.length !== 1 ? 's' : ''}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={downloadCSV} disabled={!submissions || submissions.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
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
                      <TableHead className="w-12">
                        <Checkbox
                          checked={submissions && selectedSubmissions.length === submissions.length && submissions.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Screenshot</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Planted</TableHead>
                      <TableHead>Dedicated To</TableHead>
                      <TableHead>Adopted</TableHead>
                      <TableHead>Donated</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Precise Amt</TableHead>
                      <TableHead>Login Email</TableHead>
                      <TableHead>Installments</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions?.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="align-middle">
                          <Checkbox
                            checked={selectedSubmissions.includes(s.id)}
                            onCheckedChange={() => handleSelectSubmission(s.id)}
                            aria-label={`Select submission ${s.id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={s.status === 'confirmed' ? 'success' : 'outline'} className={s.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'text-yellow-600 bg-yellow-50'}>
                            {s.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </Badge>
                        </TableCell>
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
                        <TableCell>{s.contributionMode}</TableCell>
                        <TableCell>{getPlantingCount(s)}</TableCell>
                        <TableCell>{s.dedication || 'N/A'}</TableCell>
                        <TableCell>{getAdoptionDetails(s)}</TableCell>
                        <TableCell>{getDonationAmount(s)}</TableCell>
                        <TableCell>₹{s.totalAmount?.toLocaleString()}</TableCell>
                        <TableCell>₹{s.finalContributionAmount}</TableCell>
                        <TableCell>{s.userEmail}</TableCell>
                        <TableCell>
                          <Badge variant={s.contributionFrequency?.startsWith('annual') ? 'default' : 'secondary'}>
                            {s.contributionFrequency === 'annual-3' ? '3 Years' : s.contributionFrequency === 'annual-5' ? '5 Years' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleToggleStatus(s.id, s.status)}
                            variant={s.status === 'confirmed' ? 'default' : 'outline'}
                            className={s.status === 'confirmed' ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-600 text-green-600 hover:bg-green-50"}
                          >
                            {s.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                          </Button>
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
