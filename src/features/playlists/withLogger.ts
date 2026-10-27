export function withLogger<S, A extends { type: string }>(
  reducer: (state: S, action: A) => S
): (state: S, action: A) => S {
  return (state: S, action: A): S => {
    const nextState = reducer(state, action);
    if (import.meta.env.DEV) {
      console.log(`Action: ${action.type}`, {
        prev: state,
        action,
        next: nextState,
      });
    }
    return nextState;
  };
}
