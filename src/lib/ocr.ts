// OCR Service using Google Document AI
// Note: In production, this would call a backend API to use Google Document AI
// to avoid exposing credentials on the client side

interface OCRResult {
    text: string;
    confidence: number;
    medications: {
        name: string;
        dosage: string;
        frequency: string;
        timing: string;
        beforeAfterFood: string;
    }[];
}

// Mock OCR function - in production, this would call your backend
export const extractTextFromImage = async (imageBase64: string): Promise<OCRResult> => {
    // In a real implementation, you would send the image to your backend
    // which would use Google Document AI to process the prescription

    // For now, we'll simulate the OCR process
    // This simulates what Google Document AI would return

    const simulatedPrescriptionText = `
    Rx
    
    1. Metformin 500mg - 1 tablet twice daily after food
    2. Amlodipine 5mg - 1 tablet once daily in morning after food
    3. Atorvastatin 10mg - 1 tablet once daily at night after food
    4. Omeprazole 20mg - 1 capsule once daily in morning before food
    
    Dr. Sharma
    Reg. No: 12345
  `;

    return {
        text: simulatedPrescriptionText,
        confidence: 92,
        medications: [
            {
                name: 'Metformin 500mg',
                dosage: '1 tablet',
                frequency: 'Twice daily',
                timing: '08:00, 20:00',
                beforeAfterFood: 'after'
            },
            {
                name: 'Amlodipine 5mg',
                dosage: '1 tablet',
                frequency: 'Once daily',
                timing: '09:00',
                beforeAfterFood: 'after'
            },
            {
                name: 'Atorvastatin 10mg',
                dosage: '1 tablet',
                frequency: 'Once daily',
                timing: '21:00',
                beforeAfterFood: 'after'
            },
            {
                name: 'Omeprazole 20mg',
                dosage: '1 capsule',
                frequency: 'Once daily',
                timing: '07:00',
                beforeAfterFood: 'before'
            }
        ]
    };
};

// Real Google Document AI implementation (would be called from backend)
export const processWithGoogleDocAI = async (imageBase64: string): Promise<OCRResult> => {
    const projectId = import.meta.env.VITE_DOC_AI_PROJECT_ID;
    const location = import.meta.env.VITE_DOC_AI_LOCATION;
    const processorId = import.meta.env.VITE_DOC_AI_PROCESSOR_ID;

    if (!projectId || !processorId) {
        console.warn('Google Document AI credentials not configured, using mock');
        return extractTextFromImage(imageBase64);
    }

    // This would be a call to your backend API that uses Google Document AI
    // Direct client-side calls to Google Document AI are not recommended
    // as it would expose credentials
    const response = await fetch('/api/ocr/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: imageBase64,
            projectId,
            location,
            processorId
        })
    });

    if (!response.ok) {
        throw new Error('OCR processing failed');
    }

    return response.json();
};

// Function to upload image to storage and get URL
export const uploadPrescriptionImage = async (base64Image: string, seniorId: string): Promise<string> => {
    const { supabase } = await import('./supabase');

    // Convert base64 to blob
    const byteCharacters = atob(base64Image.split(',')[1] || base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    const fileName = `prescriptions/${seniorId}/${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, blob);

    if (error) {
        console.error('Upload error:', error);
        throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('prescriptions')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
};
