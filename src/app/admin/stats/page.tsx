'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { TopBar } from '@/components/layout/topbar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Loader2, Share2 } from 'lucide-react';

interface ShareEventData {
    id: string;
    userId?: string;
    userEmail?: string;
    platform: string;
    location: string;
    timestamp: any;
}

export default function AdminStatsPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [events, setEvents] = useState<ShareEventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        if (!isUserLoading && (!user || user.email !== 'grishi99@gmail.com')) {
            router.push('/');
        }
    }, [user, isUserLoading, router]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!firestore || !user || user.email !== 'grishi99@gmail.com') return;

            try {
                const q = query(collection(firestore, 'share_events'), orderBy('timestamp', 'desc'), limit(100));
                const snapshot = await getDocs(q);

                const fetchedEvents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as ShareEventData));

                setEvents(fetchedEvents);

                // Calculate stats
                const newStats: { [key: string]: number } = {};
                fetchedEvents.forEach(event => {
                    newStats[event.platform] = (newStats[event.platform] || 0) + 1;
                });
                setStats(newStats);

            } catch (error) {
                console.error("Error fetching share stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [firestore, user]);

    if (isUserLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user || user.email !== 'grishi99@gmail.com') return null;

    return (
        <div className="min-h-screen bg-background font-body">
            <TopBar />
            <Header />
            <div className="container mx-auto py-10 pt-24 px-4">
                <h1 className="text-3xl font-bold mb-8">Share Analytics</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
                            <Share2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{events.length}</div>
                            <p className="text-xs text-muted-foreground">Most recent 100 events</p>
                        </CardContent>
                    </Card>
                    {Object.entries(stats).map(([platform, count]) => (
                        <Card key={platform}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium capitalize">{platform.replace('_', ' ')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Share Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Location</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell>
                                            {event.timestamp?.toDate ? event.timestamp.toDate().toLocaleString() : 'Just now'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{event.userEmail || 'Guest'}</span>
                                                <span className="text-xs text-muted-foreground">{event.userId || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="capitalize">{event.platform.replace('_', ' ')}</TableCell>
                                        <TableCell className="capitalize">{event.location.replace('_', ' ')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
