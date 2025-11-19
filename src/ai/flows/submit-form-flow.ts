
/**
 * @fileOverview A Genkit flow for handling tree plantation form submissions.
 *
 * - submitForm - A function that processes the form data and saves the submission details to Firestore.
 * - SubmitFormInput - The input type for the submitForm function.
 * - SubmitFormOutput - The return type for the submitForm function.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { firestore } from '@/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

const SubmitFormInputSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  pan: z.string(),
  plantingOption: z.string().optional(),
  otherTrees: z.string().optional(),
  dedication: z.string().optional(),
  oneTreeOption: z.string().optional(),
  bundlePlanOption: z.string().optional(),
  lifetimePlanOption: z.string().optional(),
  donationOption: z.string().optional(),
  otherDonationAmount: z.string().optional(),
  verificationChoice: z.string(),
  totalAmount: z.number(),
  contributionMode: z.string(),
  contributionFrequency: z.string(),
  finalContributionAmount: z.string(),
  transactionId: z.string(),
  screenshotUrl: z.string().describe("A public URL to the screenshot of the transaction."),
});
export type SubmitFormInput = z.infer<typeof SubmitFormInputSchema>;

const SubmitFormOutputSchema = z.object({
  submissionId: z.string(),
});
export type SubmitFormOutput = z.infer<typeof SubmitFormOutputSchema>;

export async function submitForm(input: SubmitFormInput): Promise<SubmitFormOutput> {
  return submitFormFlow(input);
}

const submitFormFlow = ai.defineFlow(
  {
    name: 'submitFormFlow',
    inputSchema: SubmitFormInputSchema,
    outputSchema: SubmitFormOutputSchema,
  },
  async (input) => {
    const submissionId = uuidv4();

    // Prepare data for Firestore
    const submissionData = {
      ...input,
      submittedAt: new Date(),
    };

    // Save the form data to Firestore
    const submissionRef = firestore.collection('submissions').doc(submissionId);
    await submissionRef.set(submissionData);

    return {
      submissionId,
    };
  }
);

    