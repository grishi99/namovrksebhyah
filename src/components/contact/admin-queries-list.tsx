'use client';

import { useState, useEffect } from 'react';
import { useUser, initializeFirebase } from '@/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const { firestore } = initializeFirebase();

interface ContactQuery {
    id: string;
    query: string;
    name?: string; // Added extracted name
    phoneNumber?: string;
    timestamp: any;
    userId?: string;
    userEmail?: string;
    status: 'new' | 'replied' | 'done';
}

export function AdminQueriesList() {
    const { user, isUserLoading } = useUser();
    const [queries, setQueries] = useState<ContactQuery[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || user.email !== 'grishi99@gmail.com') {
            setIsLoading(false);
            return;
        }

        const q = query(
            collection(firestore, 'contact_queries'),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedQueries: ContactQuery[] = [];
            snapshot.forEach((doc) => {
                fetchedQueries.push({ id: doc.id, ...doc.data() } as ContactQuery);
            });
            setQueries(fetchedQueries);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleStatus = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'done' ? 'new' : 'done';
            await updateDoc(doc(firestore, 'contact_queries', id), {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (isUserLoading || isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user || user.email !== 'grishi99@gmail.com') {
        return null; // Don't render anything for non-admins
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>All Queries</span>
                        <Badge variant="outline">{queries.length} Total</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Query</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No queries found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                queries.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="whitespace-nowrap font-medium">
                                            {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : 'Just now'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                {item.name ? (
                                                    <span className="font-semibold text-primary">{item.name}</span>
                                                ) : (
                                                    <span className="font-semibold text-primary">{item.userEmail || 'Guest'}</span>
                                                )}
                                                {item.name && item.userEmail && (
                                                    <span className="text-xs text-muted-foreground">{item.userEmail}</span>
                                                )}
                                                {item.phoneNumber && (
                                                    <span className="text-xs text-muted-foreground">{item.phoneNumber}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-md">
                                            {item.query}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant={item.status === 'done' ? "outline" : "default"}
                                                onClick={() => toggleStatus(item.id, item.status)}
                                                className="gap-2"
                                            >
                                                {item.status === 'done' ? (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        Done
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="h-4 w-4" />
                                                        Mark Done
                                                    </>
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
