export type UserRole = 'buyer' | 'vendor' | 'admin';
export type LicenseType = 'personal' | 'commercial' | 'resell';
export type Currency = 'EGP' | 'SAR' | 'AED' | 'USD';
export type FileType = 'excel' | 'notion' | 'powerpoint' | 'word-pdf' | 'cad-revit' | 'ai-prompts' | 'canva';
export type CategorySlug = 'business' | 'accounting' | 'engineering' | 'students' | 'individuals';

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number; // in EGP
  originalPrice?: number; // before discount
  category: CategorySlug;
  fileType: FileType;
  license: LicenseType;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  vendorName: string;
  vendorAvatar?: string;
  tags: string[];
  createdAt: string;
  featured?: boolean;
  technicalSpecs?: {
    compatibility?: string[];
    fileFormats?: string[];
    sheetsCount?: number;
    formulasCount?: number;
    blocksCount?: number;
    lodStandard?: string;
    pagesCount?: number;
    jurisdiction?: string;
    canvaDirectUrl?: string;
  };
}

export interface CartItem extends ProductItem {
  quantity: number;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

export interface FileTypeFilter {
  slug: FileType;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
