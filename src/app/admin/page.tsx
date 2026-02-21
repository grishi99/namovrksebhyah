'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useState, useMemo } from 'react';

import { TopBar } from '@/components/layout/topbar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Loader2, Download, Trash, FileSpreadsheet, LayoutList } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from '@/hooks/use-toast';
import { SubmissionForm, SubmissionFormValues } from '@/components/admin/submission-form';
import { addDoc, updateDoc, doc, Timestamp, collection, query, orderBy, deleteDoc } from 'firebase/firestore';


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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummarySheet, setShowSummarySheet] = useState(false);

  const handleAddSubmission = () => {
    setEditingSubmission(null);
    setIsSheetOpen(true);
  };

  const handleEditSubmission = (submission: Submission) => {
    setEditingSubmission(submission);
    setIsSheetOpen(true);
  };

  const handleFormSubmit = async (values: SubmissionFormValues) => {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...values,
        // Convert string amount to number if needed, keeping as string for now to match interface mostly
        // but updating totalAmount to number if provided
        totalAmount: values.totalAmount ? Number(values.totalAmount) : 0,
      };

      if (editingSubmission) {
        // Update existing
        const submissionRef = doc(firestore, 'submissions', editingSubmission.id);
        await updateDoc(submissionRef, {
          ...submissionData,
          // Don't update submittedAt or id
        });
        toast({ title: "Updated", description: "Submission updated successfully" });
      } else {
        // Add new
        await addDoc(collection(firestore, 'submissions'), {
          ...submissionData,
          submittedAt: Timestamp.now(),
          userEmail: user?.email || '', // Track who added it
        });
        toast({ title: "Added", description: "New submission added successfully" });
      }
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Error saving submission:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save submission" });
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleToggleStatus = async (id: string, currentStatus?: string) => {
    if (!firestore) return;
    try {
      // Static import used instead
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
      // Static import used instead

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

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = async () => {
    if (!submissions || submissions.length === 0) return;
    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissions.map(s => ({
          ...s,
          submittedAt: s.submittedAt.toDate().toISOString()
        })))
      });

      if (!response.ok) throw new Error('Failed to sync');

      toast({
        title: "Sync Successful",
        description: `${submissions.length} submissions synced to Google Sheets.`,
      });
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Failed to sync submissions to Google Sheets.",
      });
    } finally {
      setIsSyncing(false);
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
      } else if (submission.bundlePlanOption === 'adopt-couple-pack') {
        details.push(`Bundle (Couple Pack)`);
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

  // --- Sheet 2: Aggregated Summary ---
  const getAdoptedTreeCount = (submission: Submission) => {
    let count = 0;
    if (submission.oneTreeOption) count += 1;
    if (submission.bundlePlanOption) {
      if (submission.bundlePlanOption.includes('couple')) count += 2;
      else if (submission.bundlePlanOption.includes('family')) count += 3;
      else if (submission.bundlePlanOption.includes('grove')) count += 5;
    }
    if (submission.lifetimePlanOption) {
      const match = String(submission.lifetimePlanOption).match(/adopt-(\d+)-tree/);
      count += match ? parseInt(match[1], 10) : 1;
    }
    return count;
  };

  const getPlantingCountNum = (submission: Submission) => {
    if (submission.plantingOption === 'other-planting' && submission.otherTrees) {
      return parseInt(submission.otherTrees, 10) || 0;
    }
    const match = submission.plantingOption?.match(/(\d+)-tree/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const getFullContribution = (submission: Submission) => {
    const perInstallment = submission.totalAmount || 0;
    if (submission.contributionFrequency === 'annual-3') return perInstallment * 3;
    if (submission.contributionFrequency === 'annual-5') return perInstallment * 5;
    return perInstallment;
  };

  // 0 = Vṛkṣamitra, 1 = Vṛkṣa-Poṣaka, 2 = Vana-Rakṣaka
  const getDesignationTier = (submission: Submission) => {
    if (submission.lifetimePlanOption) return 2;
    if (submission.bundlePlanOption) return 1;
    return 0;
  };

  const DESIGNATION_LABELS = [
    'Vṛkṣamitra (Tree Companion)',
    'Vṛkṣa-Poṣaka (Tree Nourisher)',
    'Vana-Rakṣaka (Forest Protector)',
  ];

  interface AggregatedPerson {
    fullName: string;
    totalContribution: number;
    dedications: string[];
    totalPlanted: number;
    totalAdopted: number;
    designationTier: number;
  }

  const aggregatedData = useMemo(() => {
    if (!submissions || submissions.length === 0) return [];
    const map = new Map<string, AggregatedPerson>();

    for (const s of submissions) {
      const key = `${s.firstName} ${s.middleName} ${s.lastName}`.replace(/\s+/g, ' ').trim().toLowerCase();
      const displayName = `${s.firstName} ${s.middleName} ${s.lastName}`.replace(/\s+/g, ' ').trim();

      if (!map.has(key)) {
        map.set(key, {
          fullName: displayName,
          totalContribution: 0,
          dedications: [],
          totalPlanted: 0,
          totalAdopted: 0,
          designationTier: 0,
        });
      }

      const person = map.get(key)!;
      person.totalContribution += getFullContribution(s);
      person.totalPlanted += getPlantingCountNum(s);
      person.totalAdopted += getAdoptedTreeCount(s);
      person.designationTier = Math.max(person.designationTier, getDesignationTier(s));

      if (s.dedication && s.dedication.trim() && !person.dedications.includes(s.dedication.trim())) {
        person.dedications.push(s.dedication.trim());
      }
    }

    return Array.from(map.values());
  }, [submissions]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="flex-grow p-4 md:p-8 mt-16">
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle>Admin Dashboard: Submissions ({submissions?.length || 0})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddSubmission}>
                + Add Manual
              </Button>

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

              <Button variant="outline" asChild>
                <a
                  href={process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
                    ? `https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID}/edit`
                    : "https://docs.google.com/spreadsheets"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Google Sheet{!process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ? ' (ID Missing)' : ''}</span>
                </a>
              </Button>

              <Button variant="secondary" onClick={handleSyncAll} disabled={isSyncing || !submissions || submissions.length === 0}>
                {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sync All
              </Button>

              <Button onClick={downloadCSV} disabled={!submissions || submissions.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>

              <Button
                variant={showSummarySheet ? 'default' : 'outline'}
                onClick={() => setShowSummarySheet(prev => !prev)}
              >
                <LayoutList className="mr-2 h-4 w-4" />
                {showSummarySheet ? 'Main Sheet' : 'Summary Sheet'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {submissionsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : showSummarySheet ? (
              /* ====== SHEET 2: AGGREGATED SUMMARY ====== */
              aggregatedData.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Total Contribution</TableHead>
                        <TableHead>Dedicated To</TableHead>
                        <TableHead>Total Planted</TableHead>
                        <TableHead>Total Adopted</TableHead>
                        <TableHead>Designation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aggregatedData.map((person, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{person.fullName}</TableCell>
                          <TableCell>₹{person.totalContribution.toLocaleString('en-IN')}</TableCell>
                          <TableCell>{person.dedications.length > 0 ? person.dedications.join(', ') : 'N/A'}</TableCell>
                          <TableCell>{person.totalPlanted}</TableCell>
                          <TableCell>{person.totalAdopted}</TableCell>
                          <TableCell>
                            <Badge
                              variant="default"
                              className={
                                person.designationTier === 2
                                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                                  : person.designationTier === 1
                                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                    : 'bg-green-100 text-green-800 hover:bg-green-100'
                              }
                            >
                              {DESIGNATION_LABELS[person.designationTier]}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Summary totals for Sheet 2 */}
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                      <div className="p-3">
                        <div className="text-2xl font-bold text-primary">{aggregatedData.length}</div>
                        <div className="text-sm text-gray-600">Total People</div>
                      </div>
                      <div className="p-3">
                        <div className="text-2xl font-bold text-green-600">
                          {aggregatedData.reduce((t, p) => t + p.totalPlanted, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Trees Planted</div>
                      </div>
                      <div className="p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {aggregatedData.reduce((t, p) => t + p.totalAdopted, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Trees Adopted</div>
                      </div>
                      <div className="p-3">
                        <div className="text-2xl font-bold text-purple-600">
                          ₹{aggregatedData.reduce((t, p) => t + p.totalContribution, 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-600">Total Contribution</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No submissions yet.
                </div>
              )
            ) : submissions && submissions.length > 0 ? (
              /* ====== SHEET 1: MAIN TABLE (existing) ====== */
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={submissions ? selectedSubmissions.length === submissions.length && submissions.length > 0 : false}
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
                          <Badge variant={s.status === 'confirmed' ? 'default' : 'outline'} className={s.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'text-yellow-600 bg-yellow-50 hover:bg-yellow-50'}>
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
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEditSubmission(s)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleToggleStatus(s.id, s.status)}
                              variant={s.status === 'confirmed' ? 'default' : 'outline'}
                              className={s.status === 'confirmed' ? "bg-green-600 hover:bg-green-700 text-white" : "border-green-600 text-green-600 hover:bg-green-50"}
                            >
                              {s.status === 'confirmed' ? 'Confirmed' : 'Confirm'}
                            </Button>
                          </div>

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Summary Statistics */}
                {submissions && submissions.length > 0 && (
                  <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-3">
                        <div className="text-2xl font-bold text-green-600">
                          {submissions.filter(s => s.status === 'confirmed').reduce((total, s) => {
                            let count = 0;
                            if (s.plantingOption === 'other-planting' && s.otherTrees) {
                              count = parseInt(s.otherTrees, 10) || 0;
                            } else if (s.plantingOption) {
                              const match = s.plantingOption.match(/(\d+)/);
                              if (match) {
                                count = parseInt(match[1], 10);
                              }
                            }
                            return total + count;
                          }, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Trees Planted</div>
                      </div>

                      <div className="p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {submissions.filter(s => s.status === 'confirmed').reduce((total, s) => {
                            let count = 0;

                            // Bundle Plans
                            if (s.bundlePlanOption) {
                              if (s.bundlePlanOption.includes('couple')) count += 2;
                              else if (s.bundlePlanOption.includes('family')) count += 3;
                              else if (s.bundlePlanOption.includes('grove')) count += 5;
                              else {
                                const match = String(s.bundlePlanOption).match(/(\d+)/);
                                if (match) count += parseInt(match[1], 10);
                              }
                            }

                            // One Tree Options
                            if (s.oneTreeOption) {
                              const match = String(s.oneTreeOption).match(/(\d+)/);
                              count += match ? parseInt(match[1], 10) : 1;
                            }

                            // Lifetime Plans
                            if (s.lifetimePlanOption) {
                              const match = String(s.lifetimePlanOption).match(/(\d+)/);
                              count += match ? parseInt(match[1], 10) : 1;
                            }

                            return total + count;
                          }, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Trees Adopted</div>
                      </div>

                      <div className="p-3">
                        <div className="text-2xl font-bold text-purple-600">
                          ₹{submissions.filter(s => s.status === 'confirmed').reduce((total, s) => {
                            // Strip non-numeric characters except decimal point
                            const amountVal = s.finalContributionAmount || s.totalAmount || 0;
                            const cleanAmount = String(amountVal).replace(/[^0-9.]/g, '') || '0';
                            const amount = parseFloat(cleanAmount) || 0;
                            return total + amount;
                          }, 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-600">Amount Collected</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No submissions yet.
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{editingSubmission ? 'Edit Submission' : 'Add New Submission'}</SheetTitle>
            <SheetDescription>
              {editingSubmission ? 'Make changes to the submission details below.' : 'Fill in the details for the new manual submission.'}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <SubmissionForm
              defaultValues={editingSubmission ? {
                firstName: editingSubmission.firstName,
                middleName: editingSubmission.middleName,
                lastName: editingSubmission.lastName,
                email: editingSubmission.email,
                phone: editingSubmission.phone,
                pan: editingSubmission.pan,
                address: editingSubmission.address,
                transactionId: editingSubmission.transactionId,
                contributionMode: editingSubmission.contributionMode,
                contributionFrequency: editingSubmission.contributionFrequency,
                plantingOption: editingSubmission.plantingOption,
                otherTrees: editingSubmission.otherTrees,
                oneTreeOption: editingSubmission.oneTreeOption,
                bundlePlanOption: editingSubmission.bundlePlanOption,
                lifetimePlanOption: editingSubmission.lifetimePlanOption,
                donationOption: editingSubmission.donationOption,
                otherDonationAmount: editingSubmission.otherDonationAmount,
                dedication: editingSubmission.dedication,
                totalAmount: editingSubmission.totalAmount?.toString(),
                finalContributionAmount: editingSubmission.finalContributionAmount,
                status: editingSubmission.status,
                screenshotURL: editingSubmission.screenshotURL || editingSubmission.screenshotUrl,
              } : undefined}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>

  );
}
