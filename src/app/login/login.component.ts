import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Users } from '../Users/Users';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  users_data!: Users[];
  returnUrl: String;
  submitted = false;
  loading = false;
  loginForm!: FormGroup;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      userName: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });

    this.usersService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.submitted = true;
    //console.log(this.f);

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.usersService
      .login(this.f.userName['value'], this.f.password['value'])
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['/home']);
        },
        (error) => {
          this.alert.error(error);
          this.loading = false;
        }
      );
  }
}
