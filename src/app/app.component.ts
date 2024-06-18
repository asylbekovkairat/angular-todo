import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IssuesService } from './services/issues.service';
import { Issue } from './shared/consts/issues';
import { Table } from './component/table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Table],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private readonly issuesService = inject(IssuesService);
  public issues!: Issue[];

  ngOnInit(): void {
    this.issues = this.issuesService.getIssues();
  }
}
