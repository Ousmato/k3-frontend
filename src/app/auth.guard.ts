import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

 
  if (!authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  if (authService.isTokenExpired()) {
    authService.logout(); // On vide la session
    router.navigate(['/']);
    return false;
  }

  return true;
};
