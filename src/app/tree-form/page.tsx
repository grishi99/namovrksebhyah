'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';

export default function TreeFormPage() {
  const { user, isUserLoading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const isUserLoggedIn = !!user;

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

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="planting">
                  <AccordionTrigger className="text-xl font-semibold">Planting Options</AccordionTrigger>
                  <AccordionContent>
                    <RadioGroup defaultValue="1-tree" className="space-y-2 p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-tree" id="1-tree" />
                        <Label htmlFor="1-tree">1 Tree</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3-trees" id="3-trees" />
                        <Label htmlFor="3-trees">3 Trees</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5-trees" id="5-trees" />
                        <Label htmlFor="5-trees">5 Trees</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-planting" id="other-planting" />
                        <Label htmlFor="other-planting">Other</Label>
                      </div>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="adoption">
                  <AccordionTrigger className="text-xl font-semibold">Adoption Plans</AccordionTrigger>
                  <AccordionContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-lg">I wish to adopt 1 tree</h3>
                    <RadioGroup className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-tree-1-year" id="1-tree-1-year" />
                        <Label htmlFor="1-tree-1-year">1 Tree for 1 year - ₹5,000</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-tree-3-years" id="1-tree-3-years" />
                        <Label htmlFor="1-tree-3-years">1 Tree for 3 years - ₹13,500 (10% off)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-tree-5-years" id="1-tree-5-years" />
                        <Label htmlFor="1-tree-5-years">1 Tree for 5 years - ₹20,000 (20% off)</Label>
                      </div>
                    </RadioGroup>

                    <h3 className="font-semibold text-lg mt-4">Bundle Plans</h3>
                     <RadioGroup className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="family-pack" id="family-pack" />
                        <Label htmlFor="family-pack">Family Pack: 3 trees for 3 years - ₹30,000 (Save ₹15,000)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="grove-pack" id="grove-pack" />
                        <Label htmlFor="grove-pack">Grove Pack: 5 trees for 5 years - ₹50,000 (Save ₹15,000)</Label>
                      </div>
                    </RadioGroup>

                    <h3 className="font-semibold text-lg mt-4">Lifetime Plans</h3>
                     <RadioGroup className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-tree-lifetime" id="1-tree-lifetime" />
                        <Label htmlFor="1-tree-lifetime">1 Tree for Lifetime - ₹50,000</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3-trees-lifetime" id="3-trees-lifetime" />
                        <Label htmlFor="3-trees-lifetime">3 Trees for Lifetime - ₹75,000</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5-trees-lifetime" id="5-trees-lifetime" />
                        <Label htmlFor="5-trees-lifetime">5 Trees for Lifetime - ₹100,000</Label>
                      </div>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button type="submit" className="w-full text-lg py-6" disabled={!isUserLoggedIn}>Submit Form</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
