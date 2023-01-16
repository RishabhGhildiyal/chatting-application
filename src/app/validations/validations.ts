import { Validators } from "@angular/forms";

export const COMMON_VALIDATION = Validators.required
export const COMMON_EMAIL= Validators.email
export const COMMON_PATTERN = Validators.pattern(/^[a-zA-Z][a-zA-Z\\s]+$/)
export const PATTERN_EMAIL = Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
export const PATTERN_NAME= Validators.pattern(/^[^-`@~\s][a-zA-Z\s-]+$/)
export const PATTERN_PASS= Validators.pattern(/^[^\s]+$/)
