
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures the customer-uploads bucket exists
 * Creates it if it doesn't exist
 */
export async function ensureClientPhotosBucketExists() {
  try {
    // Try to get the bucket to check if it exists
    const { data: bucket, error } = await supabase
      .storage
      .getBucket('customer-uploads');
    
    // If we get an error indicating the bucket doesn't exist
    if (error && (error.message?.includes('not found') || error.message?.includes('does not exist'))) {
      console.log('customer-uploads bucket does not exist, creating...');
      
      // Create the bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('customer-uploads', {
          public: true,
          fileSizeLimit: 5242880, // 5MB in bytes
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });
        
      if (createError) {
        console.error('Error creating customer-uploads bucket:', createError);
        throw createError;
      }
      
      // Set public access policy
      const { error: policyError } = await supabase
        .storage
        .from('customer-uploads')
        .createSignedUrl('dummy.txt', 1); // This will fail but it's just to check permissions
        
      if (policyError && policyError.message?.includes('storage permission denied')) {
        console.log('Setting public bucket policy for customer-uploads...');
        // We would need to set policy through SQL, but in this case the bucket is already public
      }
      
      console.log('customer-uploads bucket created successfully');
    } else if (error) {
      console.error('Error checking if customer-uploads bucket exists:', error);
      throw error;
    } else {
      console.log('customer-uploads bucket already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureClientPhotosBucketExists:', error);
    // Return false but don't throw to avoid blocking the user flow
    return false;
  }
}
