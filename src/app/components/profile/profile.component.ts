import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: User | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPasswordForm = false;
  showDeleteConfirm = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Initialize profile form
    this.profileForm = this.fb.group({
      firstName: [this.currentUser.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.currentUser.email, [Validators.required, Validators.email]]
    });

    // Initialize password form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  onUpdateProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (!this.currentUser || !this.currentUser.id) {
      return;
    }

    this.isLoading = true;
    const updatedData = this.profileForm.value;

    this.authService.updateUser(this.currentUser.id, updatedData).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.successMessage = 'Profil mis à jour avec succès !';
        this.isLoading = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Update error:', error);
        this.errorMessage = 'Erreur lors de la mise à jour du profil.';
        this.isLoading = false;
      }
    });
  }

  onChangePassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    if (!this.currentUser || !this.currentUser.id) {
      return;
    }

    this.isLoading = true;
    const { newPassword } = this.passwordForm.value;

    this.authService.updateUser(this.currentUser.id, { password: newPassword }).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe changé avec succès !';
        this.isLoading = false;
        this.passwordForm.reset();
        this.showPasswordForm = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Password change error:', error);
        this.errorMessage = 'Erreur lors du changement de mot de passe.';
        this.isLoading = false;
      }
    });
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
    }
  }

  toggleDeleteConfirm(): void {
    this.showDeleteConfirm = !this.showDeleteConfirm;
  }

  onDeleteAccount(): void {
    if (!this.currentUser || !this.currentUser.id) {
      return;
    }

    this.isLoading = true;

    this.authService.deleteUser(this.currentUser.id).subscribe({
      next: () => {
        alert('Votre compte a été supprimé avec succès.');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Delete account error:', error);
        this.errorMessage = 'Erreur lors de la suppression du compte.';
        this.isLoading = false;
        this.showDeleteConfirm = false;
      }
    });
  }
}
