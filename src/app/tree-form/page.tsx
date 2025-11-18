
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUser } from '@/firebase';
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
import { UploadCloud } from 'lucide-react';
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


const Logo = () => (
  <div className="relative w-48 h-48 flex flex-col items-center justify-center">
    <div className="relative w-[150px] h-[150px]" data-ai-hint="logo tree">
        <Image 
            src="/icon.png?v=2"
            alt="Namo Vrkshebhyah Logo"
            width={150}
            height={150}
        />
    </div>
  </div>
);


export default function TreeFormPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [plantingOption, setPlantingOption] = useState('');
  const [otherTrees, setOtherTrees] = useState('');
  const [oneTreeOption, setOneTreeOption] = useState('');
  const [bundlePlanOption, setBundlePlanOption] = useState('');
  const [lifetimePlanOption, setLifetimePlanOption] = useState('');
  const [donationOption, setDonationOption] = useState('');
  const [otherDonationAmount, setOtherDonationAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [contributionMode, setContributionMode] = useState('');
  const [contributionFrequency, setContributionFrequency] = useState('');
  const [iAgree, setIAgree] = useState(false);


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
        <p>Loading...</p>
      </div>
    );
  }

  const isUserLoggedIn = !!user;

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the actual form submission logic,
    // like sending data to a server.
    console.log("Form submitted!");
    router.push('/thank-you');
  };


  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      {!isUserLoggedIn && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
      )}
      <AuthModal isOpen={!isUserLoggedIn} onClose={() => {}} />

      <main className={`flex flex-col items-center justify-center py-12 px-4 ${!isUserLoggedIn ? 'blur-sm' : ''}`}>
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <Card className="w-full max-w-4xl mb-8 text-center">
            <CardContent className="p-6 space-y-4">
                <h1 className="text-3xl font-bold text-primary">Namo Vṛkṣebhyaḥ</h1>
                <Separator />
                <div>
                    <h2 className="text-2xl font-bold text-primary">Vṛkṣāropaṇa Mahotsava</h2>
                    <p className="text-muted-foreground">Geet Sangeet Sagar Trust (E-15859-Mumbai)</p>
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
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-primary">Tree Plantation and Adoption Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                  <Input id="firstName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name <span className="text-red-500">*</span></Label>
                  <Input id="middleName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                  <Input id="lastName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input id="email" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number <span className="text-red-500">*</span></Label>
                  <Input id="phone" type="tel" />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                  <Input id="address" />
                  <p className="text-sm text-muted-foreground">City, State, Country, Zip Code</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN <span className="text-red-500">*</span></Label>
                  <Input id="pan" />
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
                        <Textarea id="dedication-names" placeholder="Enter name(s) here" />
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
                    <div className="p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">The adopter status will be reflected in your E-certificate.</p>
                      
                      <h3 className="font-semibold text-lg pt-2">I wish to adopt <span className="underline">One Tree</span></h3>
                      <RadioGroup value={oneTreeOption} className="space-y-2 pt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="adopt-1-tree-1-year" id="adopt-1-tree-1-year" onClick={() => handleRadioClick(oneTreeOption, 'adopt-1-tree-1-year', setOneTreeOption)}/>
                          <Label htmlFor="adopt-1-tree-1-year">for 1 year - ₹5,000/-</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="adopt-1-tree-2-years" id="adopt-1-tree-2-years" onClick={() => handleRadioClick(oneTreeOption, 'adopt-1-tree-2-years', setOneTreeOption)}/>
                          <Label htmlFor="adopt-1-tree-2-years">for 2 years - ₹10,000/-</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="adopt-1-tree-3-years" id="adopt-1-tree-3-years" onClick={() => handleRadioClick(oneTreeOption, 'adopt-1-tree-3-years', setOneTreeOption)}/>
                          <Label htmlFor="adopt-1-tree-3-years">for 3 years - ₹13,500/- (10% off)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="adopt-1-tree-5-years" id="adopt-1-tree-5-years" onClick={() => handleRadioClick(oneTreeOption, 'adopt-1-tree-5-years', setOneTreeOption)}/>
                          <Label htmlFor="adopt-1-tree-5-years">for 5 years - ₹20,000/- (20% off)</Label>
                        </div>
                      </RadioGroup>
                      <p className="text-sm font-medium text-primary pt-2">Adopter Status: Vṛkṣamitra (Tree Companion)</p>

                      <div className="pt-8">
                        <h2 className="font-bold text-xl">Term Plans</h2>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg">Bundle Plans</h3>
                        <RadioGroup value={bundlePlanOption} className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="adopt-family-pack" id="adopt-family-pack" onClick={() => handleRadioClick(bundlePlanOption, 'adopt-family-pack', setBundlePlanOption)} />
                            <Label htmlFor="adopt-family-pack">Family Pack: 3 trees for 3 years - ₹30,000/- (Save ₹15,000/-)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="adopt-grove-pack" id="adopt-grove-pack" onClick={() => handleRadioClick(bundlePlanOption, 'adopt-grove-pack', setBundlePlanOption)} />
                            <Label htmlFor="adopt-grove-pack">Grove Pack: 5 trees for 5 years - ₹50,000/- (Save ₹15,000/-)</Label>
                          </div>
                        </RadioGroup>
                        <p className="text-sm font-medium text-primary pt-2">Adopter Status: Parivāra-Poṣaka (Family Man)</p>
                      </div>

                      <div className="mt-4">
                        <h3 className="font-semibold text-lg">Lifetime Plans</h3>
                        <RadioGroup value={lifetimePlanOption} className="space-y-2 mt-2">
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
                <Label className="text-lg font-semibold">I do not wish to Plant/Adopt but would like to make a donation</Label>
                <RadioGroup 
                  value={donationOption} 
                  className="space-y-2 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10000" id="donate-10000" onClick={() => handleRadioClick(donationOption, '10000', setDonationOption)} />
                    <Label htmlFor="donate-10000">₹10,000/-</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25000" id="donate-25000" onClick={() => handleRadioClick(donationOption, '25000', setDonationOption)} />
                    <Label htmlFor="donate-25000">₹25,000/-</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50000" id="donate-50000" onClick={() => handleRadioClick(donationOption, '50000', setDonationOption)} />
                    <Label htmlFor="donate-50000">₹50,000/-</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other-donation" id="other-donation" onClick={() => handleRadioClick(donationOption, 'other-donation', setDonationOption)} />
                    <Label htmlFor="other-donation">Other</Label>
                  </div>
                </RadioGroup>

                {donationOption === 'other-donation' && (
                  <div className="pl-6 pt-2">
                    <Input 
                      id="other-donation-amount"
                      placeholder="Please enter donation amount"
                      value={otherDonationAmount}
                      onChange={handleOtherDonationChange}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 p-4 bg-primary/10 rounded-lg">
                <Label htmlFor="verification-choice" className="text-lg font-semibold">I have chosen to Plant/Adopt/Donate <span className="text-red-500">*</span></Label>
                <Select>
                  <SelectTrigger id="verification-choice">
                    <SelectValue placeholder="Please Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="please-select" disabled>Please Select</SelectItem>
                    <SelectItem value="plant-adopt">Plant &amp; Adopt</SelectItem>
                    <SelectItem value="only-plant">Only Plant</SelectItem>
                    <SelectItem value="only-adopt">Only Adopt</SelectItem>
                    <SelectItem value="only-donation">Only make a Donation</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground pt-2">This is for verification purposes.</p>
              </div>

              <div className="space-y-4 pt-4">
                <Label htmlFor="total-amount" className="text-lg font-semibold">Total amount</Label>
                <Input id="total-amount" value={`₹${totalAmount.toLocaleString()}/-`} readOnly className="text-xl font-bold" />
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
                    <p><span className="font-semibold">Branch:</span> KALBADEVI, MUMBAI</p>
                    <p><span className="font-semibold">IFSC Code:</span> UBIN0531740</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Mode of Contribution <span className="text-red-500">*</span></Label>
                  <RadioGroup value={contributionMode} onValueChange={setContributionMode} className="space-y-2 pt-2">
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
                      <Label htmlFor="other-mode">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold">What is your preferred contribution frequency? <span className="text-red-500">*</span></Label>
                   <RadioGroup value={contributionFrequency} onValueChange={setContributionFrequency} className="space-y-2 pt-2">
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
                  <Label className="font-semibold text-lg">Mention the total amount you&apos;d like to contribute. <span className="text-red-500">*</span></Label>
                  <div className="flex items-center space-x-2 text-sm mt-2">
                    <span>I am contributing (in total) ₹</span>
                    <Input className="w-48" placeholder="Enter amount" />
                    <span>towards planting/adoption/planting + adoption, OR only making a donation.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-screenshot" className="font-semibold text-lg">Screenshot of Transaction/Cheque <span className="text-red-500">*</span></Label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                        >
                          <span>Browse Files</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-id" className="font-semibold text-lg">Transaction ID/Reference ID/Cheque Details <span className="text-red-500">*</span></Label>
                  <Input id="transaction-id" />
                </div>
                
                <div className="space-y-2">
                  <Label className="font-semibold text-lg">Consent Statement: <span className="text-red-500">*</span></Label>
                  <p className="text-sm text-muted-foreground">I understand that my contribution will go towards Geet Sangeet Sagar Trust for tree plantation and maintenance, and the adoption will be valid for the chosen period.</p>
                   <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="i-agree" checked={iAgree} onCheckedChange={(checked) => setIAgree(!!checked)} />
                    <Label htmlFor="i-agree">I Agree</Label>
                  </div>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" className="w-full text-lg py-6" disabled={!isUserLoggedIn || !iAgree}>Submit Form</Button>
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
                    <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

    