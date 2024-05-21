export function createMockHeaders() {
  return new Headers({
    'Content-Type': 'application/json',
    Authorization: 'Bearer fake-access-token',
  });
}

export function createMockResponse<T extends Object>(data: T) {
  return {
    data: {
      ...data,
    },
    meta: {},
  };
}
export function createMockErrorResponse(messages: string[]) {
  return {
    _errors: messages,
  };
}
