import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = this.fb.nonNullable.group({
    email: ['mraledevid@gmail.com', Validators.required],
    password: ['123456', Validators.required],
  });


  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
  ) { 
    this.authService.getCurrentUser().subscribe((user) =>{
      if(user){
        console.log('USER ON LOGIN PAGE: ', user);
        this.router.navigateByUrl('/groups', {replaceUrl: true});
      }
    })
  }

  get email(){
    return this.credentials.controls.email;
  }
  get password(){
    return this.credentials.controls.password;
  }

  ngOnInit() {
  }

  async login(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signIn(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss();
      if(data.error){
        this.showAlert('Login failed', data.error.message);
      }
    });
  }

  async getMagicLink() {
    const alert = await this.alertController.create({
      header: "Get a Magic Link",
      message: "We will send you a link to magically log in!",
      inputs: [
        {
          type: "email",
          name: "email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Get Magic Link",
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.signInWithEmail(
              result.email
            );
            await loading.dismiss();

            if (error) {
              this.showAlert("Failed", error.message);
            } else {
              this.showAlert(
                "Success",
                "Please check your emails for further instructions!"
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async forgotPw() {
    const alert = await this.alertController.create({
      header: "Receive a new password",
      message: "Please insert your email",
      inputs: [
        {
          type: "email",
          name: "email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Reset password",
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.sendPwReset(
              result.email
            );
            await loading.dismiss();

            if (error) {
              this.showAlert("Failed", error.message);
            } else {
              this.showAlert(
                "Success",
                "Please check your emails for further instructions!"
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async showAlert(title, msg) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    })
    await alert.present()
  }
}
