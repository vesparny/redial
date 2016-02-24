import propName from './propName';

const isPromise = (obj) => typeof obj.then === 'function';

export default (name, components, locals) => {
  const promises = (Array.isArray(components) ? components : [components])

    // Filter out falsy components
    .filter(component => component)

    // Get component lifecycle hooks
    .map(component => ({ component, hooks: component[propName] }))

    // Filter out components that haven't been decorated
    .filter(({ hooks }) => hooks)

    // Calculate locals if required, execute hooks and store promises
    .map(({ component, hooks }) => {
      const hook = hooks[name];

      if (typeof hook !== 'function') {
        return;
      }
      const runningHook = locals === 'function' ?
        hook(locals(component)) :
        hook(locals)

        return isPromise(runningHook) ?
          runningHook :
          new Promise((resolve, reject) => {
            runningHook((err) => {
              if (err) {
                reject(err)
              }else {
                resolve()
              }
            })
          })
    });

  return Promise.all(promises);
};
