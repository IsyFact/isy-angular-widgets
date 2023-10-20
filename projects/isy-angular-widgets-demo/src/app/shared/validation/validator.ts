import {ValidatorFn, Validators} from '@angular/forms';
import {CHARS_AND_NUMBERS, ONLY_CHARS_REGEX, ONLY_NUMBERS_REGEX} from './regex';

/* eslint-disable @typescript-eslint/unbound-method */
/**
 * A validation rule that marks a field as required.
 */
export const required: ValidatorFn = Validators.required;

/**
 * A validation rule that only allows the use of characters.
 */
export const onlyChars: ValidatorFn = Validators.pattern(ONLY_CHARS_REGEX);

/**
 * A validation rule that only allows the use of numbers.
 */
export const onlyNumbers: ValidatorFn = Validators.pattern(ONLY_NUMBERS_REGEX);

/**
 * A validation rule that only allows the use of characters (including German characters) and numbers.
 */
export const charsAndNumbers: ValidatorFn = Validators.pattern(CHARS_AND_NUMBERS);
