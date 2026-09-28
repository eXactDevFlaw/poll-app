import { Component, output } from '@angular/core';

import { Overlay } from '../../../../shared/components/overlay/overlay';

@Component({
  selector: 'app-publish-overlay',
  imports: [Overlay],
  templateUrl: './publish-overlay.html',
  styleUrl: './publish-overlay.scss',
})
export class PublishOverlay {
  close = output<void>();
}
