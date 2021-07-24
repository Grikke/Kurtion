module.exports = {
  stateSuccess: response => ({
    state: true,
    response
  }),
  stateError: (message, object) => ({
    state: false,
    message: message.trim(),
    error: object ?? {},
  })
}