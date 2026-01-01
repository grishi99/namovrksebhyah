'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const submissionSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    pan: z.string().optional(),
    address: z.string().optional(),
    transactionId: z.string().optional(),
    contributionMode: z.string().min(1, 'Contribution mode is required'),
    contributionFrequency: z.string().min(1, 'Frequency is required'),
    plantingOption: z.string().optional(),
    otherTrees: z.string().optional(),
    oneTreeOption: z.string().optional(),
    bundlePlanOption: z.string().optional(),
    lifetimePlanOption: z.string().optional(),
    donationOption: z.string().optional(),
    otherDonationAmount: z.string().optional(),
    dedication: z.string().optional(),
    totalAmount: z.string().optional(), // Treating as string for input, convert to number on submit if needed
    finalContributionAmount: z.string().min(1, 'Final contribution amount is required'),
    status: z.enum(['pending', 'confirmed']),
    screenshotURL: z.string().optional(),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface SubmissionFormProps {
    defaultValues?: Partial<SubmissionFormValues>;
    onSubmit: (values: SubmissionFormValues) => Promise<void>;
    isSubmitting?: boolean;
}

export function SubmissionForm({ defaultValues, onSubmit, isSubmitting }: SubmissionFormProps) {
    const form = useForm<SubmissionFormValues>({
        resolver: zodResolver(submissionSchema),
        defaultValues: {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            phone: '',
            pan: '',
            address: '',
            transactionId: '',
            contributionMode: 'upi',
            contributionFrequency: 'one-time',
            plantingOption: '',
            otherTrees: '',
            oneTreeOption: '',
            bundlePlanOption: '',
            lifetimePlanOption: '',
            donationOption: '',
            otherDonationAmount: '',
            dedication: '',
            totalAmount: '',
            finalContributionAmount: '',
            status: 'pending',
            screenshotURL: '',
            ...defaultValues,
        },
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                ...defaultValues,
            });
        }
    }, [defaultValues, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Middle Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@example.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Phone Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="pan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PAN (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="PAN Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Contribution Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="finalContributionAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Final Amount (₹)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Amount" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="totalAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Calculated Amount (₹)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Total Amount" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <FormField
                            control={form.control}
                            name="contributionMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mode</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="upi">UPI</SelectItem>
                                            <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="mt-2">
                        <FormField
                            control={form.control}
                            name="transactionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Transaction ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Keeping other fields simpler for now as text inputs, can be improved later */}
                <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Planting/Adoption Details</h3>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="plantingOption"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Planting Option</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 5-tree, other-planting" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch('plantingOption') === 'other-planting' && (
                            <FormField
                                control={form.control}
                                name="otherTrees"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Other Trees Count</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Number of trees" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="dedication"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dedication</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Dedication details" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Submission'
                    )}
                </Button>
            </form>
        </Form>
    );
}
