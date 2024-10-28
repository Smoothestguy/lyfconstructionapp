import { Observable } from '@nativescript/core';
import { Service } from '../../models/service.model';
import { BookingDetails, Quote, COMPLEXITY_MULTIPLIERS, URGENCY_FEES } from '../../models/booking.model';
import { alert } from '@nativescript/core/ui/dialogs';
import { Frame } from '@nativescript/core';

export class BookingViewModel extends Observable {
    private _service: Service;
    private _step: number = 1;
    private _requirements: string = '';
    private _area: number = 0;
    private _complexityIndex: number = 0;
    private _urgencyIndex: number = 0;
    private _selectedDate: Date = new Date();
    private _selectedTimeIndex: number = 0;
    private _quote: Quote | null = null;
    private _customerName: string = '';
    private _customerPhone: string = '';
    private _customerEmail: string = '';
    private _additionalNotes: string = '';

    constructor(service: Service) {
        super();
        this._service = service;
        this.generateTimeSlots();
    }

    private _availableTimeSlots: string[] = [];
    private _selectedTime: string = '';

    get availableTimeSlots(): string[] {
        return this._availableTimeSlots;
    }

    private generateTimeSlots() {
        const slots = [];
        for (let hour = 8; hour <= 17; hour++) {
            slots.push(`${hour}:00`);
            if (hour !== 17) slots.push(`${hour}:30`);
        }
        this._availableTimeSlots = slots;
        this.notifyPropertyChange('availableTimeSlots', slots);
    }

    get step(): number {
        return this._step;
    }

    set step(value: number) {
        if (this._step !== value) {
            this._step = value;
            this.notifyPropertyChange('step', value);
        }
    }

    // ... (getters and setters for all properties)

    private calculateQuote(): Quote {
        const basePrice = this._service.price;
        const complexityFee = basePrice * (COMPLEXITY_MULTIPLIERS[this.getComplexityLevel()] - 1);
        const urgencyFee = URGENCY_FEES[this.getUrgencyLevel()];
        const materialsCost = this._area * 2; // Simple materials calculation

        const total = basePrice + complexityFee + urgencyFee + materialsCost;

        return {
            basePrice,
            complexityFee,
            urgencyFee,
            materialsCost,
            total,
            breakdown: [
                `Base Price: $${basePrice}`,
                `Complexity Fee: $${complexityFee}`,
                `Urgency Fee: $${urgencyFee}`,
                `Materials Cost: $${materialsCost}`
            ]
        };
    }

    private getComplexityLevel(): 'simple' | 'moderate' | 'complex' {
        return ['simple', 'moderate', 'complex'][this._complexityIndex];
    }

    private getUrgencyLevel(): 'normal' | 'urgent' {
        return ['normal', 'urgent'][this._urgencyIndex];
    }

    async onNext() {
        if (await this.validateCurrentStep()) {
            if (this._step === 2) {
                this._quote = this.calculateQuote();
                this.notifyPropertyChange('quote', this._quote);
            }
            this.step++;
        }
    }

    onPrevious() {
        if (this._step > 1) {
            this.step--;
        }
    }

    private async validateCurrentStep(): Promise<boolean> {
        switch (this._step) {
            case 1:
                if (!this._requirements) {
                    await alert("Please describe your project requirements");
                    return false;
                }
                break;
            case 2:
                if (!this._selectedDate || !this._selectedTime) {
                    await alert("Please select both date and time");
                    return false;
                }
                break;
            case 4:
                if (!this._customerName || !this._customerPhone || !this._customerEmail) {
                    await alert("Please fill in all contact information");
                    return false;
                }
                if (!this.isValidEmail(this._customerEmail)) {
                    await alert("Please enter a valid email address");
                    return false;
                }
                break;
        }
        return true;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async requestConsultation() {
        await alert({
            title: "Consultation Requested",
            message: "Our team will contact you within 24 hours to discuss your project in detail.",
            okButtonText: "OK"
        });
    }

    async confirmBooking() {
        if (!await this.validateCurrentStep()) {
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            await alert({
                title: "Booking Confirmed!",
                message: "Your service has been scheduled. You will receive a confirmation email shortly.",
                okButtonText: "OK"
            });

            Frame.topmost().navigate({
                moduleName: "views/categories-page",
                clearHistory: true
            });
        } catch (error) {
            await alert({
                title: "Error",
                message: "Failed to confirm booking. Please try again.",
                okButtonText: "OK"
            });
        }
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString();
    }

    onBack() {
        Frame.topmost().goBack();
    }
}