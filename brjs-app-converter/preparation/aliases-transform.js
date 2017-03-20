const inlineAliasRequires = (jscodeshift, refType) => path => {
  const requireIdentifier = jscodeshift.identifier("require");
  const aliasRequireArguments = [
    jscodeshift.literal(path.parentPath.value.value.value)
  ];
  const aliasRequire = jscodeshift.callExpression(
    requireIdentifier,
    aliasRequireArguments
  );
  const blockStatementReturningRequiredAlias = jscodeshift.blockStatement([
    jscodeshift.returnStatement(aliasRequire)
  ]);
  const functionExpressionReturningRequiredAlias = jscodeshift.functionExpression(
    null,
    [],
    blockStatementReturningRequiredAlias
  );
  const aliasRefProperty = jscodeshift.property(
    "get",
    jscodeshift.identifier(refType),
    functionExpressionReturningRequiredAlias
  );

  path.parentPath.parentPath.node.properties.push(aliasRefProperty);
};

export default ({ source }, { jscodeshift }) => {
  const ast = jscodeshift(source);

  ast
    .find(jscodeshift.Literal, ({ value }) => value === "class")
    .forEach(inlineAliasRequires(jscodeshift, "classRef"));

  ast
    .find(jscodeshift.Literal, ({ value }) => value === "interface")
    .forEach(inlineAliasRequires(jscodeshift, "interfaceRef"));

  return ast.toSource();
};
