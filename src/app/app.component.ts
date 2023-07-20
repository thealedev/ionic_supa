import { AuthService } from 'src/app/services/auth.service'
import { Router } from '@angular/router'
import { Component, NgZone } from '@angular/core'
import { App, URLOpenListenerEvent } from '@capacitor/app'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private zone: NgZone, private router: Router, private authService: AuthService) {
    this.setupListener()
  }

  setupListener() {
    App.addListener('appUrlOpen', async (data: URLOpenListenerEvent) => {
      console.log('app opened with URL: ', data)

      const openUrl = data.url
      const access = openUrl.split('#access_token=').pop().split('&')[0]
      const refresh = openUrl.split('&refresh_token=').pop().split('&')[0]

      await this.authService.setSession(access, refresh)

      this.zone.run(() => {
        this.router.navigateByUrl('/groups', { replaceUrl: true })
      })
    })
  }
}
