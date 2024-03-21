import {ValidatorFn, Validators} from '@angular/forms';
import {CHARS_AND_NUMBERS, ONLY_CHARS_REGEX, CHARS_AND_MINUS, ONLY_NUMBERS_REGEX} from './regex';

/**
 * A validation rule that marks a field as required.
 */
export const required: ValidatorFn = Validators.required;

/**
 * A validation rule that only allows the use of characters.
 */
export const onlyChars: ValidatorFn = Validators.pattern(ONLY_CHARS_REGEX);

/**
 * A validation rule that only allows the usage of characters and the optional minus ("-") character.
 */
export const charsAndMinus: ValidatorFn = Validators.pattern(CHARS_AND_MINUS);

/**
 * A validation rule that only allows the use of numbers.
 */
export const onlyNumbers: ValidatorFn = Validators.pattern(ONLY_NUMBERS_REGEX);

/**
 * A validation rule that only allows the use of characters (including German characters) and numbers.
 */
export const charsAndNumbers: ValidatorFn = Validators.pattern(CHARS_AND_NUMBERS);
