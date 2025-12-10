import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Login } from './Login';
import { RoleSelection } from './RoleSelection';

export function AuthModal() {
  const { isAuthModalOpen, authStep, closeAuthModal, login, signup, selectRole } = useAuth();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {authStep === 'login' ? 'Sign in to continue' : 'Complete your profile'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
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
