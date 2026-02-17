import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { JobSearchParams } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css'
})
export class JobSearchComponent {
  @Output() search = new EventEmitter<JobSearchParams>();

  searchForm: FormGroup;

  // Popular locations for quick selection
  popularLocations = [
    'New York, USA',
    'London, UK',
    'Paris, France',
    'Berlin, Germany',
    'Remote',
    'San Francisco, USA',
    'Toronto, Canada',
    'Amsterdam, Netherlands'
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      keyword: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  get keyword() {
    return this.searchForm.get('keyword');
  }

  get location() {
    return this.searchForm.get('location');
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const params: JobSearchParams = {
      keyword: this.searchForm.value.keyword.trim(),
      location: this.searchForm.value.location.trim()
    };

    this.search.emit(params);
  }

  setLocation(location: string): void {
    this.searchForm.patchValue({ location });
  }

  // Quick search examples
  quickSearch(keyword: string, location: string): void {
    this.searchForm.patchValue({ keyword, location });
    this.onSubmit();
  }
}
