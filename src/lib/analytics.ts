/**
 * Raseen Platform Google Analytics (GA4) & Google Ads Event Tracking Utility
 * Safe, universal dataLayer & gtag wrappers.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Custom event tracking for GA4 & Google Ads
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch (err) {
    console.warn('Analytics event dispatch warning:', err);
  }
}

/**
 * Standard eCommerce & Business Conversion Events
 */
export const Analytics = {
  // 1. Tool usage tracking (Lead magnets)
  toolUsed: (toolName: 'invoice_generator' | 'breakeven_calculator' | 'store_audit', details: Record<string, any> = {}) => {
    trackEvent('tool_engagement', {
      tool_name: toolName,
      ...details,
    });
  },

  // 2. Lead qualification tracking (High-intent conversion)
  leadCaptured: (leadId: string, channel: 'whatsapp' | 'email' | 'phone', interest?: string) => {
    trackEvent('generate_lead', {
      lead_id: leadId,
      contact_channel: channel,
      interest_topic: interest || 'General Platform Inquiry',
      value: 50.0, // Estimated target lead value in SAR
      currency: 'SAR',
    });
  },

  // 3. E-commerce viewing
  viewItem: (product: { id: string; title: string; price: number; category?: string }) => {
    trackEvent('view_item', {
      currency: 'SAR',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          item_category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  },

  // 4. Add to cart
  addToCart: (product: { id: string; title: string; price: number }) => {
    trackEvent('add_to_cart', {
      currency: 'SAR',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.title,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  },

  // 5. Begin checkout
  beginCheckout: (totalAmount: number, itemsCount: number) => {
    trackEvent('begin_checkout', {
      currency: 'SAR',
      value: totalAmount,
      items_count: itemsCount,
    });
  },

  // 6. Purchase conversion (Google Ads & GA4 Primary Conversion)
  purchase: (orderId: string, totalAmount: number, currency = 'SAR') => {
    trackEvent('purchase', {
      transaction_id: orderId,
      value: totalAmount,
      currency,
      tax: totalAmount * 0.15,
      shipping: 0,
    });
  },
};
