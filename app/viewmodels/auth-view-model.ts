import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { alert } from '@nativescript/core/ui/dialogs';

export class AuthViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';
    private _isSignUp: boolean = false;
    private _isLoading: boolean = false;
    private _errorMessage: string = '';

    constructor() {
        super();
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
            this.validateInput();
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
            this.validateInput();
        }
    }

    get isSignUp(): boolean {
        return this._isSignUp;
    }

    set isSignUp(value: boolean) {
        if (this._isSignUp !== value) {
            this._isSignUp = value;
            this.notifyPropertyChange('isSignUp', value);
        }
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    set errorMessage(value: string) {
        if (this._errorMessage !== value) {
            this._errorMessage = value;
            this.notifyPropertyChange('errorMessage', value);
        }
    }

    toggleAuthMode() {
        this.isSignUp = !this.isSignUp;
        this.errorMessage = '';
    }

    private validateInput(): void {
        if (!this._email || !this._password) {
            this.errorMessage = 'Please fill in all fields';
            return;
        }
        if (!this.isValidEmail(this._email)) {
            this.errorMessage = 'Please enter a valid email address';
            return;
        }
        if (this._password.length < 6) {
            this.errorMessage = 'Password must be at least 6 characters';
            return;
        }
        this.errorMessage = '';
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async onSubmit() {
        if (this.errorMessage) {
            return;
        }

        this.isLoading = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            Frame.topmost().navigate({
                moduleName: 'views/categories-page',
                clearHistory: true,
                transition: {
                    name: 'fade',
                    duration: 200
                }
            });
        } catch (error) {
            this.errorMessage = 'An error occurred. Please try again.';
            console.error('Auth error:', error);
        } finally {
            this.isLoading = false;
        }
    }
}