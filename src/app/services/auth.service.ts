import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';

import {createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser: BehaviorSubject<User | boolean> = new BehaviorSubject(null)
  
  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl, 
      environment.supabaseKey
    );

    this.supabase.auth.onAuthStateChange((event, sess) =>{
      if(event === "SIGNED_IN" || event === "TOKEN_REFRESHED"){
        console.log('SET USER: ', sess);
        this.currentUser.next(sess.user);
      }else{
        this.currentUser.next(false);
      }
    });

    //problema: sta qua sopra non parte subito -> risolvo con loadUser()
    this.loadUser();
  }

  async loadUser(){
    if(this.currentUser.value){
      return;
    }

    const user = await this.supabase.auth.getUser();

    if(user.data.user){
      this.currentUser.next(user.data.user);
    }else{
      this.currentUser.next(false);
    }
  }

  signUp(credentials: { email; password }) {
    return this.supabase.auth.signUp(credentials)
  }

  signIn(credentials: { email; password }) {
    return this.supabase.auth.signInWithPassword(credentials)
  }

  sendPwReset(email) {
    return this.supabase.auth.resetPasswordForEmail(email)
  }

  async signOut() {
    await this.supabase.auth.signOut()
    this.router.navigateByUrl('/', { replaceUrl: true })
  }

  getCurrentUser(): Observable<User | boolean> {
    return this.currentUser.asObservable()
  }

  getCurrentUserId(): string {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id
    } else {
      return null
    }
  }

  signInWithEmail(email: string) {
    const redirectTo = isPlatform("capacitor")
      ? "devchat://login"
      : `${window.location.origin}/groups`;

    return this.supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
  }

  async setSession(access_token, refresh_token) {
    return this.supabase.auth.setSession({ access_token, refresh_token });
  }

}