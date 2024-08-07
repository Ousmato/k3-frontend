import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['']);
    return false;
  }
};
