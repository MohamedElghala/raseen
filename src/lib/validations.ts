import { z } from 'zod';

export const OrderItemInputSchema = z.object({
  id: z.string().trim().min(1, 'معرف المنتج مطلوب').max(80),
  quantity: z.number().int().min(1).max(100).optional().default(1),
});

export const CreateOrderSchema = z
  .object({
    buyerEmail: z.string().trim().max(160).optional(),
    buyerContact: z.string().trim().max(160).optional(),
    paymentMethod: z
      .enum(['instapay', 'vodafone', 'whatsapp', 'preview_sample', 'paymob', 'free'])
      .optional()
      .default('instapay'),
    currency: z.enum(['EGP', 'SAR', 'AED', 'USD']).optional().default('EGP'),
    items: z
      .array(OrderItemInputSchema)
      .min(1, 'قائمة المنتجات فارغة')
      .max(50, 'الحد الأقصى للطلب 50 منتجاً'),
  })
  .refine(
    (data) => Boolean((data.buyerEmail && data.buyerEmail.trim()) || (data.buyerContact && data.buyerContact.trim())),
    {
      message: 'يرجى إدخال البريد الإلكتروني أو رقم الواتساب لإرسال تفاصيل الطلب',
      path: ['buyerContact'],
    }
  );

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'الاسم مطلوب ويجب أن يكون حرفين على الأقل')
    .max(100, 'الاسم طويل جداً'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('يرجى إدخال عنوان بريد إلكتروني صحيح')
    .max(160),
  password: z
    .string()
    .min(10, 'كلمة المرور يجب أن تكون 10 أحرف على الأقل وتحتوي على حرف كبير وصغير ورقم ورمز خاص')
    .max(128, 'كلمة المرور طويلة جداً'),
  role: z.enum(['buyer', 'vendor']).optional().default('buyer'),
});

export const AssistantChatSchema = z.object({
  message: z
    .string({ error: 'حقل الرسالة (message) مطلوب ولا يمكن أن يكون فارغاً.' })
    .trim()
    .min(1, 'حقل الرسالة (message) مطلوب ولا يمكن أن يكون فارغاً.')
    .max(1500, 'الرسالة طويلة جداً (الحد الأقصى 1500 حرف).'),
  history: z
    .array(
      z.object({
        sender: z.enum(['user', 'assistant']),
        text: z.string().max(4000),
      })
    )
    .max(20)
    .optional(),
  context: z.record(z.string(), z.any()).optional(),
});

export const LeadSchema = z.object({
  name: z.string().trim().max(120).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
  email: z.string().trim().max(160).optional().nullable(),
  channel: z.enum(['whatsapp', 'email', 'phone']).optional().default('whatsapp'),
  interest: z.string().trim().max(300).optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
});

export const VerifyLicenseSchema = z.object({
  licenseId: z.string().trim().min(5, 'رقم الترخيص غير صالح').max(80).optional(),
  assetId: z.string().trim().min(1).max(80).optional(),
  buyerIdentifier: z.string().trim().min(1).max(160).optional(),
  issuedAt: z.string().trim().min(1).max(60).optional(),
  licenseType: z.enum(['Commercial', 'Personal', 'Enterprise']).optional(),
  signature: z.string().trim().min(16).max(256).optional(),
  token: z.string().trim().min(10).max(2048).optional(),
});
