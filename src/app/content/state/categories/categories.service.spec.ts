import { TestBed } from '@angular/core/testing';
import { CategoriesService } from './categories.service';
import { CategoriesStore } from './categories.store';
import { CategoriesQuery } from './categories.query';
import { BackendService, BackendMockService } from '@app/content/services';
import { MatSnackBar } from '@angular/material';
import { skip, tap, first, concatMapTo, map } from 'rxjs/operators';

class MatSnackBarMock { }

describe('Categories Store', () => {
  let service: CategoriesService;
  let query: CategoriesQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriesService,
        CategoriesStore,
        CategoriesQuery,
        { provide: BackendService, useClass: BackendMockService },
        { provide: MatSnackBar, useClass: MatSnackBarMock }
      ]
    });

    service = TestBed.get(CategoriesService);
    query = TestBed.get(CategoriesQuery);
  });

  it('should add two categories', (done: DoneFn) => {
    const firstAdd = query.selectCategoryItems().pipe(
      skip(2),
      tap(cat => {
        expect(cat.length).toBe(1);
        expect(cat[0].id).not.toBe(-1);
      }),
      first()
    );

    const secondAdd = query.selectCategoryItems().pipe(
      skip(2),
      tap(cat => {
        expect(cat.length).toBe(2);
        expect(cat[0].id).not.toBe(-1);
      }),
      first()
    );

    firstAdd.pipe(
      concatMapTo(secondAdd)
    ).subscribe(() => done());

    service.addCategory('one');
    service.addCategory('two');
  });

  it('should add two items', (done: DoneFn) => {
    service.addCategory('one');

    const items$ = query.selectCategoryItems().pipe(
      skip(2),
      map(cat => {
        const cat7 = cat.find(x => x.id === 7);
        if (!cat7) { throw new Error('Category id 7 not found'); }
        return cat7.items;
      })
    );

    const firstAdd = items$.pipe(
      tap(items => {
        expect(items.length).toBe(1);
        expect(items[0].id).not.toBe(-1);
      }),
      first()
    );

    const secondAdd = items$.pipe(
      tap(items => {
        expect(items.length).toBe(2);
        expect(items[0].id).not.toBe(-1);
      }),
      first()
    );

    firstAdd.pipe(
      concatMapTo(secondAdd)
    ).subscribe(() => done());

    service.addItem({ item: { id: -1, name: 'one', category_id: 7 }, auto_pass: false, genopts: {} });
    service.addItem({ item: { id: -1, name: 'two', category_id: 7 }, auto_pass: false, genopts: {} });
  });
});