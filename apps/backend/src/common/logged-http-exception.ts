import { InternalServerErrorException } from '@nestjs/common';

export class LoggedInternalServerErrorException extends InternalServerErrorException {
  readonly alreadyLogged = true;
}
