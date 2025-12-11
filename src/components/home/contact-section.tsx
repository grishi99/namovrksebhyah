'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, serverTimestamp, query as firestoreQuery, where, getDocs, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { useUser } from '@/firebase';

const { firestore } = initializeFirebase();

export function ContactSection() {
    const [query, setQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hidden state for user details
    const [userData, setUserData] = useState({
        name: '',
        phoneNumber: ''
    });

    const { toast } = useToast();
    const { user } = useUser();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            try {
                // Try to get data from tree form submission
                const q = firestoreQuery(
                    collection(firestore, 'submissions'),
                    where('userId', '==', user.uid),
                    limit(1)
                );

                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
                    setUserData({
                        name: fullName,
                        phoneNumber: data.phone || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [user]);

    const handleSubmit = async () => {
        if (!query.trim()) {
            toast({
                title: "Error",
                description: "Please enter a query.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'contact_queries'), {
                query: query.trim(),
                name: userData.name,       // Extracted name
                phoneNumber: userData.phoneNumber, // Extracted phone (or empty)
                timestamp: serverTimestamp(),
                userId: user?.uid || null,
                userEmail: user?.email || null,
                status: 'new'
            });

            toast({
                title: "Query Submitted",
                description: "You will be contacted soon via e-mail.",
            });
            setQuery('');
        } catch (error) {
            console.error("Error submitting query:", error);
            toast({
                title: "Error",
                description: "Failed to submit query. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="w-full py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl font-bold font-headline text-primary">Contact Us</h2>

                    <div className="flex flex-col items-center gap-2 text-lg">
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            <a href="mailto:95gsst@gmail.com" className="hover:text-primary transition-colors font-medium">
                                95gsst@gmail.com
                            </a>
                        </div>
                        {/* Phone number intentionally left blank as per request */}
                    </div>

                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle className="text-xl">Have a question? Write to us.</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <Textarea
                                placeholder="Type your query here..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="min-h-[120px]"
                            />
                            <Button
                                onClick={handleSubmit}
                                className="w-full md:w-auto px-8"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Query"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
