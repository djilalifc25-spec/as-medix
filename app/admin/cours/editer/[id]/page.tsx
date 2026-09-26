'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CourseEditRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/admin/cours/nouveau?id=${encodeURIComponent(id)}`);
    } else {
      router.replace('/admin/cours');
    }
  }, [id, router]);

  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <p className="text-xs font-bold text-navy-500">Redirection vers l'éditeur de cours...</p>
    </div>
  );
}
