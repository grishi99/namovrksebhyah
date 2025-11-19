/**
 * @fileOverview A Genkit flow for handling tree plantation form submissions.
 *
 * - submitForm - A function that processes the form data, uploads a screenshot to Firebase Storage,
 *   and saves the submission details to Firestore.
 * - SubmitFormInput - The input type for the submitForm function.
 * - SubmitFormOutput - The return type for the submitForm function.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { firestore, storage } from '@/firebase/admin';
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
  screenshotDataUri: z.string().describe(
    "A screenshot of the transaction, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type SubmitFormInput = z.infer<typeof SubmitFormInputSchema>;

const SubmitFormOutputSchema = z.object({
  submissionId: z.string(),
  downloadUrl: z.string(),
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
    const { screenshotDataUri, userId, ...formData } = input;

    // Extract image data and mimetype from data URI
    const match = screenshotDataUri.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new Error('Invalid data URI for screenshot.');
    }
    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    const submissionId = uuidv4();
    const fileName = `transaction_${submissionId}.png`;
    const filePath = `submissions/${userId}/${submissionId}/${fileName}`;
    const bucket = storage.bucket();
    const file = bucket.file(filePath);

    // Upload the image to Firebase Storage
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    // Generate a long-lived signed URL for the file.
    const [downloadUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2100', // Set a far-future expiration date
    });

    // Prepare data for Firestore
    const submissionData = {
      ...formData,
      userId,
      screenshotUrl: downloadUrl,
      submittedAt: new Date(),
    };

    // Save the form data to Firestore
    const submissionRef = firestore.collection('submissions').doc(submissionId);
    await submissionRef.set(submissionData);

    return {
      submissionId,
      downloadUrl,
    };
  }
);
