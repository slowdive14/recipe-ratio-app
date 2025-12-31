'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

interface CategoryFormProps {
  onSubmit: (name: string) => Promise<void>;
  initialValue?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function CategoryForm({
  onSubmit,
  initialValue = '',
  submitLabel = '추가',
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSubmit(name.trim());
      setName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-[200px]">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="카테고리 이름 (예: 제빵, 제과)"
          disabled={loading}
          icon="🏷️"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !name.trim()} icon="✨">
          {loading ? '처리중...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  );
}
