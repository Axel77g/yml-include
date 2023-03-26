export default {
  simpleInclude: /#@include (.+)/gi,
  includeRegex: /([ ]{0,})#@include (.+)/gi,
  slotRegex: /([ ]{0,})(#@slot:.+?)[ ](.+)/gi,
};
