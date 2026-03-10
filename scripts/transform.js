export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Remove the retry utility function declaration
  root.find(j.FunctionDeclaration, {
    id: { name: 'retry' }
  }).remove();

  // Find all return statements that return a call to `retry`
  root.find(j.ReturnStatement).forEach(path => {
    const arg = path.node.argument;
    if (
      arg &&
      arg.type === 'CallExpression' &&
      arg.callee.type === 'Identifier' &&
      arg.callee.name === 'retry'
    ) {
      // The first argument to retry is an async arrow function
      const arrowFunc = arg.arguments[0];
      if (arrowFunc && arrowFunc.type === 'ArrowFunctionExpression' && arrowFunc.body.type === 'BlockStatement') {
        // Replace the return statement with the body of the arrow function
        // Need to wrap in a try block if there was no try/catch inside
        path.replace(
           j.tryStatement(
               arrowFunc.body,
               j.catchClause(
                   j.identifier('error'),
                   null,
                   j.blockStatement([
                       j.expressionStatement(
                           j.callExpression(
                               j.memberExpression(j.identifier('console'), j.identifier('error')),
                               [j.literal('Error in action:'), j.identifier('error')]
                           )
                       ),
                       j.throwStatement(j.identifier('error'))
                   ])
               )
           )
        )
      }
    } else if (
      arg &&
      arg.type === 'CallExpression' &&
      arg.callee.type === 'MemberExpression' &&
      arg.callee.property.name === 'catch' &&
      arg.callee.object.type === 'CallExpression' &&
      arg.callee.object.callee.name === 'retry'
    ) {
       // This handles `return retry(...).catch(...)`
       const retryCall = arg.callee.object;
       const catchFunc = arg.arguments[0];
       const arrowFunc = retryCall.arguments[0];
       
       if (arrowFunc && arrowFunc.body.type === 'BlockStatement') {
           path.replace(
               j.tryStatement(
                   arrowFunc.body,
                   j.catchClause(
                       j.identifier('e'),
                       null,
                       catchFunc.body.type === 'BlockStatement' ? catchFunc.body : j.blockStatement([j.returnStatement(catchFunc.body)])
                   )
               )
           )
       }
    }
  });

  return root.toSource();
}
