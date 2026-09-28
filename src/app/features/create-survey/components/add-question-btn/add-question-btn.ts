import { Component, output } from '@angular/core';

import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-add-question-btn',
  imports: [Button],
  templateUrl: './add-question-btn.html',
  styleUrl: './add-question-btn.scss',
})
export class AddQuestionBtn {
  add = output<void>();
}
