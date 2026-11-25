import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('affiche l’écran de chargement à l’ouverture', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('app-chargement')).toBeTruthy();
    expect(page.querySelector('router-outlet')).toBeNull();
  });

  it('affiche les pages une fois le chargement terminé', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.finDuChargement();
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('app-chargement')).toBeNull();
    expect(page.querySelector('router-outlet')).toBeTruthy();
  });
});
