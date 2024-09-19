import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { select } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { selectHeaderTitle } from './ngrx/selectors/header.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title$!: Observable<string>;
  constructor(private store: Store) { }
  ngOnInit(): void {
    this.title$ = this.store.pipe(select(selectHeaderTitle));
  }
}
