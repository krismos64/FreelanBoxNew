import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface PDFButtonProps {
  onClick: () => void;
  isGenerating?: boolean;
}

export const PDFButton: React.FC<PDFButtonProps> = ({ onClick, isGenerating = false }) => {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      isLoading={isGenerating}
    >
      {!isGenerating && <ArrowDownTrayIcon className="h-4 w-4 mr-2" />}
      {isGenerating ? 'Génération...' : 'Télécharger le PDF'}
    </Button>
  );
};