import { Attribute, Directive, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, FormControl } from '@angular/forms';

@Directive({
selector: '[max][formControlName],[max][formControl],[max][ngModel]',
providers: [{provide: NG_VALIDATORS, useExisting: CustomMaxDirective, multi: true}],
host: {'[attr.max]': 'max ? max : 0'}
})

export class CustomMaxDirective implements Validator, OnChanges {

constructor(@Attribute('max') mx: string) {
	if (mx !== undefined && mx !== null) {	// isPresent
		const attrValue = parseInt(mx, 10);
		if (!isNaN(attrValue)) {
			this.max = mx;
			this._createValidator();
		}
	}
	}
	private _validator:ValidatorFn;
	private _onChange: () => void;

	@Input() max:string;

	static max(mx:number) : ValidatorFn {
		return (control: AbstractControl): {[key: string]: any} => {
			let v = +control.value;
			return (v > mx ? { 'max' : { 'maxValue' : mx, 'actualValue' : v }} : null);
		};
	}

	ngOnChanges(changes:SimpleChanges) {
		if ('max' in changes) {
			this._createValidator();
			if (this._onChange) this._onChange();
	  }
	}

	registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

	private _createValidator() {
		this._validator = CustomMaxDirective.max(parseInt(this.max, 10));
	}

	validate(c:AbstractControl) : {[key: string]: any} { return this._validator(c); }
}
