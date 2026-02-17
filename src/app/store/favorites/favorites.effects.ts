import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as FavoritesActions from './favorites.actions';
import { FavoritesService } from '../../core/services/favorites.service';

@Injectable()
export class FavoritesEffects {

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      switchMap(({ userId }) =>
        this.favoritesService.getFavorites(userId).pipe(
          map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
          catchError(error => of(FavoritesActions.loadFavoritesFailure({
            error: error.message || 'Failed to load favorites'
          })))
        )
      )
    )
  );

  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.addFavorite),
      switchMap(({ favorite }) =>
        this.favoritesService.addFavorite(favorite).pipe(
          map(addedFavorite => FavoritesActions.addFavoriteSuccess({ favorite: addedFavorite })),
          tap(() => console.log('Favorite added successfully')),
          catchError(error => of(FavoritesActions.addFavoriteFailure({
            error: error.message || 'Failed to add favorite'
          })))
        )
      )
    )
  );

  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritesActions.removeFavorite),
      switchMap(({ id }) =>
        this.favoritesService.removeFavorite(id).pipe(
          map(() => FavoritesActions.removeFavoriteSuccess({ id })),
          tap(() => console.log('Favorite removed successfully')),
          catchError(error => of(FavoritesActions.removeFavoriteFailure({
            error: error.message || 'Failed to remove favorite'
          })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private favoritesService: FavoritesService
  ) {}
}
