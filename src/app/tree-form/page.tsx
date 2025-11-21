
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { UploadCloud, Loader2, MailWarning, CheckCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
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
import { useRouter } from 'next/navigation';
import { submitForm } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useDebounce } from '@/hooks/use-debounce';
import { v4 as uuidv4 } from 'uuid';


const Logo = () => (
  <div className="relative w-48 h-48 flex flex-col items-center justify-center">
    <div className="relative w-[150px] h-[150px]" data-ai-hint="logo tree">
      <Image
        src="/icon.png?v=2"
        alt="Namo Vrkshebhyah Logo"
        width={150}
        height={150}
        priority
      />
    </div>
  </div>
);

type SaveStatus = 'idle' | 'saving' | 'saved';

const SaveStatusIndicator = ({ status }: { status: SaveStatus }) => {
  if (status === 'idle') {
    return null;
  }

  return (
    <div className="flex items-center text-sm text-muted-foreground">
      {status === 'saving' && <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>}
      {status === 'saved' && <><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> All changes saved</>}
    </div>
  );
};


export default function TreeFormPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [pan, setPan] = useState('');

  const [plantingOption, setPlantingOption] = useState('');
  const [otherTrees, setOtherTrees] = useState('');
  const [dedication, setDedication] = useState('');
  const [oneTreeOption, setOneTreeOption] = useState('');
  const [bundlePlanOption, setBundlePlanOption] = useState('');
  const [lifetimePlanOption, setLifetimePlanOption] = useState('');
  const [donationOption, setDonationOption] = useState('');
  const [otherDonationAmount, setOtherDonationAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [verificationChoice, setVerificationChoice] = useState('');
  const [contributionMode, setContributionMode] = useState('');
  const [contributionFrequency, setContributionFrequency] = useState('');
  const [finalContributionAmount, setFinalContributionAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iAgree, setIAgree] = useState(false);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');


  const formState = {
    firstName, middleName, lastName, email, phone, address, city, state, country, zipCode, pan,
    plantingOption, otherTrees, dedication, oneTreeOption, bundlePlanOption,
    lifetimePlanOption, donationOption, otherDonationAmount, verificationChoice,
    contributionMode, contributionFrequency, finalContributionAmount, transactionId,
  };

  const debouncedFormState = useDebounce(formState, 2000); // Debounce for 2 seconds

  const applySavedData = (data: any) => {
    setFirstName(data.firstName || '');
    setMiddleName(data.middleName || '');
    setLastName(data.lastName || '');
    setEmail(data.email || '');
    setPhone(data.phone || '');
    setAddress(data.address || '');
    setCity(data.city || '');
    setState(data.state || '');
    setCountry(data.country || '');
    setZipCode(data.zipCode || '');
    setPan(data.pan || '');
    setPlantingOption(data.plantingOption || '');
    setOtherTrees(data.otherTrees || '');
    setDedication(data.dedication || '');
    setOneTreeOption(data.oneTreeOption || '');
    setBundlePlanOption(data.bundlePlanOption || '');
    setLifetimePlanOption(data.lifetimePlanOption || '');
    setDonationOption(data.donationOption || '');
    setOtherDonationAmount(data.otherDonationAmount || '');
    setVerificationChoice(data.verificationChoice || '');
    setContributionMode(data.contributionMode || '');
    setContributionFrequency(data.contributionFrequency || '');
    setFinalContributionAmount(data.finalContributionAmount || '');
    setTransactionId(data.transactionId || '');
  };

  // Load form data from Firestore or localStorage
  useEffect(() => {
    const loadFormData = async () => {
      if (user?.uid && firestore) {
        // 1. Try fetching from Firestore
        const draftRef = doc(firestore, `users/${user.uid}/drafts/tree-form`);
        try {
          const docSnap = await getDoc(draftRef);
          if (docSnap.exists()) {
            console.log("Loading draft from Firestore.");
            applySavedData(docSnap.data());
            setIsFormLoaded(true);
            return;
          }
        } catch (error) {
          console.error("Error fetching Firestore draft:", error);
        }

        // 2. Fallback to localStorage
        const savedData = localStorage.getItem(`treeFormData_${user.uid}`);
        if (savedData) {
          console.log("Loading draft from Local Storage.");
          applySavedData(JSON.parse(savedData));
        }
        setIsFormLoaded(true);
      }
    };
    if (!isFormLoaded) {
      loadFormData();
    }
  }, [user, firestore, isFormLoaded]);


  // Save form data to localStorage on change (instantly)
  useEffect(() => {
    if (user?.uid && isFormLoaded) {
      localStorage.setItem(`treeFormData_${user.uid}`, JSON.stringify(formState));
    }
  }, [formState, user, isFormLoaded]);

  // Save form data to Firestore on debounced change
  useEffect(() => {
    const saveToFirestore = async () => {
      if (user?.uid && firestore && isFormLoaded) {
        setSaveStatus('saving');
        const draftRef = doc(firestore, `users/${user.uid}/drafts/tree-form`);
        try {
          await setDoc(draftRef, debouncedFormState, { merge: true });
          setSaveStatus('saved');
        } catch (error) {
          console.error("Error saving draft to Firestore:", error);
          setSaveStatus('idle'); // Or show an error state
        }
      }
    }

    if (isFormLoaded && saveStatus !== 'idle') {
      saveToFirestore();
    } else if (isFormLoaded) {
      // Set to idle if no changes are being made, but only after initial load
      setSaveStatus('idle');
    }

  }, [debouncedFormState, user, firestore, isFormLoaded]);

  // Effect to change status from saved to idle to start saving again
  useEffect(() => {
    if (JSON.stringify(formState) !== JSON.stringify(debouncedFormState) && isFormLoaded) {
      setSaveStatus('idle');
    }
  }, [formState, debouncedFormState, isFormLoaded]);


  const plantingCost = otherTrees ? parseInt(otherTrees, 10) * 3000 : 0;

  const optionCosts: { [key: string]: number } = {
    '1-tree': 3000,
    '2-trees': 6000,
    '3-trees': 9000,
    '5-trees': 12500,
    'adopt-1-tree-1-year': 5000,
    'adopt-1-tree-2-years': 10000,
    'adopt-1-tree-3-years': 13500,
    'adopt-1-tree-5-years': 20000,
    'adopt-family-pack': 30000,
    'adopt-grove-pack': 50000,
    'adopt-1-tree-lifetime': 50000,
    'adopt-3-trees-lifetime': 75000,
    'adopt-5-trees-lifetime': 100000,
    '10000': 10000,
    '25000': 25000,
    '50000': 50000,
  };

  useEffect(() => {
    let sum = 0;
    if (plantingOption && plantingOption !== 'other-planting') {
      sum += optionCosts[plantingOption] || 0;
    } else if (plantingOption === 'other-planting') {
      sum += plantingCost;
    }

    if (oneTreeOption) {
      sum += optionCosts[oneTreeOption] || 0;
    }
    if (bundlePlanOption) {
      sum += optionCosts[bundlePlanOption] || 0;
    }
    if (lifetimePlanOption) {
      sum += optionCosts[lifetimePlanOption] || 0;
    }

    if (donationOption && donationOption !== 'other-donation') {
      sum += optionCosts[donationOption] || 0;
    } else if (donationOption === 'other-donation') {
      sum += otherDonationAmount ? parseInt(otherDonationAmount, 10) : 0;
    }

    setTotalAmount(sum);
  }, [plantingOption, otherTrees, oneTreeOption, bundlePlanOption, lifetimePlanOption, donationOption, otherDonationAmount, plantingCost]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isUserLoggedInAndVerified = user && (user.emailVerified || user.isAnonymous);

  if (!isUserLoggedInAndVerified && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full">
              <MailWarning className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="mt-4">Please Verify Your Email</CardTitle>
            <CardDescription>
              A verification link was sent to <strong>{user.email}</strong>. Please click the link to continue to the form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You can <Link href={`/verify-email?email=${encodeURIComponent(user.email || '')}`} className="font-medium text-primary hover:underline">resend the email</Link> if you did not receive it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRadioClick = (
    currentValue: string,
    newValue: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (currentValue === newValue) {
      setter(''); // Deselect if the same value is clicked again
    } else {
      setter(newValue);
    }
  };

  const handleOtherTreesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtherTrees(value);
    }
  };

  const handleOtherDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtherDonationAmount(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !auth || !screenshotFile || !iAgree) {
      let message = "An unknown error occurred.";
      if (!user) message = "You must be logged in to submit.";
      else if (!screenshotFile) message = "Please upload a transaction screenshot.";
      else if (!iAgree) message = "Please agree to the consent statement.";

      toast({
        variant: "destructive",
        title: "Submission Error",
        description: message,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Starting submission process...");
      console.log("User UID:", user.uid);
      console.log("User Email:", user.email);
      console.log("Email Verified:", user.emailVerified);

      // Ensure user has a fresh auth token
      const idToken = await user.getIdToken(true);
      console.log("Fresh ID token obtained");

      // 1. Upload Screenshot to Google Drive
      const submissionId = uuidv4();

      console.log(`Uploading file to Google Drive...`);
      console.log(`File size: ${screenshotFile.size} bytes`);
      console.log(`File type: ${screenshotFile.type}`);

      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', screenshotFile);
      uploadFormData.append('submissionId', submissionId);
      uploadFormData.append('userId', user.uid);

      let downloadURL: string;
      try {
        const uploadResponse = await fetch('/api/upload-to-drive', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload to Google Drive');
        }

        const uploadResult = await uploadResponse.json();
        downloadURL = uploadResult.fileUrl;
        console.log("File upload successful to Google Drive");
        console.log("File URL:", downloadURL);
      } catch (uploadError: any) {
        console.error("Google Drive upload error:", uploadError);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      // 2. Prepare Submission Data
      const combinedAddress = `${address}, ${city}, ${state}, ${country} - ${zipCode}`.trim();

      const submissionData = {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        address: combinedAddress,
        pan,
        plantingOption,
        otherTrees,
        dedication,
        oneTreeOption,
        bundlePlanOption,
        lifetimePlanOption,
        donationOption,
        otherDonationAmount,
        verificationChoice,
        contributionMode,
        contributionFrequency,
        finalContributionAmount,
        transactionId,
        screenshotURL: downloadURL,
        userId: user.uid,
        userEmail: user.email,
        submittedAt: new Date(),
        status: 'pending',
        submissionId: submissionId,
        totalAmount: totalAmount
      };

      // 3. Save to Firestore
      if (!firestore) throw new Error("Firestore not initialized");

      console.log("Writing submission to Firestore...");
      console.log("Submission ID:", submissionId);

      try {
        await setDoc(doc(firestore, 'submissions', submissionId), submissionData);
        console.log("Firestore write successful");
      } catch (firestoreError: any) {
        console.error("Firestore write error:", firestoreError);
        throw new Error(`Firestore write failed: ${firestoreError.message}`);
      }

      // 4. Clear saved form data
      try {
        const draftRef = doc(firestore, `users/${user.uid}/drafts/tree-form`);
        await setDoc(draftRef, {});
        console.log("Draft cleared from Firestore");
      } catch (cleanupError) {
        console.warn("Failed to clear cloud draft (non-critical):", cleanupError);
      }

      localStorage.removeItem(`treeFormData_${user.uid}`);
      console.log("Draft cleared from localStorage");

      toast({
        title: "Submission Successful",
        description: "Your form has been submitted successfully.",
      });

      router.push('/thank-you');

    } catch (error: any) {
      console.error("Submission error:", error);
      console.error("Error code:", error?.code);
      console.error("Error message:", error?.message);
      console.error("Full error:", JSON.stringify(error, null, 2));

      let errorMessage = error?.message || "Unknown error";

      // Provide more specific error messages
      if (error?.code === 'permission-denied') {
        errorMessage = "Permission denied. Please ensure you're logged in with a verified email.";
      } else if (error?.message?.includes('File upload failed')) {
        errorMessage = error.message;
      } else if (error?.message?.includes('Firestore write failed')) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      {!isUserLoggedInAndVerified && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
      )}
      <AuthModal isOpen={!isUserLoggedInAndVerified} onClose={() => { }} />

      <main className={`flex flex-col items-center justify-center py-12 px-4 ${!isUserLoggedInAndVerified ? 'blur-sm' : ''}`}>
        <div className="flex justify-center mb-6">
          <Logo />
        </div>


        <Card className="w-full max-w-4xl mb-8 text-center">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">Namo Vṛkṣebhyaḥ</h1>
            <Separator />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Vṛkṣāropaṇa Mahotsava</h2>
              <div className="mt-2">
                <span className="text-lg md:text-xl font-bold text-red-600">Geet Sangeet Sagar Trust</span>
                <br />
                <span className="text-lg md:text-xl text-red-600">(E-15859-Mumbai)</span>
              </div>
            </div>
            <Separator />
            <div>
              <div className="mt-4 text-sm text-muted-foreground text-left space-y-4">
                <p>Thank you for being a part of our Tree Plantation Initiative in Vraj. By planting and adopting tree(s), you are contributing to its planting, care, and maintenance. You may plant or adopt at least one, or more than one tree. Every tree will shower you with blessings and will stand as a legacy of your contribution.</p>
                <p>Your noble act will be acknowledged with an E-Certificate.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-4xl">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-center text-3xl font-bold text-primary">Tree Plantation and Adoption Form</CardTitle>
            <SaveStatusIndicator status={saveStatus} />
          </CardHeader>
          <CardContent>
            {!isFormLoaded ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <Input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No., Street Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN</Label>
                    <Input id="pan" value={pan} onChange={(e) => setPan(e.target.value)} required />
                  </div>
                </div>

                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="planting">
                    <AccordionTrigger className="text-xl font-semibold">Planting Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 space-y-4">
                        <Label className="text-lg font-semibold">I Wish to Plant (₹3000/- per tree)</Label>
                        <RadioGroup
                          value={plantingOption}
                          className="space-y-2 pt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-tree" id="plant-1-tree" onClick={() => handleRadioClick(plantingOption, '1-tree', setPlantingOption)} />
                            <Label htmlFor="plant-1-tree">1 Tree for ₹3,000/-</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2-trees" id="plant-2-trees" onClick={() => handleRadioClick(plantingOption, '2-trees', setPlantingOption)} />
                            <Label htmlFor="plant-2-trees">2 Trees for ₹6,000/-</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3-trees" id="plant-3-trees" onClick={() => handleRadioClick(plantingOption, '3-trees', setPlantingOption)} />
                            <Label htmlFor="plant-3-trees">3 Trees for ₹9,000/-</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5-trees" id="plant-5-trees" onClick={() => handleRadioClick(plantingOption, '5-trees', setPlantingOption)} />
                            <Label htmlFor="plant-5-trees">5 Trees for ₹12,500/- (16% off)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other-planting" id="plant-other" onClick={() => handleRadioClick(plantingOption, 'other-planting', setPlantingOption)} />
                            <Label htmlFor="plant-other">Other</Label>
                          </div>
                        </RadioGroup>

                        {plantingOption === 'other-planting' && (
                          <div className="space-y-4 pl-6 pt-2">
                            <Input
                              id="other-trees-count"
                              placeholder="Please type number of trees here"
                              value={otherTrees}
                              onChange={handleOtherTreesChange}
                            />
                            <div className="space-y-2">
                              <Label htmlFor="planting-cost">Cost of Planting</Label>
                              <Input id="planting-cost" value={`₹${plantingCost.toLocaleString()}/-`} readOnly />
                            </div>
                          </div>
                        )}

                        <div className="space-y-4 pt-6">
                          <Label className="font-semibold text-lg">Would you like to dedicate your planted tree(s) to someone?</Label>
                          <Textarea id="dedication-names" placeholder="Enter name(s) here" value={dedication} onChange={(e) => setDedication(e.target.value)} />
                          <p className="text-sm text-muted-foreground">
                            You may list multiple names if you have opted for more than one tree. The names you provide will be mentioned in your E-certificate.
                          </p>
                        </div>

                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="adoption">
                    <AccordionTrigger className="text-xl font-semibold">Adoption Plans</AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 space-y-6">
                        <p className="text-sm text-muted-foreground">The adopter status will be reflected in your E-certificate.</p>

                        {/* One Tree Plans */}
                        <div>
                          <h3 className="font-semibold text-lg">I wish to adopt <span className="underline">One Tree</span></h3>
                          <RadioGroup value={oneTreeOption} className="space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-1-tree-1-year" id="adopt-1-tree-1-year" onClick={() => handleRadioClick(oneTreeOption, 'adopt-1-tree-1-year', setOneTreeOption)} />
                              <Label htmlFor="adopt-1-tree-1-year">for 1 year - ₹5,000/-</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-1-tree-2-years" id="adopt-1-tree-2-years" onClick={() => handleRadioClick(oneTreeOption, 'adopt-1-tree-2-years', setOneTreeOption)} />
                              <Label htmlFor="adopt-1-tree-2-years">for 2 years - ₹10,000/-</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-1-tree-3-years" id="adopt-1-tree-3-years" onClick={() => handleRadioClick(oneTreeOption, 'adopt-1-tree-3-years', setOneTreeOption)} />
                              <Label htmlFor="adopt-1-tree-3-years">for 3 years - ₹13,500/- (10% off)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-1-tree-5-years" id="adopt-1-tree-5-years" onClick={() => handleRadioClick(oneTreeOption, 'adopt-1-tree-5-years', setOneTreeOption)} />
                              <Label htmlFor="adopt-1-tree-5-years">for 5 years - ₹20,000/- (20% off)</Label>
                            </div>
                          </RadioGroup>
                          <p className="text-sm font-medium text-primary pt-2">Adopter Status: Vṛkṣamitra (Tree Companion)</p>
                        </div>

                        {/* Bundle Plans */}
                        <div>
                          <h3 className="font-semibold text-lg">Bundle Plans</h3>
                          <RadioGroup value={bundlePlanOption} className="space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-family-pack" id="adopt-family-pack" onClick={() => handleRadioClick(bundlePlanOption, 'adopt-family-pack', setBundlePlanOption)} />
                              <Label htmlFor="adopt-family-pack">Family Pack: 3 trees for 3 years - ₹30,000/- (Save ₹15,000/-)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-grove-pack" id="adopt-grove-pack" onClick={() => handleRadioClick(bundlePlanOption, 'adopt-grove-pack', setBundlePlanOption)} />
                              <Label htmlFor="adopt-grove-pack">Grove Pack: 5 trees for 3 years - ₹50,000/- (Save ₹15,000/-)</Label>
                            </div>
                          </RadioGroup>
                          <p className="text-sm font-medium text-primary pt-2">Adopter Status: Vṛkṣa-Poṣaka (Tree Nourisher)</p>
                        </div>

                        {/* Lifetime Plans */}
                        <div>
                          <h3 className="font-semibold text-lg">Lifetime Plans</h3>
                          <RadioGroup value={lifetimePlanOption} className="space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-1-tree-lifetime" id="adopt-1-tree-lifetime" onClick={() => handleRadioClick(lifetimePlanOption, 'adopt-1-tree-lifetime', setLifetimePlanOption)} />
                              <Label htmlFor="adopt-1-tree-lifetime">1 Tree for Lifetime - ₹50,000/-</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-3-trees-lifetime" id="adopt-3-trees-lifetime" onClick={() => handleRadioClick(lifetimePlanOption, 'adopt-3-trees-lifetime', setLifetimePlanOption)} />
                              <Label htmlFor="adopt-3-trees-lifetime">3 Trees for Lifetime - ₹75,000/-</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="adopt-5-trees-lifetime" id="adopt-5-trees-lifetime" onClick={() => handleRadioClick(lifetimePlanOption, 'adopt-5-trees-lifetime', setLifetimePlanOption)} />
                              <Label htmlFor="adopt-5-trees-lifetime">5 Trees for Lifetime - ₹100,000/-</Label>
                            </div>
                          </RadioGroup>
                          <p className="text-sm font-medium text-primary pt-2">Adopter Status: Vana-Rakṣaka (Forest Protector)</p>
                        </div>

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>


                <div className="space-y-4 pt-4">
                  <Label className="text-base md:text-lg font-semibold block">I only wish to contribute towards Vṛkṣāropaṇa Mahotsava</Label>
                  <RadioGroup
                    value={donationOption}
                    className="space-y-3 pt-2"
                  >
                    <div className="flex items-center space-x-3 py-1">
                      <RadioGroupItem value="10000" id="donate-10000" onClick={() => handleRadioClick(donationOption, '10000', setDonationOption)} className="h-5 w-5" />
                      <Label htmlFor="donate-10000" className="text-base cursor-pointer">₹10,000/-</Label>
                    </div>
                    <div className="flex items-center space-x-3 py-1">
                      <RadioGroupItem value="25000" id="donate-25000" onClick={() => handleRadioClick(donationOption, '25000', setDonationOption)} className="h-5 w-5" />
                      <Label htmlFor="donate-25000" className="text-base cursor-pointer">₹25,000/-</Label>
                    </div>
                    <div className="flex items-center space-x-3 py-1">
                      <RadioGroupItem value="50000" id="donate-50000" onClick={() => handleRadioClick(donationOption, '50000', setDonationOption)} className="h-5 w-5" />
                      <Label htmlFor="donate-50000" className="text-base cursor-pointer">₹50,000/-</Label>
                    </div>
                    <div className="flex items-center space-x-3 py-1">
                      <RadioGroupItem value="other-donation" id="other-donation" onClick={() => handleRadioClick(donationOption, 'other-donation', setDonationOption)} className="h-5 w-5" />
                      <Label htmlFor="other-donation" className="text-base cursor-pointer">Other</Label>
                    </div>
                  </RadioGroup>

                  {donationOption === 'other-donation' && (
                    <div className="pl-6 pt-2">
                      <Input
                        id="other-donation-amount"
                        placeholder="Please enter donation amount"
                        value={otherDonationAmount}
                        onChange={handleOtherDonationChange}
                        className="h-12 md:h-10 text-base"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4 p-4 bg-primary/10 rounded-lg">
                  <Label htmlFor="verification-choice" className="text-base md:text-lg font-semibold block mb-2">I have chosen to Plant/Adopt/Donate</Label>
                  <select
                    id="verification-choice"
                    value={verificationChoice}
                    onChange={(e) => setVerificationChoice(e.target.value)}
                    required
                    className="flex h-12 md:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Please Select</option>
                    <option value="plant-adopt">Plant & Adopt</option>
                    <option value="only-plant">Only Plant</option>
                    <option value="only-adopt">Only Adopt</option>
                    <option value="only-donation">Only Donation</option>
                  </select>
                  <p className="text-sm text-muted-foreground pt-2">This is for verification purposes.</p>
                </div>

                <div className="space-y-4 pt-4">
                  <Label htmlFor="total-amount" className="text-base md:text-lg font-semibold">Total amount</Label>
                  <Input id="total-amount" value={`₹${totalAmount.toLocaleString()}/-`} readOnly className="text-lg md:text-xl font-bold h-12 md:h-10" />
                </div>

                <Separator className="my-8" />

                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-center text-primary">Contribution &amp; Acknowledgement</h2>
                  <div className="p-6 bg-primary/5 rounded-lg border border-primary/20 text-left">
                    <div className="space-y-1">
                      <p className="font-semibold">Contribution in favour of:</p>
                      <p className="text-lg font-bold">GEET SANGEET SAGAR TRUST</p>
                      <p><span className="font-semibold">Ac No:</span> 317402010025410</p>
                      <p><span className="font-semibold">Ac Type:</span> Savings</p>
                      <p><span className="font-semibold">Bank:</span> Union Bank of India</p>
                      <p><span className="font-semibold">Branch:</span> Kalbadevi, Mumbai</p>
                      <p><span className="font-semibold">IFSC Code:</span> UBIN0531740</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Mode of Contribution</Label>
                    <RadioGroup value={contributionMode} onValueChange={setContributionMode} className="space-y-2 pt-2" required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi">UPI</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                        <Label htmlFor="bank-transfer">Bank Transfer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-mode" id="other-mode" />
                        <Label htmlFor="other-mode">Other</Label>                    </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">What is your preferred contribution frequency?</Label>
                    <RadioGroup value={contributionFrequency} onValueChange={setContributionFrequency} className="space-y-2 pt-2" required>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time">One-Time Payment (Full Amount Now)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="annual" id="annual" />
                        <Label htmlFor="annual">Annual Payments (Yearly Installments)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-frequency" id="other-frequency" />
                        <Label htmlFor="other-frequency">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-8 pt-4">
                  <div>
                    <Label className="font-semibold text-lg">Mention the total amount you&apos;d like to contribute.</Label>
                    <div className="flex items-center space-x-2 text-sm mt-2">
                      <span>I am contributing (in total) ₹</span>
                      <Input className="w-48" placeholder="Enter amount" value={finalContributionAmount} onChange={(e) => setFinalContributionAmount(e.target.value)} required />
                      <span>towards planting/adoption/planting + adoption, OR only making a donation.</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transaction-screenshot" className="font-semibold text-lg">Screenshot of Transaction/Cheque</Label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = e.dataTransfer.files;
                        if (files && files[0]) {
                          setScreenshotFile(files[0]);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setScreenshotPreview(reader.result as string);
                          };
                          reader.readAsDataURL(files[0]);
                        }
                      }}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <div className="text-center">
                        {screenshotPreview ? (
                          <Image src={screenshotPreview} alt="Screenshot preview" width={128} height={128} className="mx-auto h-32 w-auto object-contain" />
                        ) : (
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Browse Files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transaction-id" className="font-semibold text-lg">Transaction ID/Reference ID/Cheque Details</Label>
                    <Input id="transaction-id" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold text-lg">Consent Statement: <span className="text-red-500">*</span></Label>
                    <p className="text-sm text-muted-foreground">I understand that my contribution will go towards Geet Sangeet Sagar Trust for tree plantation and maintenance, and the adoption will be valid for the chosen period.</p>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="i-agree" checked={iAgree} onCheckedChange={(checked) => setIAgree(!!checked)} required />
                      <Label htmlFor="i-agree">I Agree</Label>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" className="w-full text-lg py-6" disabled={!isUserLoggedInAndVerified || !iAgree || isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Form'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Review Your Submission</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please review your form details carefully. Once submitted, you will not be able to make any changes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Review</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>Submit</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            )}
          </CardContent>
        </Card >
      </main >
    </div >
  );
}


