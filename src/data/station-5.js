// Station 5 — מי קיבל תשובות ומי לא. Source: תחנה_5_.docx.
//
// Ten trucks we already have intelligence on, six we do not. Exactly one
// feature explains every one of the ten labels — an antenna on the roof —
// and applying it to the six unlabelled ones gives the digit.
//
// Of the six, U-01 and U-03 carry, so the digit is 2. That matches the
// roster and the lock code.
//
// The build spec records that the draft carries a DIFFERENT card set for
// this station. `תחנה_5_.docx` is the authoritative one and is what is
// transcribed here; both sets happen to yield 2.
//
// The other three features are deliberate noise: colour, wheels and box
// each appear on both sides of the labelled split, so none of them can be
// the rule. Verified in the station-5 data test.

export const FEATURES = [
  { key: 'colour',  label: 'צבע' },
  { key: 'antenna', label: 'אנטנה' },
  { key: 'wheels',  label: 'גלגלים' },
  { key: 'box',     label: 'ארגז' }
];

const card = (id, colour, antenna, wheels, box) => ({ id, colour, antenna, wheels, box });

// The ten we know about. `carries` is ground truth, shown to the group.
const known = (c, carries) => ({ ...c, carries });

export const LABELLED = [
  known(card('M-01', 'לבן', 'יש', '6', 'פתוח'), true),
  known(card('M-02', 'חול', 'יש', '8', 'סגור'), true),
  known(card('M-03', 'לבן', 'יש', '6', 'סגור'), true),
  known(card('M-04', 'חול', 'יש', '8', 'פתוח'), true),
  known(card('M-05', 'לבן', 'יש', '8', 'סגור'), true),
  known(card('M-06', 'חול', 'אין', '6', 'פתוח'), false),
  known(card('M-07', 'לבן', 'אין', '8', 'פתוח'), false),
  known(card('M-08', 'חול', 'אין', '6', 'סגור'), false),
  known(card('M-09', 'לבן', 'אין', '8', 'סגור'), false),
  known(card('M-10', 'חול', 'אין', '6', 'פתוח'), false)
];

// The six with no label. `carries` here is the answer key and is never
// rendered — it only ever reaches the answer engine.
export const UNLABELLED = [
  known(card('U-01', 'לבן', 'יש', '6', 'פתוח'), true),
  known(card('U-02', 'חול', 'אין', '8', 'סגור'), false),
  known(card('U-03', 'חול', 'יש', '8', 'פתוח'), true),
  known(card('U-04', 'לבן', 'אין', '6', 'סגור'), false),
  known(card('U-05', 'לבן', 'אין', '8', 'פתוח'), false),
  known(card('U-06', 'חול', 'אין', '6', 'סגור'), false)
];
