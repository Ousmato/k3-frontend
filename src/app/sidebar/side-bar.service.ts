import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  private readonly storageKey = 'sb|sidebar-toggle';

  constructor() {
    this.loadSidebarState();
  }

  private _isToggled: boolean = false;

  get isToggled(): boolean {
    return this._isToggled;
  }

  toggleSidebar(): void {
    this._isToggled = !this._isToggled;
    localStorage.setItem(this.storageKey, String(this._isToggled));
  }

  private loadSidebarState(): void {
    const storedState = localStorage.getItem(this.storageKey);
    this._isToggled = storedState === 'true';
  }
}
