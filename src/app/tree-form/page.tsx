'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function TreeFormPage() {
  const { user, isUserLoading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [plantingOption, setPlantingOption] = useState('');
  const [otherTrees, setOtherTrees] = useState('');
  const [oneTreeOption, setOneTreeOption] = useState('');
  const [bundlePlanOption, setBundlePlanOption] = useState('');
  const [lifetimePlanOption, setLifetimePlanOption] = useState('');
  const [donationOption, setDonationOption] = useState('');
  const [otherDonationAmount, setOtherDonationAmount] = useState('');

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
  
  const plantingCost = otherTrees ? parseInt(otherTrees, 10) * 3000 : 0;

  const handleOtherDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtherDonationAmount(value);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      {!isUserLoggedIn && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
      )}
      <AuthModal isOpen={!isUserLoggedIn} onClose={() => {}} />

      <main className={`flex flex-col items-center justify-center py-24 px-4 ${!isUserLoggedIn ? 'blur-sm' : ''}`}>
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-primary">Tree Plantation and Adoption Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input id="phone" type="tel" />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" />
                  <p className="text-sm text-muted-foreground">City, State, Country, Zip Code</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input id="pan" />
                </div>
              </div>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="planting">
                  <AccordionTrigger className="text-xl font-semibold">Planting Options</AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 space-y-4">
                      <Label className="font-semibold">I Wish to Plant (₹3000/- per tree)</Label>
                      <RadioGroup 
                        value={plantingOption}
                        onValueChange={setPlantingOption}
                        className="space-y-2 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1-tree" id="plant-1-tree" onClick={() => handleRadioClick(plantingOption, '1-tree', setPlantingOption)} />
                          <Label htmlFor="plant-1-tree">1 Tree for ₹3000/-</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2-trees" id="plant-2-trees" onClick={() => handleRadioClick(plantingOption, '2-trees', setPlantingOption)} />
                          <Label htmlFor="plant-2-trees">2 Trees for ₹6000/-</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem value="3-trees" id="plant-3-trees" onClick={() => handleRadioClick(plantingOption, '3-trees', setPlantingOption)} />
                           <Label htmlFor="plant-3-trees">3 Trees for ₹9000/-</Label>
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
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="adoption">
                  <AccordionTrigger className="text-xl font-semibold">Adoption Plans</AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">There are three plans available. The adopter status will be reflected in your E-certificate.</p>
                      
                      <h3 className="font-semibold text-lg pt-2">I wish to adopt <span className="underline">One Tree</span></h3>
                      <RadioGroup value={oneTreeOption} onValueChange={setOneTreeOption} className="space-y-2 pt-2">
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

                      <div className="pt-4">
                        <h2 className="font-bold text-xl">Term Plans</h2>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg">Bundle Plans</h3>
                        <RadioGroup value={bundlePlanOption} onValueChange={setBundlePlanOption} className="space-y-2 mt-2">
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
                        <RadioGroup value={lifetimePlanOption} onValueChange={setLifetimePlanOption} className="space-y-2 mt-2">
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
                  onValueChange={setDonationOption}
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

              <Button type="submit" className="w-full text-lg py-6" disabled={!isUserLoggedIn}>Submit Form</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
