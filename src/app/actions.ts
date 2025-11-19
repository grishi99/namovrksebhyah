
'use server';

import { firestore } from '@/firebase/admin';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const SubmitFormInputSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  email: z.string().email(),
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
  screenshotUrl: z.string().url(),
});

export async function submitForm(data: z.infer<typeof SubmitFormInputSchema>) {
  try {
    const validatedData = SubmitFormInputSchema.parse(data);
    const submissionId = uuidv4();

    const submissionData = {
      ...validatedData,
      submittedAt: new Date(),
    };

    await firestore.collection('submissions').doc(submissionId).set(submissionData);

    return { submissionId };
  } catch (error) {
    console.error("Error in submitForm server action: ", error);
    if (error instanceof z.ZodError) {
      return { error: "Validation failed: " + error.message };
    }
    return { error: "An unexpected error occurred on the server." };
  }
}
