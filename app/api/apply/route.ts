import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';
import { supabaseAdmin } from "@/utils/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ProCon {
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: number;
  features: string[];
}

interface FormData {
  email: string;
  name: string;
  description: string;
  category: string;
  logo: string | null;  // Base64 string
  screenshots: string[];
  rating: number;
  verdict: string;
  url: string;
  pros: ProCon[];
  cons: ProCon[];
  bestFor: string[];
  lessGoodFor: string[];
  features: string[];
  pricingTiers: PricingTier[];
}

const MAX_SCREENSHOTS = 10;

// Helper function to upload base64-encoded images to Supabase
const uploadBase64Image = async (base64Data: string, path: string) => {
  if (!base64Data) {
    throw new Error('Base64 data is undefined or null');
  }
  
  const base64Content = base64Data.split(';base64,').pop();
  
  if (!base64Content) {
    throw new Error('Invalid base64 format');
  }

  const buffer = Buffer.from(base64Content, 'base64');

  const { data, error } = await supabaseAdmin.storage
    .from('images')
    .upload(path, buffer, {
      contentType: 'image/png',
    });

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }

  return supabaseAdmin.storage.from('images').getPublicUrl(data.path).data.publicUrl;
};

export async function POST(req: NextRequest) {
  try {
    const formData: FormData = await req.json();
    console.log("backend: ", formData);

    // Upload logo if present
    let logoUrl = null;
    if (formData.logo) {
      const logoFilename = `logos/${formData.name}-${Date.now()}-logo.png`;
      logoUrl = await uploadBase64Image(formData.logo, logoFilename);
    }

    // Upload screenshots, but only if the screenshots array is defined and has valid file content
    const screenshotUrls = formData.screenshots && formData.screenshots.length > 0
      ? await Promise.all(
          formData.screenshots.slice(0, MAX_SCREENSHOTS).map(async (screenshot, index) => {
            const screenshotFilename = `screenshots/${formData.name}-${Date.now()}-screenshot-${index + 1}.png`;
            return await uploadBase64Image(screenshot, screenshotFilename);
          })
        )
      : [];

    // Filter out null screenshot URLs
    const validScreenshotUrls = screenshotUrls.filter(url => url !== null);

    // Create email template with improved styling
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Tool Submission: ${formData.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2, h3 {
            color: #2c3e50;
          }
          h1 {
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          h2 {
            margin-top: 30px;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 10px;
          }
          .rating {
            font-size: 1.2em;
            font-weight: bold;
            color: #f39c12;
          }
          .verdict {
            font-style: italic;
            background-color: #ecf0f1;
            padding: 10px;
            border-radius: 5px;
          }
          .pro-con {
            display: flex;
            justify-content: space-between;
          }
          .pro, .con {
            width: 48%;
          }
          .pro h3 {
            color: #27ae60;
          }
          .con h3 {
            color: #c0392b;
          }
          .pricing-tier {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .pricing-tier h3 {
            margin-top: 0;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
        </style>
      </head>
      <body>
        <h1>${formData.name}</h1>
        <p>contact email: ${formData.email}</p>
        <p>${formData.description}</p>
        <p><strong>Category:</strong> ${formData.category}</p>
        <p class="verdict"><strong>Verdict:</strong> ${formData.verdict}</p>
        <p><strong>URL:</strong> <a href="${formData.url}">${formData.url}</a></p>
        
        <h2>Best For:</h2>
        <ul>
          ${formData.bestFor.map(item => `<li>${item}</li>`).join('')}
        </ul>

        <h2>Features:</h2>
        <ul>
          ${formData.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>

        <h2>Pricing Tiers:</h2>
        ${formData.pricingTiers.map(tier => `
          <div class="pricing-tier">
            <h3>${tier.name} - $${tier.price}/month</h3>
            <ul>
              ${tier.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        ${logoUrl ? `
          <h2>Logo:</h2>
          <img src="${logoUrl}" alt="Logo" style="max-width: 200px; margin: 10px;">
        ` : ''}

        ${validScreenshotUrls.length > 0 ? `
          <h2>Screenshots:</h2>
          ${validScreenshotUrls.map(url => `<img src="${url}" alt="Screenshot" style="max-width: 100%; margin: 10px 0;">`).join('')}
        ` : ''}
      </body>
      </html>
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'minh@zippy.computer',
      to: 'luongquangminh23@gmail.com',
      subject: `New Tool Submission: ${formData.name}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Form data processed successfully',
      logoUrl,
      validScreenshotUrls,
      emailSent: true,
    });
  } catch (error) {
    console.error('Error processing form data:', error);
    return NextResponse.json({ error: `Error processing form data: ${error}` }, { status: 500 });
  }
}