import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnDestroy {
  sending = false;
  success: string | null = null;
  error: string | null = null;
  private successTimeout: any = null;
  private errorTimeout: any = null;

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // clear previous timers and messages
    if (this.successTimeout) { clearTimeout(this.successTimeout); this.successTimeout = null; }
    if (this.errorTimeout) { clearTimeout(this.errorTimeout); this.errorTimeout = null; }
    this.sending = true;
    this.success = null;
    this.error = null;

    const payload = this.form.value;
    this.http.post('/api/send-email', payload).subscribe({
      next: (res: any) => {
        this.sending = false;
        this.success = res?.message || 'Message sent — thank you!';
        this.form.reset();
        // auto-dismiss success after 5 seconds
        this.successTimeout = setTimeout(() => { this.success = null; this.successTimeout = null; }, 5000);
      },
      error: (err) => {
        this.sending = false;
        this.error = err?.error?.message || 'Unable to send message. Please email nlytton@charter.net directly.';
        // auto-dismiss error after 8 seconds
        this.errorTimeout = setTimeout(() => { this.error = null; this.errorTimeout = null; }, 8000);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.successTimeout) { clearTimeout(this.successTimeout); this.successTimeout = null; }
    if (this.errorTimeout) { clearTimeout(this.errorTimeout); this.errorTimeout = null; }
  }
}
