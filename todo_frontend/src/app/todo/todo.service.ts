// import { selectTodos } from './../state/todos/todo.selectors';

import { Injectable } from '@angular/core';
import { ITodo, ITodoRequest, ITodoUpdateRequest } from './todo.model';
import { BehaviorSubject, map, Observable, tap, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export interface ITodoStorageItem {
  id: string,
  text: string,
  isDone: boolean,
  createdOn: string,
  selected: boolean
}


@Injectable({ providedIn: 'root' })
export class TodoService {
  private _todos$: BehaviorSubject<ITodo[]> = new BehaviorSubject<ITodo[]>([]);
  readonly todos$: Observable<ITodo[]> = this._todos$.asObservable();


  constructor(private http:HttpClient) {
  }

  createTodo(todo: ITodoRequest): Observable<void> {
    return this.http.post<ITodoStorageItem>('http://localhost:3000/add', todo).pipe(
      tap(() => this.uploadAllTodos()),
      map(() => void 0)
    );
  }

  uploadAllTodos(): Observable<void> {
    return this.http.get<ITodoStorageItem[]>('http://localhost:3000/todos').pipe(
      tap((todos) => this._todos$.next(todos)),
      map(() => void 0)
    )
  }
   
  deleteTodo(id: string): Observable<void>{
    return this.http.delete(`http://localhost:3000/delete/${id}`).pipe(
      switchMap(() => this.uploadAllTodos())
    )
  }

  updateTodo(todo: ITodoUpdateRequest): Observable<void> {
    return this.http.post<void>(`http://localhost:3000/update`, todo).pipe(
      map(() => void 0)
    );
  }
}
