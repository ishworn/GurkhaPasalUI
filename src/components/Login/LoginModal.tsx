'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import AuthPage from './Auth';


interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 bg-white rounded-2xl overflow-hidden shadow-xl">
        <AuthPage />
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
