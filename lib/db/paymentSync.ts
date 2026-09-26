import { supabase } from '@/lib/supabase/client';
import { db } from '@/lib/db/store';
import { PaymentRequest } from '@/types';

export async function syncPaymentRequestsFromCloud(): Promise<PaymentRequest[]> {
  try {
    const { data: cloudRows } = await supabase
      .from('password_resets')
      .select('*')
      .eq('code', 'PAYMENT_REQUEST_SYNC_V1')
      .eq('used', false);

    if (cloudRows && cloudRows.length > 0) {
      for (const row of cloudRows) {
        try {
          const prPayload: PaymentRequest = JSON.parse(row.token);
          if (prPayload && prPayload.id) {
            const existingRequests = db.getPaymentRequests();
            const existing = existingRequests.find(r => r.id === prPayload.id || (r.transactionRef && r.transactionRef === prPayload.transactionRef));
            if (!existing) {
              db.addPaymentRequest(prPayload);
            } else {
              // Update status if updated in cloud
              if (prPayload.status && prPayload.status !== existing.status) {
                existing.status = prPayload.status;
                if (prPayload.approvedAt) existing.approvedAt = prPayload.approvedAt;
              }
            }
          }
        } catch (parseErr) {
          console.error('[paymentSync Parse Error]:', parseErr);
        }
      }
    }
  } catch (err: any) {
    console.error('[syncPaymentRequestsFromCloud Error]:', err?.message || err);
  }

  return db.getPaymentRequests();
}

export async function savePaymentRequestToCloud(pr: PaymentRequest): Promise<void> {
  try {
    await supabase.from('password_resets').insert({
      email: pr.userEmail ? pr.userEmail.toLowerCase().trim() : 'payment@asmedix.study',
      code: 'PAYMENT_REQUEST_SYNC_V1',
      token: JSON.stringify(pr),
      expires_at: '2099-12-31T23:59:59Z',
      used: false
    });
  } catch (err: any) {
    console.error('[savePaymentRequestToCloud Error]:', err?.message || err);
  }
}

export async function updatePaymentRequestStatusInCloud(requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
  try {
    const { data: rows } = await supabase
      .from('password_resets')
      .select('*')
      .eq('code', 'PAYMENT_REQUEST_SYNC_V1');

    if (rows && rows.length > 0) {
      for (const row of rows) {
        try {
          const current: PaymentRequest = JSON.parse(row.token);
          const isMatch = 
            current.id === requestId || 
            current.transactionRef === requestId || 
            (current.userEmail && current.userEmail.toLowerCase() === requestId.toLowerCase()) ||
            (current.userId && current.userId === requestId);

          if (isMatch) {
            current.status = status;
            if (status === 'APPROVED') current.approvedAt = new Date().toISOString();
            // Mark used=true so it is removed from PENDING sync queue
            await supabase
              .from('password_resets')
              .update({ token: JSON.stringify(current), used: true })
              .eq('id', row.id);
          }
        } catch {}
      }
    }
  } catch (err: any) {
    console.error('[updatePaymentRequestStatusInCloud Error]:', err?.message || err);
  }
}

export async function deletePaymentRequestFromCloud(requestId: string): Promise<void> {
  try {
    const { data: rows } = await supabase
      .from('password_resets')
      .select('*')
      .eq('code', 'PAYMENT_REQUEST_SYNC_V1');

    if (rows && rows.length > 0) {
      for (const row of rows) {
        try {
          const current: PaymentRequest = JSON.parse(row.token);
          const isMatch = 
            current.id === requestId || 
            current.transactionRef === requestId || 
            (current.userEmail && current.userEmail.toLowerCase() === requestId.toLowerCase()) ||
            (current.userId && current.userId === requestId);

          if (isMatch) {
            await supabase
              .from('password_resets')
              .delete()
              .eq('id', row.id);
          }
        } catch {}
      }
    }
  } catch (err: any) {
    console.error('[deletePaymentRequestFromCloud Error]:', err?.message || err);
  }
}
