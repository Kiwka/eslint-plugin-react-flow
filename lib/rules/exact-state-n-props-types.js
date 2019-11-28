/**
 * @fileoverview Annotation for react component state and props should be exact object type
 * @author Olena Sovyn
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const checkTypeNodeStrict = node => {
  if (node.exact) return true;
  if (node.type === "GenericTypeAnnotation") {
    const { name } = node.id;
    if (name === "$Exact" || name === "$Shape") return true;
  }
  return false;
};

const checkClassExtendsComponent = node => {
  const { superClass } = node;
  if (superClass.type === "Identifier" && superClass.name === "Component")
    return true;
  if (
    superClass.type === "MemberExpression" &&
    superClass.object &&
    superClass.object.name === "React" &&
    superClass.property &&
    ["Component", "PureComponent"].includes(superClass.property.name)
  )
    return true;
  return false;
};

module.exports = {
  meta: {
    docs: {
      description:
        "Annotation for react component state and props should be exact object type",
      category: "React flow rules",
      recommended: false
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        enum: ["always", "never"],
        type: "string"
      }
    ]
  },

  create: context => {
    return {
      ClassDeclaration(node) {
        const { id } = node;
        if (!node.superClass) {
          return;
        }

        if (node.superTypeParameters) {
          if (!checkClassExtendsComponent(node)) {
            return;
          }

          const { params } = node.superTypeParameters;
          if (params.length > 0) {
            const allHighLevelTypes = context
              .getSourceCode()
              .ast.body.filter(node => node.type === "TypeAlias");
            params.forEach(param => {
              if (param.type === "GenericTypeAnnotation") {
                const { name } = param.id;
                if (!name.startsWith("$")) {
                  const currentType = allHighLevelTypes.filter(
                    node => node.id.name === name
                  );
                  if (currentType && currentType[0]) {
                    const annotation = currentType[0].right;
                    if (!checkTypeNodeStrict(annotation)) {
                      context.report({
                        message:
                          "Annotation for React component state and props should have exact type",
                        node: annotation
                      });
                    }
                  }
                } else {
                  if (!checkTypeNodeStrict(param)) {
                    context.report({
                      message:
                        "Annotation for React component state and props should have exact type",
                      node: param
                    });
                  }
                }
              }

              if (param.type === "ObjectTypeAnnotation") {
                if (!checkTypeNodeStrict(param)) {
                  context.report({
                    message:
                      "Annotation for React component state and props should have exact type",
                    node: param
                  });
                }
              }
            });
          }
        }
      }
    };
  }
};
