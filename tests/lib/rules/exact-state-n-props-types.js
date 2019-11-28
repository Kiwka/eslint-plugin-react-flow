/**
 * @fileoverview Annotation for react component state and props should be exact object type
 * @author Olena Sovyn
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/exact-state-n-props-types"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
const parser = require.resolve("babel-eslint");
ruleTester.run("exact-state-n-props-types", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      parser,
      code: `type Props = $Exact<{}>; class NewComponent extends React.Component<Props, {}> {}`,
      errors: [
        {
          message:
            "Annotation for React component state and props should have exact type"
        }
      ]
    }
  ]
});
