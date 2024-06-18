import { Injectable } from '@angular/core';
import { ISSUES, Issue } from '@app/shared/consts/issues';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  public getIssues(): Issue[] {
    return ISSUES;
  }
}
