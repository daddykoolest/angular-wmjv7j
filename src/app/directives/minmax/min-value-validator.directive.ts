import { Attribute, Directive, forwardRef, Input, OnChanges, SimpleChanges, Provider } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
	selector: '[min][formControlName],[min][formControl],[min][ngModel]',
	providers: [{provide: NG_VALIDATORS, useExisting: CustomMinDirective, multi: true}],
	host: {'[attr.min]': 'min ? min : 0'}
})

export class CustomMinDirective implements Validator, OnChanges {
	private _validator: ValidatorFn;
	private _onChange: () => void;

	@Input() min: string;

	constructor(@Attribute('min') mn: string) {
		if (mn !== undefined && mn !== null) {	// isPresent
			const attrValue = parseInt(mn, 10);
			if (!isNaN(attrValue)) {
				this.min = mn;
				this._createValidator();
			}
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if ('min' in changes) {
			this._createValidator();
			if (this._onChange) this._onChange();
	  }
	}

	registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

	private _createValidator() {
		this._validator = CustomMinDirective.min(parseInt(this.min, 10));
	}

	validate(c: AbstractControl) : {[key: string]: any} { return this._validator(c); }

	static min(mn: number) : ValidatorFn {
		return (control: AbstractControl): {[key: string]: any} => {
			let v = +control.value;
			return (v < mn ? { 'min' : { 'minValue' : mn, 'actualValue' : v }} : null);
		};
	}
}