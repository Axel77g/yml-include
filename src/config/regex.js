export default {
  simpleInclude: /#@include (.+)/gi,
  includeRegex: /([ ]{0,})#@include (.+)/gi,
  slotRegex: /([ ]{0,})(#@slot:.+?)[ ](.+)/gi,
  slotIncludeSide: /#@slot:\w+$/gm,
  warningSyntax: /#@.+/gi,
  supportedSyntax: /[ ]{0,}#@(include|slot).+/gi,
};
