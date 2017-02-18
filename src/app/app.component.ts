import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './auth/auth.module';
import { Store } from '@ngrx/store';
import * as fromRoot from './reducers';
import * as category from './actions/categories';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn: boolean;

  constructor(
    public auth: Auth,
    private router: Router,
    private store: Store<fromRoot.State>
  ) {
    this.auth.isLoggedIn.subscribe(newState => {
      if (!newState && this.isLoggedIn) {
        this.logout();
      }
      this.isLoggedIn = newState;
    });
  }

  secretPhraseChange(secret: string) {
    this.store.dispatch(new category.SecretPhraseChangeAction(secret) as any);
  }

  private logout() {
    this.store.dispatch(new category.SecretPhraseChangeAction(undefined) as any);
    this.store.dispatch({ type: 'USER_LOGOUT' });
    this.router.navigate(['/']);
  }
}
