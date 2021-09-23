import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  const request = req;
  return request.args[0].user;
});
