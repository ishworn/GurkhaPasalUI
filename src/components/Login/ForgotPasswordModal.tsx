'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import ForgotPasswordPage from './forgot-password-page';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 bg-white rounded-2xl overflow-hidden shadow-xl">
        <ForgotPasswordPage />
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
