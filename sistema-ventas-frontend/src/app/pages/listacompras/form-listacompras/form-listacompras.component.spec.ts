import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListacomprasComponent } from './form-listacompras.component';

describe('FormListacomprasComponent', () => {
  let component: FormListacomprasComponent;
  let fixture: ComponentFixture<FormListacomprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormListacomprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormListacomprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
