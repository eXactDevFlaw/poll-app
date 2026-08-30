import { Component, output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  imports: [],
  templateUrl: './overlay.html',
  styleUrl: './overlay.scss',
})
export class Overlay {
  close = output<void>();
}
