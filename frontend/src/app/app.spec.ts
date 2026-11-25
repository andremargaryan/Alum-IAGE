import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('crée l’application', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('affiche l’écran de chargement à l’ouverture', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('app-chargement')).toBeTruthy();
    expect(page.querySelector('app-en-tete')).toBeNull();
  });

  it('affiche l’en-tête une fois le chargement terminé', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.finDuChargement();
    fixture.detectChanges();
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('app-chargement')).toBeNull();
    expect(page.querySelector('app-en-tete')?.textContent).toContain('Se connecter');
    expect(page.querySelector('app-en-tete')?.textContent).toContain("S'inscrire");
  });
});
