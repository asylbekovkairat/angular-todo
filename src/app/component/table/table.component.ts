import { NgFor, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Input,
  OnInit,
  signal,
  Component,
  ViewChild,
} from '@angular/core';
import { CheckboxColors } from '@app/shared/consts/color';
import { Issue } from '@app/shared/consts/issues';
import { Status } from '@app/shared/types';

type CheckedState = {
  backgroundColor: string;
  checked: boolean;
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table implements OnInit {
  @Input() issues!: Issue[];
  @ViewChild('custom-checkbox-selectDeselectAll') checkbox!: HTMLInputElement;

  public selectDeselectAllIsChecked = signal(false);
  public numCheckboxesSelected = signal(0);
  public checkedState = signal<CheckedState[]>([]);

  ngOnInit() {
    this.checkedState.update(() =>
      this.fillCheckedArray(this.issues.length, false)
    );
  }

  public countTotalSelected() {
    const totalSelected = this.checkedState()
      .map((element) => element.checked)
      .reduce((sum, currentState, index) => {
        if (currentState) return sum + this.issues[index].value;

        return sum;
      }, 0);

    this.numCheckboxesSelected.set(totalSelected);
    this.handleIndeterminateCheckbox(totalSelected);
  }

  public handleOnChange(position: number) {
    this.checkedState.update((values) =>
      values.map((element, index) => {
        if (position === index) {
          return {
            ...element,
            checked: !element.checked,
            backgroundColor: element.checked ? '#ffffff' : '#eeeeee',
          };
        }

        return element;
      })
    );

    this.countTotalSelected();
  }

  public handleIndeterminateCheckbox(total: number) {
    let count = 0;

    this.issues.forEach((element) => {
      if (element.status === 'open') {
        count += 1;
      }
    });

    if (total === 0) {
      this.checkbox.indeterminate = false;
      this.selectDeselectAllIsChecked.set(false);
    }
    if (total > 0 && total < count) {
      this.checkbox.indeterminate = true;
      this.selectDeselectAllIsChecked.set(false);
    }
    if (total === count) {
      this.checkbox.indeterminate = false;
      this.selectDeselectAllIsChecked.set(true);
    }
  }

  public handleSelectDeselectAll(event: Event) {
    let { checked } = event.target as HTMLInputElement;
    const allFalseArray = this.fillCheckedArray(this.issues.length, false);

    const allTrueArray: CheckedState[] = [];

    this.issues.forEach((element) => {
      if (element.status === 'open') {
        allTrueArray.push({
          checked: true,
          backgroundColor: CheckboxColors.active,
        });
      } else {
        allTrueArray.push({
          checked: false,
          backgroundColor: CheckboxColors.inactive,
        });
      }
    });

    if (checked) {
      this.checkedState.set(allTrueArray);
    } else {
      this.checkedState.set(allFalseArray);
    }

    this.countTotalSelected();
    this.selectDeselectAllIsChecked.update((prev) => !prev);
  }

  public fillCheckedArray(size: number, isChecked: boolean) {
    return new Array(size).fill({
      checked: isChecked,
      backgroundColor: '#ffffff',
    });
  }

  public getStylesTr(issue: Issue) {
    return issue.status === Status.open ? 'openIssue' : 'closedIssue';
  }
}
