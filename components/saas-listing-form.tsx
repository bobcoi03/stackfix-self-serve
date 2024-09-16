"use client"

import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Screenshot {
  file: File;
  preview: string;
}

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
  logo: File | null;
  screenshots: Screenshot[];
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

const SaasListingForm: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    description: '',
    category: '',
    logo: null,
    screenshots: [],
    rating: 0,
    verdict: '',
    url: '',
    pros: [],
    cons: [],
    bestFor: [],
    lessGoodFor: [],
    features: [],
    pricingTiers: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prevData => ({ ...prevData, logo: e.target.files![0] }));
    }
  };

  const removeLogo = () => {
    setFormData(prevData => ({ ...prevData, logo: null }));
  };

  const handleScreenshotUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newScreenshots = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setFormData(prevData => ({
        ...prevData,
        screenshots: [...prevData.screenshots, ...newScreenshots].slice(0, MAX_SCREENSHOTS)
      }));
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      screenshots: prevData.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleProConChange = (index: number, field: 'title' | 'description', value: string, type: 'pros' | 'cons') => {
    setFormData(prevData => ({
      ...prevData,
      [type]: prevData[type].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const addProCon = (type: 'pros' | 'cons') => {
    setFormData(prevData => ({
      ...prevData,
      [type]: [...prevData[type], { title: '', description: '' }]
    }));
  };

  const removeProCon = (index: number, type: 'pros' | 'cons') => {
    setFormData(prevData => ({
      ...prevData,
      [type]: prevData[type].filter((_, i) => i !== index)
    }));
  };

  const handleBestLessGoodForChange = (index: number, value: string, type: 'bestFor' | 'lessGoodFor') => {
    setFormData(prevData => ({
      ...prevData,
      [type]: prevData[type].map((item, i) => i === index ? value : item)
    }));
  };

  const addBestLessGoodFor = (type: 'bestFor' | 'lessGoodFor') => {
    setFormData(prevData => ({
      ...prevData,
      [type]: [...prevData[type], '']
    }));
  };

  const removeBestLessGoodFor = (index: number, type: 'bestFor' | 'lessGoodFor') => {
    setFormData(prevData => ({
      ...prevData,
      [type]: prevData[type].filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      features: prevData.features.map((item, i) => i === index ? value : item)
    }));
  };

  const addFeature = () => {
    setFormData(prevData => ({
      ...prevData,
      features: [...prevData.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      features: prevData.features.filter((_, i) => i !== index)
    }));
  };

  const handlePricingTierChange = (index: number, field: keyof PricingTier, value: string | number) => {
    setFormData(prevData => ({
      ...prevData,
      pricingTiers: prevData.pricingTiers.map((tier, i) => 
        i === index ? { ...tier, [field]: field === 'price' ? Number(value) : value } : tier
      )
    }));
  };

  const addPricingTier = () => {
    setFormData(prevData => ({
      ...prevData,
      pricingTiers: [...prevData.pricingTiers, { name: '', price: 0, features: [] }]
    }));
  };

  const removePricingTier = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      pricingTiers: prevData.pricingTiers.filter((_, i) => i !== index)
    }));
  };

  const addPricingFeature = (tierIndex: number) => {
    setFormData(prevData => ({
      ...prevData,
      pricingTiers: prevData.pricingTiers.map((tier, i) => 
        i === tierIndex ? { ...tier, features: [...tier.features, ''] } : tier
      )
    }));
  };

  const handlePricingFeatureChange = (tierIndex: number, featureIndex: number, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      pricingTiers: prevData.pricingTiers.map((tier, i) => 
        i === tierIndex ? {
          ...tier,
          features: tier.features.map((feature, j) => j === featureIndex ? value : feature)
        } : tier
      )
    }));
  };

  const removePricingFeature = (tierIndex: number, featureIndex: number) => {
    setFormData(prevData => ({
      ...prevData,
      pricingTiers: prevData.pricingTiers.map((tier, i) => 
        i === tierIndex ? {
          ...tier,
          features: tier.features.filter((_, j) => j !== featureIndex)
        } : tier
      )
    }));
  };

// Utility function to convert a file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        // Convert logo to base64 (if present)
        let logoBase64 = null;
        if (formData.logo) {
            logoBase64 = await fileToBase64(formData.logo);
        }

        // Convert screenshots to base64
        const screenshotsBase64 = await Promise.all(
            formData.screenshots.map(screenshot => fileToBase64(screenshot.file))
        );

        // Create new data object with base64-encoded files
        const payload = {
            ...formData,
            logo: logoBase64, 
            screenshots: screenshotsBase64,
        };

        // Send the data as JSON
        const res = await fetch("/api/apply", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log(result);
        router.push("/success")
    } catch (error) {
        console.error('Error submitting form:', error);
        // Handle error (e.g., show an error message)
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className='font-light text-xl'>Apply to be tested</h2>
        
        <p className='text-gray-600 font-light mb-4'>We{"'"}re curating the top software in each category. If you think your product has got what it takes, get in touch below. Our selection and testing process is thorough because we{"'"}re committed to helping businesses find quality software. If your product aligns with our standard, you{"'"}ll be hearing from us!</p>

        <p className='text-gray-600 font-light'>Some examples</p>
        <ul className='mb-8'>
            <li>
                <Link className='ml-4 underline text-blue-500 font-light' href={"https://www.stackfix.com/product/clhmcpc8x000mmh08r83h0958?currency=GBP&billing=MONTH"} target='_blank'>
                    CharlieHR
                </Link>
            </li>
            <li>
                <Link className='ml-4 underline text-blue-500 font-light' href={"https://www.stackfix.com/product/clhigsktm000vlb08wyr4rs44?currency=EUR&billing=MONTH"} target='_blank'>
                    Humaans
                </Link>
            </li>
            <li>
                <Link className='ml-4 underline text-blue-500 font-light' href={"https://www.stackfix.com/product/clhigkfo4000nlb08qcytxj40?currency=USD&billing=MONTH"} target='_blank'>
                    BambooHR
                </Link>
            </li>
            <li>
                <Link className='ml-4 underline text-blue-500 font-light' href={"https://www.stackfix.com/product/clhjhfiju0018l00865q4r4by?currency=USD&billing=MONTH"} target='_blank'>
                    Deel
                </Link>
            </li>
        </ul>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-start space-x-8">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center relative">
              {formData.logo ? (
                <>
                  <img 
                    src={URL.createObjectURL(formData.logo)} 
                    alt="Logo" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                  <Button
                    type="button"
                    size="icon"
                    className="absolute top-0 right-1 w-4 h-4 rounded-full"
                    onClick={removeLogo}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <label htmlFor="logo-upload" className="cursor-pointer text-gray-500 text-sm text-center">
                  Click to upload logo
                  <input 
                    id="logo-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleLogoUpload} 
                    accept=".jpeg, .jpg, .png, .webp" 
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              <Input 
                placeholder='Contact email'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="text-md font-light mb-2 max-w-xl"
                required
              />
              <Input
                placeholder="Business Software Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-md font-light mb-2 max-w-xl"
                required
              />
              <Input
                placeholder="URL of your software"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className="text-md font-light mb-2 max-w-xl"
                required
              />
              <Select onValueChange={(value) => handleInputChange('category', value)} required>
                <SelectTrigger className="w-full max-w-xl">
                  <SelectValue placeholder="Select software category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crm">CRM Software</SelectItem>
                  <SelectItem value="customer-support">Customer Support Software</SelectItem>
                  <SelectItem value="applicant-tracking">Applicant Tracking System</SelectItem>
                  <SelectItem value="hr-information">HR Information System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex">
            <div className="w-40 space-y-2">
            </div>
            <div className="flex-1">
              <div>
                <h2 className="text-md font-semibold mb-4">Screenshots of your software</h2>
                <div className="w-full md:max-w-xl lg:max-w-3xl items-center justify-center">
                    <div className="w-full flex overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4 items-center">
                        {formData.screenshots.length < MAX_SCREENSHOTS && (
                            <div className="flex-shrink-0 w-40 h-40 mr-4 snap-center">
                                <label className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer">
                                    <span className="text-gray-500">+ Add Screenshot</span>
                                    <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleScreenshotUpload}
                                    accept="image/*"
                                    multiple
                                    />
                                </label>
                            </div>
                        )}
                        {formData.screenshots.map((screenshot, index) => (
                            <div key={index} className="flex-shrink-0 w-96 mr-4 snap-center relative">
                            <div className="w-full h-54 relative flex items-center justify-center">
                                <img 
                                src={screenshot.preview} 
                                alt={`Screenshot ${index + 1}`} 
                                className="max-w-full max-h-full rounded object-contain"
                                style={{ maxWidth: '384px', maxHeight: '216px' }}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 w-4 h-4 rounded-full"
                                onClick={() => removeScreenshot(index)}
                            >
                                <X className="h-2 w-2" />
                            </Button>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-12'>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <Textarea
              placeholder="Enter a detailed description of your software... (5000 characters max)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full h-24"
              maxLength={5000}
              required
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Best For</h2>
            {formData.bestFor.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  placeholder="What is your software best for..."
                  value={item}
                  onChange={(e) => handleBestLessGoodForChange(index, e.target.value, 'bestFor')}
                  className="flex-1"
                  required
                />
                <Button type="button" onClick={() => removeBestLessGoodFor(index, 'bestFor')} size="icon"><Minus className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" onClick={() => addBestLessGoodFor('bestFor')} className="mt-2 rounded-full bg-white text-black hover:bg-slate-200"><Plus className="h-4 w-4 mr-2" /> Add Best For</Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  placeholder="Feature"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="button" onClick={() => removeFeature(index)} size="icon"><Minus className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" onClick={addFeature} className="mt-2 rounded-full bg-white text-black hover:bg-slate-200"><Plus className="h-4 w-4 mr-2" /> Add Feature</Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.pricingTiers.map((tier, tierIndex) => (
                <Card key={tierIndex} className="relative">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removePricingTier(tierIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CardHeader>
                    <CardTitle>
                      <Input
                        placeholder="Tier Name"
                        value={tier.name}
                        onChange={(e) => handlePricingTierChange(tierIndex, 'name', e.target.value)}
                        className="mb-2"
                        required
                      />
                    </CardTitle>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-1">$</span>
                      <Input
                        type="number"
                        placeholder="Price"
                        value={tier.price}
                        onChange={(e) => handlePricingTierChange(tierIndex, 'price', e.target.value)}
                        className="text-2xl font-bold"
                        required
                      />
                      <span className="ml-1">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 mb-2">
                        <Input
                          placeholder="Feature"
                          value={feature}
                          onChange={(e) => handlePricingFeatureChange(tierIndex, featureIndex, e.target.value)}
                          className="flex-1"
                          required
                        />
                        <Button type="button" onClick={() => removePricingFeature(tierIndex, featureIndex)} size="icon"><Minus className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => addPricingFeature(tierIndex)} className="mt-2 rounded-full bg-white text-black hover:bg-slate-200"><Plus className="h-4 w-4 mr-2" /> Add Feature</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button type="button" onClick={addPricingTier} className="mt-2 rounded-full bg-white text-black hover:bg-slate-200"><Plus className="h-4 w-4 mr-2" /> Add Pricing Tier</Button>
          </div>

          <Button 
            type="submit" 
            className="mt-2 rounded-full bg-white text-black hover:bg-slate-200 border-black border"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Apply to be tested'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SaasListingForm;