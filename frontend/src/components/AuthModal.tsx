import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Login } from './Login';
import { RoleSelection } from './RoleSelection';

export function AuthModal() {
  const { isAuthModalOpen, authStep, closeAuthModal, login, signup, selectRole } = useAuth();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent 
        className="min-w-[320px] max-w-[92vw] sm:max-w-[600px] max-h-[92vh] overflow-hidden p-5 sm:p-8"
      >
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {authStep === 'login' ? 'Welcome to Eximpo' : 'Complete your profile'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(92vh-80px)] pr-0.5">
          {authStep === 'login' ? (
            <Login 
              onLogin={login}
              onSignup={signup}
              isModal={true}
            />
          ) : (
            <RoleSelection 
              onSelectRole={selectRole}
              onBack={() => {}}
              isModal={true}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
