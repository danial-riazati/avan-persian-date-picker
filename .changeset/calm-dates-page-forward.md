---
'@avan-persian/react': patch
---

Fix keyboard navigation in multi-month views: arrow/page navigation from the last visible
panel now pages the view forward instead of losing focus in an unrendered month, and moving
into a month that is already visible no longer shifts the view unnecessarily.

Fix uncontrolled picker wrappers (`AvanDatePicker` with `allowTextInput`, and the trigger
labels of every picker wrapper) so selections made in the calendar are reflected in the
text input, trigger, and summary even when the value is not controlled by the caller.
