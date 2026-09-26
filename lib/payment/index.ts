import { PlanType, User } from '@/types';
import { db } from '@/lib/db/store';

export type PaymentMethod = 'edahabia_cib' | 'baridimob' | 'ccp_transfer' | 'credit_card';

export interface PaymentIntent {
  id: string;
  userId: string;
  plan: PlanType;
  amountDa: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
}

export interface PaymentProvider {
  createPaymentIntent(userId: string, plan: PlanType, method: PaymentMethod): Promise<PaymentIntent>;
  verifyPayment(intentId: string): Promise<boolean>;
}

export class AlgerianSatimProvider implements PaymentProvider {
  async createPaymentIntent(userId: string, plan: PlanType, method: PaymentMethod): Promise<PaymentIntent> {
    const settings = db.getSettings();
    const amount = plan === 'PRO' ? settings.pricing.proPriceDa : settings.pricing.premiumPriceDa;

    const intent: PaymentIntent = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      plan,
      amountDa: amount,
      paymentMethod: method,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    return intent;
  }

  async verifyPayment(intentId: string): Promise<boolean> {
    // In production, verify with SATIM / GIM-TEL / Algerie Poste Webhook
    return true;
  }
}

export class SubscriptionService {
  private provider: PaymentProvider;

  constructor(provider?: PaymentProvider) {
    this.provider = provider || new AlgerianSatimProvider();
  }

  async upgradePlan(userId: string, targetPlan: PlanType, method: PaymentMethod = 'edahabia_cib'): Promise<{ success: boolean; intent: PaymentIntent }> {
    const intent = await this.provider.createPaymentIntent(userId, targetPlan, method);

    // Auto-approve in demo / development environment
    intent.status = 'succeeded';
    db.updateUser(userId, {
      plan: targetPlan,
      status: 'active'
    });

    db.addNotification({
      id: `notif_sub_${Date.now()}`,
      title: `Abonnement ${targetPlan} activé !`,
      message: `Félicitations, vous bénéficiez désormais de l'accès complet ${targetPlan} sur AS MEDIX.`,
      date: new Date().toISOString(),
      type: 'system',
      read: false,
      linkUrl: '/dashboard'
    });

    return { success: true, intent };
  }
}

export const subscriptionService = new SubscriptionService();
